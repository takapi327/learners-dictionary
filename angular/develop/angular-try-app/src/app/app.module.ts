import { BrowserModule }        from '@angular/platform-browser';
import { NgModule }             from '@angular/core';
import { FormsModule }          from '@angular/forms';

import { AppRoutingModule }     from './app-routing.module';
import { AppComponent }         from './app.component';
import { TryAngularComponent }  from './try-angular/try-angular.component';
import { TryAngular2Component } from './try-angular2/try-angular2.component';

@NgModule({
  declarations: [
    AppComponent,
    TryAngularComponent,
    TryAngular2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
