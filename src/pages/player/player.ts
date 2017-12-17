import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-player',
  templateUrl: 'player.html'
})
export class PlayerPage {

  constructor(public navCtrl: NavController, private media: Media, private file: File) {

  }

  //myMedia: MediaObject = this.media.create('https://www.android-examples.com/wp-content/uploads/2016/04/Thunder-rumble.mp3');
  // ? resolveLocalFileSystemUrl(fileUrl)
  myMedia: MediaObject = this.media.create(this.file.externalRootDirectory + "Music/America/nicesong.m4a");

  playMedia() {
    console.log("play");
    this.myMedia.play();
    console.log(this.myMedia);
  };

  stopMedia() {
    console.log("stop");
    this.myMedia.stop();
    console.log(this.file.externalRootDirectory);
  };

}
