import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {forkJoin} from "rxjs";
import {fn} from "@angular/compiler/src/output/output_ast";

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private hostUrl = "http://" + window.location.hostname + ":8080/";
  constructor(private http:HttpClient) { }

  getGames(){
    return this.http.get(this.hostUrl + "games")
      .pipe(map((response: Response) => response));
  }

  getMeetings() {
    return this.http.get(this.hostUrl + "meetings")
      .pipe(map((response :Response) => response))
  }


  getRacesInMeeting(meetingId) {
    return this.http.get(this.hostUrl + "meeting/" + meetingId)
      .pipe(map((response :Response) => response))
  }

  getRaceInfo(raceId) {
    const url = this.hostUrl + `raceINfo/${raceId}`;
    return this.http.get( url)
      .pipe(map((response: Response) => {
        return response;
      }));
  }


  getHorsesForPlayer(gameId, playerId) {
    return this.http.get(this.hostUrl + "game/" + gameId + "/horsesFor/" + playerId)
      .pipe(map((response :Response) => response));
  }

  savePlayerHorses(gameId, playerId, horses){
    return this.http.post(this.hostUrl + "game/" + gameId + '/horsesFor/' + playerId, horses)
      .pipe(map((response :Response) => response));
  }


  getHorsesForRace(gameId, raceId) {
    return this.http.get(this.hostUrl + "game/" + gameId + "/horsesInRace/" + raceId)
      .pipe(map((response :Response) => response));
  }


  getHorseByName(horses, horseName) {
    return horses.find((horse) => {
      if (horse.NAME === horseName) {
        return horse;
      }
    })
  }


  getHorseForm(gameId, horseId) {
    return this.http.get(this.hostUrl + "game/" + gameId + "/horseForm/" + horseId)
      .pipe(map((response :Response) => response));

  }



  addHorseToRace(gameId, raceId, horseId, playerId) {
    return this.http.post(this.hostUrl + "game/" + gameId + "/horses/" + raceId + "/" + horseId + "/" + playerId,{})
      .pipe(map((response :Response) => response));
  }


  addGame(name){
    return this.http.post(this.hostUrl + "games",{'name':name })
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  getGame(id) {
    return this.http.get(this.hostUrl + "game/" + id,{})
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  saveGameIndexes(gameObj) {
    return this.http.post(this.hostUrl + "gameIndexes", gameObj)
      .pipe(map((response: Response) => {
        return response;
      }));
  }


  getPlayersInGame(id) {
    return this.http.get(this.hostUrl + "game/" + id + '/players',{})
      .pipe(map((response: Response) => {
        return response;
      }));
  }


  updatePlayerInGame(gameId, playerObject) {
    return this.http.post( `${this.hostUrl}game/${gameId}/players`,playerObject)
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  adjustPlayerFunds(gameId, playerId, adjustment) {
    return this .http.post(`${this.hostUrl}playerFunds/${gameId}/${playerId}/${adjustment}`,{})
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  getPlayerFunds(gameId, playerId) {
    return this .http.get(`${this.hostUrl}playerFunds/${gameId}/${playerId}`,{})
      .pipe(map((response: Response) => {
        return response;
      }));
  }


  deleteGame(name) {
    return this.http.delete(this.hostUrl + "game/" + name,{})
      .pipe(map((response: Response) => {
        return response;
      }));
  }


  removePlayerFromGame(gameId, playerId) {
    return this.http.delete( `${this.hostUrl}game/${gameId}/players/${playerId}`)
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  getMeetingSelectionsComplete(gameId, meetingId) {
    return this.http.get( `${this.hostUrl}meetingSelectionsReady/${meetingId}/game/${gameId}`)
      .pipe(map((response: Response) => {
        return response;
      }));
  }


  getPlayerHorsesForMeeting(gameId, meetingId, playerId) {
    const url = this.hostUrl + `playerHorseSelection/${gameId}/${playerId}/${meetingId}`;
    return this.http.get( url)
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  placeBet(betObj) {
    const options = {};

    return this.http.post( `${this.hostUrl}bets`,betObj, options)
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  getBetsForPlayer(gameId, raceId, playerId) {
    return this.http.get( `${this.hostUrl}bets/game/${gameId}/race/${raceId}/player/${playerId}`)
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  getBetsForRace(gameId, raceId) {
    return this.http.get( `${this.hostUrl}bets/game/${gameId}/race/${raceId}`)
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  saveHorseForm(gameId,raceId,horseId,position) {
      return this.http.post(`${this.hostUrl}game/${gameId}/horseForm/${raceId}/${horseId}/${position}`,{})
        .pipe(map((response: Response) => {
          return response;
        }));
    }

  clearRaceBets(gameId, raceId) {
   return this.http.delete(`${this.hostUrl}game/${gameId}/bets/${raceId}`)
     .pipe(map((response: Response) => {
       return response;
     }));

  }


  getPlayerCountWithState(gameId, state) {
    return this.http.get( `${this.hostUrl}playerStates/${gameId}/state/${state}`)
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  clearHorsesForPlayer(gameId, playerId, meetingId) {
    return this.http.post( `${this.hostUrl}delHorse`,{
      gameId : gameId,
      playerId : playerId,
      meetingId : meetingId
    })
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  setPlayerState(gameId,playerId, state) {
    const url = `${this.hostUrl}plyrState/${playerId}/game/${gameId}/state/${state}`;
    return this.http.post( url,{value:state})
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  getPlayerState(gameId,playerId) {
    const url = `${this.hostUrl}plyrState/${playerId}/game/${gameId}`;
    return this.http.get( url )
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  async waitForAllPlayersToHaveState(gameId, state, expectedCount) {

    return new Promise((resolve, reject) => {
      const doCheck =() => {
        this.getPlayerCountWithState(gameId,state)
          .subscribe(data => {
            if (data && data["COUNT"] && (data["COUNT"] === expectedCount)) {

              resolve(true);
            } else {
              window.setTimeout(doCheck, 2000, this);
            }
          }, error => {
            reject(error);
          });
      };
      doCheck();
    });
  }



  async getRaces(meetingId) {
    return new Promise((resolve,reject)=> {
      this.getRacesInMeeting(meetingId)
        .subscribe((r) => {
          resolve(r)
        }, e => {
          reject(e);
        })
    });
  }

  async getNextMeeting(gameData) {
    return new Promise((resolve,reject) => {
      let meetings;
      forkJoin([this.getGame(gameData.ID),this.getMeetings()])
        .subscribe(async (arr) => {
          gameData = arr[0];
          meetings = arr[1];
          let meeting;
          meeting = meetings[gameData.MEETING_INDEX];
          await this.getRaces(meeting.ID).then(async (races) => {

            gameData.RACE_INDEX = gameData.RACE_INDEX + 1;

            if (gameData.RACE_INDEX >= races["length"]) {

              gameData.RACE_INDEX = 0;
              // last race in meeting move to next meeting
              gameData.MEETING_INDEX = gameData.MEETING_INDEX + 1;
              if (gameData.MEETING_INDEX >= meetings.length) {
                resolve(null);
              } else {
                // move to 1st race in next meeting
                meeting = meetings[gameData.MEETING_INDEX];
                gameData.MEETING_ID = meeting.ID;
                gameData.MEETING_NAME = meeting.NAME;
                gameData.RACE_INDEX = 0;
                await this.getRaces(meeting.ID).then((races) => {
                  gameData.RACE_ID = races[0].ID;
                  gameData.RACE_NAME = races[0].NAME;
                  gameData.RACE_INDEX = 0;
                  resolve(gameData);
                });

              }
            } else {
              // move to next race in current meeting
             // gameData.RACE_INDEX = gameData.RACE_INDEX+1;
              gameData.MEETING_ID = meeting.ID;
              gameData.MEETING_NAME = meeting.NAME;
              gameData.RACE_ID = races[gameData.RACE_INDEX].ID;
              gameData.RACE_NAME = races[gameData.RACE_INDEX].NAME;
              await this.getRaces(meeting.ID).then((races) => {
                gameData.RACE_ID = races[gameData.RACE_INDEX].ID;
                gameData.RACE_NAME = races[gameData.RACE_INDEX].NAME;
                resolve(gameData);
              });

            }
          })

        }, err => {
          window.alert("error getting next meeting: " + err)
        })

    });
  }


}
