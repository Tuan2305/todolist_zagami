import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AppUser } from '../../models/app-user.model';
import { Course } from '../../models/course'; // Import Course model


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe], // Thêm DatePipe vào imports
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboardComponent implements OnInit {
  currentUser: AppUser | null = null;
  enrolledClassesCount: number = 8; // Dữ liệu mẫu
  externalExamsCount: number = 0;   // Dữ liệu mẫu

  // Dữ liệu mẫu cho danh sách lớp học
  enrolledCourses: Course[] = [
    {
      id: 1,
      title: 'Quản trị nguồn nhân lực 2021',
      imageUrl: 'assets/images/course1.jpg', // Thay bằng đường dẫn ảnh thực tế
      timeRange: '22:38 23/04/2021 - 22:38 23/05/2022',
      enrollmentDate: 'Ngày tham gia: 23:16 23/04/2021'
    },
    {
      id: 2,
      title: 'Lớp tập huấn dành cho Giảng viên trường ĐH Kinh tế',
      imageUrl: 'assets/images/course2.jpg', // Thay bằng đường dẫn ảnh thực tế
      timeRange: '08:00 27/05/2021 - 18:00 27/05/2021',
      enrollmentDate: 'Ngày tham gia: 14:27 22/05/2021'
    },
    {
      id: 3,
      title: 'Lớp tập huấn dành cho Giảng viên trường ĐH Công nghệ và ĐH...',
      imageUrl: 'assets/images/course3.jpg', // Thay bằng đường dẫn ảnh thực tế
      timeRange: '08:00 26/05/2021 - 18:00 26/05/2021',
      enrollmentDate: 'Ngày tham gia: 14:27 22/05/2021'
    },
    {
      id: 4,
      title: 'Lớp tập huấn dành cho Giảng viên trường ĐH Ngoại ngữ',
      imageUrl: 'assets/images/course4.jpg', // Thay bằng đường dẫn ảnh thực tế
      timeRange: '08:00 28/05/2021 - 18:00 28/05/2021',
      enrollmentDate: 'Ngày tham gia: 14:27 22/05/2021'
    },
    {
      id: 5,
      title: 'Phát triển ứng dụng di động',
      imageUrl: 'assets/images/course5.jpg',
      timeRange: '09:00 01/06/2022 - 17:00 30/06/2022',
      enrollmentDate: 'Ngày tham gia: 08:00 01/06/2022'
    }
  ];

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    // Tạo thư mục assets/images và đặt các ảnh mẫu vào đó
    // Ví dụ: course1.jpg, course2.jpg, ...
  }

  viewCourse(courseId: number): void {
    alert(`Vào học lớp ID: ${courseId}`);
    // Logic điều hướng đến trang chi tiết lớp học
  }

  // Các hàm điều khiển carousel nếu muốn (chưa triển khai trong HTML)
  scrollLeft(): void {
    const container = document.querySelector('.course-cards-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' }); // Cuộn 300px sang trái
    }
  }

  scrollRight(): void {
    const container = document.querySelector('.course-cards-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' }); // Cuộn 300px sang phải
    }
  }
}