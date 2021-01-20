import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, NotificationService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthService, private notif: NotificationService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // check if route is restricted by role
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
                // role not authorised so redirect to home page
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
