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
        next: (response) => {},
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  setClassValidate(className: string) {
    return this.api.put<any>(`/admin/class/${className}/pass`, null).pipe(
      tap({
        next: (response) => {},
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteStudent(sid: number) {
    return this.api.delete<any>(`/admin/student/${sid}`).pipe(
      tap({
        next: (response) => {},
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getTeacherList() {
    return this.api.get<any>('/admin/reviewer/list').pipe(
      tap({
        next: (response) => {
          // this.studentList.next(response.body);
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
        next: (response) => {},
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  private handleError(error: string) {
    this.notify.error('??????', error);
    if (error == '?????????') {
      location.reload();
    }
  }
}
