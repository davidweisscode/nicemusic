import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-player',
  templateUrl: 'player.html'
})
export class PlayerPage {

  constructor(public navCtrl: NavController, private media: Media) {

    const myMedia: MediaObject = this.media.create('file.mp3');

  }



  playMedia() {
    //myMedia.play();
    console.log("play");
  };

  pauseMedia() {
    //myMedia.pause();
    console.log("pause");
  };



}
