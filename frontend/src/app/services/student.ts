import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8000/api/students/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Student[]> {
    console.log('Fetching all students from:', this.apiUrl);
    return this.http.get<Student[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching students:', error);
        return throwError(() => error);
      })
    );
  }

  get(id: number): Observable<Student> {
    console.log('Fetching student ID:', id, 'from:', `${this.apiUrl}${id}/`);
    return this.http.get<Student>(`${this.apiUrl}${id}/`).pipe(
      catchError(error => {
        console.error('Error fetching student:', error);
        console.error('Status:', error.status, 'Message:', error.message);
        return throwError(() => error);
      })
    );
  }

  getById(id: number): Observable<Student> {
    return this.get(id);
  }

  create(data: Student): Observable<Student> {
    console.log('Creating student:', data);
    return this.http.post<Student>(this.apiUrl, data).pipe(
      catchError(error => {
        console.error('Error creating student:', error);
        return throwError(() => error);
      })
    );
  }

  update(id: number, data: Student): Observable<Student> {
    console.log('Updating student ID:', id, 'with:', data);
    return this.http.put<Student>(`${this.apiUrl}${id}/`, data).pipe(
      catchError(error => {
        console.error('Error updating student:', error);
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<void> {
    console.log('Deleting student ID:', id);
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      catchError(error => {
        console.error('Error deleting student:', error);
        return throwError(() => error);
      })
    );
  }
}