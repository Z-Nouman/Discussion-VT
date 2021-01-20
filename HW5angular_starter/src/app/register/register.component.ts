import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { NotificationService } from '../_services/notification.service';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';

@Component({templateUrl: 'register.component.html',
  selector: 'app-register',
  styleUrls: ['register.component.css']
})

export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  roles = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService,
              private notification: NotificationService) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']).then();
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      role: [''],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.roles = [{name: 'Student'},
      {name: 'Professor'}, {name: 'Guest'}];
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      // Error submitting the form
      return;
    }
    this.loading = true;
    this.userService.register(this.registerForm.value)
        .pipe(first())
        .subscribe(
            data => {
              this.notification.showNotif('Registration successful', 'Accept');
              this.authService.login(this.f.username.value, this.f.password.value)
                  .pipe(first())
                  .subscribe(
                      () => {
                        this.router.navigate(['/']);
                      },
                      error => {
                        this.loading = false;
                        this.notification.showNotif('There was an error', 'Accept');
                      });
            },
            error => {
              this.notification.showNotif(error);
              this.loading = false;
            });
  }
}
