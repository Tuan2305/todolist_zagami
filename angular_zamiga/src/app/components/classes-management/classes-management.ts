import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Class } from '../../models/class';
import { ClassService } from '../../services/class';
import { FormsModule } from '@angular/forms'; // Cho tìm kiếm/sắp xếp sau này

@Component({
  selector: 'app-classes-management',
  standalone: true,
  imports: [CommonModule, FormsModule], // Thêm FormsModule
  templateUrl: './classes-management.html',
  styleUrls: ['./classes-management.css']
})
export class ClassesManagementComponent implements OnInit {
  classes: Class[] = [];

  // Thêm các biến cho tìm kiếm, sắp xếp, phân trang (sẽ triển khai sau)
  searchTerm: string = '';
  sortBy: keyof Class = 'maLop';
  sortOrder: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  pageSize: number = 10;
  totalClasses: number = 0;
  totalPages: number = 0;

  constructor(private classService: ClassService) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.getClasses().subscribe(data => {
      this.classes = data;
      this.totalClasses = data.length; // Dữ liệu mẫu, tổng số bằng số lượng hiện có
      this.totalPages = Math.ceil(this.totalClasses / this.pageSize);
      // Áp dụng tìm kiếm/sắp xếp/phân trang trên dữ liệu mẫu ở đây nếu muốn
      this.applyFiltersAndSortingAndPagination();
    });
  }

  applyFiltersAndSortingAndPagination(): void {
    let filteredClasses = [...this.classes];

    // Áp dụng tìm kiếm (dữ liệu mẫu, tìm trên frontend)
    if (this.searchTerm) {
      const query = this.searchTerm.toLowerCase();
      filteredClasses = filteredClasses.filter(c =>
        c.maLop.toLowerCase().includes(query) ||
        c.tenLop.toLowerCase().includes(query) ||
        c.giaoVien.toLowerCase().includes(query) ||
        c.phongHoc.toLowerCase().includes(query)
      );
    }

    // Áp dụng sắp xếp (dữ liệu mẫu, sắp xếp trên frontend)
    if (this.sortBy) {
        filteredClasses.sort((a, b) => {
            const valA = a[this.sortBy];
            const valB = b[this.sortBy];

            if (typeof valA === 'string' && typeof valB === 'string') {
                return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (typeof valA === 'number' && typeof valB === 'number') {
                return this.sortOrder === 'asc' ? valA - valB : valB - valA;
            }
            return 0;
        });
    }


    // Cập nhật lại tổng số lớp sau khi tìm kiếm
    this.totalClasses = filteredClasses.length;
    this.totalPages = Math.ceil(this.totalClasses / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1;
    }

    // Áp dụng phân trang (dữ liệu mẫu, phân trang trên frontend)
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.classes = filteredClasses.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadClasses(); // Tải lại toàn bộ dữ liệu để tìm kiếm trên bản gốc
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
    this.totalPages = Math.ceil(this.totalClasses / this.pageSize); // Cập nhật tổng số trang
    this.applyFiltersAndSortingAndPagination();
  }

  editClass(classId: number): void {
    alert('Chức năng sửa lớp: ' + classId);
    // Logic để mở form sửa lớp
  }

  deleteClass(classId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa lớp học này không?')) {
      alert('Chức năng xóa lớp: ' + classId);
      // Logic để xóa lớp
    }
  }

  addClass(): void {
    alert('Chức năng thêm lớp học mới');
    // Logic để mở form thêm lớp
  }
}