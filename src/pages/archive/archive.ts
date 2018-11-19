import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { File } from "@ionic-native/file";
import { AudioService } from "../../services/audio.service";
import jsMediaTags from "jsmediatags";

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
    console.log("SELECT ITEM", item);
    if(item.content) {
      this.navCtrl.push(ArchivePage, item);
    } else {
      //TODO: update playerPage
      this.audioService.setAudio(item);
      this.audioService.playAudio();
    }
  }

  getTags() {
    console.log("GET TAGS");
    /*debugger;
    this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then((myDir) => {

      this.file.getFile(myDir, "Music/Negroman/Sequel EP/01. Nejromunn.mp3", {create: false}).then((fileEntry) => {
        jsMediaTags.read(fileEntry.toInternalURL(), {
          onSuccess: function(tag) {
            console.log(tag);
          },
          onError: function(err) {
            console.log(err, err.type, err.info);
          }
        })
      });

    });*/

    jsMediaTags.read("http:///sdcard/Music/album01/song01.mp3", {
      onSuccess: function(tag) {
        console.log(tag);
      },
      onError: function(error) {
        console.log(error);
      }
    });

  }

}
