import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { File } from "@ionic-native/file";
import { AudioService } from "../../services/audio.service";
import jsMediaTags from "jsmediatags";
import { WebView } from '@ionic-native/ionic-webview/ngx';

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
    private webView: WebView,
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
    this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then((dirEntry) => {
      // extRootDir / dirEntry.nativeURL: file:///storage/emulated/0/
      this.file.resolveLocalFilesystemUrl("file:///storage/emulated/0/Music/Dramadigs/04.%20Scherben.mp3").then((fileEntry) => {
        // nativeURL: file:///storage/emulated/0/Music/Dramadigs/04.%20Scherben.mp3
        jsMediaTags.read(fileEntry.toInternalURL(), {
          // fileEntry.toInternalURL(): cdvfile://localhost/sdcard/Music/Dramadigs/04.%20Scherben.mp3 
          onSuccess: function(tag) {
            console.log("TAG", tag);
          },
          onError: function(error) {
            console.log("ERROR", error);
          }
        });
      });
    });
  }

}
