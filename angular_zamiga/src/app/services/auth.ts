import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AppUser } from '../models/app-user.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

interface LoginDto {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5018/api/account';
  private currentUserSubject: BehaviorSubject<AppUser | null>;
  public currentUser: Observable<AppUser | null>;
  
  constructor(private http: HttpClient, private router: Router) {
    const userJson = localStorage.getItem('user');
    const user: AppUser | null = userJson ? JSON.parse(userJson) : null;
    this.currentUserSubject = new BehaviorSubject<AppUser | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();

    if (user && user.token && !user.roles) {
      this.decodeTokenAndSetRoles(user.token);
    }
  }

  public get currentUserValue(): AppUser | null {
    return this.currentUserSubject.value;
  }

  private decodeTokenAndSetRoles(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      // Lấy vai trò từ claim 'role' hoặc claim phù hợp từ token
      const role = decodedToken.role || '';
      
      const user = this.currentUserSubject.value;
      if (user) {
        // Đảm bảo roles là một mảng
        user.roles = Array.isArray(role) ? role : [role];
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      this.logout();
    }
  }

  login(loginDto: LoginDto): Observable<AppUser> {
    // Thêm log để debug
    console.log('Đang gửi request login:', loginDto);
    
    return this.http.post<AppUser>(`${this.apiUrl}/login`, loginDto).pipe(
      tap(response => console.log('Login response:', response)),
      map(user => {
        // Đảm bảo response đúng format
        if (user && user.token) {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', user.token); // Lưu token riêng cho JWT Interceptor
          this.currentUserSubject.next(user);
          this.decodeTokenAndSetRoles(user.token);
          // điều hướng dựa trên vai trò
          const currentUser = this.currentUserSubject.value;
          if (currentUser?.roles?.includes('Admin')) {
            this.router.navigate(['/students']); // Admin đi đến trang quản lý sinh viên
          } else if (currentUser?.roles?.includes('Student')) {
            this.router.navigate(['/dashboard']); // Student đi đến trang dashboard
          } 

        }
        return user;
      }),
      catchError(this.handleError)
    );
  }
  // isStudent(): boolean {
  //   const user = this.currentUserSubject.value;
  //   return user?.roles?.includes('Student') || false;
  // }

  register(registerDto: RegisterDto, role: 'admin' | 'student'): Observable<AppUser> {
    const endpoint = role === 'admin' ? '/register/admin' : '/register/student';
    
    // Thêm log để debug
    console.log(`Đang đăng ký tài khoản ${role}:`, registerDto);
    
    return this.http.post<AppUser>(`${this.apiUrl}${endpoint}`, registerDto).pipe(
      tap(response => console.log('Register response:', response)),
      map(user => {
        if (user && user.token) {
          // Không lưu vào localStorage nếu chỉ đăng ký mà chưa đăng nhập
          // Để người dùng phải đăng nhập sau khi đăng ký
        }
        return user;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error.error instanceof ErrorEvent) {
      // Lỗi client-side
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Lỗi server trả về
      if (error.status === 401) {
        errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }
    
    console.error('Auth error:', error);
    return throwError(() => new Error(errorMessage));
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes('Admin') || false;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value?.token;
  }
}