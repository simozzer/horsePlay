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
    this.player = JSON.parse(localStorage.getItem('currentHorseUser',));

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

        this.updateShowNextLink();

        this.gamesService.notBusy();
      }, error => {
        this.gamesService.notBusy();
        window.alert('error: ' + error);
      });

  }

  async updateBets() {
    return new Promise( (resolve,reject) => {
      this.gamesService.getBetsForRace(this.gameId, this.raceId)
        .subscribe(async (data) => {
          this.bets = data;
          resolve(true);
        }, (err) => {
          reject(err);
        })
    });
  }

  async updateShowNextLink() {

    const doCheck = async () => {
      if (this.showNextLink) {
        return;
      }

      await this.updateBets();
      this.gamesService.getPlayerCountWithState(this.gameId, GamesStates.viewingPreRaceSummary)
        .subscribe((data) => {
          if (data['COUNT'] && (data['COUNT'] === this.players.length)) {
            this.showNextLink = true;
          } else {

            let validState = true;
            for(let p of data['playerStates']) {
              if (p.STATE < GamesStates.viewingPreRaceSummary) {
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

  getBetTypeName(betType) {
    switch(betType) {
      case 0: return "To win";
      case 1: return "To place (top 3)";
      default:
        return "Unknown betType: " + betType;
    }
  }


}
