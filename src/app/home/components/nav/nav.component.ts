import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '@core/service/user.service';
import { Router } from '@angular/router';
import { User } from '@core/model/user';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user!: User;
  role: any = {
    0: '辅导员',
    1: '评审',
    2: '学生',
  };
  constructor(
    private message: NzMessageService,
    private userSrvc: UserService,
    private readonly router: Router
  ) {
    this.userSrvc.user$.subscribe((v) => (this.user = v));
  }

  logout() {
    this.userSrvc.logout().subscribe(() => {
      this.message.success(`成功登出！`);
    });
    this.router.navigateByUrl('/login');
  }
  ngOnInit(): void {}
}
