import { Component, OnInit } from '@angular/core';
import {GamesService} from "../games.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-bet-placement',
  templateUrl: './bet-placement.component.html',
  styleUrls: ['./bet-placement.component.css']
})
export class BetPlacementComponent implements OnInit {

  player: any;
  horses: any[];
  constructor(private gamesService: GamesService,
              private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    let gameId = this.route.snapshot.paramMap.get('gameId');
    let raceId = this.route.snapshot.paramMap.get('raceId');
    this.player = JSON.parse(localStorage.getItem('currentUser',));


    this.gamesService.getHorsesForRace(gameId, raceId)
      .subscribe(async data => {
          debugger;
        }, error =>
          window.alert("error getting game: " + error)
      )
  }


}
