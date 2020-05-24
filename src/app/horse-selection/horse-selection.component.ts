import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GamesService} from '../games.service';
import {forkJoin} from 'rxjs';
import {HorseNameGenerator, RaceHorse} from "../race-horse";

@Component({
  selector: 'app-horse-selection',
  templateUrl: './horse-selection.component.html',
  styleUrls: ['./horse-selection.component.css']
})
export class HorseSelectionComponent implements OnInit {

  gameId: number;
  horses: any;
  player: any;
  races: any;
  meetingId: any;
  meetings: any;
  meeting: any;
  meetingName: string;
  invalid = true;
  readyForBets = false;
  gameData: any;
  waitingFor: any;
  showSubmit = false;
  players: any;
  isGameMaster = false;

  constructor(private route: ActivatedRoute,
              private gamesService: GamesService) {
  }


  async getHorsesForRobot(botId):Promise<any> {
    return new Promise ( (resolve, reject) => {
      this.gamesService.getHorsesForPlayer(this.gameId, botId)
        .subscribe( data => {
          resolve(data);
        }, err => {
          console.log('failed to get horses for bot: ' + err);
          reject(err);
      });
    });
  }

  async makeGlue (horse) {
    return new Promise( async (resolve, reject) => {
      // TODO.. only allow if we have the funds?
      if (window.confirm(`Are you sure you want to turn ${horse.NAME} intro glue? This will cost you 50 points.`)) {
        this.gamesService.deleteHorse(horse.ID)
          .subscribe(data => {
            const horseName = HorseNameGenerator.getHorseName()
            const newHorse = new RaceHorse(horseName);
            this.gamesService.savePlayerHorse(this.gameId,this.player.ID, newHorse)
              .subscribe(()=> {
                this.gamesService.adjustPlayerFunds(this.gameId, this.player.ID, - 50)
                  .subscribe(async () => {
                    await this.getAllPlayerHorses();
                    resolve(true);
                  }, err => {
                    reject(err);
                  });

              }, err => {
                reject(err);
              })
          }, error => {
            reject(error);
          });
      }
    });

  }

  async dope(horse) {
    if (window.confirm(`Are you sure you want to dope ${horse.NAME}. This would be cheating.`)) {
      window.alert("Cheating is not yet tolerated, sorry.");
    }
  }


