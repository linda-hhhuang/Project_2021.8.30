import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Student, FileList } from '@ta/model/member';
@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private fileList = new BehaviorSubject<FileList[] | null>(null);
  fileList$ = this.fileList.asObservable();

  private currentStudent = new BehaviorSubject<Student | null>(null);
  currentStudent$ = this.currentStudent.asObservable();

  constructor(
    @SkipSelf()
    @Optional()
    requestSrvc: RequestService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (requestSrvc) {
      throw new Error(
        'You should not import requestSrvc which is already imported in root!'
      );
    }
  }

  //学生端
  getStudentInfo() {
    return this.api.get<any>('/student/me').pipe(
      tap({
        next: (response) => {
          console.log('in request service getStudentInfo', response);
          this.currentStudent.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  updateStudentInfo(update: Student) {
    return this.api
      .put<any>('student/me', {
        description: update.description,
        score: update.score,
      })
      .pipe(
        tap({
          next: (response) => {
            this.currentStudent.next(response.body);
            console.log('in request service updateStudentInfo ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  uploadFile(data: FormData) {
    return this.api.post<any>('/student/me/files', data).pipe(
      tap({
        next: (response) => {
          this.getUploadFileList().subscribe();
          console.log('in request service updateStudentInfo ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getUploadFileList() {
    return this.api.get<any>('student/me/files').pipe(
      tap({
        next: (response) => {
          this.fileList.next(response.body);
          console.log('in request service getUploadFileList ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteUpload(fid: string) {
    return this.api.delete<any>(`/student/me/files/${fid}`).pipe(
      tap({
        next: (response) => {
          this.getUploadFileList().subscribe();
          console.log('in request service deleteUpload ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  studentdownloadUpload(fid: string) {
    window.location.href = `/api/student/me/files/${fid}`;
  }

  getPublicity() {
    return this.api.get<any>('student/publicity').pipe(
      tap({
        next: (response) => {
          console.log('in request service getPublicity', response);
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
