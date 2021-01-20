import { Component, OnInit } from '@angular/core';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService, CourseService, NotificationService} from '../_services';
import {User} from '../_models/user';

@Component({
  selector: 'app-coursecreator',
  templateUrl: './coursecreator.component.html',
  styleUrls: ['./coursecreator.component.css']
})

export class CoursecreatorComponent implements OnInit {

  courseForm: FormGroup;
  loading = false;
  submitted = false;
  seasons = [];
  visibilities = [];
  currentUser: User;
  emptyList = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService,
              private courseService: CourseService,
              private notification: NotificationService) {
        this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.courseForm = this.formBuilder.group({
      courseNum: ['', [Validators.required]],
      courseDept: ['', [Validators.required]],
      season: ['', [Validators.required]],
      year: ['', [Validators.required]],
      CRN: ['', [Validators.required]],
      public: ['', [Validators.required]]
    });
    this.seasons = [{name: 'Spring'}, {name: 'Summer'}, {name: 'Fall'}, {name: 'Winter'}];
    this.visibilities = [{name: false}, {name: true}];
  }

  get f() {return this.courseForm.controls; }

  // Creates a random access code given a length
  randStr(len) {
    let s = '';
    while (len--) { s += String.fromCodePoint(Math.floor(Math.random() * (126 - 33) + 33)); }
    return s;
  }

  onSubmit() {
    this.submitted = true;
    if (this.courseForm.invalid) {
      // Error on submit
      return;
    }
    this.loading = true;
    const newCourse = {
      courseNumber: this.f.courseNum.value,
      courseDept: this.f.courseDept.value,
      createdBy: {username: this.currentUser.username},
      season: this.f.season.value,
      year: this.f.year.value,
      CRN: this.f.CRN.value,
      public: this.f.public.value,
      accessCode: this.randStr(50),
      comments: this.emptyList
    };
    this.courseService.createCourse(newCourse)
        .pipe(first())
        .subscribe(
            data => {
              // Registration was successful
              this.router.navigate(['/']);
            },
            error => {
              this.notification.showNotif(error);
              this.loading = false;
            });
  }
}
