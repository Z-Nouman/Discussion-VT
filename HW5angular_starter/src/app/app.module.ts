import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {MaterialModule} from './material-module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from './_interceptors/jwt.interceptor';
import {ErrorInterceptor} from './_interceptors/error.interceptor';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CoursecreatorComponent } from './coursecreator/coursecreator.component';
import { ViewCourseComponent } from './view-course/view-course.component';
import {StudentPaperComponent} from './student-paper/student-paper.component';
import { CommentComponent } from './comment/comment.component';
import { AddclassComponent } from './addclass/addclass.component';
import { AddcommentComponent } from './addcomment/addcomment.component';
import { NewPostComponent } from './new-post/new-post.component';
import { MatButtonModule } from '@angular/material';
import { MatFileUploadModule } from 'angular-material-fileupload';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    CoursecreatorComponent,
    ViewCourseComponent,
    StudentPaperComponent,
    CommentComponent,
    AddclassComponent,
    AddcommentComponent,
    NewPostComponent
  ],
    entryComponents: [StudentPaperComponent, AddcommentComponent],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule,
        NgxMaterialTimepickerModule,
        MatButtonModule,
        MatFileUploadModule
    ],
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
