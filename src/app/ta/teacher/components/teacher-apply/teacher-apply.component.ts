import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileList } from '@ta/model/request';
import { Student } from '@ta/model/member';
import { TeacherService } from '@ta/teacher/services/teacher.service';
@Component({
  selector: 'app-teacher-apply',
  templateUrl: './teacher-apply.component.html',
  styleUrls: ['./teacher-apply.component.css'],
})
export class TeacherApplyComponent implements OnInit {
  studentList: Student[] = [];
  currentDisplayStudentList: Student[] = [];

  currentSelectedUser!: Student;
  fileList: FileList[] = [];

  isVisibleStudent = false;
  isOkLoadingStudent = false;

  status = [
    '等待辅导员审核',
    '材料已被审核,请等待结果',
    '材料已被审核,请等待结果',
    '本人已通过奖学金成绩审核',
  ];

  constructor(
    private teacherSrvc: TeacherService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.teacherSrvc.getStudentList().subscribe((v) => {
      this.currentDisplayStudentList = v.body;
      this.studentList = v.body;
    });
  }

  //查看学生信息
  showModalStudent(e: any) {
    console.log('in Student ', e);
    this.teacherSrvc.getStudentInfo(e.uid).subscribe((v) => {
      this.currentSelectedUser = v.body;
      this.isVisibleStudent = true;
    });
    this.teacherSrvc.getStudentFileList(e.uid).subscribe((file) => {
      this.fileList = file.body;
    });
  }
  handleOkStudent(): void {
    this.isVisibleStudent = false;
    this.ngOnInit();
  }

  getStudentFile(data: FileList) {
    this.teacherSrvc.getStudentFile(this.currentSelectedUser.uid, data.fid);
  }

  passConfirm(user: Student) {
    this.teacherSrvc.setStudentPass(user.uid).subscribe((_) => {
      this.message.success('成功通过学生初试申请!');
      this.ngOnInit();
    });
  }

  rejectConfirm(user: Student) {
    this.teacherSrvc.setStudentReject(user.uid).subscribe((_) => {
      this.message.success('成功通过学生初试申请!');
      this.ngOnInit();
    });
  }
}
