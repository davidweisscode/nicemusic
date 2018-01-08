import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { File } from "@ionic-native/file";
import { AudioService } from "../../services/audio.service";

@Component({
  selector: "page-archive",
  templateUrl: "archive.html"
})
export class ArchivePage {
  constructor(
    public navCtrl: NavController,
    private file: File,
    private navParams: NavParams,
    private audioService: AudioService,
    ) {
    let pageName = navParams.get("name"); //string?
    let pageContent = navParams.get("content"); //array

    if (pageName) { // Consecutive partial JSON lookup
      this.currentArchiveArr = pageContent;
    } else { // First JSON lookup
      this.file
      .readAsText(this.file.dataDirectory, "currentArchive")
      .then((string) => {
        this.currentArchiveJSON = JSON.parse(string);
        this.currentArchiveArr = this.currentArchiveJSON["root"];
      });
    }
  }

  currentArchiveJSON: any = {};
  currentArchiveArr: any = [];

  itemSelected(item) {
    console.log("SELECT ITEM", item);
    if(item.content) {
      this.navCtrl.push(ArchivePage, item);
    } else {
      //TODO: update playerPage
      this.audioService.setAudio(item);
      this.audioService.playAudio();
    }
  }
}
