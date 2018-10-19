import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { fadeInAnimation } from './_animations/index';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})

export class AppComponent {


}




