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
    await this.getGames();

  }

  async getPlayersInGame(game) {
    return new Promise(async (resolve, reject) => {
      this.gamesService.getPlayersInGame(game.ID)
        .subscribe( (data) => {
          resolve(data);
        });
    });
  }

  async getGames() {
    return new Promise((resolve, reject) => {
      this.gamesService.busy();
      this.gamesService.getGames()
        .subscribe(async (data) => {
            this.games = data;
            await this.games.forEach( async (game) => {
              const players = await this.getPlayersInGame(game);
              game.players = players;
              game.playerInGame = this.getInGame(game);
            }, this);
            this.gamesService.notBusy();
            resolve(this.games);
          }, error => {
            this.gamesService.notBusy();
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
            await this.getGames();
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
            await this.getGames();
            this.gamesService.notBusy();
            return data;
          }, error => {
            this.gamesService.notBusy();
            return false;
          }
        );
    }
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
                    await this.getGames();
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
            await this.getGames();
            this.gamesService.notBusy();
          }, error => {
            window.alert('Error: ' + error);
          this.gamesService.notBusy();
          }
        );
    }

  }


}
