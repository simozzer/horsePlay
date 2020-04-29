import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GamesService} from "../games.service";
import {forkJoin} from "rxjs";
import {SoundsService} from "../sounds.service";

@Component({
  selector: 'app-horse-selection',
  templateUrl: './horse-selection.component.html',
  styleUrls: ['./horse-selection.component.css']
})
export class HorseSelectionComponent implements OnInit {

  gameId : number;
  horses: any;
  player: any;
  races: any;
  meetingId: any;
  meetings: any;
  meeting : any;
  meetingName : string;

  invalid : Boolean = true;
  readyForBets: Boolean = false;

  constructor(private route:ActivatedRoute,
              private gamesService: GamesService,
              private soundsService: SoundsService) { }


  ngOnInit(): void {
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId') ,10);
    this.meetingId = parseInt(this.route.snapshot.paramMap.get('meetingId'),10) ;
    this.player = JSON.parse(localStorage.getItem('currentUser',));

    this.gamesService.getMeetings()
      .subscribe(async (data) => {
          console.log(data);
          this.meetings = data;
          this.meeting = this.meetings.find((m) => {
            if (m.ID === this.meetingId) {
              return m;
            }
          });
          this.meetingName = this.meeting.NAME;
        }, error => {
          window.alert("error getting game: " + error);
        });

    this.gamesService.getHorsesForPlayer(this.gameId, this.player.ID)
      .subscribe(async (data) => {
          console.log(data);
          this.horses = data;

          for (let i=0; i < this.horses.length; i++) {
            const horse = this.horses[i];

            this.gamesService.getHorseForm(this.gameId, horse.ID)
              .subscribe(async (data) => {
                horse.FORM = data;
              }, error => {
                window.alert("error getting horse form: " + error);
              });
          };

        this.gamesService.getPlayerHorsesForMeeting(this.gameId,this.meetingId,this.player.ID)
          .subscribe( async(data) => {
            this.restoreSelections(data);
          }, (err) => {
            window.alert("Error getting player horses for meeting: " + err);
          });
        }, error =>
          window.alert("error getting horses for player: " + error)
      );

    this.gamesService.getRacesInMeeting(this.meetingId)
      .subscribe(async (data) => {
          console.log(data);
          this.races = data;
        }, error => {
          window.alert("error getting game: " + error);
        });

    this.checkReadyForNextStep();
  }


  getMeeting() {
    if (this.meetings && this.meetingId) {
      return this.meetings.find((meeting) => {
        if (meeting.ID === this.meetingId) {
          return meeting;
        }
      });
    }
  }

  handleHorseSelected() {
    let selectionBoxes = Array.from(document.getElementsByClassName("horseSelector"));
    let selectedValues = selectionBoxes.map((selectionBox) => {
      return (<HTMLSelectElement>selectionBox).value;
    });

    // check for duplicated values
    this.invalid = (new Set(selectedValues)).size !== selectedValues.length;
    this.soundsService.playSound(1);
  }

  checkReadyForNextStep() {

    setTimeout((args) => {
      this.gamesService.getMeetingSelectionsComplete(this.gameId,this.meetingId).subscribe( (response) => {
        if (response) {
          this.readyForBets = true;
        } else {
          this.checkReadyForNextStep();
        }
      }, (err) => {
        console.log(err);
      });
    }, 2000, [this]);

  }

  async setSelection() {
    let selectionBoxes = Array.from(document.getElementsByClassName("horseSelector"));
    let selectedValues = selectionBoxes.map((selectionBox, index) => {
      let horseName = (<HTMLSelectElement>selectionBox).value;
      let horse = this.gamesService.getHorseByName(this.horses,horseName);
      return {raceId: this.races[index].ID, horseId: horse.ID};
    });
    let aSubscriptions = []
    for (const selection of selectedValues) {
      aSubscriptions.push(this.gamesService.addHorseToRace(this.gameId,selection.raceId,selection.horseId,this.player.ID));
    }

    forkJoin(aSubscriptions)
      .subscribe(async (data) => {
          console.log(data);
          this.checkReadyForNextStep();

        }, error =>
          window.alert("error getting game: " + error)
      );
  }

  restoreSelections(sels) {

    const selectionElems = Array.from(document.getElementsByClassName("horseSelector"));
    if (sels) {
      for(let selection of sels) {
        let selRaceId = selection.RACE_ID;

        let raceIndex = this.races.findIndex((race, raceIndex) => {
            if (race.ID === selRaceId) {
              return raceIndex;
            }
        });

        if (raceIndex >=0) {
          (<HTMLSelectElement>selectionElems[raceIndex]).value = selection.NAME;
        }

      }
    }

  }

}
