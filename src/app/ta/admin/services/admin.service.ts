import { Injectable, Optional, SkipSelf } from '@angular/core';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    @SkipSelf()
    @Optional()
    adminSrvc: AdminService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (adminSrvc) {
      throw new Error(
        'You should not importAdminService which is already imported in root!'
      );
    }
  }

  getStudentList() {
    return this.api.get<any>('/admin/student/list').pipe(
      tap({
        next: (response) => {
          // this.studentList.next(response.body);
          console.log('in Student service getStudentList', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getStudentInfo(sid: number) {
    return this.api.get<any>(`/admin/student/${sid}`).pipe(
      tap({
        next: (response) => {
          // this.studentInfo.next(response.body);
          console.log('in Student service getStudentInfo', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getStudentFileList(sid: number) {
    return this.api.get<any>(`/admin/student/${sid}/files`).pipe(
      tap({
        next: (response) => {
          // this.studentFileList.next(response.body);
          console.log('in Student service getStudentFileList', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getStudentFile(sid: number, fid: string) {
    window.location.href = `/api/admin/student/${sid}/files/${fid}`;
  }

  setStudentValidate(sid: number) {
    return this.api.put<any>(`/admin/student/${sid}/validate`, null).pipe(
      tap({
        next: (response) => {
          console.log('in Student service setStudentValidate', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteStudent(sid: number) {
    return this.api.delete<any>(`/admin/student/${sid}`).pipe(
      tap({
        next: (response) => {
          console.log('in Student service deleteStudent', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getTeacherList() {
    return this.api.get<any>('/admin/student/list').pipe(
      tap({
        next: (response) => {
          // this.studentList.next(response.body);
          console.log('in Teacher service getTeacherList', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getTeacherInfo(sid: number) {
    return this.api.get<any>(`/admin/reviewer/${sid}`).pipe(
      tap({
        next: (response) => {
          // this.reviewerInfo.next(response.body);
          console.log('in Teacher service getTeacherInfo', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteTeacher(sid: number) {
    return this.api.delete<any>(`/admin/reviewer/${sid}`).pipe(
      tap({
        next: (response) => {
          console.log('in Teacher service deleteTeacher', response);
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
