import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AppUser } from '../../models/app-user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Import RouterLink và RouterLinkActive
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'] // Sử dụng CSS thuần
})
export class SidebarComponent implements OnInit {
  currentUser: AppUser | null = null;

  // Nếu muốn điều khiển ẩn/hiện sidebar từ ngoài
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  onLogout(): void {
    this.authService.logout();
    // emit event nếu bạn muốn component cha xử lý việc đóng sidebar sau logout
    // this.toggleSidebar.emit();
  }

  // Hàm để đóng sidebar trên mobile (nếu có)
  closeSidebar(): void {
    this.toggleSidebar.emit();
  }
}