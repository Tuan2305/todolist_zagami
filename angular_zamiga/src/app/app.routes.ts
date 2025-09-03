import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard';
import { AuthGuard } from './guards/auth-guard';
import { ClassesManagementComponent } from './components/classes-management/classes-management'; // <-- Import component mới (sẽ tạo sau)

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'classes', // <-- Route cho quản lý lớp học
    component: ClassesManagementComponent, 
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'dashboard',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'Student' }
  },
  { path: '**', redirectTo: '/login' }
];