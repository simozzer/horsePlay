import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService} from "../authentication.service";
import {Router} from '@angular/router'
import {GamesService} from "../games.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService, private gamesService : GamesService) { }

  ngOnInit(): void {
  }

  async submitLogin() {
    this.gamesService.busy();
    let username = (<HTMLInputElement>(document.getElementById('username'))).value;
    let password = (<HTMLInputElement>(document.getElementById('password'))).value;
    await this.authService.login(username.toUpperCase(),password).then((loggedIn) => {
      if (loggedIn) {
        this.gamesService.notBusy();
        this.router.navigateByUrl('games');
      } else {
        this.gamesService.notBusy();
        window.alert("Failed to log in");
      }
    })
  }

  handleKeyDown() {
    if (event && (event["keyCode"] === 13)) {
      this.submitLogin();
    }
  }



}
