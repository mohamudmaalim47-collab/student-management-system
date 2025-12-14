import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentList } from './components/student-list/student-list';
import { StudentForm } from './components/student-form/student-form';
import { ExamList } from './components/exam-list/exam-list';
import { ExamForm } from './components/exam-form/exam-form';
import { StudentResults } from './components/student-results/student-results';


const routes: Routes = [
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { 
    path: 'students', 
    component: StudentList,
    data: { reuse: false }
  },
  { 
    path: 'students/add', 
    component: StudentForm,
    data: { reuse: false }
  },
  { 
    path: 'students/edit/:id', 
    component: StudentForm,
    data: { reuse: false }
  },
  { 
    path: 'exams', 
    component: ExamList,
    data: { reuse: false }
  },
  { 
    path: 'exams/add', 
    component: ExamForm,
    data: { reuse: false }
  },
  { 
    path: 'exams/edit/:id', 
    component: ExamForm,
    data: { reuse: false }
  },

  {
    path: 'results',
    component: StudentResults,
    data: { reuse: false }
  },
  { path: '**', redirectTo: '/students' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    onSameUrlNavigation: 'reload',
    enableTracing: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }