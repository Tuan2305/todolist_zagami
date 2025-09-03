import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.errorMessage = '';
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (user) => {
        if (user.roles?.includes('Admin')) {
          this.router.navigate(['/students']); // Chuyển hướng admin đến trang quản lý sinh viên
        } else {
          this.router.navigate(['/dashboard']); // Hoặc trang dashboard cho sinh viên
        }
      },
      error: (err) => {
        this.errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.';
        console.error('Login error:', err);
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}