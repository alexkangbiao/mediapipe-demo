import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component'
import { MediaPipeDemoModule } from './media-pipe-demo/media-pipe-demo.module';
import { ScriptService } from './tools/script-service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MediaPipeDemoModule
  ],
  providers: [
    ScriptService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
