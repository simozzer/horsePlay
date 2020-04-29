import { Component, OnInit } from '@angular/core';
import {GamesService} from "../games.service";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-bet-placement',
  templateUrl: './bet-placement.component.html',
  styleUrls: ['./bet-placement.component.css']
})
export class BetPlacementComponent implements OnInit {

  HORSETYPES = {
    SHORT_RACE: 0,
    MEDIUM_RACE: 1,
    LONG_RACE: 2,
  };

  RACE_LENGTHS = {
    F5: 0,
    F6: 1,
    F7: 2,
    M1: 3,
    M2: 4,
  };


  playerCount : number = 0;
  gameId : number;
  raceId : number;
  player: any;
  players: any;
  horses: any;
  raceData : any;
  playerBets : any;
  _oddsStats: any;
  allPlayersReady = false;
  playerReady = false;
  constructor(private gamesService: GamesService,
              private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId'),10);
    this.raceId = parseInt(this.route.snapshot.paramMap.get('raceId'),10);
    this.player = JSON.parse(localStorage.getItem('currentUser',));

    this.getAllPlayers();
    this.gamesService.getHorsesForRace(this.gameId, this.raceId)
      .subscribe(async data => {
          this.horses = data;

        this.gamesService.getRaceInfo(this.raceId)
          .subscribe((data) => {
            this.raceData = data;
            this.generateOdds(this.horses);
            this.getPlayerBets();
          }, (error) => {
            window.alert("failed to get race info: " + error);
          })



        }, error =>
          window.alert("error getting game: " + error)
      )
  }

  getPlayerBets() {
    this.gamesService.getBetsForPlayer(this.gameId,this.raceId,this.player.ID)
      .subscribe( data => {
        this.playerBets = data;
      }, error => {
        window.alert("Failed to get player bets: " + error);
      })
  }

  getAllPlayers() {
    this.gamesService.getPlayersInGame((this.gameId))
      .subscribe(data => {
        this.players = data;
      }, error => {
        console.log('Error fetching players in game: ' + error)
      });
  }

  checkAllPlayersReady() {

    const doCheck =() => {
      if (!this.players) {
        return;
      }

      this.gamesService.getPlayerCountWithState(this.gameId,3)
        .subscribe(data => {
          if (data && data["COUNT"] && data["COUNT"] === this.player.length) {
            this.allPlayersReady = true;
          } else {
            window.setTimeout(doCheck, 2000, this);
          }
        }, error => {
          console.log('error fetching player count for state: ' + error);
        });
    };

    if (!this.allPlayersReady) {
      window.setTimeout(doCheck, 2000, this);
    }

  }

  getHorseWinChanceScore(horse) {
    switch (this.raceData.LENGTH_FURLONGS) {
      case 5:
        switch (horse.HORSE_TYPE) {
          case this.HORSETYPES.SHORT_RACE:
            return horse.SPEED_FACTOR;
          case this.HORSETYPES.MEDIUM_RACE:
            return horse.SPEED_FACTOR * 0.9;
          case this.HORSETYPES.LONG_RACE:
            return horse.SPEED_FACTOR * 0.8;
          default:
        }
        break;

      case 6:
        switch (horse.HORSE_TYPE) {
          case this.HORSETYPES.SHORT_RACE * 0.95:
            return horse.SPEED_FACTOR;
          case this.HORSETYPES.MEDIUM_RACE:
            return horse.SPEED_FACTOR * 0.92;
          case this.HORSETYPES.LONG_RACE:
            return horse.SPEED_FACTOR * 0.8;
          default:
        }
        break;

      case 7:
        switch (horse.HORSE_TYPE) {
          case this.HORSETYPES.SHORT_RACE:
            return horse.SPEED_FACTOR * 0.85;
          case this.HORSETYPES.MEDIUM_RACE:
            return horse.SPEED_FACTOR * 0.94;
          case this.HORSETYPES.LONG_RACE:
            return horse.SPEED_FACTOR * 0.8;
          default:
        }
        break;

      case 8:
        switch (horse.HORSE_TYPE) {
          case this.HORSETYPES.SHORT_RACE:
            return horse.SPEED_FACTOR * 0.75;
          case this.HORSETYPES.MEDIUM_RACE:
            return horse.SPEED_FACTOR * 0.96;
          case this.HORSETYPES.LONG_RACE:
            return horse.SPEED_FACTOR * 0.85;
          default:
        }
        break;

      case 16:
        switch (horse.HORSE_TYPE) {
          case this.HORSETYPES.SHORT_RACE:
            return horse.SPEED_FACTOR * 0.6;
          case this.HORSETYPES.MEDIUM_RACE:
            return horse.SPEED_FACTOR * 0.86;
          case this.HORSETYPES.LONG_RACE:
            return horse.SPEED_FACTOR;
          default:
        }
        break;

      default:
        window.alert("unhandled race length");
        break;
    }
  }

  generateOdds(horses) {
    let oddsStats = [];
    horses.forEach((horse) => {
      let val = this.getHorseWinChanceScore(horse);
      oddsStats.push({ horse: horse, score: val });
    });
    oddsStats.sort((a, b) => {
      if (a.score === b.score) {
        return 0;
      } else if (a.score < b.score) {
        return 1;
      } else {
        return -1;
      }
    });

    oddsStats.forEach((stat, index) => {
      stat.odds = 2.0 + index * 0.5;
      if (index > 2) {
        stat.odds = stat.odds * (2 + index - 2);
      }

      stat.horse._raceOdds = stat.odds;
      console.log(stat.horse.NAME + "=" + stat.score + "=" + stat.odds + "/1");
    });
    this._oddsStats = oddsStats;
  }

  getOdds(horseName) {
    return this._oddsStats.find((o) => {
      const h = o.horse;
      if (h.NAME === horseName) {
        return o;
      }
    });
  }

  handleReadyToRace() {
    this.playerReady = true;
    this.checkAllPlayersReady();
  }

  placeBet(){
    const horseSelector = (<HTMLSelectElement> document.getElementById("horseSelector"));
    let selIndex = horseSelector.selectedIndex;
    let horseName = (<HTMLOptionElement>horseSelector.childNodes[selIndex]).value;
    let horseOdds = this.getOdds(horseName);
    let horseId = horseOdds.horse.ID;
    let amount = (<HTMLInputElement>document.getElementById("betAmount")).value;
    const betObj = {
      PLAYER_ID : this.player.ID,
      GAME_ID : this.gameId,
      RACE_ID : this.raceId,
      HORSE_ID : horseId,
      AMOUNT : parseInt(amount,10) | 0,
      TYPE : 0,
      ODDS : horseOdds.odds
    }
    debugger;
    this.gamesService.placeBet(betObj)
      .subscribe( result => {
        if (result) {
          this.getPlayerBets();
        } else {
          window.alert("failed to place bet");
        }
      }, error => {
        window.alert("Error placing bet: " + error);
      })
  }
}
