import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router'; // <-- Thêm NavigationEnd
import { StudentListComponent } from './components/student-list/student-list';
import { StudentFormComponent } from './components/student-form/student-form';
import { ModalComponent } from './components/modal/modal';
import { Student } from './models/student.model';
import { StudentService } from './services/student.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';
import { AppUser } from './models/app-user.model';
import { SidebarComponent } from './components/sidebar/sidebar'; 
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    StudentListComponent,
    StudentFormComponent,
    ModalComponent,
    CommonModule,
    SidebarComponent // <-- Thêm SidebarComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'] // <-- Cập nhật file CSS này
})
export class App implements OnInit {
  title = 'Quản lý Sinh viên';
  showStudentModal: boolean = false;
  selectedStudent: Student | null = null;
  modalTitle: string = '';

  currentUser: AppUser | null = null;
  showSidebar: boolean = false; // <-- Biến mới để điều khiển hiển thị sidebar trên mobile

  // @ViewChild(StudentListComponent) studentListComp!: StudentListComponent; // Có thể không cần nếu sidebar quản lý routing

  constructor(
    private studentService: StudentService,
    public authService: AuthService,
    private router: Router
  ) {
    // Đóng sidebar khi điều hướng (quan trọng cho mobile)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showSidebar = false;
    });
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void { // <-- Phương thức để bật/tắt sidebar
    this.showSidebar = !this.showSidebar;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  onEditStudent(student: Student): void {
    this.selectedStudent = student;
    this.modalTitle = 'Chỉnh sửa Sinh viên';
    this.showStudentModal = true;
  }

  onAddStudent(): void {
    this.selectedStudent = null;
    this.modalTitle = 'Thêm Sinh viên Mới';
    this.showStudentModal = true;
  }

  onSaveStudent(student: Student): void {

    if (student.id && student.id !== 0) {
      this.studentService.updateStudent(student).subscribe({
        next: () => {
          alert('Cập nhật sinh viên thành công!');
          this.showStudentModal = false;
          this.selectedStudent = null;
          // this.studentListComp.loadInitialData(); // Không còn truy cập trực tiếp qua @ViewChild
          // Sau khi modal đóng, route /students sẽ được activate lại,
          // StudentListComponent sẽ gọi ngOnInit -> loadInitialData.
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
          this.showStudentModal = false;
          this.selectedStudent = null;
          // this.studentListComp.loadInitialData(); // Không còn truy cập trực tiếp qua @ViewChild
        },
        error: (err) => alert('Lỗi khi thêm sinh viên: ' + err.message)
      });
    }
  }

  onCancelForm(): void {
    this.showStudentModal = false;
    this.selectedStudent = null;
  }

  onCloseModal(): void {
    this.showStudentModal = false;
    this.selectedStudent = null;
  }
}