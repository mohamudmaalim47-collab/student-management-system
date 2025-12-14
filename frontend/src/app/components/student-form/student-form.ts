import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student';
import { Student } from '../../models/student';

@Component({
  selector: 'app-student-form',
  standalone: false,
  templateUrl: './student-form.html',
  styleUrl: './student-form.css',
})
export class StudentForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  studentId?: number;
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('🔧 StudentForm constructor called');
    
    this.form = this.fb.group({
      student_id: ['', [Validators.required, Validators.maxLength(20)]],
      first_name: ['', [Validators.required, Validators.maxLength(100)]],
      last_name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      date_of_birth: ['', Validators.required],
      class_name: ['', Validators.required]
    });
    
    console.log('✅ Form created');
  }

  ngOnInit(): void {
    console.log('🚀 StudentForm ngOnInit started');
    
    // TEST: Force show form after 2 seconds
    setTimeout(() => {
      console.log('⏰ DEBUG: 2 second timeout fired');
      if (this.loading) {
        console.log('⚠️ DEBUG: Still loading, forcing stop');
        this.loading = false;
        this.cdr.detectChanges();
        this.form.patchValue({
          student_id: 'TIMEOUT123',
          first_name: 'Timeout',
          last_name: 'Test',
          email: 'timeout@test.com',
          date_of_birth: '2000-01-01',
          class_name: 'Timeout Class'
        });
      }
    }, 2000);
    
    this.route.params.subscribe(params => {
      console.log('📍 DEBUG: Route params:', params);
      if (params['id']) {
        this.isEditMode = true;
        this.studentId = +params['id'];
        console.log('📝 DEBUG: Edit mode, ID:', this.studentId);
        this.loadStudent(this.studentId);
      }
    });
  }

  loadStudent(id: number): void {
    console.log('⚡ Loading student ID:', id);
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();
    
    this.studentService.get(id).subscribe({
      next: (student) => {
        console.log('✅ Student data received:', student);
        
        this.form.patchValue({
          student_id: student.student_id || '',
          first_name: student.first_name || '',
          last_name: student.last_name || '',
          email: student.email || '',
          date_of_birth: student.date_of_birth || '',
          class_name: student.class_name || ''
        });
        
        this.loading = false;
        this.cdr.detectChanges();
        console.log('✅ Loading set to false');
      },
      error: (err) => {
        console.error('❌ Error loading student:', err);
        this.error = `Failed to load student: ${err.message || 'Unknown error'}`;
        this.loading = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.form.patchValue({
            student_id: 'TEST' + id,
            first_name: 'Test',
            last_name: 'Student',
            email: 'test@example.com',
            date_of_birth: '2000-01-01',
            class_name: 'Test Class'
          });
          console.log('📝 Loaded test data');
        }, 100);
      },
      complete: () => {
        console.log('✅ Student load complete');
        setTimeout(() => {
          if (this.loading) {
            console.warn('⚠️ Forcing loading to stop');
            this.loading = false;
            this.cdr.detectChanges();
          }
        }, 1000);
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';
      this.cdr.detectChanges();
      
      const studentData: Student = this.form.value;
      console.log('📤 Submitting student data:', studentData);

      if (this.isEditMode && this.studentId) {
        console.log('🔄 Calling update API for student ID:', this.studentId);
        this.studentService.update(this.studentId, studentData).subscribe({
          next: (updatedStudent) => {
            console.log('✅ Student updated successfully:', updatedStudent);
            this.loading = false;
            this.successMessage = '✅ Student updated successfully! Redirecting...';
            this.cdr.detectChanges();
            
            setTimeout(() => {
              // Force fresh navigation to ensure list refreshes
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate(['/students']);
              });
            }, 1500);
          },
          error: (err) => {
            console.error('❌ Error updating student:', err);
            console.error('❌ Error details:', err.status, err.statusText, err.message);
            this.error = `Failed to update student: ${err.status || 'Error'} - ${err.message || 'Unknown error'}`;
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        console.log('🔄 Calling create API');
        this.studentService.create(studentData).subscribe({
          next: (newStudent) => {
            console.log('✅ Student created successfully:', newStudent);
            this.loading = false;
            this.successMessage = '✅ Student created successfully! Redirecting...';
            this.cdr.detectChanges();
            
            setTimeout(() => {
              // Force fresh navigation to ensure list refreshes
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate(['/students']);
              });
            }, 1500);
          },
          error: (err) => {
            console.error('❌ Error creating student:', err);
            console.error('❌ Error details:', err.status, err.statusText, err.message);
            this.error = `Failed to create student: ${err.status || 'Error'} - ${err.message || 'Unknown error'}`;
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      }
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }

  // Helper methods for template
  get studentIdControl() { return this.form.get('student_id'); }
  get firstNameControl() { return this.form.get('first_name'); }
  get lastNameControl() { return this.form.get('last_name'); }
  get emailControl() { return this.form.get('email'); }
  get dobControl() { return this.form.get('date_of_birth'); }
  get classNameControl() { return this.form.get('class_name'); }
}