import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService} from "../authentication.service";
import {Router} from '@angular/router'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  submitLogin() {
    let username = (<HTMLInputElement>(document.getElementById('username'))).value;
    let password = (<HTMLInputElement>(document.getElementById('password'))).value;
    this.authService.login(username.toUpperCase(),password);
    this.router.navigate(['games']);

  }



}
