import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
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
export class StudentFormComponent implements OnInit, OnChanges {
  @Input() student: Student | null = null; // Input chỉ được đặt bởi component cha
  @Output() save = new EventEmitter<Student>();
  @Output() cancel = new EventEmitter<void>();

  currentStudent: Student = {
    id: 0,
    maSv: '',
    hoTen: '',
    gioiTinh: 'Nam',
    ngaySinh: new Date(),
    lop: '',
    chuyenNganh: ''
  };

  isEditMode: boolean = false;
  gioiTinhOptions: string[] = ['Nam', 'Nữ', 'Khác'];

  ngOnInit(): void {
    // Logic khởi tạo ban đầu thường được handle trong ngOnChanges khi có @Input
    // Không cần logic ở đây nếu ngOnChanges bao quát tốt
  }

  // ngOnChanges sẽ phản ứng với bất kỳ thay đổi nào của @Input() student từ AppComponent
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student']) {
      if (this.student) { // Nếu @Input() student không phải null -> Chế độ chỉnh sửa
        this.currentStudent = { ...this.student }; // Sao chép sâu để tránh sửa đổi trực tiếp input gốc
        this.isEditMode = true;
      } else { // Nếu @Input() student là null -> Chế độ thêm mới
        this.resetInternalFormState(); // Reset trạng thái nội bộ của form
        this.isEditMode = false;
      }
    }
  }

  // Phương thức chỉ dùng để reset các trường dữ liệu nội bộ của form
  private resetInternalFormState(): void {
    this.currentStudent = {
      id: 0,
      maSv: '',
      hoTen: '',
      gioiTinh: 'Nam',
      ngaySinh: new Date(),
      lop: '',
      chuyenNganh: ''
    };
  }

  // Hàm trợ giúp để định dạng Date object thành chuỗi 'YYYY-MM-DD' cho input type="date"
  formatDateToInput(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Hàm trợ giúp để phân tích chuỗi 'YYYY-MM-DD' từ input thành Date object
  parseDateFromInput(dateString: string): Date {
    return new Date(dateString);
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.save.emit(this.currentStudent);
      // KHÔNG GỌI resetInternalFormState() ở đây.
      // AppComponent sẽ chịu trách nhiệm reset selectedStudent về null,
      // điều này sẽ kích hoạt ngOnChanges để reset form cho lần mở tiếp theo.
    } else {
      alert('Vui lòng điền đầy đủ và đúng định dạng các trường!');
    }
  }

  onCancel(): void {
    this.cancel.emit();
    // KHÔNG GỌI resetInternalFormState() ở đây.
    // AppComponent sẽ chịu trách nhiệm reset selectedStudent về null.
  }

  isFormValid(): boolean {
    return (
      !!this.currentStudent.maSv &&
      !!this.currentStudent.hoTen &&
      !!this.currentStudent.gioiTinh &&
      !!this.currentStudent.ngaySinh &&
      !isNaN(this.currentStudent.ngaySinh.getTime()) && // Đảm bảo ngày tháng hợp lệ
      !!this.currentStudent.lop &&
      !!this.currentStudent.chuyenNganh
    );
  }
}