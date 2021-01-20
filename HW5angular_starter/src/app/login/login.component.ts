import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { first } from 'rxjs/operators';
import {AuthService} from '../_services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../_services/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({ templateUrl: 'login.component.html' ,
    encapsulation: ViewEncapsulation.None,
  styleUrls: ['login.component.css']})

export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService,
                private notification: NotificationService) {
        // redirect to home if already logged in
        if (this.authService.currentUserValue) {
            this.router.navigate(['/']).then();
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.authService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                    // show a snackbar to user
                    this.notification.showNotif(this.error, 'undo');
                });
    }
}
