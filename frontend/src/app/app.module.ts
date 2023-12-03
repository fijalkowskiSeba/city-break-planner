import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationComponent} from './components/navigation/navigation.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MapComponent} from './components/map-tab/map/map.component';
import {ProfileComponent} from './components/profile/profile.component';
import {MapTabComponent} from './components/map-tab/map-tab.component';
import {SearchPlaceColumnComponent} from './components/map-tab/search-place-column/search-place-column.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatRadioModule} from "@angular/material/radio";
import {ChosenLocationsListComponent} from './components/map-tab/chosen-locations-list/chosen-locations-list.component';
import {MatCardModule} from "@angular/material/card";
import {StringToXCommaPipe} from './pipes/string-to-x-comma.pipe';
import {MyTripsComponent} from './components/my-trips/my-trips.component';
import {
  AskForNameModalComponent
} from './components/map-tab/chosen-locations-list/ask-for-name-modal/ask-for-name-modal.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MapComponent,
    ProfileComponent,
    MapTabComponent,
    SearchPlaceColumnComponent,
    ChosenLocationsListComponent,
    StringToXCommaPipe,
    MyTripsComponent,
    AskForNameModalComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        HttpClientModule,
        MatInputModule,
        FormsModule,
        MatRadioModule,
        MatCardModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatTooltipModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
