import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { File } from "@ionic-native/file";
import { AudioService } from "../../services/audio.service";
import jsMediaTags from "jsmediatags";
import { WebView } from '@ionic-native/ionic-webview/ngx';

declare let window: any;

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
    // https://github.com/ionic-team/cordova-plugin-ionic-webview/issues/193
    // ExtRootDir  file:///storage/emulated/0/
    // NativeURL   file:///storage/emulated/0/Music/Dramadigs/04.%20Scherben.mp3 //fileEntry
    // InternalURL cdvfile://localhost/sdcard/Music/Dramadigs/04.%20Scherben.mp3 //toInternalURL
    this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then((dirEntry) => {
      console.log("DIR ENTRY", dirEntry);

      this.file.resolveLocalFilesystemUrl("file:///storage/emulated/0/Music/Dramadigs/04.%20Scherben.mp3").then((fileEntry) => {
        console.log("ResLocFileSysUrl", fileEntry);
        // Local example
        // https://github.com/aadsm/jsmediatags/issues/51 "No suitable reader found"
        jsMediaTags.read(fileEntry, {
          onSuccess: function(tag) {
            console.log("TAG", tag);
          },
          onError: function(error) {
            console.log("ERROR", error);
          }
        });
      });

      // Online example
      jsMediaTags.read("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", {
        onSuccess: function(tag) {
          console.log("TAG", tag);
        },
        onError: function(error) {
          console.log("ERROR", error);
        }
      });

      /*this.file.getFile(dirEntry, "Music/Dramadigs/04.%20Scherben.mp3", {create: false}).then((fileEntry) => {
        console.log("FILE ENTRY", fileEntry);
        //console.log("CONVERT_EXAMPLE", this.webView.convertFileSrc('file:///Users/dan/camera-image-12345.png'));
        //console.log("CONVERT_NATIVE", this.webView.convertFileSrc('file:///storage/emulated/0/Music/Dramadigs/04.%20Scherben.mp3'));
        //console.log("CONVERT_INTERNAL", this.webView.convertFileSrc('cdvfile://localhost/sdcard/Music/Dramadigs/04.%20Scherben.mp3'));
        console.log("CONVERT", this.convertFileSrc(fileEntry));

        jsMediaTags.read("http://localhost:8080/_file_/" + "storage/emulated/0/Music/Dramadigs/04.%20Scherben.mp3", {
          onSuccess: function(tag) {
            console.log(tag);
          },
          onError: function(err) {
            console.log(err, err.type, err.info);
          }
        });
      });*/
    });
  }

  convertFileSrc(url: any) {
    if (!url) {
      return url;
    }
    if (url.startsWith('/')) {
      return window.WEBVIEW_SERVER_URL + '/_app_file_' + url;
    }
    if (url.startsWith('file://')) {
      return window.WEBVIEW_SERVER_URL + url.replace('file://', '/_app_file_');
    }
    if (url.startsWith('content://')) {
      return window.WEBVIEW_SERVER_URL + url.replace('content:/', '/_app_content_');
    }
    return url;
  }

}
