import { Component, OnInit } from '@angular/core';
import { UsersService} from '../users.service';
import {GamesService} from '../games.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users;

  constructor(private usersService: UsersService,
              private gamesService: GamesService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.gamesService.busy();
    this.usersService.getUsers()
      .subscribe(data => {
          this.users = data;
          this.gamesService.notBusy();
        }, err => {
        this.gamesService.notBusy();
        window.alert('error getting users: ' + err)
      });
  }

  addNewUser() {
    const username = ((document.getElementById('username')) as HTMLInputElement).value;
    const password = ((document.getElementById('password')) as HTMLInputElement).value;
    const confirmPassword = ((document.getElementById('confirmPassword')) as HTMLInputElement).value;
    if ((username && password && confirmPassword) && (password === confirmPassword)) {
      const matchingUsers = this.users.filter((user) => {
        if (user.NAME.toUpperCase() === username.toUpperCase()) {
          return user;
        }
      });

      if (matchingUsers.length === 0) {
        this.usersService.addUser(username, password, false).subscribe((data) => {
          this.getUsers();
        } , err => {
          this.gamesService.notBusy();
          window.alert('Error adding user: ' + err);
        });
      }
    }
  }

  get credentialsInvalid() {
    const username = ((document.getElementById('username')) as HTMLInputElement).value;
    const password = ((document.getElementById('password')) as HTMLInputElement).value;
    const confirmPassword = ((document.getElementById('confirmPassword')) as HTMLInputElement).value;
    return ((username === '') || (password === '') || (password !== confirmPassword));
  }

}
