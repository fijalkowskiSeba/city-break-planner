import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {AuthModule} from "@auth0/auth0-angular";
import { MapComponent } from './components/map/map.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MapTabComponent } from './components/map-tab/map-tab.component';
import { SearchPlaceColumnComponent } from './components/map-tab/search-place-column/search-place-column.component';
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatRadioModule} from "@angular/material/radio";
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MapComponent,
    ProfileComponent,
    MapTabComponent,
    SearchPlaceColumnComponent
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
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-g8q3i4mwcb82sak7.us.auth0.com',
      clientId: 'EY84B3NU6KpYkdlNjK8nyn8zweYFSOei',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    MatInputModule,
    FormsModule,
    MatRadioModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
