import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GamesService} from "./games.service";
import { UsersService } from './users.service';
import { GameListComponent } from './game-list/game-list.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { AuthenticationService } from "./authentication.service";
import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user-list/user-list.component';
import { BetPlacementComponent } from './bet-placement/bet-placement.component';
import { HorseSelectionComponent } from './horse-selection/horse-selection.component';


@NgModule({
  declarations: [
    AppComponent,
    GameListComponent,
    GameDetailComponent,
    LoginComponent,
    UserListComponent,
    BetPlacementComponent,
    HorseSelectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [GamesService, AuthenticationService, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
