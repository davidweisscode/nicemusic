import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ArchivePage } from '../pages/archive/archive';
import { PlayerPage } from '../pages/player/player';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { Media } from '@ionic-native/media';
import { AudioService } from "../services/audio.service";
import { ArchiveService } from "../services/archive.service";

@NgModule({
  declarations: [
  MyApp,
  TabsPage,
  HomePage,
  ArchivePage,
  PlayerPage
  ],
  imports: [
  BrowserModule,
  IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
  MyApp,
  TabsPage,
  HomePage,
  ArchivePage,
  PlayerPage
  ],
  providers: [
  StatusBar,
  SplashScreen,
  AudioService,
  ArchiveService,
  File,
  Media,
  {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
