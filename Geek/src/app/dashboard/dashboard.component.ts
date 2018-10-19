import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { fadeInAnimation } from '../_animations/index';
import { NavService } from '../nav.service';
import { HttpService } from '../http.service';
import { NgsRevealModule } from 'ng-scrollreveal';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  
})
export class DashboardComponent implements OnInit {

    constructor(private _authService: AuthService,
  	private _navService: NavService,
  	private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private spinner: NgxSpinnerService,
    ) {}

  ngOnInit() {
  	this.spinner.show();
  	this.checkLogin();
  }
  events = [];
  displayedevents = [];
  admin = false;

//Check Login and load events if logged in.
  checkLogin(){
  	if(this._navService.admin){
  		this.admin = true;
  	}
  	let obs = this._authService.checkLogin()
  	obs.subscribe(data =>{
  		if((data as any).message == 'false'){
  			this._router.navigate(['home'])
  		}
  		else{
  			this._authService.user = (data as any).user;
  			this.loadEvents()
  		}
  	})
  }

  loadEvents(){
  	let obs = this._httpService.getEvents()
  	obs.subscribe(data =>{
  		if((data as any).error){
  		}
  		else{
  			this.events = (data as any).events
  			for(var i = 0; i < this.events.length; i++){
  				var base64 = btoa(
				  new Uint8Array(this.events[i].imageBuffer.data.data)
				    .reduce((data, byte) => data + String.fromCharCode(byte), '')
				);
				this.events[i].image = base64

		  		var d = new Date(0)
		  		d.setUTCSeconds(Date.parse(this.events[i].date)/1000)
		  		this.events[i].parseddate = d.getUTCMonth()+1 + "/" + d.getUTCDate() + "/" + d.getUTCFullYear()
  			}
  			  	this.events.sort(function(a, b){
			  		return Date.parse(b.date) - Date.parse(a.date);
			  	})
  			this.displayedevents = this.events;
  		}
  		this.spinner.hide()	
  	})
  }



  showAttending(){
  	this.displayedevents = [];
  	for(var i = 0; i < this.events.length; i++){
  		for(var j = 0; j < this.events[i].attending.length; j++)
  		{
  			if(this.events[i].attending[j].id == this._authService.user){
  				this.displayedevents.push(this.events[i]);
  				break;
  			}
  		}
  	}

  }

  showAll(){
  	this.displayedevents = this.events;
  }

  showUpcoming(){
  	this.displayedevents = [];
	for(var i = 0; i < this.events.length; i++){
  		if(Date.parse(this.events[i].date) > Date.now()){

  			this.displayedevents.push(this.events[i])
  		}
  	}
  	this.displayedevents.sort(function(a, b){
  		return Date.parse(a.date) - Date.parse(b.date);
  	})
  }

  createNew(){
  	this._navService.event = "";
  	this._router.navigate(['/createEvent'])
  }




//Navigate to specified event
  goToEvent(event){

  	this._navService.event = event;
  	this._router.navigate(['eventPage'])
  }

}
