import { Component, OnInit } from '@angular/core';
import { Student } from '@ta/model/member';
import { AdminService } from '@ta/admin/services/admin.service';
@Component({
  selector: 'app-admin-export',
  templateUrl: './admin-export.component.html',
  styleUrls: ['./admin-export.component.css'],
})
export class AdminExportComponent implements OnInit {
  constructor(private adminSrvc: AdminService) {}

  isLoading = false;
  ngOnInit(): void {}

  exportCvs() {
    this.isLoading = true;
    let title = ['姓名', '学号', '班级', '自评分数', '状态'];

    let titleForKey = ['name', 'sid', 'class', 'score', 'status'];
    this.adminSrvc.getStudentList().subscribe((v) => {
      this.isLoading = false;
      let data = v.body.map((v: Student) => {
        return {
          name: v.name,
          sid: v.sid,
          class: v.class,
          score: v.score,
          status:
            v.status == 2 || v.status == 3 ? '获得奖学金' : '未获得奖学金',
        };
      });
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
        new Date().toISOString().substring(0, 10) + '-奖学金评审公示结果.csv';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
}
