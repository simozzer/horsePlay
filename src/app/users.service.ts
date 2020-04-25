import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private hostUrl = "http://" + window.location.hostname + ":8080/";
  constructor(private http:HttpClient) { }

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

  putUser(name, user:User) {
    return this.http.put(this.hostUrl + "users",user)
      .pipe(map((response: Response) => {
        debugger;
        return response;
      }));
  }

}
