import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students: Student[] = [
    { id: 1, maSv: 'SV001', hoTen: 'Nguyễn Văn A', gioiTinh: 'Nam', ngaySinh: '2000-01-15', lop: 'K18CLC1', chuyenNganh: 'Công nghệ thông tin' },
    { id: 2, maSv: 'SV002', hoTen: 'Trần Thị B', gioiTinh: 'Nữ', ngaySinh: '2001-05-20', lop: 'K18CLC2', chuyenNganh: 'Khoa học máy tính' },
    { id: 3, maSv: 'SV003', hoTen: 'Lê Văn C', gioiTinh: 'Nam', ngaySinh: '2000-11-10', lop: 'K19CLC1', chuyenNganh: 'Kỹ thuật phần mềm' },
    { id: 4, maSv: 'SV004', hoTen: 'Phạm Thị D', gioiTinh: 'Nữ', ngaySinh: '2002-03-01', lop: 'K18CLC1', chuyenNganh: 'Hệ thống thông tin' },
    { id: 5, maSv: 'SV005', hoTen: 'Hoàng Văn E', gioiTinh: 'Nam', ngaySinh: '1999-08-22', lop: 'K19CLC1', chuyenNganh: 'Công nghệ thông tin' },
    { id: 6, maSv: 'SV006', hoTen: 'Đỗ Thị F', gioiTinh: 'Nữ', ngaySinh: '2001-12-05', lop: 'K18CLC2', chuyenNganh: 'Khoa học máy tính' },
    { id: 7, maSv: 'SV007', hoTen: 'Vũ Minh G', gioiTinh: 'Nam', ngaySinh: '2000-04-18', lop: 'K19CLC1', chuyenNganh: 'Kỹ thuật phần mềm' },
    { id: 8, maSv: 'SV008', hoTen: 'Bùi Thanh H', gioiTinh: 'Nữ', ngaySinh: '2002-07-30', lop: 'K18CLC1', chuyenNganh: 'Hệ thống thông tin' },
  ];
  private nextId: number = 9;

  constructor() { }

  // Lấy toàn bộ sinh viên (chưa phân trang/sắp xếp)
  getStudents(): Observable<Student[]> {
    return of(this.students);
  }

  // Lấy sinh viên theo ID
  getStudentById(id: number): Observable<Student | undefined> {
    return of(this.students.find(s => s.id === id));
  }

  // Thêm sinh viên
  addStudent(student: Omit<Student, 'id'>): Observable<Student> {
    const newStudent: Student = { ...student, id: this.nextId++ };
    this.students.push(newStudent);
    return of(newStudent);
  }

  // Cập nhật sinh viên
  updateStudent(updatedStudent: Student): Observable<Student> {
    const index = this.students.findIndex(s => s.id === updatedStudent.id);
    if (index > -1) {
      this.students[index] = updatedStudent;
      return of(updatedStudent);
    }
    return of(null as any); // Hoặc throw error
  }

  // Xóa sinh viên
  deleteStudent(id: number): Observable<boolean> {
    const initialLength = this.students.length;
    this.students = this.students.filter(s => s.id !== id);
    return of(this.students.length < initialLength);
  }

  // Tìm kiếm theo Mã SV
  searchByCode(code: string): Observable<Student[]> {
    if (!code) {
      return of(this.students);
    }
    return of(this.students.filter(s => s.maSv.toLowerCase().includes(code.toLowerCase())));
  }

  // Tìm kiếm theo Tên
  searchByName(name: string): Observable<Student[]> {
    if (!name) {
      return of(this.students);
    }
    return of(this.students.filter(s => s.hoTen.toLowerCase().includes(name.toLowerCase())));
  }

  // Tìm kiếm theo Lớp
  searchByClass(className: string): Observable<Student[]> {
    if (!className) {
      return of(this.students);
    }
    return of(this.students.filter(s => s.lop.toLowerCase().includes(className.toLowerCase())));
  }

  // Tìm kiếm theo Chuyên ngành
  searchByMajor(major: string): Observable<Student[]> {
    if (!major) {
      return of(this.students);
    }
    return of(this.students.filter(s => s.chuyenNganh.toLowerCase().includes(major.toLowerCase())));
  }

  // Sắp xếp
  sortStudents(sortBy: keyof Student, sortOrder: 'asc' | 'desc'): Observable<Student[]> {
    const sortedStudents = [...this.students].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
    return of(sortedStudents);
  }

  // Phân trang
  getStudentsPaginated(page: number, size: number): Observable<Student[]> {
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    return of(this.students.slice(startIndex, endIndex));
  }

  // Lấy tổng số sinh viên (cần cho phân trang)
  getTotalStudents(): Observable<number> {
    return of(this.students.length);
  }
}