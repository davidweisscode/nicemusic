import { Injectable } from "@angular/core";
import { File } from "@ionic-native/file";
import { Media, MediaObject } from "@ionic-native/media";

@Injectable()
export class AudioService {

  constructor(private file: File, private media: Media) {}

  audio: MediaObject;

  setAudio(item) {
    if(this.audio) {
      this.audio.release();
    }
    this.audio = this.media.create(
      this.file.externalRootDirectory + item.fullPath
    );
  }

  playAudio() {
    this.audio.play();
  }

  pauseAudio() {
    this.audio.pause();
  }

  stopAudio() {
    this.audio.stop();
  }

}
