import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Student } from '../../models/student.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-form.html',
  styleUrls: ['./student-form.css']
})
export class StudentFormComponent implements OnInit {
  @Input() student: Student | null = null;
  @Output() save = new EventEmitter<Student>();
  @Output() cancel = new EventEmitter<void>();

  currentStudent: Student = {
    id: 0,
    maSv: '',
    hoTen: '',
    gioiTinh: 'Nam', 
    ngaySinh: '',
    lop: '',
    chuyenNganh: ''
  };

  isEditMode: boolean = false;
  gioiTinhOptions: string[] = ['Nam', 'Nữ', 'Khác']; // Tùy chọn cho giới tính

  ngOnInit(): void {
    if (this.student) {
      this.currentStudent = { ...this.student };
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.save.emit(this.currentStudent);
      this.resetForm();
    } else {
      alert('Vui lòng điền đầy đủ và đúng định dạng các trường!');
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.currentStudent = {
      id: 0,
      maSv: '',
      hoTen: '',
      gioiTinh: 'Nam',
      ngaySinh: '',
      lop: '',
      chuyenNganh: ''
    };
    this.isEditMode = false;
    this.student = null;
  }

  isFormValid(): boolean {
    return (
      !!this.currentStudent.maSv &&
      !!this.currentStudent.hoTen &&
      !!this.currentStudent.gioiTinh &&
      !!this.currentStudent.ngaySinh &&
      !!this.currentStudent.lop &&
      !!this.currentStudent.chuyenNganh
    );
  }
}