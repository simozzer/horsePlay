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

  constructor(private gamesService: GamesService,
              private usersService: UsersService,
              private authService: AuthenticationService) {
  }

  async ngOnInit() {
    this.getGames();
  }

  getGames() {
    this.gamesService.getGames()
      .subscribe(data => {
          this.games = data;
        }, error =>
          window.alert("error: " + error)
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

  join(gameName: string) {
    let userTmp = JSON.parse(localStorage.getItem("currentUser"));

    this.gamesService.updatePlayerInGame(gameName, {name: userTmp.name})
      .subscribe( data => {
          this.getGames();
        }, error => {
          window.alert("Error: " + error)
        }
      )

  }


}
