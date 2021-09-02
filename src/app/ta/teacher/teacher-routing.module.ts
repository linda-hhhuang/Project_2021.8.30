import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherApplyComponent } from './components/teacher-apply/teacher-apply.component';
import { TeacherMainComponent } from './components/teacher-main/teacher-main.component';
import { TeacherHomeComponent } from './components/teacher-home/teacher-home.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherMainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: TeacherHomeComponent },
      {
        path: 'member',
        component: TeacherApplyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
