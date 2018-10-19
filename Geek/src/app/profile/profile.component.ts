import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { fadeInAnimation } from '../_animations/index';
import { NavService } from '../nav.service';
import { HttpService } from '../http.service';
import { NgsRevealModule } from 'ng-scrollreveal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

      constructor(private _authService: AuthService,
  	private _navService: NavService,
  	private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,

    ) {}

  user: any;
  info: any;
  viewself = false;
  image: File = null;
  invalidFile = true;
  fd = new FormData;
  newInterest = "";

  ngOnInit() {
  	this.checkLogin()
  	
  }


  checkLogin(){
  	let obs = this._authService.checkLogin()
  	obs.subscribe(data =>{
  		
  		if((data as any).message == 'false'){
  			this._router.navigate(['/home'])
  		}
  		else{
  			this._authService.user = (data as any).user;
  			this.getDetails()
  		}
  	})
  }

  getDetails(){

  	if(this._navService.user){
  		this.user = this._navService.user
  		if(this.user == this._authService.user){
  			this.viewself = true;
  		}
  	}
  	else{
  		this.viewself = true;
  		this.user = this._authService.user
  	}

  	let obs = this._httpService.getDetails(this.user);
  	obs.subscribe(data =>{
  		if((data as any).message == "success"){
  			this.info = data;

  			if(this.info.gender == "male"){
  				this.info.gender = "Male"
  			}
  			else{
  				this.info.gender = "Female"
  			}
  			if(this.info.picture.data){
  				var base64 = btoa(
				new Uint8Array(this.info.picture.data.data)
				    .reduce((data, byte) => data + String.fromCharCode(byte), '')
				);

  				this.info.picture = base64
  			
  			}
  			else{
  				this.info.picture = undefined
  			}


  		
  		}
  		else{

  		}
  	})
  }

  onFileSelected(event){
  	this.image = <File>event.target.files[0];
  	var regex = /^.*(jpeg|jpg|png|bmp)$/
  	if(regex.test(this.image.type)){
  		this.invalidFile = false;
  		this.fd.append('file', this.image, this.image.name)
  		this.changePhoto();
  	}
  	else{
  		this.image = null;
  		this.invalidFile = true;
  		alert("unsupported file format")
  	}
  }

  submitChanges(){
  	var information = {likes: this.info.likes, description: this.info.description}
  	let obs = this._httpService.updateProfile(information);
  	obs.subscribe(data =>{
  		if((data as any).message = "success"){
  			alert("Successfully updated profile")
  		}
  		else{
  			alert("error")
  		}
  	})
  	
  }

  changePhoto(){
  	let obs = this._httpService.updatePhoto(this.fd)
  	obs.subscribe(data =>{
  		this.ngOnInit();
  	})
  }

  addInterest(){
  	if(this.newInterest){
  		this.info.likes.push(this.newInterest)
  	}
  	
  }

  deleteItem(args){
  	this.info.likes.splice(args, 1);
  }


}
