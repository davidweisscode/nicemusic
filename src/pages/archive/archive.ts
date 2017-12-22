import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { File } from "@ionic-native/file";

@Component({
  selector: "page-archive",
  templateUrl: "archive.html",
})
export class ArchivePage {
  constructor(public navCtrl: NavController, private file: File) {}

  currentArchiveJSON: any = {};

  ngOnInit() {
    this.file
      .readAsText(this.file.dataDirectory, "currentArchive")
      .then((string) => {
        this.currentArchiveJSON = JSON.parse(string);
        console.log(this.currentArchiveJSON);
      });
  }
}
