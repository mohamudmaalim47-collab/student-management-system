import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../services/exam';
import { StudentService } from '../../services/student';
import { Exam } from '../../models/exam';
import { Student } from '../../models/student';

@Component({
  selector: 'app-exam-form',
  standalone: false,
  templateUrl: './exam-form.html',
  styleUrl: './exam-form.css',
})
export class ExamForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  examId?: number;
  loading = false;
  loadingStudents = false;
  error = '';
  successMessage = '';
  students: Student[] = [];
  terms = ['Term1', 'Term2', 'Term3'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('🔧 ExamForm constructor called');
    
    this.form = this.fb.group({
      student: [null, Validators.required],
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      term: ['', Validators.required],
      marks: [null, [Validators.required, Validators.min(0)]],
      max_marks: [null, [Validators.required, Validators.min(1)]],
      exam_date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('🚀 ExamForm ngOnInit started');
    
    // Start with empty to avoid template issues
    this.students = [];
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.examId = +params['id'];
        this.loadExam(this.examId);
      } else {
        // Only load students for new exam forms
        this.loadStudents();
      }
    });
  }

  loadStudents(): void {
    console.log('🔄 Loading students for dropdown...');
    this.loadingStudents = true;
    this.cdr.detectChanges();
    
    const timeout = setTimeout(() => {
      if (this.loadingStudents) {
        console.warn('⚠️ Student load timeout - using test data');
        this.students = [
          { id: 1, student_id: 'TEST001', first_name: 'Test', last_name: 'Student', email: 'test@example.com', date_of_birth: '2000-01-01', class_name: 'Test Class' },
          { id: 2, student_id: 'TEST002', first_name: 'Demo', last_name: 'User', email: 'demo@example.com', date_of_birth: '2001-01-01', class_name: 'Demo Class' }
        ];
        this.loadingStudents = false;
        this.cdr.detectChanges();
      }
    }, 3000);

    this.studentService.getAll().subscribe({
      next: (data) => {
        clearTimeout(timeout);
        console.log('✅ Students loaded for dropdown:', data);
        
        if (data && data.length > 0) {
          this.students = data;
          console.log(`✅ Loaded ${data.length} students from API`);
        } else {
          console.log('📝 No students from API, using fallback data');
          this.students = [
            { id: 1, student_id: 'STU001', first_name: 'John', last_name: 'Doe', email: 'john@example.com', date_of_birth: '2000-01-01', class_name: '10A' },
            { id: 2, student_id: 'STU002', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', date_of_birth: '2001-01-01', class_name: '10B' }
          ];
        }
        this.loadingStudents = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        clearTimeout(timeout);
        console.error('❌ Error loading students:', err);
        
        // Fallback to test data
        this.students = [
          { id: 1, student_id: 'STU001', first_name: 'John', last_name: 'Doe', email: 'john@example.com', date_of_birth: '2000-01-01', class_name: '10A' },
          { id: 2, student_id: 'STU002', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', date_of_birth: '2001-01-01', class_name: '10B' }
        ];
        
        this.error = `Failed to load students: ${err.status || 'Connection error'}. Using test data.`;
        this.loadingStudents = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadExam(id: number): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.examService.get(id).subscribe({
      next: (exam) => {
        console.log('✅ Exam data loaded:', exam);
        
        // Load students first, then patch form
        this.loadStudents();
        
        // Format date for input field
        const examDate = new Date(exam.exam_date);
        const formattedDate = examDate.toISOString().split('T')[0];
        
        // Patch values after students are loaded
        setTimeout(() => {
          this.form.patchValue({
            student: exam.student,
            subject: exam.subject,
            term: exam.term,
            marks: exam.marks,
            max_marks: exam.max_marks,
            exam_date: formattedDate
          });
          this.loading = false;
          this.cdr.detectChanges();
        }, 500);
      },
      error: (err) => {
        console.error('Error loading exam:', err);
        this.error = 'Failed to load exam data.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculatePreview(): string {
    const marks = this.form.get('marks')?.value;
    const maxMarks = this.form.get('max_marks')?.value;
    
    if (marks !== null && marks !== undefined && 
        maxMarks !== null && maxMarks !== undefined && 
        maxMarks > 0) {
      const percentage = (marks / maxMarks) * 100;
      return `${marks}/${maxMarks} = ${percentage.toFixed(1)}%`;
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';
      this.cdr.detectChanges();
      
      const examData: Exam = this.form.value;
      console.log('📤 Submitting exam data:', examData);

      if (this.isEditMode && this.examId) {
        this.examService.update(this.examId, examData).subscribe({
          next: (updatedExam) => {
            console.log('✅ Exam updated successfully');
            this.successMessage = '✅ Exam record updated successfully! Redirecting...';
            this.loading = false;
            this.cdr.detectChanges();
            
            setTimeout(() => {
              this.router.navigate(['/exams']);
            }, 1500);
          },
          error: (err) => {
            console.error('Error updating exam:', err);
            this.error = `Failed to update exam: ${err.status || 'Error'} - ${err.message || 'Unknown error'}`;
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.examService.create(examData).subscribe({
          next: (newExam) => {
            console.log('✅ Exam created successfully');
            this.successMessage = '✅ Exam record created successfully! Redirecting...';
            this.loading = false;
            this.cdr.detectChanges();
            
            setTimeout(() => {
              this.router.navigate(['/exams']);
            }, 1500);
          },
          error: (err) => {
            console.error('Error creating exam:', err);
            this.error = `Failed to create exam: ${err.status || 'Error'} - ${err.message || 'Unknown error'}`;
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      }
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      this.cdr.detectChanges();
    }
  }

  cancel(): void {
    this.router.navigate(['/exams']);
  }

  getTermDisplay(term: string): string {
    const termMap: { [key: string]: string } = {
      'Term1': 'Term 1',
      'Term2': 'Term 2',
      'Term3': 'Term 3'
    };
    return termMap[term] || term;
  }

  get studentControl() { return this.form.get('student'); }
  get subjectControl() { return this.form.get('subject'); }
  get termControl() { return this.form.get('term'); }
  get marksControl() { return this.form.get('marks'); }
  get maxMarksControl() { return this.form.get('max_marks'); }
  get examDateControl() { return this.form.get('exam_date'); }
}