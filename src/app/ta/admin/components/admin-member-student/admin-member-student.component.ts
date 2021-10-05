import { Component, OnInit } from '@angular/core';
import { AdminService } from '@ta/admin/services/admin.service';
import { Student, FileList } from '@ta/model/member';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-admin-member-student',
  templateUrl: './admin-member-student.component.html',
  styleUrls: ['./admin-member-student.component.css'],
})
export class AdminMemberStudentComponent implements OnInit {
  studentList: Student[] | null = [];
  currentDisplayUserList!: Student[] | null;

  currentSelectedUser!: Student;

  fileList: FileList[] = [];

  isVisibleStudent = false;
  isOkLoadingStudent = false;

  isVisiblePass = false;
  isOkLoadingPass = false;

  passClass: string = '';

  searchNameValue = '';
  visibleSearchName = false;

  searchSidValue = '';
  visibleSearchSid = false;

  searchClassValue = '';
  visibleSearchClass = false;
  status = ['等待评审', '已被拒绝', '奖学金评审通过', '奖学金辅导员评定通过'];

  constructor(
    private adminSrvc: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.adminSrvc.getStudentList().subscribe((v) => {
      this.currentDisplayUserList = v.body;
      this.studentList = v.body;
    });
  }

  showModalStudent(e: any) {
    this.adminSrvc.getStudentInfo(e.sid).subscribe((v) => {
      this.currentSelectedUser = v.body;
      this.adminSrvc
        .getStudentFileList(this.currentSelectedUser.sid)
        .subscribe((file) => {
          this.fileList = file.body;
          this.isVisibleStudent = true;
        });
    });
  }
  handleOkStudent(): void {
    this.isVisibleStudent = false;
    this.ngOnInit();
  }

  //Pass
  showModalPass(): void {
    this.isVisiblePass = true;
    this.passClass = '';
  }
  handleOkPass(): void {
    this.isOkLoadingPass = true;
    this.adminSrvc.setClassValidate(this.passClass).subscribe((_) => {
      this.message.success(`成功审批${this.passClass}的奖学金结果!`);
      this.isOkLoadingPass = false;
      this.isVisiblePass = false;
      this.ngOnInit();
    });
  }
  handleCancelPass(): void {
    this.isOkLoadingPass = false;
    this.isVisiblePass = false;
  }

  resetName(): void {
    this.searchNameValue = '';
    this.searchName();
  }
  searchName(): void {
    this.visibleSearchName = false;
    this.currentDisplayUserList = this.studentList!.filter(
      (item: Student) => item.name!.indexOf(this.searchNameValue) !== -1
    );
  }

  resetSid(): void {
    this.searchSidValue = '';
    this.searchSid();
  }
  searchSid(): void {
    this.visibleSearchSid = false;
    this.currentDisplayUserList = this.studentList!.filter(
      (item: Student) => String(item.sid).indexOf(this.searchSidValue) !== -1
    );
  }

  resetClass(): void {
    this.searchClassValue = '';
    this.searchClass();
  }
  searchClass(): void {
    this.visibleSearchClass = false;
    this.currentDisplayUserList = this.studentList!.filter(
      (item: Student) =>
        String(item.class).indexOf(this.searchClassValue) !== -1
    );
  }

  deleteConfirm(user: Student) {
    this.adminSrvc.deleteStudent(user.sid).subscribe((_) => {
      this.message.success('删除学生成功!');
      this.ngOnInit();
    });
  }

  validateConfirm(user: Student) {
    this.adminSrvc.setStudentValidate(user.sid).subscribe((_) => {
      this.message.success('成功评定此学生奖学金申请!');
      this.ngOnInit();
    });
  }

  getStudentFile(data: FileList) {
    this.adminSrvc.getStudentFile(this.currentSelectedUser.sid, data.fid);
  }

  Cancel() {}

  formatDateTime(dateString: string) {
    const date = new Date(dateString);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let mm = m < 10 ? '0' + m : m;
    let d = date.getDate();
    let dd = d < 10 ? '0' + d : d;
    let h = date.getHours();
    let hh = h < 10 ? '0' + h : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let minuteS = minute < 10 ? '0' + minute : minute;
    let secondS = second < 10 ? '0' + second : second;
    return y + '-' + mm + '-' + dd + ' ' + hh + ':' + minuteS + ':' + secondS;
  }
}
