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
  invalid: Boolean = true;
  readyForBets: Boolean = false;
  gameData: any;
  waitingFor: any;

  constructor(private route: ActivatedRoute,
              private gamesService: GamesService,
              private soundsService: SoundsService) {
  }


  ngOnInit(): void {
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId'), 10);
    this.meetingId = parseInt(this.route.snapshot.paramMap.get('meetingId'), 10);
    this.player = JSON.parse(localStorage.getItem('currentUser',));

    this.gamesService.getGame(this.gameId)
      .subscribe((data) => {
        this.gameData = data;
      }, (err) => {
        window.alert('Failed to get game data: ' + err);
      });

    this.gamesService.getMeetings(this.gameId)
      .subscribe(async (data) => {
        this.meetings = data;
        this.meeting = this.meetings.find((m) => {
          if (m.ID === this.meetingId) {
            return m;
          }
        });
        this.meetingName = this.meeting.NAME;
      }, error => {
        window.alert('error getting game: ' + error);
      });

    this.gamesService.getHorsesForPlayer(this.gameId, this.player.ID)
      .subscribe(async (data) => {

          this.horses = data;

          for (let i = 0; i < this.horses.length; i++) {
            const horse = this.horses[i];

            this.gamesService.getHorseForm(this.gameId, horse.ID)
              .subscribe(async (data) => {
                let form = data;
                for (let f of form) {
                  f.going = this.getGoingString(f.GOING);
                }
                horse.FORM = form;
              }, error => {
                window.alert('error getting horse form: ' + error);
              });
          }
          ;

          this.gamesService.getPlayerHorsesForMeeting(this.gameId, this.meetingId, this.player.ID)
            .subscribe(async (data) => {
              // this.restoreSelections(data);
            }, (err) => {
              window.alert('Error getting player horses for meeting: ' + err);
            });
        }, error =>
          window.alert('error getting horses for player: ' + error)
      );

    this.gamesService.getRacesInMeeting(this.meetingId)
      .subscribe(async (data) => {
        this.races = data;
      }, error => {
        window.alert('error getting game: ' + error);
      });

    this.checkReadyForNextStep();
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

  checkReadyForNextStep() {
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
            this.checkReadyForNextStep();
          }
        } else {
          this.checkReadyForNextStep();
        }
      }, (err) => {
        console.log(err);
      });
    }, 2000, [this]);

  }

  async setSelection() {

    this.gamesService.clearHorsesForPlayer(this.gameId, this.player.ID, this.meetingId)
      .subscribe((success) => {

        let selectionBoxes = Array.from(document.getElementsByClassName('horseSelector'));
        let selectedValues = selectionBoxes.map((selectionBox, index) => {

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
              this.checkReadyForNextStep();
            }, error =>
              window.alert('error getting game: ' + error)
          );
      }, error => {
        window.alert('error clearing player horses:' + error)
      });
  }


  restoreSelections(sels) {

    const selectionElems = Array.from(document.getElementsByClassName('horseSelector'));
    if (sels) {

      for (let selection of sels) {

        let selRaceId = selection.RACE_ID;

        let raceIndex = this.races.findIndex((race, raceIndex) => {
          if (race.ID === selRaceId) {

            return raceIndex;
          }
        });

        if (raceIndex >= 0) {
          (<HTMLSelectElement>selectionElems[raceIndex]).value = selection.NAME;
        } else {
          console.log('Selection not found: ' + JSON.stringify(selection));
        }
      }
    }

  }

}
