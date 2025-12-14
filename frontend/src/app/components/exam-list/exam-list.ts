import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam';
import { StudentService } from '../../services/student';
import { Exam } from '../../models/exam';
import { Student } from '../../models/student';

@Component({
  selector: 'app-exam-list',
  standalone: false,
  templateUrl: './exam-list.html',
  styleUrl: './exam-list.css',
})
export class ExamList implements OnInit {
  exams: Exam[] = [];
  students: Student[] = [];
  loading = false;
  error = '';
  
  selectedStudent: string = 'all';
  selectedSubject: string = 'all';
  selectedTerm: string = 'all';
  
  subjects: string[] = [];
  terms: string[] = ['Term1', 'Term2', 'Term3'];

  constructor(
    private examService: ExamService,
    private studentService: StudentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🚀 ExamList ngOnInit - Loading data');
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();
    
    this.studentService.getAll().subscribe({
      next: (studentData) => {
        console.log('✅ Students loaded:', studentData.length);
        this.students = studentData;
        
        this.examService.getAll().subscribe({
          next: (examData) => {
            console.log('✅ Exams loaded:', examData.length);
            this.exams = examData.map(exam => ({
              ...exam,
              percentage: this.calculatePercentage(exam),
              grade: this.getGrade(this.calculatePercentage(exam))
            }));
            
            this.subjects = [...new Set(this.exams.map(e => e.subject))];
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('❌ Error loading exams:', err);
            this.error = 'Failed to load exam records.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('❌ Error loading students:', err);
        this.error = 'Failed to load student data.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getFilteredExams(): Exam[] {
    return this.exams.filter(exam => {
      if (this.selectedStudent !== 'all' && exam.student !== +this.selectedStudent) {
        return false;
      }
      
      if (this.selectedSubject !== 'all' && exam.subject !== this.selectedSubject) {
        return false;
      }
      
      if (this.selectedTerm !== 'all' && exam.term !== this.selectedTerm) {
        return false;
      }
      
      return true;
    });
  }

  onFilterChange(): void {
    this.cdr.detectChanges();
  }

  deleteExam(id: number): void {
    if (confirm('Are you sure you want to delete this exam record?')) {
      this.examService.delete(id).subscribe({
        next: () => {
          this.exams = this.exams.filter(e => e.id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error deleting exam:', err);
          alert('Failed to delete exam record.');
        }
      });
    }
  }

  getStudentName(studentId: number): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown';
  }

  getStudentById(studentId: number): Student | undefined {
    return this.students.find(s => s.id === studentId);
  }

  getTermDisplay(term: string): string {
    const termMap: { [key: string]: string } = {
      'Term1': 'Term 1',
      'Term2': 'Term 2', 
      'Term3': 'Term 3'
    };
    return termMap[term] || term;
  }

  calculatePercentage(exam: Exam): number {
    return (exam.marks / exam.max_marks) * 100;
  }

  getGrade(percentage: number): string {
    if (percentage >= 80) return 'A';
    if (percentage >= 75) return 'A-';
    if (percentage >= 70) return 'B+';
    if (percentage >= 65) return 'B';
    if (percentage >= 60) return 'B-';
    if (percentage >= 55) return 'C+';
    if (percentage >= 50) return 'C';
    if (percentage >= 45) return 'C-';
    if (percentage >= 40) return 'D';
    return 'E';
  }

  getGradeColor(grade: string): string {
    const gradeColors: { [key: string]: string } = {
      'A': 'success',
      'A-': 'success',
      'B+': 'success',
      'B': 'info',
      'B-': 'info',
      'C+': 'warning',
      'C' : 'warning',
      'C-': 'warning',
      'D': 'danger',
      'E': 'danger'
    };
    return gradeColors[grade] || 'secondary';
  }

  addExam(): void {
    this.router.navigate(['/exams/add']);
  }

  editExam(id: number): void {
    this.router.navigate(['/exams/edit', id]);
  }

  refreshList(): void {
    console.log('🔄 Manually refreshing exam list');
    this.loadData();
  }
}