  async getData(): Promise<any> {
    return new Promise( (resolve, reject) => {
      forkJoin([
        this.gamesService.getGame(this.gameId),
        this.gamesService.getMeetings(this.gameId),
        this.gamesService.getRacesInMeeting(this.meetingId),
        this.gamesService.getPlayersInGame(this.gameId)
      ]).subscribe( async data => {
        this.gameData = data[0];
        this.meetings = data[1];
        this.meeting = this.meetings.find((m) => {
        if (m.ID === this.meetingId) {
            return m;
          }
         });
        this.meetingName = this.meeting.NAME;
        this.races = data[2];
        this.players = data[3];
        const robots = this.players.filter((x) => {
          if (!x.HUMAN) {
            return x;
          }
        });

        if (this.gameData.MASTER_PLAYER_ID === this.player.ID) {
          this.isGameMaster = true;
          if (robots.length) {

            const aSubscriptions = [];

            for(const robot of robots) {
              const selections = await this.getPlayerHorsesForMeeting(robot.PLAYER_ID);
              if ((!selections) || (selections.length === 0)) {
                await this.clearHorsesForPlayer(robot.PLAYER_ID);
                const robotHorses = await this.getHorsesForRobot(robot.PLAYER_ID);
                // select a unique horse for each race
                for (const race of this.races) {
                  const rnd = (Math.random() * robotHorses.length) | 0;
                  const randomHorse = robotHorses.splice(rnd, 1)[0];
                  console.log(randomHorse.NAME);
                  aSubscriptions.push(this.gamesService.addHorseToRace(this.gameId, race.ID, randomHorse.ID, robot.PLAYER_ID));
                }
              }
            }

            forkJoin(aSubscriptions).subscribe( (data) => {
              console.log("saved selections");
            }, err => {
              window.alert("error saving robot horse selection");
            });
          }
        }
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  async getPlayerHorsesForMeeting(playerId): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.gamesService.getPlayerHorsesForMeeting(this.gameId, this.meetingId, playerId)
        .subscribe( data => resolve(data), err => reject(err));
    });
  }


  async getHorseForm(horse): Promise<any> {
    return new Promise( (resolve,reject) => {
      this.gamesService.getHorseForm(this.gameId, horse.ID)
        .subscribe(async (data) => {
          const form: any = data;
          for (let f of form) {
            f.going = this.getGoingString(f.GOING);
          }
          resolve(form);
        }, err => {
          reject(err);
        });
    });
  }


  async getAllPlayerHorses() {
    return new Promise((resolve, reject) => {
      this.gamesService.getHorsesForPlayer(this.gameId, this.player.ID)
        .subscribe(async (data) => {
          this.horses = data;
          for (let i = 0; i < this.horses.length; i++) {
            const horse = this.horses[i];
            await this.getHorseForm(horse).catch(err => {
              // this.gamesService.notBusy();
              reject(err);
            }).then((form) => {
              horse.FORM = form;
            });
          }
          resolve(this.horses);
        });
    });
  }

   ngOnInit(): void {
    this.showSubmit = false;
    this.gamesService.busy();
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId'), 10);
    this.meetingId = parseInt(this.route.snapshot.paramMap.get('meetingId'), 10);
    this.player = JSON.parse(localStorage.getItem('currentHorseUser'),null);


    this.getData().catch( err => {
      this.gamesService.notBusy();
      window.alert('Error getting data: ' + err);
      this.checkReadyForNextStep(0);
    }).then( async () => {
          await this.updatePlayerSelections();
        }, error => {
          this.gamesService.notBusy();
          window.alert('error getting horses for player: ' + error);
        });
    };


  async updatePlayerSelections(){
    await this.getAllPlayerHorses();
    const selections = await this.getPlayerHorsesForMeeting(this.player.ID);
    this.restoreSelections(selections);
    this.gamesService.notBusy();
    this.checkReadyForNextStep(0);
  }

  handleHorseSelected() {
    let selectionBoxes = Array.from(document.getElementsByClassName('horseSelector'));
    let selectedValues = selectionBoxes.map((selectionBox) => {
      return (<HTMLSelectElement>selectionBox).value;
    });

    // check for duplicated values
    this.invalid = (new Set(selectedValues)).size !== selectedValues.length;
  }


  getGoingString(id) {
    switch (id) {
      case 0:
        return 'firm';
      case 1:
        return 'good';
      case 2:
        return 'soft';
      default :
        return '?';
    }
  }

  get going() {
    if (this.meeting) {
      return this.getGoingString(this.meeting.GOING);
    }
  }

  checkReadyForNextStep(timeout?: number) {
    if (this.readyForBets) {
      return;
    }

    setTimeout((args) => {
      this.gamesService.getMeetingSelectionsComplete(this.gameId, this.meetingId).subscribe((response) => {
        if (response) {
          if (response['ready']) {
            this.readyForBets = true;
          } else {
            this.waitingFor = response;
            this.checkReadyForNextStep(2000);
          }
        } else {
          this.checkReadyForNextStep(2000);
        }
      }, (err) => {
        console.log(err);
      });
    }, timeout, [this]);

  }

  async clearHorsesForPlayer(playerId) {
    return new Promise( (resolve, reject) => {
      this.gamesService.clearHorsesForPlayer(this.gameId, playerId, this.meetingId)
        .subscribe((success) => {
          resolve(success)
        }, err => {
          reject(err);
        });
    });
  }


  async setSelection() {

    this.gamesService.clearHorsesForPlayer(this.gameId, this.player.ID, this.meetingId)
      .subscribe((success) => {

        let selectionBoxes = Array.from(document.getElementsByClassName('horseSelector'));
        let selectedValues = selectionBoxes.map((selectionBox, index) => {
          selectionBox["disabled"] = true;
          let horseName = (<HTMLSelectElement>selectionBox).value;
          let horse = this.gamesService.getHorseByName(this.horses, horseName);
          return {raceId: this.races[index].ID, horseId: horse.ID};
        });
        let aSubscriptions = []
        for (const selection of selectedValues) {
          aSubscriptions.push(this.gamesService.addHorseToRace(this.gameId, selection.raceId, selection.horseId, this.player.ID));
        }
        forkJoin(aSubscriptions)
          .subscribe(async (data) => {
              this.showSubmit = false;
              this.checkReadyForNextStep(0);
            }, error => {
              window.alert('error getting game: ' + error);

              // reenable the input.
              for (let s of selectionBoxes) {
                s["disabled"] = false;
              }
            }
          );
      }, error => {
        window.alert('error clearing player horses:' + error)
      });
  }


  restoreSelections(sels) {
    let bHideSubmit = false;

    const selectionElems = Array.from(document.getElementsByClassName('horseSelector'));
    if (sels && sels.length) {
      let bHideSubmit = true;
      for (let selection of sels) {

        let selRaceId = selection.RACE_ID;

        const raceIndex = this.races.findIndex((race) => {
          return (race.ID === selRaceId);
        });

        if (raceIndex >= 0) {
          const selElem = (<HTMLSelectElement>selectionElems[raceIndex]);
          if (selElem) {
            selElem.value = selection.NAME;
            selElem.disabled = true;
          } else {
            console.log('Could not restore selection: ' + selection.NAME);
          }
        } else {
          console.log('Selection not found: ' + JSON.stringify(selection));
          bHideSubmit = false;
        }
      }
    }
    this.showSubmit = !bHideSubmit;
  }

  async doForceSelection(aPlayer) {
    if (window.confirm(`Are you sure you want to select horses for ${aPlayer.PLAYER_NAME}?`) === true) {


      this.gamesService.busy();
      const aSubscriptions = [];
      const selections = await this.getPlayerHorsesForMeeting(aPlayer.PLAYER_ID);
      if ((!selections) || (selections.length === 0)) {
        await this.clearHorsesForPlayer(aPlayer.PLAYER_ID);
        const robotHorses = await this.getHorsesForRobot(aPlayer.PLAYER_ID);
        // select a unique horse for each race
        for (const race of this.races) {
          const selHorse = await this.getHorseForRace(aPlayer, race, robotHorses);
          const ndx = robotHorses.indexOf(selHorse);
          const randomHorse = robotHorses.splice(ndx, 1)[0];
          console.log(randomHorse.NAME);
          aSubscriptions.push(this.gamesService.addHorseToRace(this.gameId, race.ID, randomHorse.ID, aPlayer.PLAYER_ID));
        }

        return new Promise( (resolve,reject) => {
          forkJoin(aSubscriptions)
            .subscribe( async data => {
              await this.updatePlayerSelections();
              this.gamesService.notBusy();
              window.alert('OK');
              resolve(data);
            }, err => {
              this.gamesService.notBusy();
              reject(err);
            });
        });
      }
      else {
        this.gamesService.notBusy();
        return true;
      }
    }
  }



  async getHorseForRace(aPlayer, aRace, allPlayerHorses) {

    for(const horse of allPlayerHorses) {
      horse.FORM = await this.getHorseForm(horse);
    }

    const fnGetWinnerForLengthAndGoing = () => {
      return allPlayerHorses.find( (aHorse) => {
        return aHorse.FORM.find((form) => {
          if ((form.LENGTH_FURLONGS === aRace.LENGTH_FURLONGS) && (form.GOING === this.meeting.GOING) && (form.POSITION === 1)) {
            return true;
          }
        });
      });
    };

    const fnGetWinnerForLength = () => {
      return allPlayerHorses.find( (aHorse) => {
        return aHorse.FORM.find((form) => {
          if ((form.LENGTH_FURLONGS === aRace.LENGTH_FURLONGS)  && (form.POSITION === 1)) {
              return true;
          }
        });
      });
    };


    const fnGetPlaceForLengthAndGoing = () => {
      return allPlayerHorses.find( (aHorse) => {
        return aHorse.FORM.find((form) => {
          if ((form.LENGTH_FURLONGS === aRace.LENGTH_FURLONGS) && (form.GOING === this.meeting.GOING) && (form.POSITION  <= 3)) {
            return true;
          }
        });
      });
    };

    const fnGetPlaceForLength = () => {
      return allPlayerHorses.find( (aHorse) => {
        return aHorse.FORM.find((form) => {
          if ((form.LENGTH_FURLONGS === aRace.LENGTH_FURLONGS)  && (form.POSITION <= 3)) {
            return true;
          }
        });
      });
    };

    const fnGetUnusedHorse = () => {
      return allPlayerHorses.find( (aHorse) => {
        if (aHorse.FORM.length === 0) {
          return true;
        }
      });
    };

    const fnGetRandomHorse = () => {
      const rnd = (Math.random() * allPlayerHorses.length) | 0;
      return allPlayerHorses[rnd];
    };

    let horse = fnGetWinnerForLengthAndGoing();
    if (!horse) {
      horse = fnGetWinnerForLength();
    }

    if (!horse) {
      horse = fnGetPlaceForLengthAndGoing();
    }

    if (!horse) {
      horse = fnGetPlaceForLength();
    }

    if (!horse) {
      horse = fnGetUnusedHorse();
    }

    if (!horse) {
      horse = fnGetRandomHorse();
    }

    return horse;

  }

}

