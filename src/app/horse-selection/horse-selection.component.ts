import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GamesService} from "../games.service";

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
  meetingId: number;
  meetings: any;
  invalid : Boolean = true;
  constructor(private route:ActivatedRoute,
              private gamesService: GamesService) { }

  ngOnInit(): void {
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId') ,10);
    this.meetingId = parseInt(this.route.snapshot.paramMap.get('meetingId'),10) ;
    this.player = JSON.parse(localStorage.getItem('currentUser',));

    this.gamesService.getMeetings()
      .subscribe(async (data) => {
          console.log(data);
          this.meetings = data;
        }, error =>
          window.alert("error getting game: " + error)
      );

    this.gamesService.getHorsesForPlayer(this.gameId, this.player.ID)
      .subscribe(async (data) => {
          console.log(data);
          this.horses = data;

          for (let i=0; i < this.horses.length; i++) {
            const horse = this.horses[i];
            this.gamesService.getHorseForm(this.gameId,horse.ID)
              .subscribe( async(data) => {
                horse.FORM = data;
              }, error => {
                window.alert("error getting horse form: " + error);
              });
          }
        }, error =>
          window.alert("error getting game: " + error)
      );

    this.gamesService.getRacesInMeeting(this.meetingId)
      .subscribe(async (data) => {
          console.log(data);
          this.races = data;
        }, error =>
          window.alert("error getting game: " + error)
      );
  }

  getMeetingName() {
    if (this.meetings && this.meetingId) {
      return this.meetings.find((meeting) => {
        if (meeting.ID === this.meetingId) {
          return meeting;
        }
      }).NAME;
    }
    return "";
  }

  handleHorseSelected() {
    let selectionBoxes = Array.from(document.getElementsByClassName("horseSelector"));
    let selectedValues = selectionBoxes.map((selectionBox) => {
      return (<HTMLSelectElement>selectionBox).value;
    });

    // check for duplicated values
    this.invalid = (new Set(selectedValues)).size !== selectedValues.length;
  }

  async setSelection() {
    let selectionBoxes = Array.from(document.getElementsByClassName("horseSelector"));
    let selectedValues = selectionBoxes.map((selectionBox, index) => {
      let horseName = (<HTMLSelectElement>selectionBox).value;
      let horse = this.gamesService.getHorseByName(this.horses,horseName);
      return {raceId: this.races[index].ID, horseId: horse.ID};
    });
    for (const selection of selectedValues) {
      await this.gamesService.addHorseToRace(this.gameId,selection.raceId,selection.horseId,this.player.ID)
        .subscribe(async (data) => {
            console.log(data);
          }, error =>
            window.alert("error getting game: " + error)
        );
    }
    window.alert('Done');


  }

}
