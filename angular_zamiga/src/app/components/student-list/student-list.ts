import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Student } from '../../models/student.model';
import { PaginatedStudents, StudentService, StudentQueryObject } from '../../services/student.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common'; // <-- DatePipe cần được import
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe], // <-- Đảm bảo DatePipe có ở đây
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];

  searchQuery: string = '';
  searchType: 'maSv' | 'hoTen' | 'lop' | 'chuyenNganh' | 'all' = 'all';

  sortBy: keyof Student = 'hoTen';
  sortOrder: 'asc' | 'desc' = 'asc';

  currentPage: number = 1;
  pageSize: number = 10;
  totalStudents: number = 0;
  totalPages: number = 0;

  @Output() editStudent = new EventEmitter<Student>();
  @Output() addStudent = new EventEmitter<void>();

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.applyFiltersAndSortingAndPagination();
  }

  applyFiltersAndSortingAndPagination(): void {
    const queryObject: StudentQueryObject = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy as string,
      sortOrder: this.sortOrder
    };

    if (this.searchQuery) {
        switch (this.searchType) {
            case 'maSv': queryObject.searchCode = this.searchQuery; break;
            case 'hoTen': queryObject.searchName = this.searchQuery; break;
            case 'lop': queryObject.searchClass = this.searchQuery; break;
            case 'chuyenNganh': queryObject.searchMajor = this.searchQuery; break;
            case 'all':
                queryObject.searchCode = this.searchQuery;
                queryObject.searchName = this.searchQuery;
                queryObject.searchClass = this.searchQuery;
                queryObject.searchMajor = this.searchQuery;
                break;
        }
    }

    this.studentService.getAllStudents(queryObject).subscribe({
      next: (data: PaginatedStudents) => {
        this.students = data.students;
        this.totalStudents = data.totalCount;
        this.pageSize = data.pageSize;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách sinh viên:', err);
        // Xử lý lỗi: hiển thị thông báo, logging, ...
        alert('Không thể tải danh sách sinh viên. Vui lòng thử lại sau.');
      }
    });
  }

  // Các phương thức onSearch, onSort, onPageChange, onPageSizeChange, deleteStudent, onEdit, onAdd giữ nguyên
  // vì chúng chỉ gọi lại applyFiltersAndSortingAndPagination() hoặc phát ra event.

  onSearch(): void {
    this.currentPage = 1;
    this.applyFiltersAndSortingAndPagination();
  }

  onSort(): void {
    this.currentPage = 1;
    this.applyFiltersAndSortingAndPagination();
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndSortingAndPagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndSortingAndPagination();
  }

  deleteStudent(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          alert('Xóa sinh viên thành công!');
          this.loadInitialData(); // Tải lại danh sách sau khi xóa
        },
        error: (err) => {
          console.error('Lỗi khi xóa sinh viên:', err);
          alert('Không thể xóa sinh viên. Vui lòng thử lại sau.');
        }
      });
    }
  }

  onEdit(student: Student): void {
    this.editStudent.emit(student);
  }

  onAdd(): void {
    this.addStudent.emit();
  }
}