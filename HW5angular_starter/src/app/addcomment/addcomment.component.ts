import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, CourseService, NotificationService} from '../_services';
import {User} from '../_models/user';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-addcomment',
  templateUrl: './addcomment.component.html',
  styleUrls: ['./addcomment.component.css']
})

export class AddcommentComponent implements OnInit {

  commentForm: FormGroup;
  currentUser: User;
  submitted = false;
  loading = false;

  private firstName: string;
  private lastName: string;
  private userID: string;
  constructor(private formBuilder: FormBuilder, private bottomSheetRef: MatBottomSheetRef, private authService: AuthService,
              private courseService: CourseService, private route: ActivatedRoute, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private notifService: NotificationService) { }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });
  }

  get f() {return this.commentForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.commentForm.invalid) {
      // Error on submit
      return;
    }
    this.authService.currentUser.subscribe(x => {
      if (x) {
        this.firstName = x.firstName;
        this.lastName = x.lastName;
        this.userID = x._id;
      }
    });
    this.loading = true;
    const newComment = {
      firstName: this.firstName,
      lastName: this.lastName,
      comment: this.f.comment.value,
      userID: this.userID,
      unique: this.randStr(64)
    };
    if (this.data.shouldEdit) {
      this.courseService.editComment(this.data.original, this.data.postID, newComment.comment).subscribe(x => {
        if (x.toString().localeCompare('Invalid access') === 0) {
          this.notifService.showNotif('Invalid access to edit', 'Accept');
        }
        this.bottomSheetRef.dismiss('Dismissing it now!');
      });
    } else {
      this.courseService.postComment(this.data.postID, newComment).subscribe(x => {
        this.notifService.showNotif(x, 'Accept');
        this.bottomSheetRef.dismiss('Dismissing it now!');
      });
    }
  }

  goBack() {
    this.bottomSheetRef.dismiss();
  }

  // Generates a random comment ID given a length
  randStr(len) {
    let s = '';
    while (len--) { s += String.fromCodePoint(Math.floor(Math.random() * (126 - 33) + 48)); }
    return s;
  }
}
