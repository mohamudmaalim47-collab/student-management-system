// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { StudentList } from './components/student-list/student-list';
// import { StudentForm } from './components/student-form/student-form';
// import { ExamList } from './components/exam-list/exam-list';
// import { ExamForm } from './components/exam-form/exam-form';

// const routes: Routes = [
//   { path: '', redirectTo: '/students', pathMatch: 'full' },
//   { 
//     path: 'students', 
//     component: StudentList,
//     data: { reuse: false }  // Force reload
//   },
//   { 
//     path: 'students/add', 
//     component: StudentForm,
//     data: { reuse: false }
//   },
//   { 
//     path: 'students/edit/:id', 
//     component: StudentForm,
//     data: { reuse: false }
//   },
//   { 
//     path: 'exams', 
//     component: ExamList,
//     data: { reuse: false }
//   },
//   { 
//     path: 'exams/add', 
//     component: ExamForm,
//     data: { reuse: false }
//   },
//   { 
//     path: 'exams/edit/:id', 
//     component: ExamForm,
//     data: { reuse: false }
//   },
//   { path: '**', redirectTo: '/students' } // Fallback
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes, { 
//     onSameUrlNavigation: 'reload',  // Enable reload on same URL
//     enableTracing: false  // Set to true for debug
//   })],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { StudentList } from './components/student-list/student-list';
import { StudentForm } from './components/student-form/student-form';
import { ExamList } from './components/exam-list/exam-list';
import { ExamForm } from './components/exam-form/exam-form';
import { StudentResults } from './components/student-results/student-results';


@NgModule({
  declarations: [
    App,
    StudentList,
    StudentForm,
    ExamList,
    ExamForm,
    StudentResults
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }