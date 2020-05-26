import { Component, OnInit } from '@angular/core';
import {GamesService, GamesStates} from '../games.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HORSETYPES} from '../race-horse';
import {forkJoin} from 'rxjs';



@Component({
  selector: 'app-bet-placement',
  templateUrl: './bet-placement.component.html',
  styleUrls: ['./bet-placement.component.css']
})
export class BetPlacementComponent implements OnInit {

  gameId: number;
  raceId: number;
  player: any;
  players: any;
  horses: any;
  raceData: any;
  playerBets: any;
  gameData: any;
  allPlayersReady = false;
  playerReady = false;
  initialFunds = 0;
  remainingFunds = 0;
  betsTotal = 0;
  waitingFor: any;
  _invalidBetAmount;
  _oddsStats: any;

  constructor(private gamesService: GamesService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.gamesService.busy();
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId'), 10);
    this.raceId = parseInt(this.route.snapshot.paramMap.get('raceId'), 10);
    this.player = JSON.parse(localStorage.getItem('currentHorseUser'));

    forkJoin([this.gamesService.getPlayersInGame(this.gameId),
      this.gamesService.getHorsesForRace(this.gameId, this.raceId),
      this.gamesService.getRaceInfo(this.raceId, this.gameId),
      this.gamesService.getPlayerFunds(this.gameId, this.player.ID),
      this.gamesService.getGame(this.gameId),
      this.gamesService.setPlayerState(this.gameId, this.player.ID, GamesStates.placingBets)])
        .subscribe( async data => {
          this.players = data[0];
          this.horses = data[1];
          this.raceData = data[2];
          for (const horse of this.horses) {
            const horseForm: any = await this.getHorseForm(horse.ID);
            for (const f of horseForm) {
              switch (f.GOING) {
                case 0:
                  f.going = 'firm';
                  break;
                case 1:
                  f.going = 'good';
                  break;
                case 2:
                  f.going = 'soft';
                  break;
                default :
                  f.going = '?';
              }
            }
            horse.FORM = horseForm;
          }
          this.generateOdds(this.horses);
          localStorage.setItem('odds', JSON.stringify({
            gameId : this.gameId,
            raceId : this.raceId,
            odds : this._oddsStats
          }));
          this.initialFunds = data[3]['FUNDS'];
          this.remainingFunds = this.initialFunds;

          this.gameData = data[4];

          if (this.player.ID === this.gameData.MASTER_PLAYER_ID) {
            // advance any robots to the next step
            for (const pl of this.players) {
              if (pl.HUMAN !== 1) {
                this.gamesService.setPlayerState(this.gameId, pl.PLAYER_ID, GamesStates.viewingPreRaceSummary).subscribe(data => {
                  console.log('saved played state');
                }, err => {
                  window.alert('Error setting robot state: ' + err);
                });
              }
            }
          }

          this.getPlayerBets();

          },
            err => {
            this.gamesService.notBusy();
            window.alert('error setting up: ' + err);
          });

  }


