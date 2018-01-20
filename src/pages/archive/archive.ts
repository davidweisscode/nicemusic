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
    let pagePath = navParams.get("fullPath");
    let pageContent = navParams.get("content"); // Array

    if (pagePath) { // Consecutive partial JSON lookup
      this.archiveTitle = pagePath.substring(5); // Remove "Music"
      this.currentArchiveArr = pageContent;
    } else { // First JSON lookup
      this.archiveTitle = "/";
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
  archiveTitle: string;

  itemSelected(item) {
    console.log("Select item:", item);
    if(item.content) { // Subsequent page is directory page
      this.navCtrl.push(ArchivePage, item);
    } else { // Subsequent page is file page
      //TODO: update playerPage
      console.log("Select item before setAudio:", item);
      console.log("Select currentArchiveArr before setAudio:", this.currentArchiveArr);
      console.log("Select index before setAudio:", this.currentArchiveArr.indexOf(item));
      this.audioService.setAudio(
        item,
        this.currentArchiveArr,
        this.currentArchiveArr.indexOf(item)
        );
      this.audioService.playAudio();
    }
  }
}
