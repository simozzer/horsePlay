import { Component, OnInit } from '@angular/core';
import {GamesService} from "../games.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-pre-race-report',
  templateUrl: './pre-race-report.component.html',
  styleUrls: ['./pre-race-report.component.css']
})
export class PreRaceReportComponent implements OnInit {

  gameId;
  raceId;
  bets;
  raceData;



  constructor(private gamesService: GamesService,
              private route: ActivatedRoute,
              private router: Router) {}


  ngOnInit(): void {
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId'),10);
    this.raceId = parseInt(this.route.snapshot.paramMap.get('raceId'),10);

    this.gamesService.getBetsForRace(this.gameId, this.raceId)
      .subscribe(async data => {
          this.bets = data;
        }, error =>
          window.alert("error getting bets: " + error)
      );

    this.gamesService.getRaceInfo(this.raceId)
      .subscribe(async data => {
          this.raceData = data;
        }, error =>
          window.alert("error getting race data: " + error)
      );
  }

}
