import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService, CourseService, NotificationService} from '../_services';
import {Role} from '../_models/role';

@Injectable({ providedIn: 'root' })
export class ViewGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthService, private notif: NotificationService,
                private courseService: CourseService) {

    }

    // Authorize who can view certain pages based on their role, enrollment, and the course's visibility
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        let flag: boolean;
        // Check if the page the user is trying to access is public
        if (route.queryParams.public.toString().localeCompare('false') === 0) {
            flag = false;
        } else {
            flag = true;
        }

        // Check if this is a valid user
        if (currentUser) {
            // check if route is restricted by public / registration
            if ((!currentUser.courses.includes(route.queryParams.courseID)) &&  !flag && (currentUser.role === Role.guest)) {
                this.notif.showNotif('Not authorized!', 'error');
                this.router.navigate(['/']);
                return false;
            }
            // authorized so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
