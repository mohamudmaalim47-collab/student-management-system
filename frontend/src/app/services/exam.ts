import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Exam } from '../models/exam';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:8000/api/exam-records/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Exam[]> {
    console.log('Fetching all exams from:', this.apiUrl);
    return this.http.get<Exam[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching exams:', error);
        return throwError(() => error);
      })
    );
  }

  get(id: number): Observable<Exam> {
    console.log('Fetching exam ID:', id);
    return this.http.get<Exam>(`${this.apiUrl}${id}/`).pipe(
      catchError(error => {
        console.error('Error fetching exam:', error);
        return throwError(() => error);
      })
    );
  }

  create(data: Exam): Observable<Exam> {
    console.log('Creating exam:', data);
    return this.http.post<Exam>(this.apiUrl, data).pipe(
      catchError(error => {
        console.error('Error creating exam:', error);
        return throwError(() => error);
      })
    );
  }

  update(id: number, data: Exam): Observable<Exam> {
    console.log('Updating exam ID:', id, 'with:', data);
    return this.http.put<Exam>(`${this.apiUrl}${id}/`, data).pipe(
      catchError(error => {
        console.error('Error updating exam:', error);
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<void> {
    console.log('Deleting exam ID:', id);
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      catchError(error => {
        console.error('Error deleting exam:', error);
        return throwError(() => error);
      })
    );
  }
}