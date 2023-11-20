import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "./components/profile/profile.component";
import {MapTabComponent} from "./components/map-tab/map-tab.component";
import {MyTripsComponent} from "./components/my-trips/my-trips.component";

const routes: Routes = [
  {path: "new-trip", component: MapTabComponent},
  {path: "my-trips", component: MyTripsComponent},
  {path: "profile", component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
