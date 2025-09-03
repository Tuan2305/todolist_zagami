import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentUser = this.authService.currentUserValue;

    if (currentUser && currentUser.token) {
      // Người dùng đã đăng nhập
      const requiredRole = route.data['role'] as string; // Lấy vai trò yêu cầu từ route data

      if (requiredRole) {
        // Kiểm tra vai trò
        if (currentUser.roles?.includes(requiredRole)) {
          return true; // Có vai trò cần thiết
        } else {
          // Không có vai trò cần thiết, chuyển hướng đến trang không có quyền
          alert('Bạn không có quyền truy cập trang này.');
          return this.router.createUrlTree(['/']); // Chuyển hướng về trang chủ
        }
      }
      return true; // Đã đăng nhập và không yêu cầu vai trò cụ thể
    }

    // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    alert('Bạn cần đăng nhập để truy cập trang này.');
    return this.router.createUrlTree(['/login']);
  }
}