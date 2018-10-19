import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service'
import { NavService } from '../nav.service'
import { NgbCarouselConfig  } from '@ng-bootstrap/ng-bootstrap'; 


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [NgbCarouselConfig],
  
})

export class LandingComponent implements OnInit {

  constructor(private _authService: AuthService,
  	private _navService: NavService,
    private _route: ActivatedRoute,
    private _router: Router, config: NgbCarouselConfig) 
  { 
    config.interval = 7500;  
    config.wrap = true;  
    config.keyboard = true; 
  }
  images = [
    {source :"/assets/images/banner0.jpg"},
    {source :"/assets/images/banner1.jpg"},
    {source :"/assets/images/banner2.jpg"},
  ]

  ngOnInit() {
  }
  goToLogin(){
  	this._router.navigate(['/login'])
  }




 


}
