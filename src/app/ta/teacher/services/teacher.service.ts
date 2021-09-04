import { Injectable, Optional, SkipSelf } from '@angular/core';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  constructor(
    @SkipSelf()
    @Optional()
    teacherSrvc: TeacherService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (teacherSrvc) {
      throw new Error(
        'You should not importTeacherService which is already imported in root!'
      );
    }
  }

  getStudentList() {
    return this.api.get<any>('/reviewer/student/list').pipe(
      tap({
        next: (response) => {
          // this.studentList.next(response.body);
          console.log('in TeacherService getStudentList', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getStudentInfo(sid: number) {
    return this.api.get<any>(`/reviewer/student/${sid}`).pipe(
      tap({
        next: (response) => {
          // this.studentInfo.next(response.body);
          console.log('in TeacherService getStudentInfo', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getStudentFileList(sid: number) {
    return this.api.get<any>(`/reviewer/student/${sid}/files`).pipe(
      tap({
        next: (response) => {
          // this.studentFileList.next(response.body);
          console.log('in TeacherService getStudentFileList', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getStudentFile(sid: number, fid: string) {
    window.location.href = `/api/reviewer/student/${sid}/files/${fid}`;
  }

  setStudentPass(sid: number) {
    return this.api.put<any>(`/reviewer/student/${sid}/pass`, null).pipe(
      tap({
        next: (response) => {
          console.log('in Student service setStudentPass', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  setStudentReject(sid: number, comment: string) {
    return this.api
      .put<any>(`/reviewer/student/${sid}/reject`, {
        studentSid: sid,
        comment: comment,
      })
      .pipe(
        tap({
          next: (response) => {
            console.log('in Student service setStudentReject', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  private handleError(error: string) {
    this.notify.error('错误', error);
    if (error == '未登录') {
      location.reload();
    }
  }
}
