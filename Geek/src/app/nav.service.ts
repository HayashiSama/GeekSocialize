import { Injectable, Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class NavService {
  // next viewed event
  event: any;
  user: any;
  admin: boolean;

  @Output() fire: EventEmitter<any> = new EventEmitter();

   constructor() {
   }

   change(status) {
     this.fire.emit(status);
   }

   getEmittedValue() {
     return this.fire;
   }


}
