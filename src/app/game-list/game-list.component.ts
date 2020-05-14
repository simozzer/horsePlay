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
      this.gamesService.getGames()
        .subscribe(async (data) => {
            this.games = data;
            await this.games.forEach( async (game) => {
              const players = await this.getPlayersInGame(game);
              game.players = players;
              game.playerInGame = this.getInGame(game);
            }, this);
            resolve(this.games);
          }, error => {
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
    return this.gamesService.addGame(name, playerId)
      .subscribe(async data => {
          await this.join(data["ID"]).catch(err => {
            return false;
          }).then( () => {
            this.getGames();
          });
          return data;
        }, error => {
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
      return this.gamesService.deleteGame(name)
        .subscribe(data => {
            this.getGames();
            return data;
          }, error => {
            return false;
          }
        );
    }
  }

  async join(gameId: string) {

    return new Promise((resolve, reject) => {

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
                  .subscribe( data => {
                    this.getGames();
                    resolve(true);
                  }, err => {
                    reject('Failed to adjust player funds: ' + err);
                  });

              },
              error => {
                reject('error saving player horses: ' + error);
              }
            );
            this.gamesService.setPlayerState(gameId, this.player.ID, 2); // ready to select horses

          }, error => {
            reject(error);
          }
        );

    });


  }

  leave(gameId: string) {
    if (window.confirm(`Are you sure you want to leave this game?`)) {
      this.gamesService.removePlayerFromGame(gameId, this.player.ID)
        .subscribe(data => {
            this.getGames();
          }, error => {
            window.alert('Error: ' + error);
          }
        );
    }

  }


}
