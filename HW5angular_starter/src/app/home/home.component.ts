import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Course} from '../_models/course';
import {NotificationService} from '../_services/notification.service';
import {CourseService} from '../_services/course.service';
import {Router} from '@angular/router';
import {UserService, AuthService} from '../_services';
import {User} from '../_models/user';
import {Role} from '../_models/role';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({ templateUrl: 'home.component.html' ,
  styleUrls: ['home.component.css']})

export class HomeComponent implements OnInit {
  @Output() accessEvent = new EventEmitter<string>();

  constructor(private courseService: CourseService, private userService: UserService, private authService: AuthService,
              private notifService: NotificationService, private router: Router) {
      // Observing currentUser. We will need it to get user's id.
      this.authService.currentUser.subscribe(x => this.currentUser = x);
    }

  // Use this getter in the HTML to hide the buttons that professors shouldn't see.
  get isProf() {
      return this.currentUser.role === Role.professor;
  }

  currentUser: User;
  displayedColumns = [];
  courses: Course[] = [];
  displayedColumnsStudent = [];
  private dataSource;

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ngOnInit() {
    this.loadAllClasses();
    this.displayedColumns = ['CRN', 'courseDept', 'courseNumber', 'season', 'year', 'details', 'visible'];
    this.displayedColumnsStudent = ['CRN', 'courseDept', 'courseNumber', 'season', 'year', 'details'];
  }

  // Checks if the user is a student
  isStu() {
    return this.currentUser && this.currentUser.role === Role.student;
  }

  // Applies a search filter to the courses
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Loads all the courses available to that user
  loadAllClasses() {
    this.courseService.getAll().subscribe(
      courses => {
        this.dataSource = new MatTableDataSource(courses);
        this.dataSource.sort = this.sort;
        },
        error => {this.notifService.showNotif(error, 'error'); });
  }

  // Creates a new course
  createCourse() {
    // This will load the 'coursecreator' component
    this.router.navigateByUrl('/createCourse').then();
  }

  // Navigates a specific course
  viewCourse(id: string, num: number, dept: string, crn: string, weather: string, time: number, vis: boolean) {
    this.router.navigate([`/viewCourse`], {queryParams: {courseID: id, courseNumber: num, courseDept: dept, CRN: crn,
        season: weather, year: time, public: vis}}).then();
  }

  // Navigates to the page that allows students to join a course using an access code
  joinClass() {
    this.router.navigateByUrl('/addClass').then();
  }
}

