import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService, UserService} from '../_services';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-addclass',
  templateUrl: './addclass.component.html',
  styleUrls: ['./addclass.component.css']
})

export class AddclassComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder, private notifService: NotificationService, private userService: UserService,
              private router: Router) {

  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      accessCode: ['', Validators.required],
    });
  }

  get f() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      // Error on submit
      return;
    }
    this.loading = true;
    this.userService.joinCourse(this.f.accessCode.value).pipe(first()).subscribe(x => {
      this.notifService.showNotif('Successfully registered a course!', 'Accept');
      this.router.navigate(['/']).then();
    }, error => {
      this.notifService.showNotif(error, 'Accept');
    });
  }
}
