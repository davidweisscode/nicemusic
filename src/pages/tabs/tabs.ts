import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ArchivePage } from '../archive/archive';
import { PlayerPage } from '../player/player';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ArchivePage;
  tab3Root = PlayerPage;

  constructor() {

  }
}
