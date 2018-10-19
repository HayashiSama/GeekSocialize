import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(private _http: HttpClient) { }

  user: any;

  login(user){
  	return this._http.post('/users/login', {username: user.username, password: user.password})
  }

  logout(){
  	return this._http.post('/users/logout', {})
  }


  register(body){
  	return this._http.post('/register', {username: body.username, email: body.email, password: body.password, birthday: body.birthday, gender: body.gender})
  }

  checkLogin(){
  	return this._http.get('/loggedin')
  }

  checkAdmin(){
    return this._http.get('/isadmin')
  }

}
