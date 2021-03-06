import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {GameListComponent} from './game-list/game-list.component';
import {GameDetailComponent} from './game-detail/game-detail.component';
import { AuthGuard } from './auth.guard';
import {LoginComponent} from './login/login.component';
import {UserListComponent} from './user-list/user-list.component';
import {BetPlacementComponent} from './bet-placement/bet-placement.component';
import {HorseSelectionComponent} from './horse-selection/horse-selection.component';
import {PreRaceReportComponent} from './pre-race-report/pre-race-report.component';
import {RaceComponent} from './race/race.component';



const routes: Routes = [
  { path : 'games', component: GameListComponent, canActivate: [AuthGuard] },
  { path : 'game/:id', component: GameDetailComponent, canActivate: [AuthGuard]},
  { path : 'login', component: LoginComponent},
  { path : 'users', component: UserListComponent},
  { path : 'betting/:gameId/:raceId', component: BetPlacementComponent, canActivate: [AuthGuard]},
  { path : 'selection/:gameId/:meetingId', component: HorseSelectionComponent, canActivate: [AuthGuard]},
  { path : 'preRace/:gameId/:raceId', component: PreRaceReportComponent, canActivate: [AuthGuard]},
  { path : 'race/:gameId/:raceId', component: RaceComponent, canActivate: [AuthGuard]},
  { path: '', component: GameListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
