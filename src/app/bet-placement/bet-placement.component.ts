import { Component, OnInit } from '@angular/core';
import {GamesService} from "../games.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HORSETYPES} from "../race-horse";
import {forkJoin} from "rxjs";


@Component({
  selector: 'app-bet-placement',
  templateUrl: './bet-placement.component.html',
  styleUrls: ['./bet-placement.component.css']
})
export class BetPlacementComponent implements OnInit {

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
  initialFunds = 0;
  remainingFunds = 0;
  betsTotal = 0;
  _invalidBetAmount = false;

  constructor(private gamesService: GamesService,
              private route: ActivatedRoute,
              private router: Router) {}



  ngOnInit(): void {
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId'),10);
    this.raceId = parseInt(this.route.snapshot.paramMap.get('raceId'),10);
    this.player = JSON.parse(localStorage.getItem('currentUser',));

    this.getAllPlayers();

    forkJoin([this.gamesService.getHorsesForRace(this.gameId, this.raceId),
      this.gamesService.getRaceInfo(this.raceId)])
        .subscribe( async data => {
          this.horses = data[0];
          this.raceData = data[1];
          for (const horse of this.horses) {
            horse.FORM = await this.getHorseForm(horse.ID);
          }
          this.generateOdds(this.horses);
          this.getPlayerBets();
          }, err => {
              window.alert("error setting up: " + err);
          });
    this.gamesService.getPlayerFunds(this.gameId,this.player.ID)
      .subscribe( (data) => {
        let rec = data;
        this.initialFunds = rec["FUNDS"];
        this.remainingFunds = this.initialFunds;

      }, err => {
        window.alert("Error getting player funds:" + err);
      })
  }

  async getHorseForm(horseId)  {
    return new Promise((resolve, reject) => {
      this.gamesService.getHorseForm(this.gameId,horseId)
        .subscribe( data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  getPlayerBets() {
    this.gamesService.getBetsForPlayer(this.gameId,this.raceId,this.player.ID)
      .subscribe( data => {
        this.playerBets = data;
        let betsAmt = 0;
        for(let b of this.playerBets) {
          betsAmt += b.AMOUNT;
        }
        this.betsTotal = betsAmt;
        this.remainingFunds = this.initialFunds - this.betsTotal;
      }, error => {
        window.alert("Failed to get player bets: " + error);
      })
  }

  get invalidBetAmount() {
    this._invalidBetAmount = false;
    let input = (<HTMLInputElement>(document.getElementById("betAmount")));
    if (input) {
      let val = +input.value;
       if ((val <0) || (val> this.remainingFunds)) {
         this._invalidBetAmount = true;
        }
    } else if (this.remainingFunds < 0) {
      this._invalidBetAmount = true;
    }
    return this._invalidBetAmount;
  }

  updateEnabledState() {
    this.invalidBetAmount;
  }

  getAllPlayers() {
    this.gamesService.getPlayersInGame((this.gameId))
      .subscribe(data => {
        this.players = data;
      }, error => {
        window.alert('Error fetching players in game: ' + error);
        throw error;
      });
  }

  checkAllPlayersReady() {

    const doCheck =(interval) => {
      if (!this.players) {
        return;
      }

      this.gamesService.getPlayerCountWithState(this.gameId,4)
        .subscribe(data => {
          if (data && data["COUNT"] && (data["COUNT"] === this.players.length)) {
            this.allPlayersReady = true;
            this.router.navigateByUrl(`preRace/${this.gameId}/${this.raceId}`);
          } else {
            window.setTimeout(doCheck, 2000, this);
          }
        }, error => {
          window.alert('error fetching player count for state: ' + error);
        });
    };

    if (!this.allPlayersReady) {
      window.setTimeout(doCheck, 0, this);
    }


  }

  getHorseWinChanceScore(horse) {
    switch (this.raceData.LENGTH_FURLONGS) {
      case 5:
        switch (horse.HORSE_TYPE) {
          case HORSETYPES.SHORT_RACE:
            return horse.SPEED_FACTOR;
          case HORSETYPES.MEDIUM_RACE:
            return horse.SPEED_FACTOR * 0.9;
          case HORSETYPES.LONG_RACE:
            return horse.SPEED_FACTOR * 0.8;
          default:
        }
        break;

      case 6:
        switch (horse.HORSE_TYPE) {
          case HORSETYPES.SHORT_RACE * 0.95:
            return horse.SPEED_FACTOR;
          case HORSETYPES.MEDIUM_RACE:
            return horse.SPEED_FACTOR * 0.92;
          case HORSETYPES.LONG_RACE:
            return horse.SPEED_FACTOR * 0.8;
          default:
        }
        break;

      case 7:
        switch (horse.HORSE_TYPE) {
          case HORSETYPES.SHORT_RACE:
            return horse.SPEED_FACTOR * 0.85;
          case HORSETYPES.MEDIUM_RACE:
            return horse.SPEED_FACTOR * 0.94;
          case HORSETYPES.LONG_RACE:
            return horse.SPEED_FACTOR * 0.8;
          default:
        }
        break;

      case 8:
        switch (horse.HORSE_TYPE) {
          case HORSETYPES.SHORT_RACE:
            return horse.SPEED_FACTOR * 0.75;
          case HORSETYPES.MEDIUM_RACE:
            return horse.SPEED_FACTOR * 0.96;
          case HORSETYPES.LONG_RACE:
            return horse.SPEED_FACTOR * 0.85;
          default:
        }
        break;

      case 16:
        switch (horse.HORSE_TYPE) {
          case HORSETYPES.SHORT_RACE:
            return horse.SPEED_FACTOR * 0.6;
          case HORSETYPES.MEDIUM_RACE:
            return horse.SPEED_FACTOR * 0.86;
          case HORSETYPES.LONG_RACE:
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
      oddsStats.push({ horse: horse, score: val, form: horse.FORM});
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
    this.gamesService.setPlayerState(this.gameId, this.player.ID,4)
      .subscribe((state) => {
        this.checkAllPlayersReady();
      }, err => {
        window.alert("error setting player state: " + err);
      });

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
