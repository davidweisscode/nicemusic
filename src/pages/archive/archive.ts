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
    console.log("GET TAGS");
    // this.file.externalRootDirectory + item.fullPath
    // http:///sdcard/Music/Negroman/Sequel EP/01. Nejromunn.mp3
    // file:///storage/emulated/0/Music/Negroman/Sequel%20EP/01.%20Nejromunn.mp3 // fileEntry
    // cdvfile://localhost/sdcard/Music/Negroman/Sequel%20EP/01.%20Nejromunn.mp3 //toInternalURL
    //debugger;
    console.log("EXTROOTDIR", this.file.externalRootDirectory);
    this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then((dirEntry) => {

      console.log("DIRENTRY", dirEntry);

      this.file.getFile(dirEntry, "Music/Negroman/Sequel EP/01. Nejromunn.mp3", {create: false}).then((fileEntry) => {
        console.log("FILEENTRY", fileEntry);
        console.log("FILEENTRYINTERNALURL", fileEntry.toInternalURL());
        console.log("FILEENTRYNATIVEURL", fileEntry.nativeURL);
        //console.log("CONVERTED", this.webView.convertFileSrc(fileEntry.nativeURL));

        jsMediaTags.read(fileEntry.nativeURL, {
          onSuccess: function(tag) {
            console.log(tag);
          },
          onError: function(err) {
            console.log(err, err.type, err.info);
          }
        })
      });

    });

  }

}
