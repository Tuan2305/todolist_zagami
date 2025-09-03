import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Student } from '../models/student.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StudentQueryObject {
  searchCode?: string;
  searchName?: string;
  searchClass?: string;
  searchMajor?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedStudents {
  students: Student[]; // Bây giờ students trong đây cũng sẽ có ngaySinh là Date
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:5018/api/student'; // Đảm bảo đúng cổng backend của bạn

  constructor(private http: HttpClient) { }

  // Hàm tiện ích để chuyển đổi ngaySinh từ string (API) sang Date (Angular)
  private convertStudentDates(student: any): Student {
    // Backend trả về ngaySinh dưới dạng string (ví dụ: "2000-01-15T00:00:00")
    // Frontend cần chuyển nó thành Date object
    return {
      ...student,
      ngaySinh: student.ngaySinh ? new Date(student.ngaySinh) : student.ngaySinh // Nếu ngaySinh là null/undefined thì giữ nguyên
    };
  }

  getAllStudents(queryObject: StudentQueryObject): Observable<PaginatedStudents> {
    let params = new HttpParams();
    if (queryObject.pageNumber !== undefined) params = params.set('pageNumber', queryObject.pageNumber.toString());
    if (queryObject.pageSize !== undefined) params = params.set('pageSize', queryObject.pageSize.toString());
    if (queryObject.searchCode) params = params.set('searchCode', queryObject.searchCode);
    if (queryObject.searchName) params = params.set('searchName', queryObject.searchName);
    if (queryObject.searchClass) params = params.set('searchClass', queryObject.searchClass);
    if (queryObject.searchMajor) params = params.set('searchMajor', queryObject.searchMajor);
    if (queryObject.sortBy) params = params.set('sortBy', queryObject.sortBy);
    if (queryObject.sortOrder) params = params.set('sortOrder', queryObject.sortOrder);

    return this.http.get<any[]>(this.apiUrl, { params, observe: 'response' }).pipe( // <-- Sử dụng any[] tạm thời cho body
      map(response => {
        const totalCount = parseInt(response.headers.get('X-Pagination-Total-Count') || '0', 10);
        const pageSize = parseInt(response.headers.get('X-Pagination-Page-Size') || '10', 10);
        const currentPage = parseInt(response.headers.get('X-Pagination-Current-Page') || '1', 10);
        const totalPages = parseInt(response.headers.get('X-Pagination-Total-Pages') || '1', 10);

        // Ánh xạ từng sinh viên để chuyển đổi ngaySinh
        const students = (response.body || []).map(this.convertStudentDates);

        return {
          students: students, // Đã là Student[] với ngaySinh là Date
          totalCount,
          pageSize,
          currentPage,
          totalPages
        };
      })
    );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe( // <-- Sử dụng any tạm thời
      map(this.convertStudentDates) // Chuyển đổi ngaySinh sang Date
    );
  }

  addStudent(student: Omit<Student, 'id'>): Observable<Student> {
    // student.ngaySinh bây giờ là Date object, chuyển thành ISO string để gửi lên backend
    const studentToSend = {
        ...student,
        ngaySinh: student.ngaySinh ? student.ngaySinh.toISOString() : null // Nếu ngaySinh là Date, chuyển đổi
    };
    return this.http.post<any>(`${this.apiUrl}/create`, studentToSend).pipe( // <-- Sử dụng any tạm thời
      map(this.convertStudentDates) // Chuyển đổi ngaySinh của phản hồi sang Date
    );
  }

  updateStudent(updatedStudent: Student): Observable<Student> {
    // updatedStudent.ngaySinh bây giờ là Date object, chuyển thành ISO string
    const studentToSend = {
        ...updatedStudent,
        ngaySinh: updatedStudent.ngaySinh ? updatedStudent.ngaySinh.toISOString() : null
    };
    return this.http.put<any>(`${this.apiUrl}/update/${updatedStudent.id}`, studentToSend).pipe( // <-- Sử dụng any tạm thời
      map(this.convertStudentDates) // Chuyển đổi ngaySinh của phản hồi sang Date
    );
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}