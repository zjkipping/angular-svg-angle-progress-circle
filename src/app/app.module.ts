import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AngleProgressRxjsComponent } from './angle-progress-rxjs/angle-progress-rxjs.component';
import { AngleProgressCssComponent } from './angle-progress-css/angle-progress-css.component';

@NgModule({
  imports: [BrowserModule],
  declarations: [
    AppComponent,
    AngleProgressRxjsComponent,
    AngleProgressCssComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
