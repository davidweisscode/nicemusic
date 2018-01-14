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


    this.audio.onStatusUpdate.subscribe(status => console.log("STATUS", status)); // fires when file status changes

    this.audio.onSuccess.subscribe(() => console.log('Action is successful')); // Fires after audio finished playing

    this.audio.onError.subscribe(error => console.log('Error!', error));

    /*
    Media.MEDIA_NONE = 0;
    Media.MEDIA_STARTING = 1;
    Media.MEDIA_RUNNING = 2;
    Media.MEDIA_PAUSED = 3;
    Media.MEDIA_STOPPED = 4;
    */

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
