import { NzUploadFile } from 'ng-zorro-antd/upload';

export interface Comment {
  [index: string]: any;
  cid: number;
  comment: string;
  studentSid: number;
  reviewerSid: number;
  date: string;
}

export interface Student {
  [index: string]: any;
  sid: number;
  name: string;
  class: string;
  description: string;
  status: number;
  //   Wait
  //   Reject
  //   Pass
  //   Validate
  score: string;
  Comment: Comment[];
}

export interface Teacher {
  [index: string]: any;
  sid: number;
  name: string;
  class: string;
  Comment: Comment[];
}

export type FileList = {
  [index: string]: number | string | NzUploadFile;
  fid: string;
  filename: string;
  studentSid: number;
  date: string;
  nzUpload: NzUploadFile;
};
