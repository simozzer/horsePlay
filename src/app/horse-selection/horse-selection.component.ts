import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GamesService} from '../games.service';
import {forkJoin} from 'rxjs';
import {SoundsService} from '../sounds.service';

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

  constructor(private route: ActivatedRoute,
              private gamesService: GamesService,
              private soundsService: SoundsService) {
  }

  async getData(): Promise<any> {
    return new Promise( (resolve, reject) => {
      forkJoin([
        this.gamesService.getGame(this.gameId),
        this.gamesService.getMeetings(this.gameId),
        this.gamesService.getRacesInMeeting(this.meetingId)
      ]).subscribe( data => {
        this.gameData = data[0];
        this.meetings = data[1];
        this.meeting = this.meetings.find((m) => {
        if (m.ID === this.meetingId) {
            return m;
          }
         });
        this.meetingName = this.meeting.NAME;
        this.races = data[2];
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  async getPlayerHorsesForMeeting(): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.gamesService.getPlayerHorsesForMeeting(this.gameId, this.meetingId, this.player.ID)
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

   ngOnInit(): void {
    this.gamesService.busy();
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId'), 10);
    this.meetingId = parseInt(this.route.snapshot.paramMap.get('meetingId'), 10);
    this.player = JSON.parse(localStorage.getItem('currentUser'),null);


    this.getData().catch( err => {
      this.gamesService.notBusy();
      window.alert('Error getting data: ' + err);
      this.checkReadyForNextStep(0);
    }).then( () => {
      this.gamesService.getHorsesForPlayer(this.gameId, this.player.ID)
        .subscribe(async (data) => {

          this.horses = data;
          for (let i = 0; i < this.horses.length; i++) {
            const horse = this.horses[i];

            await this.getHorseForm(horse).catch(err => {
              // this.gamesService.notBusy();
              window.alert('error getting horse form: ' + err);
            }).then((form) => {
              horse.FORM = form;
            });
          };
          const selections = await this.getPlayerHorsesForMeeting();
          this.restoreSelections(selections);
          this.gamesService.notBusy();
          this.checkReadyForNextStep(0);
        }, error => {
          this.gamesService.notBusy();
          window.alert('error getting horses for player: ' + error);
        });
    });

    // nested

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
    let bHideSumbit = false;

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
    this.showSubmit = !bHideSumbit;
  }

}
