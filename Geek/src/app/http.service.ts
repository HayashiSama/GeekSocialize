import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 

@Injectable()
export class HttpService {

    constructor(private _http: HttpClient) { }


  getEvents(){
  	return this._http.get('/events')
  }

  getUsers(id){
  	return this._http.get('/getUsers/' + id)
  }

  createEvent(event){
  	return this._http.post('/create', event)
  }

  joinEvent(eventid, userid){
  	return this._http.post('/join',{event: eventid, user: userid})
  }

  deleteEvent(eventid){
  	return this._http.delete('/deleteEvent/'+ eventid)
  }

  modifyEvent(event, id){
  	return this._http.put('/modify/' + id, event)
  }

  getDetails(id){
  	return this._http.get('/details/' + id)
  }

  updatePhoto(data){
  	return this._http.post('/photo', data)

  }

  updateProfile(info){
  	return this._http.put('/updateProfile', info)
  }

}
