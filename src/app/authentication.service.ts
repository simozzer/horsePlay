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
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  getUsers(){
    return this.http.get(this.hostUrl + "users")
      .pipe(map((response: Response) => response));
  }

  addUser(name, password, isAdmin) {
    return this.http.post(this.hostUrl + "users",{username:name,password:password,isAdmin:isAdmin})
      .pipe(map((response: Response) => {
        return response;
      }));
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    let sUrl = `${this.hostUrl}authenticate`;

    const loginObj = { username : username, password: password};
    this.http.post<User>(sUrl, loginObj).subscribe((response) => {
      if (response) {
        if (response.NAME) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(response));

          this.currentUserSubject.next(response);
          return response;
        } else {
          window.alert("Failed to login");
        }
      } else {
        window.alert("Failed to login")
      }

    }, (error) => {
      console.log("error: " + error.toString());
    });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
