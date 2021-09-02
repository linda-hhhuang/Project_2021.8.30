import { Injectable, Optional, SkipSelf } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { map, take, skip, skipWhile, switchMap } from 'rxjs/operators';
import { GlobalMessageService } from '@shared/ui-antd/global-message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userServ: UserService,
    private router: Router,
    private message: GlobalMessageService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('in auth.guard');
    return this.userServ.isLogin$.pipe(
      skipWhile((v) => v == -1),
      map((loggedIn) => {
        if (loggedIn) {
          console.log('guard', true);
          return true;
        } else {
          console.log('guard', false);
          return this.router.parseUrl('/login');
        }
      })
    );
  }
}
