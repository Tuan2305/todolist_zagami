import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list'; // Đảm bảo đúng đường dẫn
import { StudentFormComponent } from './components/student-form/student-form'; // Đảm bảo đúng đường dẫn
import { ModalComponent } from './components/modal/modal'; // <-- Import ModalComponent
import { Student } from './models/student.model';
import { StudentService } from './services/student.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    StudentListComponent,
    StudentFormComponent,
    ModalComponent, 
    CommonModule
  ],
  templateUrl: './app.html', // Trỏ đến tệp HTML đã chỉnh sửa ở dưới
  styleUrls: ['./app.css']
})
export class App {
  title = 'Quản lý Sinh viên';
  showStudentModal: boolean = false; // <-- Thay đổi tên biến để rõ ràng hơn
  selectedStudent: Student | null = null;
  modalTitle: string = ''; // Tiêu đề cho modal

  @ViewChild(StudentListComponent) studentListComp!: StudentListComponent;
  // Nếu bạn muốn truy cập StudentFormComponent bên trong modal, bạn cũng có thể dùng @ViewChild
  // @ViewChild(StudentFormComponent) studentFormComp!: StudentFormComponent;


  constructor(private studentService: StudentService) {}

  onEditStudent(student: Student): void {
    this.selectedStudent = student;
    this.modalTitle = 'Chỉnh sửa Sinh viên';
    this.showStudentModal = true; // <-- Hiển thị modal
  }

  onAddStudent(): void {
    this.selectedStudent = null; // Đảm bảo form ở chế độ thêm mới
    this.modalTitle = 'Thêm Sinh viên Mới';
    this.showStudentModal = true; // <-- Hiển thị modal
  }

  onSaveStudent(student: Student): void {
    if (student.id && student.id !== 0) {
      this.studentService.updateStudent(student).subscribe({
        next: () => {
          alert('Cập nhật sinh viên thành công!');
          this.showStudentModal = false; // <-- Ẩn modal
          this.studentListComp.loadInitialData();
        },
        error: (err) => alert('Lỗi khi cập nhật sinh viên: ' + err.message)
      });
    } else {
      const studentToAdd: Omit<Student, 'id'> = {
        maSv: student.maSv,
        hoTen: student.hoTen,
        gioiTinh: student.gioiTinh,
        ngaySinh: student.ngaySinh,
        lop: student.lop,
        chuyenNganh: student.chuyenNganh
      };
      this.studentService.addStudent(studentToAdd).subscribe({
        next: () => {
          alert('Thêm sinh viên mới thành công!');
          this.showStudentModal = false; // <-- Ẩn modal
          this.studentListComp.loadInitialData();
        },
        error: (err) => alert('Lỗi khi thêm sinh viên: ' + err.message)
      });
    }
  }

  onCancelForm(): void {
    this.showStudentModal = false; // <-- Ẩn modal khi hủy
    this.selectedStudent = null;
  }

  // Phương thức để đóng modal từ chính modal (ví dụ: click overlay hoặc nút X)
  onCloseModal(): void {
    this.showStudentModal = false;
    this.selectedStudent = null; // Reset dữ liệu khi đóng modal
  }
}