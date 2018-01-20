import { Injectable } from "@angular/core";
import { File } from "@ionic-native/file";
import { Media, MediaObject } from "@ionic-native/media";

@Injectable()
export class AudioService {

  constructor(private file: File, private media: Media) {}

  audio: MediaObject;
  audioList: Array<any>;
  audioIndex: number;

  setAudio(item, audioList, audioIndex) {
    if(this.audio) { this.audio.release(); }
    // Update play context
    this.audio = this.media.create(
      this.file.externalRootDirectory + item.fullPath
      );
    this.audioList = audioList;
    this.audioIndex = audioIndex;
    // Register events
    // NONE = 0; STARTING = 1; RUNNING = 2; PAUSED = 3; STOPPED = 4;
    this.audio.onStatusUpdate.subscribe(status => { //Many status changes in stupid order and repeated ?!
      /*switch(status) {
        case (0): {
          console.log("Media status:", "NONE");
        }
        case (1): {
          console.log("Media status:", "STARTING");
        }
        case (2): {
          console.log("Media status:", "RUNNING");
        }
        case (3): {
          console.log("Media status:", "PAUSED");
        }
        case (4): {
          console.log("Media status:", "STOPPED");
        }
      }*/
    });
    this.audio.onError.subscribe(error =>
      console.log('Error: Cannot play audio.', error));
    this.audio.onSuccess.subscribe(() => { // !!! Triggers also on "stop" or other audio
      console.log('Audio finished!');
      this.nextAudio();
    });
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

  // Check for, set and play next audio
  nextAudio() {
    console.log("Start nextAudio()");
    ++this.audioIndex;
    let nextFile = this.audioList[this.audioIndex];
    if(nextFile) {
      if(this.isAudioPath(nextFile.fullPath)) {
        this.setAudio(
          this.audioList[this.audioIndex],
          this.audioList,
          this.audioIndex
          );
        console.log("playAudio() within nextAudio()");
        this.playAudio();
      } else {
        console.log("Next file is no audio");
      }
    } else {
      console.log("No next file");
    }
  }

  isAudioPath(filepath) {
    if(filepath) {
      return filepath.substr(filepath.length - 3) === "m4a" || "mp3";
    } else {
      return false;
    }
  }



}
