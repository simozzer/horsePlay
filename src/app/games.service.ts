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

  addGame(name){
    return this.http.post(this.hostUrl + "games",{'name':name})
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  getGame(name) {
    return this.http.get(this.hostUrl + "game/" + name,{})
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  updatePlayerInGame(gameName, playerObject) {
    return this.http.post( `${this.hostUrl}game/${gameName}/players`,playerObject)
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

  removePlayerFromGame(gameName, playerName) {
    return this.http.delete( `${this.hostUrl}game/${gameName}/players/${playerName}`)
      .pipe(map((response: Response) => {
        return response;
      }));
  }



}
