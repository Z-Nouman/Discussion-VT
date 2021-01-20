import {AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {StudentPaperComponent} from '../student-paper/student-paper.component';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService, CourseService, NotificationService} from '../_services';
import {Role} from '../_models/role';
import {MatSort, MatTableDataSource} from '@angular/material';
import {User} from '../_models/user';

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./view-course.component.css']
})
export class ViewCourseComponent implements OnInit, AfterViewInit {

  season: string;
  year: number;
  accessCode: string;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private authService: AuthService, private router: Router,
              private courseService: CourseService, private notifService: NotificationService) {

  }

  dataSource;
  courseID;
  CRN;
  userRole = '';
  isChecked;
  courseDept;
  courseNumber;
  enrolledStudents;
  comments;
  displayedColumns: string[] = ['firstName', 'lastName', 'date', 'title', 'authors', 'details', 'upvotes'];

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
  openDialog(element) {
    const config: MatDialogConfig = {
      panelClass: 'dialog-responsive'
    };
    const dialogRef = this.dialog.open(StudentPaperComponent, config);
    dialogRef.componentInstance.element = element;
    dialogRef.componentInstance.course = this.courseID;
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    // Check if the user can see this page
    this.authService.currentUser.subscribe(x => {
      if (x) {
        this.userRole = x.role;
      }
    });
    this.route.queryParams.subscribe(params => {
      this.courseID = params.courseID;
      this.courseService.retrievePosts(this.courseID).subscribe(res => {
        this.dataSource = new MatTableDataSource(res);
      });
      this.CRN = params.CRN;
      this.courseDept = params.courseDept;
      this.courseNumber = params.courseNumber;
      this.year = params.year;
      this.season = params.season;
      if (this.userRole === Role.professor) {
        this.courseService.getCourse(this.courseID).subscribe(x => {
          this.accessCode = x.accessCode;
          this.isChecked = x.public;
        });
        // Retrieves list of enrolled students
        this.courseService.getEnrolledStudents(this.courseID).subscribe(x => {
          this.enrolledStudents = x;
        });
      }
    });
  }

  // Checks if the user is a professor
  isProf() {
    return this.userRole && this.userRole === Role.professor;
  }

  // Changes the access code to a new, random one. This invalidates the previous access code
  changeAccessCode() {
    this.courseService.updateAccessCode(this.courseID).subscribe(x => {
      this.accessCode = x.toString();
    });
  }

  // Creates a new post
  createPost(id: string) {
    this.router.navigate(['/createPost'], {queryParams: {courseID: id}}).then();
  }

  // Changes the visibility of the course
  buttonToggle() {
    this.courseService.getVisibility(this.courseID, this.isChecked).subscribe(() => {
    });
  }

  // Deletes a post
  deletePost(id: string) {
    this.courseService.deletePost(id).subscribe(x => {
      this.courseService.retrievePosts(this.courseID).subscribe(res => {
        this.dataSource = new MatTableDataSource(res);
        this.notifService.showNotif(x, 'Accept');
      });
    });
  }

  // Removes an enrolled student from the course
  deleteUser(user: User) {
    this.courseService.removeUser(user, this.courseID).subscribe(x => {
      this.courseService.getEnrolledStudents(this.courseID).subscribe(y => {
        this.enrolledStudents = y;
        this.notifService.showNotif(x.toString(), 'Accept');
      });
    });
  }

  // Checks if the user is a student
  isStu() {
    return this.userRole && this.userRole === Role.student;
  }
}
