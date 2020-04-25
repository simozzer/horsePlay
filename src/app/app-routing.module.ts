import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from "./app.component";
import {GameListComponent} from "./game-list/game-list.component";
import {GameDetailComponent} from "./game-detail/game-detail.component";
import { AuthGuard } from './auth.guard';
import {LoginComponent} from "./login/login.component";
import {UserListComponent} from "./user-list/user-list.component";


const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [AuthGuard] },
  { path : 'games', component: GameListComponent, canActivate: [AuthGuard] },
  { path : 'game/:name', component: GameDetailComponent},
  { path : 'login', component: LoginComponent},
  { path : 'users', component: UserListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
