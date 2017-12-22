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

  // ? resolveLocalFileSystemUrl(fileUrl)
  myMedia: MediaObject = this.media.create(
    this.file.externalRootDirectory + "Music/America/nicesong.m4a",
  );
  myArch: any = { archive: [] };

  playMedia() {
    console.log("[play]");
    //this.myMedia.play();
    this.file
      .listDir(this.file.externalRootDirectory, "Music")
      .then(function(dirList) {
        console.log(dirList);
      });
  }

  stopMedia() {
    console.log("[stop]");
    //this.myMedia.stop();
  }

  buildJSONArchive(path) {
    this.addJSONEntries(path, this.myArch["archive"]).then((entries) => {
      this.writeArchiveFile(JSON.stringify(this.myArch));
      console.log(this.myArch);
      let test = JSON.stringify(this.myArch);
      console.log(test); //
    });
  }

  addJSONEntries(path, objArr) {
    return new Promise((resolve, reject) => {
      this.file
        .listDir(this.file.externalRootDirectory, path)
        .then((dirList) => {
          //TODO: build JSON object recursively
          let counter = 0;
          dirList.forEach((item) => {
            console.log(item);

            if (item.isDirectory) {
              ++counter;
              let newObjArr = [];
              this.addJSONEntries(item.fullPath.substring(1), newObjArr).then(
                () => {
                  objArr.push({
                    name: item.name,
                    content: newObjArr,
                  });
                  --counter;
                  if (counter == 0) {
                    resolve();
                  }
                },
              );
            } else {
              objArr.push({
                name: item.name,
              });
            }
          });
          if (counter == 0) {
            resolve();
          }
        });
    });
  }

  writeArchiveFile(content: string) {
    this.file.createFile(this.file.dataDirectory, "myArchive", true);
    this.file.writeExistingFile(this.file.dataDirectory, "myArchive", content);
  }
}
