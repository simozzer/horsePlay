import { Injectable } from '@angular/core';
import { AudioBufferLoader} from "./audioBufferLoader";

@Injectable({
  providedIn: 'root'
})
export class SoundsService {

  loader : AudioBufferLoader;
  finishedLoading = false;
  context;
  soundBuffers;
  hostUrl;


  constructor(){
    // Fix up prefixing
    window.AudioContext = AudioContext || window.AudioContext;// || window.webkitAudioContext;
    this.context = new AudioContext();

    this.hostUrl = "";//http://" + window.location.hostname + ":4200";
    // this.hostUrl = "http://82.15.30.96";
    const prefix = this.hostUrl + '/assets/sounds/';
    this.loader = new AudioBufferLoader(this.context,
      [
        prefix + "Galloping-Horse.mp3",
        prefix + "gun.mp3",
        prefix + "ding.mp3",
        prefix + "bugle.mp3",
        prefix + "neigh.mp3",
        prefix + "crowd.mp3",
      ],
      this.finishedLoadingSounds,
      this);

    this.loadSounds();
  }


  loadSounds() {
    this.loader.load();
  }

  finishedLoadingSounds(bufferList: []) {
    this.soundBuffers = [...bufferList]
    this.finishedLoading = true;
  }

  playSound(soundIndex, time?) {
    if (!this.finishedLoading) {
      return;
    }
    let source = this.context.createBufferSource();
    source.buffer = this.soundBuffers[soundIndex];
    source.connect(this.context.destination);
    source.start(0);
    if (time) {
      window.setTimeout(() => {
        source.stop();
      }, time);
    }
  }

}


