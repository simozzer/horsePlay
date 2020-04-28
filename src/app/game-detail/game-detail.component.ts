import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {GamesService} from "../games.service";

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})

export class GameDetailComponent implements OnInit {

  id;
  @Input() game: any;
  model = { name: ""};
  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService
  ){}

  ngOnInit(): void {
    this.getGame();
  }

  getGame(): void {
    let id = this.route.snapshot.paramMap.get('name');
    console.log(id);
    this.gamesService.getGame(id)
      .subscribe(async data => {
          this.game = data;
          this.game.players = await this.getPlayersInGame();
          this.sortPlayers();
        }, error =>
          window.alert("error getting game: " + error)
      )
  }

  async getPlayersInGame() {
    return new Promise(async (resolve,reject) => {
      this.gamesService.getPlayersInGame(this.game.ID)
        .subscribe( (data) => {
          resolve(data);
        });
    });
  }


  private sortPlayers() {
    if (this.game && this.game.players && this.game.players.length && (this.game.players.length > 0)) {
      this.game.players.sort((player1, player2) => {
        if (player1.funds > player2.funds) {
          return -1;
        } else if (player1.funds < player2.funds) {
          return 1
        } else if (player1.name > player2.name) {
          return 1;
        } else if (player1.name < player2.name) {
          return -1
        } else {
          return 0;
        }
      });
    }
  }
}
