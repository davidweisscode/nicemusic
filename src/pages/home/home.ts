import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ArchiveService } from "../../services/archive.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private archiveService: ArchiveService) {

  }

  updateArchive(pathToRoot) {
    this.archiveService.updateArchive(pathToRoot);
  }

}
