import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { AudioService } from "../../services/audio.service"

@Component({
  selector: "page-player",
  templateUrl: "player.html",
})
export class PlayerPage {
  constructor(
    public navCtrl: NavController,
    private audioService: AudioService,
    ) {}

  playAudio() {
    this.audioService.playAudio();
  }

  pauseAudio() {
    this.audioService.pauseAudio();
  }

  stopAudio() {
    this.audioService.stopAudio();
  }

}
