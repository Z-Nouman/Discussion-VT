import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material';
import {AddcommentComponent} from '../addcomment/addcomment.component';
import {Comment} from '../_models/course';
import {FileService} from '../_services/file.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {CourseService, NotificationService} from '../_services';

@Component({
  selector: 'app-student-paper',
  templateUrl: './student-paper.component.html',
  styleUrls: ['./student-paper.component.css']
})

export class StudentPaperComponent implements OnInit {

  pdfSource ;
  name = '';
  course = '';
  comments = [];
  element: any;

  constructor(private bottomSheet: MatBottomSheet, private fileService: FileService, private sanitizer: DomSanitizer,
              private courseService: CourseService, private notifService: NotificationService) {

  }

  // Loads the pdf and comments
  ngOnInit() {
    this.courseService.getComments(this.element._id).subscribe(res => {
      this.comments = res;
    });
    this.name = this.element.title;
    this.fileService.download(this.element.pdf).subscribe(res => {
      const theFile = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(res));
      this.pdfSource = theFile;
    });
  }

  // Adds a new comment
  openBottomSheet(): void {
    const bottomSheetRef = this.bottomSheet.open(AddcommentComponent, {
      data: {postID: this.element._id, shouldEdit: false}
    });
    bottomSheetRef.afterDismissed().subscribe(() => {
      this.courseService.getComments(this.element._id).subscribe(res => {
        this.comments = res;
      });
    });
  }

  // Edits an existing comment
  editComment($event: Comment) {
    const bottomSheetRef = this.bottomSheet.open(AddcommentComponent, {
      data: {postID: this.element._id, shouldEdit: true, original: $event}
    });
    bottomSheetRef.afterDismissed().subscribe(() => {
      this.courseService.getComments(this.element._id).subscribe(res => {
        this.comments = res;
      });
    });
  }

  // Deletes a comment
  deleteComment($event: string) {
    this.courseService.deleteComment($event, this.element._id).subscribe(x => {
      if (x.toString().localeCompare('Invalid access') === 0) {
        this.notifService.showNotif('Invalid access', 'Accept');
      }
      this.courseService.getComments(this.element._id).subscribe(res => {
        this.comments = res;
      });
    });
  }
}
