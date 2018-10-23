import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { fadeInAnimation } from '../_animations/index';
import { NavService } from '../nav.service';
import { HttpService } from '../http.service';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  
  constructor(private _authService: AuthService,
  	private _navService: NavService,
  	private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) {}

  event: any = {}
  fd = new FormData;
  error = false;
  message = "";
  modifying = false;
  image: File = null;
  invalidFile = true;

  ngOnInit() {
   	this.checkAdmin();
  	if(this._navService.event){
  		this.event = this._navService.event;
  		this.modifying = true;

  	}
  }

  checkAdmin(){
  	let obs = this._authService.checkAdmin()
  	obs.subscribe(data => {
  		if((data as any).message != "true"){
  			this._router.navigate(['/home'])
  		}
  	})

  }

  onFileSelected(event){
  	this.image = <File>event.target.files[0];
  	var regex = /^.*(jpeg|jpg|png|bmp)$/
  	if(regex.test(this.image.type)){
  		this.invalidFile = false;
  	}
  	else{
  		this.invalidFile = true;

  	}
  }

  submitPress(){
  	if(!this.event.name){
  		this.error = true;
  		this.message = "Please fill out event name"
  	}
  	else if(!this.event.location){
  		this.error = true;
  		this.message = "Please fill out event location"
  	}
   	else if(!this.event.date){
  		 this.error = true;
  		this.message = "Please fill out event date / time"
  	} 	
  	else if(!this.event.capacity){
  		this.error = true;
  		this.message = "Please fill out event capacity"
  	}
  	else if(!this.image && !this.modifying){
  		this.error = true;
  		this.message = "Please submit an image"
  	}
  	else if(!this.event.description){
  		this.error = true;
  		this.message = "Please submit a description"	
  	}
  	else if(this.invalidFile && !this.modifying){
  		this.error = true;
  		this.message = "Invalid File Type"
  	}
  	else{
  		this.error = false;
  		this.message = ""
  		if(!this.modifying){
  			this.fd.append('file', this.image, this.image.name)
  		}
  		this.fd.append('name', this.event.name)
  		this.fd.append('location', this.event.location)
  		this.fd.append('date', this.event.date)
  		this.fd.append('capacity', this.event.capacity)
  		this.fd.append('description', this.event.description)


  		if(!this.modifying){
  			let obs = this._httpService.createEvent(this.fd)
	  		obs.subscribe(data => {
	  			if((data as any).message == "success"){
	  				this._router.navigate(['dashboard'])
	  			}
	  			else{
	  			}
  			})
  		}
  		else{
  			let obs = this._httpService.modifyEvent(this.fd, this.event._id)
  			obs.subscribe(data => {
	  			if((data as any).message == "success"){
	  				this._router.navigate(['dashboard'])
	  			}
	  			else{
	  			}
  			})

  		}

  	}

  }

}
