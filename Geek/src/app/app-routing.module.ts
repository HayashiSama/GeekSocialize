import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventPageComponent } from './event-page/event-page.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
	{path: 'login', component: LoginComponent},
	{path: 'dashboard', component: DashboardComponent},
	{path: 'register', component: RegisterComponent},
	{path: 'admin', component: AdminDashboardComponent},
	{path: 'createEvent', component: CreateEventComponent},
	{path: 'eventPage', component: EventPageComponent},
	{path: 'profile', component: ProfileComponent},
	{path: '**', component: LandingComponent},
	];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
