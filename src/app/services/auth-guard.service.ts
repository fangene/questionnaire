import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.auth.map((res) => {
            if (res.auth) {
                this.authService.setCurrentUser(res.google);
                return true;
            }
            this.router.navigate(['/login']);
            return false;
        });
    }
}
