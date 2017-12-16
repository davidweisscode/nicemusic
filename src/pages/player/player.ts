import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-player',
  templateUrl: 'player.html'
})
export class PlayerPage {

  constructor(public navCtrl: NavController, private media: Media) {

  }

  myMedia: MediaObject = this.media.create('https://www.android-examples.com/wp-content/uploads/2016/04/Thunder-rumble.mp3');

  playMedia() {
    console.log("play");
    this.myMedia.play();
    console.log(this.myMedia);
  };

  pauseMedia() {
    console.log("pause");
  };

}
