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
import {TripInfoComponent} from './components/trip-info/trip-info.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ErrorModalComponent} from './components/modals/error-modal/error-modal.component';
import {ConfirmationModalComponent} from './components/modals/confirmation-modal/confirmation-modal.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { TripHistoryComponent } from './components/trip-info/trip-history/trip-history.component';
import { EditTripComponent } from './components/trip-info/edit-trip/edit-trip.component';
import { EditTripPointModalComponent } from './components/modals/edit-trip-point-modal/edit-trip-point-modal.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { FirstLastLocationModalComponent } from './components/modals/first-last-location-modal/first-last-location-modal.component';
import {MatSelectModule} from "@angular/material/select";
import { HomeComponent } from './components/home/home.component';
import { AddBillModalComponent } from './components/modals/add-bill-modal/add-bill-modal.component';

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
    AskForNameModalComponent,
    TripInfoComponent,
    ErrorModalComponent,
    ConfirmationModalComponent,
    TripHistoryComponent,
    EditTripComponent,
    EditTripPointModalComponent,
    FirstLastLocationModalComponent,
    HomeComponent,
    AddBillModalComponent
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
    MatProgressSpinnerModule,
    MatExpansionModule,
    CdkDropList,
    CdkDrag,
    MatCheckboxModule,
    LeafletModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
