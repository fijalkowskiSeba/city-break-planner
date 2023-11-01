import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "./profile/profile.component";
import {MapTabComponent} from "./map-tab/map-tab.component";

const routes: Routes = [
  {path: "map", component: MapTabComponent},
  {path: "profile", component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
