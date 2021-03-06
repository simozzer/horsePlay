import { Component, OnInit, Input } from '@angular/core';
import {User} from "./user";
import {AuthenticationService} from "./authentication.service";
import { Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title : string = "";
  currentUser: User;
  _loggedIn: Boolean = false;
  player: any;
  showHeader: Boolean = true;

  constructor(  private router: Router,
                private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.title = 'Horse Racing';
    this.player = JSON.parse(localStorage.getItem('currentHorseUser',));
  }

  ngOnInit(): void {
  }


  logout() {
    this.authenticationService.logout();

    this.player = null;
    this._loggedIn = false;
    this.updateLoginStatus();
    this.router.navigate(['/login']);
  }

  updateLoginStatus() {
    this.authenticationService.currentUser.subscribe( value => {
      this._loggedIn = (value !== null);
    }, err => {
      window.alert("failed to update logon status: " + err.toString());
    });
    return true;
  }
  @Input() get loggedIn() {
    this.updateLoginStatus();
    return this._loggedIn;
  }

  set loggedIn(val){
    this._loggedIn = val;
  }

}



