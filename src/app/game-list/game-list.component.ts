import { Component, OnInit } from '@angular/core';
import {GamesService} from '../games.service';
import {UsersService} from '../users.service';
import {HORSES_PER_PLAYER, RaceHorse, HorseNameGenerator, INITIAL_PLAYER_FUNDS} from '../race-horse';
import {HorseSocketService} from "../horse-socket.service";

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  games;
  player;

  constructor(private gamesService: GamesService,
              private usersService: UsersService,
              private socket: HorseSocketService) {
    this.games = [];
  }

  async ngOnInit() {
    this.player = JSON.parse(localStorage.getItem('currentHorseUser', ));
    await this.getGames(true);
    this.socket.addObserver(this);
  }

  async fnSocketNotify(data) {
    try {
      const obj = JSON.parse(data);
      if (obj.messageType && (obj.messageType === "games")) {
        // games have changes
        await this.getGames(false);
      }
    } catch(e) {
      console.log('Error in wsnotify');
    }



  }

  async getPlayersInGame(game) {
    return new Promise(async (resolve, reject) => {
      this.gamesService.getPlayersInGame(game.ID)
        .subscribe( (data) => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }


  async getGames(updateBusyState: boolean) {
    return new Promise((resolve, reject) => {
      if (updateBusyState === true) {
        this.gamesService.busy();
      }
      this.gamesService.getGames()
        .subscribe(async (data) => {
            this.games = data;
            await this.games.forEach( async (game) => {
              const players = await this.getPlayersInGame(game);
              game.players = players;
              game.playerInGame = this.getInGame(game);
            }, this);

            if (updateBusyState === true) {
              this.gamesService.notBusy();
            }
            resolve(this.games);
          }, error => {
            if (updateBusyState === true) {
              this.gamesService.notBusy();
            }
            reject(error);
          });
    });
  }

  getInGame(game) {

    if (game && game.players) {
      const plyr = game.players.find(p => {
        if (p.PLAYER_ID === this.player.ID) {
          return p;
        }
      });
      return plyr;
    }
  }

  addGame(name, playerId) {
    this.gamesService.busy();
    return this.gamesService.addGame(name, playerId)
      .subscribe(async data => {
          await this.join(data["ID"]).catch(err => {
            this.gamesService.notBusy();
            return false;
          }).then( async () => {
            await this.getGames(false);
            const notifyData = {
              messageType: 'games'
            };
            await this.socket.sendData(JSON.stringify(notifyData));
          });
          this.gamesService.notBusy();
          return data;
        }, error => {
          this.gamesService.notBusy();
          return false;
        }
      );
  }

  addNewGame() {
    const newName = window.prompt('Please enter game name');
    if (newName !== '') {
      const game = this.addGame(newName, this.player.ID);
      if (game) {
        // window.alert('added: ' + game);
      } else {
        window.alert('did not add');
      }
    }
  }

  deleteGame(name) {

    if (window.confirm(`Are you sure you want to delete the game "${name}"`)) {
      this.gamesService.busy();
      return this.gamesService.deleteGame(name)
        .subscribe(async data => {
            await this.getGames(false);
            this.gamesService.notBusy();
            const notifyData = {
              messageType: 'games'
            };
            await this.socket.sendData(JSON.stringify(notifyData));
            return data;
          }, error => {
            this.gamesService.notBusy();
            return false;
          }
        );
    }
  }

  async setPlayerState(gameId, playerId, state) {
    return new Promise( async (resolve, reject) => {
      this.gamesService.setPlayerState(gameId, playerId, state).
      subscribe( d => resolve(d), err => reject(err));
    });
  }

  async joinRobot(gameId, robotId) {
    return new Promise((resolve, reject) => {
      this.gamesService.addPlayerToGame(gameId, {id: robotId})
        .subscribe(data => {
            // ADD HORSES FOR PLAYER
            const horses = [];
            for (let i = 0; i < HORSES_PER_PLAYER; i++) {
              const horseName = HorseNameGenerator.getHorseName();
              const horse = new RaceHorse(horseName);
              horses.push(horse);
            }
            this.gamesService.savePlayerHorses(gameId, robotId, horses).subscribe(
              data => {
                this.gamesService.adjustPlayerFunds(gameId, robotId, INITIAL_PLAYER_FUNDS)
                  .subscribe( async data => {
                    // ready to select horses
                    this.gamesService.setPlayerState(gameId, robotId, 2)
                      .subscribe( data => {
                        resolve(true);
                      }, err => {
                        reject(err);
                      });

                  }, err => {
                    reject('Failed to adjust robot funds: ' + err);
                  });

              },
              error => {
                reject('error saving robot horses: ' + error);
              }
            );

          }, error => {
            reject(error);
          }
        );

    });


  }


  async doAddPlayerToGame(gameId, playerId) {

    return new Promise(async (resolve, reject) => {

      await this.setPlayerState(gameId, playerId,0);

      this.gamesService.addPlayerToGame(gameId, {id: playerId})
        .subscribe(async data => {
            // ADD HORSES FOR PLAYER
            const horses = [];
            for (let i = 0; i < HORSES_PER_PLAYER; i++) {
              const horseName = HorseNameGenerator.getHorseName();
              const horse = new RaceHorse(horseName);
              horses.push(horse);
            }
            this.gamesService.savePlayerHorses(gameId, playerId, horses).subscribe(
              async data => {
                this.gamesService.adjustPlayerFunds(gameId, playerId, INITIAL_PLAYER_FUNDS)
                  .subscribe( async () => {
                    await this.getGames(false);
                    const notifyData = {
                      messageType: 'games'
                    };
                    await this.socket.sendData(JSON.stringify(notifyData));
                    resolve(true);
                  }, err => {
                    reject('Failed to adjust player funds: ' + err);
                  });

              },
              error => {
                reject('error saving player horses: ' + error);
              }
            );
            await this.gamesService.setPlayerState(gameId, playerId, 2); // ready to select horses

          }, error => {
            reject(error);
          }
        );
    });

  }
  async join(gameId: string) {
    await this.doAddPlayerToGame(gameId, this.player.ID);
  }

  leave(gameId: string) {
    if (window.confirm(`Are you sure you want to leave this game?`)) {
      this.gamesService.busy();
      this.gamesService.removePlayerFromGame(gameId, this.player.ID)
        .subscribe(async data => {
            await this.getGames(false);
            const notifyData = {
              messageType: 'games'
            };
            await this.socket.sendData(JSON.stringify(notifyData));
            this.gamesService.notBusy();
          }, error => {
            window.alert('Error: ' + error);
          this.gamesService.notBusy();
          }
        );
    }
  }

  async getRobots(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.usersService.getRobots()
        .subscribe( data => {
          resolve(data);
        }, err => {
          reject(err);
      })
    });
  }

  async getUsers(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.usersService.getUsers()
        .subscribe( data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    });
  }

  async startGame(gameObj) {
    this.gamesService.busy();

    const humanCount = gameObj.players.length;
    if (humanCount < 6) {
      window.alert(`This game only has ${gameObj.players.length} human players. ${6 - gameObj.players.length} robots will be created`);
      const robots = await this.getRobots().then(r => r);
      const robotCount = 6 - gameObj.players.length;
      for(let i=0; i < robotCount; i++) {
        const robot = robots[i];
        await this.joinRobot(gameObj.ID,robot.ID);
      }
    }

    gameObj.STATE = 1;
    this.gamesService.setGameState(gameObj)
      .subscribe( async data => {
        await this.getGames(false);
        const notifyData = {
          messageType: 'games'
        };
        await this.socket.sendData(JSON.stringify(notifyData));
        this.gamesService.notBusy();
      }, err => {
        this.gamesService.notBusy();
        window.alert('error setting game state: ' + err);
      });
  }


  async addPlayerToGame(game) {

    const allUsers = await this.getUsers().then((users) => {
      return users.filter((user) => {
        if (user.HUMAN === 1) {
          return user;
        };
      });
    });

    const gamePlayers = await this.getPlayersInGame(game);
    // get list of players not in game.
    const availablePlayers = allUsers.filter( (aUser) => {
      const userId = aUser.ID;
      const found = gamePlayers['find']( (gp) => {
        return (gp['PLAYER_ID'] === userId);
      });
      return !found;
    });

    const playerNames = availablePlayers.map((item) => {
      return item.NAME;
    });

    // ask user to enter a name
    const newPlayerName = window.prompt("Please choose a player to add to the game from: " + playerNames);
    if ((newPlayerName) && (playerNames.indexOf(newPlayerName) >= 0)) {
      const player = availablePlayers.find((p) => {
        return (p.NAME === newPlayerName);
      });
      if (player) {
        this.gamesService.busy();
        await this.doAddPlayerToGame(game.ID, player.ID)
          .catch( e => {
            this.gamesService.notBusy();
            window.alert("Error adding player to game: " + e);
          }).then( () => {
            this.gamesService.notBusy();
          });

      }
    }

    // if we're halfway through a meeting then assign the horses for the races
  }

}
