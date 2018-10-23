import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { fadeInAnimation } from '../_animations/index';
import { NavService } from '../nav.service'
import { HttpService } from '../http.service'
import {AgmCoreModule} from '@agm/core';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})





export class EventPageComponent implements OnInit {

    constructor(private _authService: AuthService,
  	private _navService: NavService,
  	private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) {}

  ngOnInit() {
  	this.initalize();
  }
  	lat = 0;
  	lng = 0;


  admin = false;
  isMember = false;
  user: any;
  event: any;
  parsedDate : Date;

//ChecksLogin && admin status
  initalize(){
  	if(!this._navService.event){
  		this._router.navigate(['dashboard'])
  	}
  	else{
  		this.event=this._navService.event;

  		var d = new Date(0)
  		d.setUTCSeconds(Date.parse(this.event.date)/1000)
  		this.parsedDate = d;
  		this.lng = this.event.long
  		this.lat = this.event.lat
  	

  		 var base64 = btoa(
			new Uint8Array(this.event.imageBuffer.data.data)
				    .reduce((data, byte) => data + String.fromCharCode(byte), '')
			);

  				
  			this.event.image = base64
  		


  		let obs = this._authService.checkLogin()
  		obs.subscribe(data =>{
	  		if((data as any).message == 'false'){
	  			this._router.navigate(['/home'])
	  		}
	  		else{
	  			this.user = (data as any).user;
	  		
	  			for(var i = 0; i < this.event.attending.length; i++){
	  				if(this.user == this.event.attending[i].id){
	  					this.isMember = true;
	  				}
	  			}
	  
	  			
	  			if(!this.isMember){
	  			}

	  		
	  			this.checkAdmin();

	  		}
  		})

  	}
  	
  }
  checkAdmin(){
  	let obs = this._authService.checkAdmin()
  	obs.subscribe(data => {
  		if((data as any).message == "true"){
  			this.admin = true;
  		}
  	})
  }




  goBack(){
  	this._navService.event = "";
  	this._router.navigate(['dashboard'])
  	
  }

  deleteEvent(){

  	let obs = this._httpService.deleteEvent(this.event._id)
  	obs.subscribe(data => {
  		if((data as any).message == "success"){
  			this._navService.event = "";
  			this._router.navigate(['dashboard'])
  		}
  	})
  }



  modifyEvent(){
  	this._router.navigate(['createEvent'])

  }

  joinEvent(){
  	let obs = this._httpService.joinEvent(this.event._id, this.user)
  	obs.subscribe(data =>{
  		if((data as any).message == "success"){
  			this.isMember = !this.isMember
  			this._router.navigate(['dashboard'])
  		}
  	})
  }

  viewProfile(id){
  	this._navService.user = id;
  	this._router.navigate(['profile'])
  }

  leaveEvent(){
  	this.joinEvent()
  }







}
