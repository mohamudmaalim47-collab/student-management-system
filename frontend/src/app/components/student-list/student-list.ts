import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student';
import { Student } from '../../models/student';

@Component({
  selector: 'app-student-list',
  standalone: false,
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {
  students: Student[] = [];
  loading = false;
  error = '';

  constructor(
    private studentService: StudentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    console.log('🔧 StudentList constructor called');
  }

  ngOnInit(): void {
    console.log('🚀 StudentList ngOnInit - Loading students');
    this.loadStudents();
  }

  loadStudents(): void {
    console.log('🔄 Starting to load students...');
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();
    
    this.studentService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Students loaded:', data);
        this.students = data;
        this.loading = false;
        console.log(`✅ Loaded ${data.length} students`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error loading students:', err);
        console.error('❌ Error details:', err.status, err.message);
        this.error = 'Error loading students. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.delete(id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (err) => {
          console.error('Error deleting student:', err);
          alert('Failed to delete student.');
        }
      });
    }
  }

  editStudent(id: number): void {
    this.router.navigate(['/students/edit', id]);
  }

  addStudent(): void {
    this.router.navigate(['/students/add']);
  }

  refreshList(): void {
    console.log('🔄 Manually refreshing student list');
    this.loadStudents();
  }
}