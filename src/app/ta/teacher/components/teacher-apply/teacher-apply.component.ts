import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Student, FileList, Comment } from '@ta/model/member';
import { TeacherService } from '@ta/teacher/services/teacher.service';

@Component({
  selector: 'app-teacher-apply',
  templateUrl: './teacher-apply.component.html',
  styleUrls: ['./teacher-apply.component.css'],
})
export class TeacherApplyComponent implements OnInit {
  studentList: Student[] | null = [];
  currentDisplayStudentList!: Student[] | null;

  currentSelectedStudent!: Student;

  fileList: FileList[] | null = [];

  commentValue: string = '无评论';
  commentList: Comment[] | null = [];
  isReject = false;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  isVisibleShowComment = false;
  isOkLoadingShowComment = false;

  searchSidValue = '';
  visibleSearchSid = false;

  searchNameValue = '';
  visibleSearchName = false;
  status = ['等待评审', '已拒绝', '奖学金评审通过', '奖学金辅导员评定通过'];

  constructor(
    private teacherSrvc: TeacherService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.teacherSrvc.getStudentList().subscribe((v) => {
      this.studentList = v.body;
      this.currentDisplayStudentList = v.body;
    });
  }

  showModalShowInfo(e: Student) {
    this.isReject = false;
    console.log('in ShowInfo ', e);
    this.commentValue = '无评论';
    this.teacherSrvc.getStudentInfo(e.sid).subscribe((v) => {
      this.currentSelectedStudent = v.body;
      this.teacherSrvc.getStudentFileList(e.sid).subscribe((v) => {
        this.fileList = v.body;
        this.isVisibleShowInfo = true;
      });
    });
  }
  handleOkShowInfo(): void {
    this.isVisibleShowInfo = false;
    this.isReject = false;
    this.commentValue = '无评论';
  }

  showModalShowComment(e: Student) {
    console.log('in ShowComment ', e);
    this.currentSelectedStudent = e;
    this.teacherSrvc.getStudentInfo(e.sid).subscribe((v) => {
      this.commentList = v.body.Comment;
      this.isVisibleShowComment = true;
    });
  }
  handleOkShowComment(): void {
    this.isVisibleShowComment = false;
  }

  resetSid(): void {
    this.searchSidValue = '';
    this.searchSid();
  }
  searchSid(): void {
    this.visibleSearchSid = false;
    this.currentDisplayStudentList = this.studentList!.filter(
      (item: Student) => String(item.sid).indexOf(this.searchSidValue) !== -1
    );
  }

  //按状态搜索
  resetName(): void {
    this.searchNameValue = '';
    this.searchName();
  }
  searchName(): void {
    this.visibleSearchName = false;
    this.currentDisplayStudentList = this.studentList!.filter(
      (item: Student) => String(item.pass!).indexOf(this.searchNameValue) !== -1
    );
  }

  pass(student: Student) {
    this.teacherSrvc.setStudentPass(student.sid).subscribe((_) => {
      this.message.success(`成功设置学生 ${student.name} 获得奖学金`);
      this.ngOnInit();
      this.isVisibleShowInfo = false;
    });
  }

  reject(student: Student, comment: string) {
    this.teacherSrvc.setStudentReject(student.sid, comment).subscribe((_) => {
      this.message.success(`成功拒绝学生 ${student.name} 的奖学金申请`);
      this.ngOnInit();
      this.isVisibleShowInfo = false;
    });
  }

  downloadUpload(data: FileList) {
    this.teacherSrvc.getStudentFile(data.studentSid, data.fid);
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
