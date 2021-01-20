import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role} from '../_models/role';
import {AuthService, CourseService, NotificationService} from '../_services';
import {Course} from '../_models/course';
import {FileService} from '../_services/file.service';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  loading = false;
  submitted = false;
  postForm: FormGroup;
  studentID: string;
  firstName: string;
  lastName: string;
  fileName;
  courseID: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private courseService: CourseService,
              private fileService: FileService, private location: Location, private notifService: NotificationService,
              private router: ActivatedRoute) {

  }

  public formGroup = this.formBuilder.group({
    file: [null, Validators.required]
  });

  ngOnInit() {
    this.authService.currentUser.subscribe(x => {
      if (x) {
        this.firstName = x.firstName;
        this.lastName = x.lastName;
        this.studentID = x._id;
      }
    });
    this.router.queryParams.subscribe(params => {
      this.courseID = params.courseID;
    });
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      authors: ['', [Validators.required]],
    });
  }

  get f() {return this.postForm.controls; }

  onSubmit() {
    this.submitted = true;
    // Validate the file is of type 'pdf'
    if (this.formGroup.valid) {
      const ext = this.fileName.substring(this.fileName.lastIndexOf('.') + 1);
      if (ext.toLowerCase().localeCompare('pdf') === 0) {
        this.fileService.upload(this.studentID + this.courseID, this.formGroup.get('file').value, this.courseID).subscribe(res => {
        }, error => {
          this.notifService.showNotif('Invalid file', 'Accept');
        });
      } else {
        this.notifService.showNotif('Invalid file type', 'Accept');
        return;
      }
    }

    if (this.submitted && this.postForm.valid && this.formGroup.valid) {
      const newPost = {
          commentContent: [],
          pdf: this.studentID + this.courseID,
          firstName: this.firstName,
          lastName: this.lastName,
          title: this.f.title.value,
          authors: this.f.authors.value,
          studentID: this.studentID,
          courseID: this.courseID
      };
      this.courseService.newPost(newPost).subscribe(x => {
        this.location.back();
        this.notifService.showNotif(x, 'Accept');
      });
    } else {
      this.notifService.showNotif('Invalid post', 'Accept');
    }
  }

  public onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      this.fileName = event.target.files[0].name;
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formGroup.patchValue({
          file: reader.result
        });
      };
    }
  }

  goBack() {
    this.location.back();
  }
}
