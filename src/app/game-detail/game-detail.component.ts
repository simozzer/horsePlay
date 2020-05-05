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

  gameId;
  player;
  meetings;
  meeting;
  meetingId;
  gameData;

  @Input() game: any;
  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService
  ){
    this.player = JSON.parse(localStorage.getItem('currentUser',));
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId'),10);
  }

  ngOnInit(): void {
    this.getGame();
  }




  getMeetings() {
    this.gamesService.getMeetings(this.gameId)
      .subscribe(async data => {
          this.meetings = data;
          this.meeting = this.meetings[this.game.MEETING_INDEX];
          this.meetingId = this.meeting.ID;
          await this.gamesService.getRaces(this.meetingId).then((races) => {
            const race = races[this.game.RACE_INDEX];
            this.game.RACE_ID = race.ID;
            this.game.RACE_NAME = race.NAME;
          })
        }, error => {
        window.alert('error getting meetings: ' + error)
      })
  }

  getGame(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.gamesService.getGame(this.gameId)
      .subscribe(async data => {
          this.game = data;
          this.game.players = await this.getPlayersInGame();
          await this.getMeetings();
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
          return 1;
        } else if (player1.funds < player2.funds) {
          return -1
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
