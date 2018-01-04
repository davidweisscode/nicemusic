import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { File } from "@ionic-native/file";
import { Media, MediaObject } from "@ionic-native/media";
import { AudioService } from "../../services/audio.service"

@Component({
  selector: "page-player",
  templateUrl: "player.html",
  providers: [AudioService],
})
export class PlayerPage {
  constructor(
    public navCtrl: NavController,
    private media: Media,
    private file: File,
    private audioService: AudioService,
    ) {}

  // Current JSON object used for archive
  currentArchive: any = { root: [] };

  playAudio() {
    this.audioService.playAudio();
  }

  pauseAudio() {
    this.audioService.pauseAudio();
  }

  stopAudio() {
    this.audioService.stopAudio();
  }

  //TODO outsource functions in ArchiveService.ts

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
                  //directory meta data
                });
                 --recursionCounter;
                 if (recursionCounter == 0) {
                  resolve(); // Resolve recursive promise
                }
              });
             } else {
               targetArr.push({
                 name: item.name,
                //file meta data: TODO path to file
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
   *  Overwrite currentArchive.json file
   *  @param content   (Stringified) JSON file structure
   */
  //TODO execute on buttonclick
  writeArchiveFile(content: string) {
    this.file.createFile(this.file.dataDirectory, "currentArchive", true);
    this.file.writeExistingFile(
      this.file.dataDirectory,
      "currentArchive",
      content,
      );
  }
}
