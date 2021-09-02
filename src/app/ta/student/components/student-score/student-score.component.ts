import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '@ta/student/services/request.service';
import { Student } from '@ta/model/member';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-student-score',
  templateUrl: './student-score.component.html',
  styleUrls: ['./student-score.component.css'],
})
export class StudentScoreComponent implements OnInit {
  isVisibleScore = false;
  isOkLoadingScore = false;

  currentPublicity!: Student;

  constructor(
    private requestrSrvc: RequestService,
    private message: NzMessageService
  ) {}
  init() {}
  ngOnInit(): void {}

  //查看公示名单
  showModalScore(): void {
    this.requestrSrvc.getPublicity().subscribe((publicity) => {
      this.currentPublicity = publicity.body;
      this.isVisibleScore = true;
      console.log('in student-score ngOnInit, data is ', publicity);
    });
  }
  handleOkScore(): void {
    this.isVisibleScore = false;
  }
}
