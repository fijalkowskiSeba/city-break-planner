import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "./components/profile/profile.component";
import {MapTabComponent} from "./components/map-tab/map-tab.component";
import {MyTripsComponent} from "./components/my-trips/my-trips.component";
import {AuthGuard} from "./auth/auth.guard";
import {TripInfoComponent} from "./components/trip-info/trip-info.component";

const routes: Routes = [
  {path: "new-trip", component: MapTabComponent, canActivate: [AuthGuard]},
  {path: "my-trips", component: MyTripsComponent, canActivate: [AuthGuard]},
  {path: "my-trips/:id", component: TripInfoComponent, canActivate: [AuthGuard]},
  {path: "profile", component: ProfileComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ""}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
