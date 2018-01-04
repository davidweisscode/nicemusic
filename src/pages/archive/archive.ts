import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { File } from "@ionic-native/file";
import { AudioService } from "../../services/audio.service";

@Component({
  selector: "page-archive",
  templateUrl: "archive.html",
  providers: [AudioService],
})
export class ArchivePage {
  constructor(
    public navCtrl: NavController,
    private file: File,
    private navParams: NavParams,
    private audioService: AudioService,
    ) {
    console.log("CONSTRUCTOR");
    console.log(navParams.get("name"));
    console.log(navParams.get("content"));
    let pageName = navParams.get("name"); //string?
    let pageContent = navParams.get("content"); //array

    if (pageName) {
      console.log("OPEN SUB-PAGE");
      this.currentArchiveArr = pageContent;
    } else {
      console.log("OPEN ROOT-PAGE");
      this.file
      .readAsText(this.file.dataDirectory, "currentArchive")
      .then((string) => {
        this.currentArchiveJSON = JSON.parse(string);
        console.log("[READ ARCHIVE]", this.currentArchiveJSON);
        this.currentArchiveArr = this.currentArchiveJSON["root"];
      });
    }
  }

  currentArchiveJSON: any = {};
  currentArchiveArr: any = [];

  itemSelected(item) {
    console.log("SELECT ITEM", item);
    if(item.content) {
      console.log("OPEN PAGE --> item selected has content property");
      this.navCtrl.push(ArchivePage, item);
    } else {
      //TODO: update playerPage
      this.audioService.setAudio(item);
    }
  }
}
