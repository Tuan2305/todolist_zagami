import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'] // Bạn sẽ cần style với Tailwind
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role: 'admin' | 'student' = 'student'; // Mặc định đăng ký là student
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.register({ username: this.username, email: this.email, password: this.password }, this.role).subscribe({
      next: () => {
        this.successMessage = 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.';
        // Có thể tự động chuyển hướng hoặc yêu cầu đăng nhập
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Đăng ký thất bại. Vui lòng thử lại. Có thể tên đăng nhập hoặc email đã tồn tại.';
        console.error('Register error:', err);
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}