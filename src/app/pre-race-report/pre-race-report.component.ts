import { Component, OnInit } from '@angular/core';
import {GamesService, GamesStates} from "../games.service";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-pre-race-report',
  templateUrl: './pre-race-report.component.html',
  styleUrls: ['./pre-race-report.component.css']
})
export class PreRaceReportComponent implements OnInit {

  gameId;
  gameData;
  raceId;
  bets;
  raceData;
  showNextLink = false;
  player;
  players;

  constructor(private gamesService: GamesService,
              private route: ActivatedRoute,
              private router: Router) {}


  ngOnInit(): void {
    this.gamesService.busy();
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId'),10);
    this.raceId = parseInt(this.route.snapshot.paramMap.get('raceId'),10);
    this.player = JSON.parse(localStorage.getItem('currentUser',));

    forkJoin([this.gamesService.getBetsForRace(this.gameId, this.raceId),
      this.gamesService.getRaceInfo(this.raceId, this.gameId),
      this.gamesService.getGame(this.gameId),
      this.gamesService.getPlayersInGame(this.gameId),
      this.gamesService.setPlayerState(this.gameId,this.player.ID, GamesStates.viewingPreRaceSummary)])
      .subscribe((data) => {
        this.bets = data[0];
        this.raceData = data[1];
        this.gameData = data[2];
        this.players = data[3];
        if (this.gameData.MASTER_PLAYER_ID !== this.player.ID) {
          this.showNextLink = true;
        } else {
          this.updateShowNextLink();
        }
        this.gamesService.notBusy();
      }, error => {
        this.gamesService.notBusy();
        window.alert('error: ' + error);
      });

  }



  updateShowNextLink() {

    const doCheck =() => {
      if (this.showNextLink) {
        return;
      }

      this.gamesService.getPlayerCountWithState(this.gameId, GamesStates.viewingPreRaceSummary)
        .subscribe((data) => {
          if (data['COUNT'] && (data['COUNT'] === this.players.length)) {
            this.showNextLink = true;
          } else {

            let validState = true;
            for(let p of data['playerStates']) {
              if (p.state < GamesStates.viewingPreRaceSummary) {
                validState = false;
              }
            }

            if (validState) {
              this.showNextLink = true;
            } else {
              window.setTimeout(doCheck, 2000, [this]);
            }


          }
        }, error => {
          window.alert('error fetching player count with state: ' + error);
        });
    }

    doCheck();

  }

  get going() {
    if (this.raceData) {
      switch (this.raceData.GOING) {
        case 0:
          return "firm";
        case 1:
          return "good";
        case 2:
          return "soft";
      }
    }
  }

}
