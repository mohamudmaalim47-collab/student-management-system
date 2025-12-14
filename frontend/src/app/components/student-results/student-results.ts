import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student';
import { ExamService } from '../../services/exam';
import { Student } from '../../models/student';
import { Exam } from '../../models/exam';

@Component({
  selector: 'app-student-results',
  standalone: false,
  templateUrl: './student-results.html',
  styleUrls: ['./student-results.css']
})
export class StudentResults implements OnInit {
  students: Student[] = [];
  exams: Exam[] = [];
  loading = false;
  error = '';
  
  // Student performance data
  studentPerformances: any[] = [];
  overallAverage: number = 0;
  
  // Selected student analytics
  selectedStudent: any = null;
  selectedStudentExams: Exam[] = [];
  showAnalytics: boolean = false;
  


  constructor(
    private studentService: StudentService,
    private examService: ExamService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🚀 Loading student results...');
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    // Load students and exams
    this.studentService.getAll().subscribe({
      next: (studentData) => {
        this.students = studentData;
        
        this.examService.getAll().subscribe({
          next: (examData) => {
            this.exams = examData;
            this.calculateStudentPerformances();
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading exams:', err);
            this.error = 'Failed to load exam records.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.error = 'Failed to load student data.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStudentPerformances(): void {
    this.studentPerformances = [];
    
    this.students.forEach(student => {
      // Get all exams for this student
      const studentExams = this.exams.filter(exam => exam.student === student.id);
      
      if (studentExams.length > 0) {
        // Calculate total marks
        const totalMarks = studentExams.reduce((sum, exam) => sum + exam.marks, 0);
        const totalMaxMarks = studentExams.reduce((sum, exam) => sum + exam.max_marks, 0);
        const averagePercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
        
        // Calculate subject-wise performance
        const subjects: any = {};
        studentExams.forEach(exam => {
          if (!subjects[exam.subject]) {
            subjects[exam.subject] = {
              marks: exam.marks,
              maxMarks: exam.max_marks,
              count: 1,
              percentage: (exam.marks / exam.max_marks) * 100
            };
          } else {
            subjects[exam.subject].marks += exam.marks;
            subjects[exam.subject].maxMarks += exam.max_marks;
            subjects[exam.subject].count += 1;
            subjects[exam.subject].percentage = 
              (subjects[exam.subject].marks / subjects[exam.subject].maxMarks) * 100;
          }
        });

        // Convert subjects object to array
        const subjectArray = Object.keys(subjects).map(subjectName => ({
          name: subjectName,
          marks: subjects[subjectName].marks,
          maxMarks: subjects[subjectName].maxMarks,
          percentage: subjects[subjectName].percentage,
          grade: this.getGrade(subjects[subjectName].percentage)
        }));

        // Get overall grade
        const overallGrade = this.getGrade(averagePercentage);

        this.studentPerformances.push({
          student,
          totalExams: studentExams.length,
          totalMarks,
          totalMaxMarks,
          averagePercentage,
          overallGrade,
          subjects: subjectArray
        });
      } else {
        // Student with no exams
        this.studentPerformances.push({
          student,
          totalExams: 0,
          totalMarks: 0,
          totalMaxMarks: 0,
          averagePercentage: 0,
          overallGrade: 'N/A',
          subjects: []
        });
      }
    });

    // Sort by average percentage (highest first)
    this.studentPerformances.sort((a, b) => b.averagePercentage - a.averagePercentage);
    
    // Calculate overall average
    this.calculateOverallAverage();
  }

  calculateOverallAverage(): void {
    if (this.studentPerformances.length === 0) {
      this.overallAverage = 0;
      return;
    }
    
    const total = this.studentPerformances.reduce((sum, sp) => sum + sp.averagePercentage, 0);
    this.overallAverage = total / this.studentPerformances.length;
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
    if (percentage > 0) return 'E';
    return 'N/A';
  }

  getGradeColor(grade: string): string {
    const gradeColors: { [key: string]: string } = {
      'A': 'success',
      'A-': 'success',
      'B+': 'success',
      'B': 'info',
      'B-': 'info',
      'C+': 'warning',
      'C': 'warning',
      'C-': 'warning',
      'D': 'danger',
      'E': 'danger',
      'N/A': 'secondary'
    };
    return gradeColors[grade] || 'secondary';
  }

  getGradeBadge(grade: string): string {
    const gradeBadges: { [key: string]: string } = {
      'A': '🏆 Excellent',
      'A-': '🥇 Very Good',
      'B+': '🥈 Good',
      'B': '🥉 Above Average',
      'B-': '📗 Average',
      'C+': '📘 Fair',
      'C': '📙 Below Average',
      'C-': '⚠️ Needs Improvement',
      'D': '🔴 Poor',
      'E': '💢 Fail',
      'N/A': '⚪ No Exams'
    };
    return gradeBadges[grade] || grade;
  }

  viewStudentAnalytics(studentId: number): void {
    // Find the selected student's performance data
    this.selectedStudent = this.studentPerformances.find(p => p.student.id === studentId);
    // Get all exams for this specific student
    this.selectedStudentExams = this.exams.filter(exam => exam.student === studentId);
    this.showAnalytics = true;
  }

  closeAnalytics(): void {
    this.showAnalytics = false;
    this.selectedStudent = null;
  }

  getMeanGrade(exams: Exam[]): string {
    if (exams.length === 0) return 'N/A';
    
    const gradePoints: { [key: string]: number } = {
      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'E': 0.0
    };
    
    let totalPoints = 0;
    exams.forEach(exam => {
      const percentage = (exam.marks / exam.max_marks) * 100;
      const grade = this.getGrade(percentage);
      totalPoints += gradePoints[grade] || 0;
    });
    
    const meanPoint = totalPoints / exams.length;
    
    if (meanPoint >= 3.7) return 'A';
    if (meanPoint >= 3.3) return 'A-';
    if (meanPoint >= 3.0) return 'B+';
    if (meanPoint >= 2.7) return 'B';
    if (meanPoint >= 2.3) return 'B-';
    if (meanPoint >= 2.0) return 'C+';
    if (meanPoint >= 1.7) return 'C';
    if (meanPoint >= 1.0) return 'C-';
    if (meanPoint >= 0.5) return 'D';
    return 'E';
  }

  getAverageScore(exams: Exam[]): string {
    if (!exams || exams.length === 0) return '0.0';
    
    const totalMarks = exams.reduce((sum, exam) => {
      const marks = Number(exam.marks) || 0;
      return sum + marks;
    }, 0);
    
    const numberOfExams = exams.length;
    
    if (numberOfExams === 0) return '0.0';
    
    const averageScore = totalMarks / numberOfExams;
    
    return isNaN(averageScore) ? '0.0' : averageScore.toFixed(1);
  }

  getNumberOfSubjects(exams: Exam[]): number {
    const subjects = new Set(exams.map(exam => exam.subject));
    return subjects.size;
  }

  getStudentRank(studentId: number): number {
    const index = this.studentPerformances.findIndex(p => p.student.id === studentId);
    return index + 1;
  }


}