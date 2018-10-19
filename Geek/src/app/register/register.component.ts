import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service'
import { NavService } from '../nav.service'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _authService: AuthService,
  	private _navService: NavService,
    private _route: ActivatedRoute,
    private _router: Router) { }
  
  user: any = {};
  passwordConfirmationFailed = false;
  passwordMessage = ""
  userMessage = ""
  usernameFailed = false
  genderFailed = false
  genderMessage = ""
  error = false;
  errorMessage = ""

  ngOnInit() {
  }

   submitPress(){
  	if(!this.user.username){
  		this.usernameFailed = true;
  		this.userMessage = "Username must be filled in"
  	}
  	else if (this.user.username.length <6 || this.user.username.length > 18){
  		this.usernameFailed = true;
  		this.userMessage = "Username must be between 6 and 18 characters"
  	}
  	else if(!this.user.password){
  		this.passwordConfirmationFailed = true;
  		this.passwordMessage = "Please enter a password"
  	}
  	else if (this.user.password != this.user.confirmpassword){
  		this.passwordConfirmationFailed = true;
  		this.passwordMessage = "Passwords did not match"
  	}
  	else if (this.user.password.length < 6){
  		this.passwordConfirmationFailed = true;
  		this.passwordMessage = "Passwords must be at least 6 characters"
  	}
    else if(!this.user.gender){
      this.genderFailed = true;
      this.genderMessage = "Please fill out your gender";
    }

  	else{
  		this.usernameFailed = false;
  		this.passwordConfirmationFailed = false;
  		let obs = this._authService.register(this.user)
  		obs.subscribe(data => {
  			if((data as any).message != "success"){
  				this.error = true;
  				this.errorMessage = (data as any).details
  			}
  			else{
  				this.error = false;
  				this._navService.change(true);

  				this._router.navigate(['dashboard'])

  			}
  		})
  	}
  	

  }

}
