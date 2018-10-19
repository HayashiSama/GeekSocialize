import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavService } from '../nav.service'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
	loggedIn = false;
  admin = false;

  constructor(private _authService: AuthService,
  	private _navService: NavService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
  	let subscription = this._navService.getEmittedValue()
  	subscription.subscribe(item => {
  		if(item){
  			this.loggedIn = true;
  		}
  		else{
  			this.loggedIn = false;
  		}
  	})

  }

  checkLogin(){
  	let obs = this._authService.checkLogin()
  	obs.subscribe(data =>{
  		if((data as any).message == true){
  			this.loggedIn = true;
        let obs2 = this._authService.checkAdmin();
        obs2.subscribe(data => {
          if((data as any).message == true){
            this.admin = true;
          }
        })
  		}
  		else{
  			this.loggedIn = false;
  		}

  	})
  }

  goToLogin(){
  	this._router.navigate(['/login'])
  }

  goToRegister(){
    this._router.navigate(['/register'])
  }

  goToProfile(){
    this._navService.user = "";
    this._router.navigate(['/profile'])
  }

  goToLogout(){
  	let obs = this._authService.logout()
  	obs.subscribe(data => {
  		this._navService.user = null;
      this._navService.event = null;
      this._navService.admin = false;
      this._authService.user = null;
      this.loggedIn = false;
  	})
  	this._router.navigate(['/home'])
  }

  goHome(){
    this._router.navigate(['dashboard'])
  }

}
