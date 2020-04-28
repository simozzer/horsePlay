import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { map } from 'rxjs/operators';

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

  getHorsesForPlayer(gameId, playerId) {
    return this.http.get(this.hostUrl + "game/" + gameId + "/horsesFor/" + playerId)
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

  getHorseForm(gameId, raceId) {
    return this.http.get(this.hostUrl + "game/" + gameId + "/horseForm/" + raceId)
      .pipe(map((response :Response) => response));

  }

  addHorseToRace(gameId, raceId, horseId, playerId) {
    return this.http.post(this.hostUrl + "game/" + gameId + "/horses/" + raceId + "/" + horseId + "/" + playerId,{})
      .pipe(map((response :Response) => response));
  }

  addGame(name){
    return this.http.post(this.hostUrl + "games",{'name':name})
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



}
