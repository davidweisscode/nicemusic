import { Injectable } from "@angular/core";
import { File } from "@ionic-native/file";
import jsMediaTags from "jsmediatags";

@Injectable()
export class ArchiveService {

  constructor(private file: File) {}

  // Current JSON object used for archive
  currentArchive: any;

  /**
   *  Write directory and file structure in JSON file
   *  @param fullPath  Android music dir path to scan, following file:///storage/emulated/0/
   */
   updateArchive(fullPath) {
     this.currentArchive = { root: [] };
     this.addJSONEntries(fullPath, this.currentArchive["root"]).then(() => {
       this.writeArchiveFile(JSON.stringify(this.currentArchive));
     });
     //TODO reload archive view
   }

  /**
   *  Recursively list file structure at "deviceRoot/fullPath" in array "targetArr"
   *  @param fullPath   Path to scan
   *  @param targetArr  Array to push to
   *  @returns          Promise
   */
   addJSONEntries(fullPath, targetArr) {
     return new Promise((resolve, reject) => {
       this.file
       .listDir(this.file.externalRootDirectory, fullPath)
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
               // Item is file
               //debugger;
               if(item.fullPath.substr(-3, 3) === ("mp3" || "wav")) { // Is audio file
                this.getTags(item.fullPath).then(tag => {
                  targetArr.push({
                    name: item.name,
                    fullPath: item.fullPath.substring(1),
                    title: tag.title,
                    artist:tag.artist,
                  });
                 });
               } else if(item.fullPath.substr(-3, 3) === ("jpg" || "JPG" || "png" || "PNG")) { // Is image file
                  targetArr.push({
                    name: item.name,
                    fullPath: item.fullPath.substring(1),
                  });
               } else {
                 console.log("Not audio and not img");
                 return;
               }
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
   writeArchiveFile(content: string) {
     this.file.createFile(this.file.dataDirectory, "currentArchive", true);
     this.file.writeExistingFile(
       this.file.dataDirectory,
       "currentArchive",
       content,
       );
     console.log("dataDirectory is at ", this.file.dataDirectory)
     // file:///data/data/io.ionic.starter/files/
   }

   /**
   *  Read ID3 tags from local files
   *  @param fullPath   Path in the /Music/ dir
   *  @returns tag      Object containing tags and metadata
   */
   getTags(fullPath) {
    return new Promise<{title: any, artist: any}>((resolve, reject) => {

      this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then((dirEntry) => {
        // extRootDir / dirEntry.nativeURL: file:///storage/emulated/0/
        this.file.resolveLocalFilesystemUrl(dirEntry.nativeURL + fullPath).then((fileEntry) => {
          //"file:///storage/emulated/0/Music/Dramadigs/04.%20Scherben.mp3"
          // nativeURL: file:///storage/emulated/0/Music/Dramadigs/04.%20Scherben.mp3
          jsMediaTags.read(fileEntry.toInternalURL(), {
            // fileEntry.toInternalURL(): cdvfile://localhost/sdcard/Music/Dramadigs/04.%20Scherben.mp3 
            onSuccess: function(tag) {
              console.log("TAG", tag);
              resolve(tag);
            },
            onError: function(error) {
              console.log("ERROR", error);
              reject();
            }
          });
        });
      });

    })
  }

 }
