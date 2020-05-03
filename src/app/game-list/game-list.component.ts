import { Component, OnInit } from '@angular/core';
import {GamesService} from "../games.service";
import {UsersService} from "../users.service";
import {AuthenticationService} from "../authentication.service";
import {HORSES_PER_PLAYER, RaceHorse, HorseNameGenerator, INITIAL_PLAYER_FUNDS} from "../race-horse";
import {map} from "rxjs/operators";

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
              private authService: AuthenticationService) {
  }

  async ngOnInit() {
    this.getGames();
    this.player = JSON.parse(localStorage.getItem('currentUser',));
  }

  async getPlayersInGame(game) {
    return new Promise(async (resolve,reject) => {
      this.gamesService.getPlayersInGame(game.ID)
        .subscribe( (data) => {
          resolve(data);
        });
    });
  }

  getGames() {
    this.gamesService.getGames()
      .subscribe(async(data) => {
          this.games = data;
          await this.games.forEach( async (game)=> {
              let players = await this.getPlayersInGame(game);
              game.players = players;
              let playerInGame = game.players.find(p => {
                if (p.ID = this.player.ID) {
                  return p;
                }
              });

              game.playerInGame = playerInGame;
              //window.alert(JSON.stringify(players));
          },this);
          return this.games;
        }, error =>
          window.alert("error getting games: " + error)
      )
  }

  addGame(name) {
    return this.gamesService.addGame(name)
      .subscribe(data => {
          this.getGames();
          return data;
        }, error => {
          return false;
        }
      )
  }

  addNewGame() {
    let newName = window.prompt("Please enter game name");
    if (newName !== "") {
      let game = this.addGame(newName);
      if (game) {
        // window.alert('added: ' + game);
      } else {
        window.alert('did not add');
      }
    }
  }


  deleteGame(name) {
    return this.gamesService.deleteGame(name)
      .subscribe(data => {
          this.getGames();
          return data;
        }, error => {
          return false;
        }
      )
  }


  join(gameId: string) {
    this.gamesService.updatePlayerInGame(gameId, {id: this.player.ID})
      .subscribe(data => {
          //ADD HORSES FOR PLAYER
          let horses = [];
          for(let i = 0; i < HORSES_PER_PLAYER; i++) {
            let i = Math.round(Math.random() * 50);
            let horseName = HorseNameGenerator.getHorseName() + i;
            let horse = new RaceHorse(horseName);
            horses.push(horse);
          };
          this.gamesService.savePlayerHorses(gameId,this.player.ID,horses).subscribe(
            data => {
              this.gamesService.adjustPlayerFunds(gameId,this.player.ID,INITIAL_PLAYER_FUNDS)
                .subscribe( data =>{
                  this.getGames();
                }, err => {
                  window.alert("Failed to adjust player funds: " + err)
                })

            },
            error => {
              window.alert("error saving player horses: " + error);
            }
          );
          this.gamesService.setPlayerState(gameId,this.player.ID,2);// ready to select horses

        }, error => {
          window.alert("Error: " + error)
        }
      );
  }

  leave(gameId: string) {
    this.gamesService.removePlayerFromGame(gameId, this.player.ID)
      .subscribe(data => {
          this.getGames();
        }, error => {
          window.alert("Error: " + error)
        }
      );
  }


}
