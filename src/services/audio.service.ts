import { Injectable } from "@angular/core";
import { File } from "@ionic-native/file";
import { Media, MediaObject } from "@ionic-native/media";

@Injectable()
export class AudioService {

  constructor(private file: File, private media: Media) {}

  audio: MediaObject;
  // different scope in "setAudio" and "playAudio" ?!
  // idea: provide class variable in constructor --> does not work ... "no provider"
  // Angular style?!

  setAudio(item) {
    this.audio = this.media.create(
      this.file.externalRootDirectory + "Music/America/01 - A Horse With No Name.m4a",//item.fullPath ?
      );
    //Ionic native doc: release() after finish?
    console.log("LOG audio (at SET): ", this.audio); //MediaObject instance
  }

  playAudio() {
    console.log("LOG audio (at PLAY): ", this.audio); //undefined
    this.audio.play();
  }

  pauseAudio() {
    this.audio.pause();
  }

  stopAudio() {
    this.audio.stop();
  }

}
