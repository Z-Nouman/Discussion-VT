import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {Role} from './_models/role';
import {AuthGuard} from './_guards/auth.guard';
import {CoursecreatorComponent} from './coursecreator/coursecreator.component';
import {ViewCourseComponent} from './view-course/view-course.component';
import {AddclassComponent} from './addclass/addclass.component';
import {NewPostComponent} from './new-post/new-post.component';
import {ViewGuard} from './_guards/view.guard';
import {AddcommentComponent} from './addcomment/addcomment.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  {
    path: 'createCourse',
    component: CoursecreatorComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.professor] }
  },
  {
    path: 'addClass',
    component: AddclassComponent,
    canActivate: [AuthGuard],
    // The prof route also sets the roles data property to [Role.professor] so only admin users can access it.
    data: { roles: [Role.student] }
  },
  {
    path: 'createPost',
    component: NewPostComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.student] }
  },
  {
    path: 'viewCourse',
    component: ViewCourseComponent,
    canActivate: [ViewGuard]
  },
  {
    path: 'viewCourse',
    component: AddcommentComponent,
    canActivate: [ViewGuard],
  },

  { path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
