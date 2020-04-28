import { Component, OnInit } from '@angular/core';
import {GamesService} from "../games.service";
import {UsersService} from "../users.service";
import {AuthenticationService} from "../authentication.service";

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

  async playerInGame(gameId: number) {
    return new Promise(async (resolve,reject) => {
      this.gamesService.getPlayersInGame(gameId)
        .subscribe( (data) => {
          let players = [];
          if (players.find((player) => {
            if (player.NAME = this.player.Name) {
              return player;
            }
          })) {
            resolve(true)
          } else {
            resolve(false);
          }
        });
    });
  }


  join(gameId: string) {
    this.gamesService.updatePlayerInGame(gameId, {id: this.player.ID})
      .subscribe(data => {
          this.getGames();
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
