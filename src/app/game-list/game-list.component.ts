import { Component, OnInit } from '@angular/core';
import {GamesService} from '../games.service';
import {UsersService} from '../users.service';
import {HORSES_PER_PLAYER, RaceHorse, HorseNameGenerator, INITIAL_PLAYER_FUNDS} from '../race-horse';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  games;
  player;

  constructor(private gamesService: GamesService,
              private usersService: UsersService) {
    this.games = [];
  }

  async ngOnInit() {
    this.gamesService.busy();
    this.player = JSON.parse(localStorage.getItem('currentUser', ));
    await this.getGames(true);

  }


  async getPlayersInGame(game) {
    return new Promise(async (resolve, reject) => {
      this.gamesService.getPlayersInGame(game.ID)
        .subscribe( (data) => {
          resolve(data);
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
      this.gamesService.busy();
      const game = this.addGame(newName, this.player.ID);
      if (game) {
        this.gamesService.notBusy();
        // window.alert('added: ' + game);
      } else {
        this.gamesService.notBusy();
        window.alert('did not add');
      }
    }
  }

  deleteGame(name) {
    this.gamesService.busy();
    if (window.confirm(`Are you sure you want to delete the game "${name}"`)) {
      return this.gamesService.deleteGame(name)
        .subscribe(async data => {
            await this.getGames(false);
            this.gamesService.notBusy();
            return data;
          }, error => {
            this.gamesService.notBusy();
            return false;
          }
        );
    }
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

  async join(gameId: string) {

    return new Promise((resolve, reject) => {
      this.gamesService.busy();

      this.gamesService.addPlayerToGame(gameId, {id: this.player.ID})
        .subscribe(data => {
            // ADD HORSES FOR PLAYER
            const horses = [];
            for (let i = 0; i < HORSES_PER_PLAYER; i++) {
              const i = Math.round(Math.random() * 50);
              const horseName = HorseNameGenerator.getHorseName() + i;
              const horse = new RaceHorse(horseName);
              horses.push(horse);
            }
            this.gamesService.savePlayerHorses(gameId, this.player.ID, horses).subscribe(
              data => {
                this.gamesService.adjustPlayerFunds(gameId, this.player.ID, INITIAL_PLAYER_FUNDS)
                  .subscribe( async data => {
                    await this.getGames(false);
                    this.gamesService.notBusy();
                    resolve(true);
                  }, err => {
                    this.gamesService.notBusy();
                    reject('Failed to adjust player funds: ' + err);
                  });

              },
              error => {
                this.gamesService.notBusy();
                reject('error saving player horses: ' + error);
              }
            );
            this.gamesService.busy();
            this.gamesService.setPlayerState(gameId, this.player.ID, 2); // ready to select horses
            this.gamesService.notBusy();

          }, error => {
            this.gamesService.notBusy();
            reject(error);
          }
        );

    });


  }

  leave(gameId: string) {
    if (window.confirm(`Are you sure you want to leave this game?`)) {
      this.gamesService.busy();
      this.gamesService.removePlayerFromGame(gameId, this.player.ID)
        .subscribe(async data => {
            await this.getGames(false);
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
        this.gamesService.notBusy();
      }, err => {
        this.gamesService.notBusy();
        window.alert('error setting game state: ' + err);
      });
  }


}
