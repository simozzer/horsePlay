import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private hostUrl = "http://" + window.location.hostname + ":8080/";

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentHorseUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  async login(username: string, password: string) {

    return new Promise((resolve,reject) => {
      const loginObj = { username : username, password: password};
      let sUrl = `${this.hostUrl}authenticate`;
      this.http.post<User>(sUrl, loginObj).subscribe((response) => {
        if (response) {
          if (response.NAME) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentHorseUser', JSON.stringify(response));

            this.currentUserSubject.next(response);
            resolve(response);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }, (error) => {
       reject(error);
      });
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentHorseUser');
    this.currentUserSubject.next(null);
  }
}
