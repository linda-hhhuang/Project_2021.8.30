import { Component, OnInit } from '@angular/core';
import { AdminService } from '@ta/admin/services/admin.service';
import { FileList } from '@ta/model/request';
import { Student } from '@ta/model/member';
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

  searchNameValue = '';
  visibleSearchName = false;

  searchSidValue = '';
  visibleSearchSid = false;

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
    console.log('in Student ', e);
    this.adminSrvc.getStudentInfo(e.uid).subscribe((v) => {
      this.currentSelectedUser = v.body;
      this.isVisibleStudent = true;
    });
  }

  handleOkStudent(): void {
    this.isVisibleStudent = false;
    this.ngOnInit();
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
      (item: Student) => String(item.uid).indexOf(this.searchSidValue) !== -1
    );
  }

  deleteConfirm(user: Student) {
    this.adminSrvc.deleteStudent(user.uid).subscribe((_) => {
      this.message.success('删除学生成功!');
      this.ngOnInit();
    });
  }

  validateConfirm(user: Student) {
    this.adminSrvc.setStudentValidate(user.uid).subscribe((_) => {
      this.message.success('成功通过学生初试申请!');
      this.ngOnInit();
    });
  }

  getStudentFileList() {
    this.adminSrvc
      .getStudentFileList(this.currentSelectedUser.uid)
      .subscribe((file) => {
        this.fileList = file.body;
      });
  }

  getStudentFile(data: FileList) {
    this.adminSrvc.getStudentFile(this.currentSelectedUser.uid, data.fid);
  }

  Cancel() {}
}
