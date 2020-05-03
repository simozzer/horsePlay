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
  gameData : any;

  constructor(private route:ActivatedRoute,
              private gamesService: GamesService,
              private soundsService: SoundsService) { }


  ngOnInit(): void {
    this.gameId = parseInt(this.route.snapshot.paramMap.get('gameId') ,10);
    this.meetingId = parseInt(this.route.snapshot.paramMap.get('meetingId'),10) ;
    this.player = JSON.parse(localStorage.getItem('currentUser',));

    this.gamesService.getGame(this.gameId)
      .subscribe((data) => {
        this.gameData = data;
      }, (err) => {
        console.log("Failed to get game data: " + err);
      });

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
            //this.restoreSelections(data);
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


  handleHorseSelected() {
    let selectionBoxes = Array.from(document.getElementsByClassName("horseSelector"));
    let selectedValues = selectionBoxes.map((selectionBox) => {
      return (<HTMLSelectElement>selectionBox).value;
    });

    // check for duplicated values
    this.invalid = (new Set(selectedValues)).size !== selectedValues.length;
  }

  checkReadyForNextStep() {
    if (this.readyForBets) {
      return;
    }

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

    this.gamesService.clearHorsesForPlayer(this.gameId, this.player.ID, this.meetingId)
      .subscribe((success) => {

        let selectionBoxes = Array.from(document.getElementsByClassName("horseSelector"));
        let selectedValues = selectionBoxes.map((selectionBox, index) => {
          debugger;
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
              console.log(data);
              this.checkReadyForNextStep();
            }, error =>
              window.alert("error getting game: " + error)
          );
      }, error => {
        window.alert("error clearing player horses:" + error)
      });
  }


  restoreSelections(sels) {

    const selectionElems = Array.from(document.getElementsByClassName("horseSelector"));
    if (sels) {
      console.log("Races: " + JSON.stringify(this.races));
      for(let selection of sels) {
        console.log('selection: ' + JSON.stringify(selection));
        let selRaceId = selection.RACE_ID;

        let raceIndex = this.races.findIndex((race, raceIndex) => {
            if (race.ID === selRaceId) {
              console.log('race: ' + JSON.stringify(race));
              return raceIndex;
            }
        });

        if (raceIndex >=0) {
          (<HTMLSelectElement>selectionElems[raceIndex]).value = selection.NAME;
        } else {
          console.log('Selection not found: ' + JSON.stringify(selection));
        }
      }
    }

  }

}
