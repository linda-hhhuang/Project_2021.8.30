import { Component, OnInit } from '@angular/core';
import { Teacher } from '@ta/model/member';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from '@ta/admin/services/admin.service';
@Component({
  selector: 'app-admin-member-teacher',
  templateUrl: './admin-member-teacher.component.html',
  styleUrls: ['./admin-member-teacher.component.css'],
})
export class AdminMemberTeacherComponent implements OnInit {
  teacherList: Teacher[] | null = [];
  currentDisplayUserList!: Teacher[] | null;

  // currentSelectedUser!: Teacher;

  // isVisibleShowInfo = false;
  // isOkLoadingShowInfo = false;

  searchNameValue = '';
  visibleSearchName = false;

  searchSidValue = '';
  visibleSearchSid = false;

  constructor(
    private adminSrvc: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.adminSrvc.getTeacherList().subscribe((v) => {
      this.currentDisplayUserList = v.body;
      this.teacherList = v.body;
    });
  }

  // showModalShowInfo(e: any) {
  //
  //   this.adminSrvc.getTeacherInfo(e.sid).subscribe((v) => {
  //     this.currentSelectedUser = v.body;
  //     this.isVisibleShowInfo = true;
  //   });
  // }
  // handleOkShowInfo(): void {
  //   this.isVisibleShowInfo = false;
  // }

  deleteConfirm(user: Teacher) {
    this.adminSrvc.deleteTeacher(user.sid).subscribe((_) => {
      this.message.success('删除评审成功!');
      this.ngOnInit();
    });
  }

  deleteCancel() {}

  resetName(): void {
    this.searchNameValue = '';
    this.searchName();
  }
  searchName(): void {
    this.visibleSearchName = false;
    this.currentDisplayUserList = this.teacherList!.filter(
      (item: Teacher) => item.name!.indexOf(this.searchNameValue) !== -1
    );
  }

  resetSid(): void {
    this.searchSidValue = '';
    this.searchSid();
  }
  searchSid(): void {
    this.visibleSearchSid = false;
    this.currentDisplayUserList = this.teacherList!.filter(
      (item: Teacher) => String(item.sid).indexOf(this.searchSidValue) !== -1
    );
  }
}
