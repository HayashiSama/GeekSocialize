import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { NavService } from './nav.service';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { LandingComponent } from './landing/landing.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgsRevealModule } from 'ng-scrollreveal';
import { NgxSpinnerModule } from 'ngx-spinner'


import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventPageComponent } from './event-page/event-page.component';
import { SafeHtml } from './safeHtml.pipe';
import { AgmCoreModule } from '@agm/core';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LandingComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    AdminDashboardComponent,
    CreateEventComponent,
    EventPageComponent,
    SafeHtml,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    FormsModule,
    NgbModule.forRoot(),
    ScrollToModule.forRoot(),
    NgsRevealModule.forRoot(),
    AgmCoreModule.forRoot({apiKey: ''}),
    NgxSpinnerModule.forRoot(),

  ],
  providers: [HttpService, AuthService, NavService],
  bootstrap: [AppComponent]
})
export class AppModule { }