  async getHorseForm(horseId)  {
    return new Promise((resolve, reject) => {
      this.gamesService.getHorseForm(this.gameId, horseId)
        .subscribe( data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  get going(){
    if (this.raceData) {
      switch (this.raceData.GOING) {
        case 0: return 'firm';
        case 1: return 'good';
        case 2: return 'soft';
        default : return '?';
      }
    }
  }


  getPlayerBets() {
    this.gamesService.getBetsForPlayer(this.gameId, this.raceId, this.player.ID)
      .subscribe( data => {
        this.playerBets = data;
        let betsAmt = 0;
        for (const b of this.playerBets) {
          betsAmt += b.AMOUNT;
        }
        this.betsTotal = betsAmt;
        this.remainingFunds = this.initialFunds - this.betsTotal;
        this.gamesService.notBusy();
      }, error => {
        this.gamesService.notBusy();
        window.alert('Failed to get player bets: ' + error);
      });
  }


  get invalidBetAmount() {
    this._invalidBetAmount = false;
    const input = ((document.getElementById('betAmount')) as HTMLInputElement);
    if (input) {
      const val = +input.value;
      if ((val < 0) || (val > this.remainingFunds)) {
         this._invalidBetAmount = true;
        }
    } else if (this.remainingFunds < 0) {
      this._invalidBetAmount = true;
    }
    return this._invalidBetAmount;
  }


  updateEnabledState() {
    // update state of bet validity
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
    if (this.allPlayersReady) {
      return;
    }

    if (this.router.isActive('/betting', false) === true) {
      const expectedState = GamesStates.viewingPreRaceSummary;
      const doCheck = (interval) => {
        if (!this.players) {
          return;
        }

        this.gamesService.getPlayerCountWithState(this.gameId, expectedState)
          .subscribe(data => {
            if (data && data['COUNT'] && (data['COUNT'] === this.players.length)) {
              this.allPlayersReady = true;
              this.waitingFor = [];
              this.router.navigateByUrl(`preRace/${this.gameId}/${this.raceId}`);
            } else {
              let validState = true;
              for (const p of data['playerStates']) {
                if (p.state < expectedState) {
                  validState = false;
                }
              }
              if (validState) {
                this.allPlayersReady = true;
                this.waitingFor = [];
                this.router.navigateByUrl(`preRace/${this.gameId}/${this.raceId}`);
              } else {
                this.waitingFor = data['playerStates'];
                window.setTimeout(doCheck, 2000, this);
              }
            }
          }, error => {
            window.alert('error fetching player count for state: ' + error);
          });
      };

      if (!this.allPlayersReady) {
        window.setTimeout(doCheck, 0, this);
      }
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
        window.alert('unhandled race length');
        break;
    }
  }

  // adjust the chance of a win based on the going
  adjustHorseWinChanceScoreForGoing(horse, val) {
    switch (horse.GOING_TYPE) {
      case 0:
        switch (this.raceData.GOING) {
          case 0:
            return val;
          case 1:
            return val * 0.8;
          case 2:
            return val * 0.75;
          default:
            throw new Error('Could not adjust horse chance win score');

        }
      case 1:
        switch (this.raceData.GOING) {
          case 0:
            return val * 0.8;
          case 1:
            return val;
          case 2:
            return val * 0.8;
          default:
            throw new Error('Could not adjust horse chance win score');

        }
      case 2:
        switch (this.raceData.GOING) {
          case 0:
            return val * 0.75;
          case 1:
            return val * 0.8;
          case 2:
            return val;
          default:
            throw new Error('Could not adjust horse chance win score');

        }
        break;
      default:
        throw new Error('Could not adjust horse chance win score');
    }
  }

  adjustHorseWinChanceSoreUsingFormAndGoing(horse, val) {

    const getHasFinishedLength = () => {
      const res = horse.FORM.find( (formItem) => {
        if ((formItem.LENGTH_FURLONGS >= (this.raceData.LENGTH_FURLONGS - 1))
          && (formItem.LENGTH_FURLONGS <= (this.raceData.LENGTH_FURLONGS + 1))
          && (formItem.POSITION <= 3)) {
          return formItem;
        }
      });
      if (res) {
        return true;
      }
   };

    const getHasWonLength = () => {
      const res = horse.FORM.find( (formItem) => {
        if ((formItem.LENGTH_FURLONGS >= (this.raceData.LENGTH_FURLONGS - 1))
          && (formItem.LENGTH_FURLONGS <= (this.raceData.LENGTH_FURLONGS + 1))
          && (formItem.POSITION === 1)) {
          return formItem;
        }
      });
      if (res) {
        return true;
      }
    };

    const getHasWonLengthAndGoing = () => {
      const res = horse.FORM.find( (formItem) => {
        if ((formItem.LENGTH_FURLONGS >= (this.raceData.LENGTH_FURLONGS - 1))
          && (formItem.LENGTH_FURLONGS <= (this.raceData.LENGTH_FURLONGS + 1))
          && (formItem.POSITION === 1) && (formItem.GOING === this.raceData)) {
          return formItem;
        }
      });
      if (res) {
        return true;
      }
    };

    const getHasFinishedLengthAndGoing = () => {
      const res = horse.FORM.find( (formItem) => {
        if ((formItem.LENGTH_FURLONGS >= (this.raceData.LENGTH_FURLONGS - 1))
          && (formItem.LENGTH_FURLONGS <= (this.raceData.LENGTH_FURLONGS + 1))
          && (formItem.POSITION <= 3) && (formItem.GOING === this.raceData)) {
          return formItem;
        }
      });
      if (res) {
        return true;
      }
    };

    const getHasFinishedGoing = () => {
      const res = horse.FORM.find( (formItem) => {
        if ((formItem.GOING === this.raceData.GOING)
          && (formItem.POSITION <= 3)) {
          return formItem;
        }
      });
      if (res) {
        return true;
      }
    };

    const getHasWonGoing = () => {
      const res = horse.FORM.find( (formItem) => {
        if ((formItem.GOING === this.raceData.GOING)
          && (formItem.POSITION === 1)) {
          return formItem;
        }
      });
      if (res) {
        return true;
      }
    };

    if (getHasWonLengthAndGoing()) {
      return val + 0.2;
    } else if (getHasFinishedGoing()) {
      return val + 0.15;
    } else if (getHasWonLength()) {
      return val + 0.1;
    } else if (getHasFinishedLengthAndGoing()) {
      return val + 0.08;
    } else if (getHasFinishedLength()) {
      return val + 0.075;
    } else if (getHasWonGoing()) {
      return val  + 0.05;
    } else if (getHasFinishedGoing()) {
      return val + 0.02;
    } else {
      return val - 0.1;
    }

  }


  generateOdds(horses) {

    const oddsStats = [];
    horses.forEach((horse) => {
      let val = this.getHorseWinChanceScore(horse);
      val = this.adjustHorseWinChanceScoreForGoing(horse, val);
      val = this.adjustHorseWinChanceSoreUsingFormAndGoing(horse, val);
      oddsStats.push({ horse, score: val, form: horse.FORM});
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
      stat.odds = 1.0 + index * 0.5;
      if (index > 2) {
        stat.odds = stat.odds * (2 + index - 2);
      }

      stat.horse._raceOdds = stat.odds;
    });
    this._oddsStats = oddsStats;
  }


  getBetTypeName(betType) {
    switch (betType) {
      case 0: return 'To win';
      case 1: return 'To place (top 3)';
      default:
        return 'Unknown betType: ' + betType;
    }
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
    const horseSelector = (document.getElementById('horseSelector') as HTMLSelectElement);
    const selIndex = horseSelector.selectedIndex;
    const horseName = (horseSelector.childNodes[selIndex] as HTMLOptionElement).value;
    const horseOdds = this.getOdds(horseName);
    const horseId = horseOdds.horse.ID;
    const amount = (document.getElementById('betAmount') as HTMLInputElement).value;
    const betTypeSelector = (document.getElementById('betTypeSelector') as HTMLSelectElement);
    const betTypeIndex = betTypeSelector.selectedIndex;
    let betOdds = horseOdds.odds;
    if (betTypeIndex === 1) {
      betOdds = horseOdds.odds / 4;
    }
    const betObj = {
      PLAYER_ID : this.player.ID,
      GAME_ID : this.gameId,
      RACE_ID : this.raceId,
      HORSE_ID : horseId,
      AMOUNT : parseInt(amount, 10) | 0,
      TYPE : betTypeIndex,
      ODDS : betOdds
    };

    this.gamesService.busy();
    this.gamesService.placeBet(betObj)
      .subscribe( result => {
        if (result) {
          this.gamesService.notBusy();
          this.getPlayerBets();

        } else {
          this.gamesService.notBusy();
          window.alert('failed to place bet');
        }
      }, error => {
        this.gamesService.notBusy();
        window.alert('Error placing bet: ' + error);
      });
  }

  betKeyPress() {
    this.updateEnabledState();
    const event: any = window['event'];
    if (event  && (event['keyCode'] === 13)) {
      if (!(this._invalidBetAmount)) {
        this.placeBet();
      }
    }
  }

}
