import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { fadeInAnimation } from '../_animations/index';
import { NavService } from '../nav.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class LoginComponent implements OnInit {

  constructor(private _authService: AuthService,
  	private _navService: NavService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  user: any = {}
  error = false;
  message = ""

  ngOnInit() {
  }
  goToRegister(){
  	this._router.navigate(['/home'])
  }

  submitPress(){
  	if(!this.user.username){
  		this.error = true;
  		this.message = "Please fill out username"
  	}
  	else if(!this.user.password){
  		 this.error = true;
  		this.message = "Please fill out password"
  	}
  	else{
  		this.error = false;
  		this.message = ""
  		let obs = this._authService.login(this.user)
  		obs.subscribe(data => {
  			if ((data as any).message == "success"){
  				this._navService.change(true);
         
          if((data as any).administrator == "true"){
            this._navService.admin = true;
          }
          this._router.navigate(['dashboard'])

  				
  			}
  			else{
  				this.error = true;
  				this.message = "Incorrect username or password."
  			}
  		})
  	}
  }



}
