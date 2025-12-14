export interface Exam {
    id?: number;
    student: number;
    subject: string;
    term: string;
    marks: number;
    max_marks: number;
    exam_date: string;
    
    // Add these optional properties
    percentage?: number;
    grade?: string;
    student_id?: string;  // For display
    student_name?: string; // For display
}