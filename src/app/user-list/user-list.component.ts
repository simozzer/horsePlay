import { Component, OnInit } from '@angular/core';
import { UsersService} from "../users.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users;

  constructor(private usersService : UsersService,
              private router : Router) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.usersService.getUsers()
      .subscribe(data => {
          this.users = data;
        }, error =>
          window.alert("error: " + error)
      )
  }

  addNewUser() {
    let username = <HTMLInputElement>(document.getElementById('username')).value;
    let password = <HTMLInputElement>(document.getElementById('password')).value;
    let confirmPassword = <HTMLInputElement>(document.getElementById('confirmPassword')).value;
    if ((username && password && confirmPassword) && (password === confirmPassword)) {
      debugger;
      let matchingUsers = this.users.filter((user) => {
        if (user.name.toUpperCase() === username.toUpperCase()) {
          return user;
        }
      });

      if (matchingUsers.length === 0) {
        this.usersService.addUser(username,password, false).subscribe((data) => {
          this.getUsers();
        });
      }
    }

  }

}
