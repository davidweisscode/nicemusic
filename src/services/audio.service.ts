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
      console.log("Status geändert", status);
    });
    this.audio.onError.subscribe(error =>
      console.log('Error: Cannot play audio.', error));
    this.audio.onSuccess.subscribe((successType) => { // Triggers on finish and cancel
      if(successType === 6) { // See at plugin Media.js
        console.log('Audio finished!');
        this.nextAudio();
      } else {
        console.log('Audio stopped!');
      }

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
      // TODO: Repeat album from beginning
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
