import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = []; // Danh sách sinh viên đang hiển thị
  allStudents: Student[] = []; // Danh sách toàn bộ sinh viên (dùng để lọc/sắp xếp trên client)

  // Tìm kiếm
  searchQuery: string = '';
  searchType: 'maSv' | 'hoTen' | 'lop' | 'chuyenNganh' | 'all' = 'all'; // Thêm loại tìm kiếm

  // Sắp xếp
  sortBy: keyof Student = 'hoTen';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Phân trang
  currentPage: number = 1;
  pageSize: number = 5; // Mặc định 5 sinh viên mỗi trang
  totalStudents: number = 0;
  totalPages: number = 0;

  @Output() editStudent = new EventEmitter<Student>();
  @Output() addStudent = new EventEmitter<void>();

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.studentService.getStudents().subscribe(data => {
      this.allStudents = data; // Tải toàn bộ data để thực hiện lọc/sắp xếp trên frontend
      this.totalStudents = data.length;
      this.totalPages = Math.ceil(this.totalStudents / this.pageSize);
      this.applyFiltersAndSortingAndPagination();
    });
  }

  applyFiltersAndSortingAndPagination(): void {
    let tempStudents = [...this.allStudents]; // Bắt đầu với bản sao của toàn bộ sinh viên

    // 1. Áp dụng tìm kiếm
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      tempStudents = tempStudents.filter(s => {
        switch (this.searchType) {
          case 'maSv': return s.maSv.toLowerCase().includes(query);
          case 'hoTen': return s.hoTen.toLowerCase().includes(query);
          case 'lop': return s.lop.toLowerCase().includes(query);
          case 'chuyenNganh': return s.chuyenNganh.toLowerCase().includes(query);
          case 'all':
          default:
            return (
              s.maSv.toLowerCase().includes(query) ||
              s.hoTen.toLowerCase().includes(query) ||
              s.lop.toLowerCase().includes(query) ||
              s.chuyenNganh.toLowerCase().includes(query)
            );
        }
      });
    }

    // 2. Áp dụng sắp xếp
    tempStudents.sort((a, b) => {
      const valA = a[this.sortBy];
      const valB = b[this.sortBy];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      // Xử lý ngày sinh riêng vì có thể cần parse
      if (this.sortBy === 'ngaySinh') {
        const dateA = new Date(valA as string);
        const dateB = new Date(valB as string);
        return this.sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      return 0;
    });

    // Cập nhật lại tổng số sinh viên sau khi tìm kiếm (ảnh hưởng đến phân trang)
    this.totalStudents = tempStudents.length;
    this.totalPages = Math.ceil(this.totalStudents / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages; // Điều chỉnh trang hiện tại nếu vượt quá
    } else if (this.totalPages === 0) {
      this.currentPage = 1; // Nếu không có sinh viên, về trang 1
    }


    // 3. Áp dụng phân trang
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.students = tempStudents.slice(startIndex, endIndex);
  }


  onSearch(): void {
    this.currentPage = 1; // Reset về trang 1 khi tìm kiếm
    this.applyFiltersAndSortingAndPagination();
  }

  onSort(): void {
    this.currentPage = 1; // Reset về trang 1 khi sắp xếp
    this.applyFiltersAndSortingAndPagination();
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndSortingAndPagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1; // Reset về trang 1 khi thay đổi kích thước trang
    this.totalPages = Math.ceil(this.totalStudents / this.pageSize);
    this.applyFiltersAndSortingAndPagination();
  }

  deleteStudent(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
      this.studentService.deleteStudent(id).subscribe(success => {
        if (success) {
          alert('Xóa sinh viên thành công!');
          this.loadInitialData(); // Tải lại toàn bộ dữ liệu để cập nhật danh sách
        } else {
          alert('Không thể xóa sinh viên.');
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