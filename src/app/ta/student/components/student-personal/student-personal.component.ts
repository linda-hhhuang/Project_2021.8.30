import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { filter, map } from 'rxjs/operators';
import { RequestService } from '@ta/student/services/request.service';
import { FileList, Student, Comment } from '@ta/model/member';

@Component({
  selector: 'app-student-personal',
  templateUrl: './student-personal.component.html',
  styleUrls: ['./student-personal.component.css'],
})
export class StudentPersonalComponent implements OnInit {
  commentList: Comment[] = [];

  isVisibleUpdateInfo = false;
  isOkLoadingUpdateInfo = false;

  isVisibleUpload = false;
  isOkLoadingUpload = false;

  isVisibleComment = false;
  isOkLoadingComment = false;

  currentStudentInfo!: Student;

  fileList: NzUploadFile[] = [];
  displayFileList: FileList[] = [];

  uploading = false; // 初始值

  currentStatus: number = 0;
  status = [
    '等待评审',
    '被拒绝,请查看评论',
    '奖学金评审通过,请查看结果公示',
    '奖学金辅导员评定通过,请查看结果公示',
  ];
  AntdStatus = function (v: number) {
    switch (v) {
      case 0:
        return 'warning';
      case 1:
        return 'danger';
      case 2:
        return 'success';
      case 3:
        return 'success';
      default:
        return undefined;
    }
  };

  constructor(
    private requestrSrvc: RequestService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.requestrSrvc.getStudentInfo().subscribe((v) => {
      this.currentStudentInfo = v.body;
      this.currentStatus = this.currentStudentInfo.status;
    });
  }

  //报名表
  showModalUpdateInfo(): void {
    this.requestrSrvc.getStudentInfo().subscribe((v) => {
      this.isVisibleUpdateInfo = true;
      this.currentStudentInfo = v.body;
    });
  }
  handleOkUpdateInfo(): void {
    this.isOkLoadingUpdateInfo = true;

    // if (this.currentStudentInfo.SignupTemplate.description.length > 300) {
    //   this.message.error('申请人个人陈述字数不能超过300个字!');
    //   this.isOkLoadingUpdateInfo = false;
    //   return;
    // }
    this.requestrSrvc
      .updateStudentInfo(this.currentStudentInfo)
      .subscribe((response) => {
        this.message.success('成功提交/更新奖学金申请！');
        this.isOkLoadingUpdateInfo = false;
        this.isVisibleUpdateInfo = false;
        this.ngOnInit();
      });
  }
  handleCancelUpdateInfo(): void {
    this.isOkLoadingUpdateInfo = false;
    this.isVisibleUpdateInfo = false;
  }

  //文件
  showModalUpload(): void {
    this.requestrSrvc.getUploadFileList().subscribe((v) => {
      this.displayFileList = v.body;
      this.isVisibleUpload = true;
    });
  }
  handleOkUpload(): void {
    this.isVisibleUpload = false;
  }

  //评论
  showModalComment(): void {
    this.requestrSrvc.getStudentInfo().subscribe((v) => {
      this.commentList = v.body.Comment;
      this.isVisibleComment = true;
    });
  }
  handleOkComment(): void {
    this.isVisibleComment = false;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    // 对上传文件大小进行限制

    const isLt10M = file.size! / 1024 / 1024 < 10;
    if (!isLt10M) {
      this.message.warning('文件必须在10M以内');
      this.uploading = false;
      this.fileList = [];
      return false;
    }
    this.fileList = this.fileList.concat(file);

    return false;
  };

  handleUpload(): void {
    // 手动上传
    this.fileList.forEach((file: any) => {
      this.uploading = true; // 修改上传按钮状态
      const formData = new FormData();
      formData.append('file', file);

      this.requestrSrvc.uploadFile(formData).subscribe((_) => {
        this.uploading = false;
        this.message.success(
          `${file.name} 上传完毕,请在下方检查成功上传的文件`
        );
        this.requestrSrvc.getUploadFileList().subscribe((v) => {
          this.displayFileList = v.body;
          this.isVisibleUpload = true;
        });
      });
    });
    this.fileList = [];
  }

  deleteUploadConfirm(data: FileList) {
    this.requestrSrvc.deleteUpload(data.fid).subscribe((_) => {
      this.requestrSrvc.getUploadFileList().subscribe((v) => {
        this.displayFileList = v.body;
        this.isVisibleUpload = true;
      });
      this.message.success(`成功删除 ${data.filename} `);
    });
  }

  deleteUploadCancel() {}

  downloadUpload(data: FileList) {
    this.requestrSrvc.studentdownloadUpload(data.fid);
  }

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
