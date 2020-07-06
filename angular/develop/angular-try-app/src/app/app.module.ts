//---- Module ----------------------------
import { BrowserModule }                    from '@angular/platform-browser';
import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ---- AppComponent ---------------------
import { AppRoutingModule }     from './app-routing.module';
import { AppComponent }         from './app.component';

//---- Component -------------------------
import { TryAngularComponent }  from './try-angular/try-angular.component';
import { TryAngular2Component } from './try-angular2/try-angular2.component';
import { FormComponent }        from './form/form.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    TryAngularComponent,
    TryAngular2Component,
    FormComponent,
    UserComponent,
    UserDetailComponent,
    UserEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
