import { Injectable } from '@angular/core';
import { BufferLoader} from "./buffer.loader";

@Injectable({
  providedIn: 'root'
})
export class SoundsService {

  loader : BufferLoader;
  finishedLoading = false;
  context;
  soundBuffers;


  constructor(){
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();

    const prefix = '/assets/sounds/';
    this.loader = new BufferLoader(this.context,
      [
        prefix + "Galloping-Horse.wav",
        prefix + "gun.mp3",
        prefix + "ding.mp3",
        prefix + "bugle.mp3",
        prefix + "neigh.mp3",
        prefix + "crowd.mp3",
      ],
      this.finishedLoadingSounds);

    this.loadSounds();
  }


  loadSounds() {
  //  this.loader.load();
  }

  finishedLoadingSounds() {
    this.soundBuffers = [...this.loader._bufferList]
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


