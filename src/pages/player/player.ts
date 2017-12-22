import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { File } from "@ionic-native/file";
import { Media, MediaObject } from "@ionic-native/media";

@Component({
  selector: "page-player",
  templateUrl: "player.html",
})
export class PlayerPage {
  constructor(
    public navCtrl: NavController,
    private media: Media,
    private file: File,
  ) {}

  // Currently playing audio file
  //TODO setCurrentAudio()
  currentAudio: MediaObject = this.media.create(
    this.file.externalRootDirectory + "Music/America/nicesong.m4a",
  );
  // Current JSON object used for archive
  currentArchive: any = { root: [] };

  playMedia() {
    console.log("[play]");
    //this.currentAudio.play();
  }

  stopMedia() {
    console.log("[stop]");
    //this.currentAudio.stop();
  }

  /**
   *  Write file structure in JSON file
   *  @param fromPath  Path to scan
   */
  buildJSONArchive(fromPath) {
    this.addJSONEntries(fromPath, this.currentArchive["root"]).then(() => {
      this.writeArchiveFile(JSON.stringify(this.currentArchive));
    });
  }

  /**
   *  Recursively list file structure at "deviceRoot/fromPath" in array "targetArr"
   *  @param fromPath   Path to scan
   *  @param targetArr  Array to push to
   *  @returns          Promise
   */
  addJSONEntries(fromPath, targetArr) {
    return new Promise((resolve, reject) => {
      this.file
        .listDir(this.file.externalRootDirectory, fromPath)
        .then((dirList) => {
          let recursionCounter = 0;
          dirList.forEach((item) => {
            if (item.isDirectory) {
              ++recursionCounter;
              let newTargetArr = [];
              this.addJSONEntries(
                item.fullPath.substring(1),
                newTargetArr,
              ).then(() => {
                targetArr.push({
                  name: item.name,
                  content: newTargetArr,
                });
                --recursionCounter;
                if (recursionCounter == 0) {
                  resolve(); // Resolve recursive promise
                }
              });
            } else {
              targetArr.push({
                name: item.name,
              });
            }
          });
          if (recursionCounter == 0) {
            resolve(); // Resolve initial promise
          }
        });
    });
  }

  /**
   *  Write or overwrite currentArchive.json file
   *  @param content   (Stringified) JSON file structure
   */
  writeArchiveFile(content: string) {
    this.file.createFile(this.file.dataDirectory, "currentArchive", true);
    this.file.writeExistingFile(
      this.file.dataDirectory,
      "currentArchive",
      content,
    );
  }
}
