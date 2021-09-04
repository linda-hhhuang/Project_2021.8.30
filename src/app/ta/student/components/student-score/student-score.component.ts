import { Component, OnInit } from '@angular/core';
import { Student } from '@ta/model/member';
import { RequestService } from '@ta/student/services/request.service';

@Component({
  selector: 'app-student-score',
  templateUrl: './student-score.component.html',
  styleUrls: ['./student-score.component.css'],
})
export class StudentScoreComponent implements OnInit {
  constructor(private requestSrvc: RequestService) {}
  isLoading = false;
  ngOnInit(): void {}

  exportCvs() {
    this.isLoading = true;
    let title = ['姓名', '学号', '自评分数', '状态'];
    let titleForKey = ['name', 'sid', 'score', 'status'];
    this.requestSrvc.getPublicity().subscribe((v) => {
      this.isLoading = false;
      let data = v.body.map((v: Student) => {
        return {
          name: v.name,
          sid: v.sid,
          score: v.score,
          status:
            v.status == 2 || v.status == 3 ? '获得奖学金' : '未获得奖学金',
        };
      });
      // console.log(data);
      let str = [];
      str.push(title.join(',') + '\n');
      for (let i = 0; i < data.length; i++) {
        let temp: any[] = [];
        for (let j = 0; j < titleForKey.length; j++) {
          if (j == 1) temp.push('\t' + data[i][titleForKey[j]]);
          else temp.push(data[i][titleForKey[j]]);
        }
        str.push(temp.join(',') + '\n');
      }
      let uri =
        'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str.join(''));
      let downloadLink = document.createElement('a');
      downloadLink.href = uri;
      downloadLink.download =
        new Date().toISOString().substring(0, 10) + '-奖学金公示名单.csv';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
}
