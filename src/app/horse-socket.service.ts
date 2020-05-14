import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HorseSocketService {

  connection;
  url;
  open = false;
  observers = [];

  constructor() {
    this.url = `ws://${window.location.hostname}:8081`;
    this.connection = new WebSocket(this.url);
    this.open = false;

    this.connection.onopen = () => {
      this.open = true;
      this.connection.send("hey");
    };

    this.connection.onerror = error => {
      console.log(`WebSocket error: ${error}`);
    };

    this.connection.onmessage = e => {
      console.log(e.data);
      for(const observer of this.observers) {
        observer.fnSocketNotify(e.data);
      }
    };
  }

  addObserver = o => {
    if ( (o['fnSocketNotify'] && (typeof(o.fnSocketNotify) === 'function') )) {
      this.observers.push(o);
    } else {
      console.log("not an observer");
    }
  }

  removeObserver = o => {
    let i = this.observers.indexOf(o);
    if (i>=0) {
      this.observers.splice(i,1);
    }
}

  async sendData(s) {
    if (open) {
      await this.connection.send(s);
    } else {
      //
    }
  }


}
