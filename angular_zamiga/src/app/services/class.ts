import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Class } from '../models/class';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private classes: Class[] = [
    {
      id: 1,
      maLop: 'CTK42',
      tenLop: 'Lập trình Web nâng cao',
      giaoVien: 'Nguyễn Văn A',
      soLuongSinhVien: 30,
      thoiGianHoc: 'Thứ 2, 8:00 - 10:00',
      phongHoc: 'A201',
      moTa: 'Nghiên cứu các công nghệ và framework lập trình web hiện đại.'
    },
    {
      id: 2,
      maLop: 'MMT39',
      tenLop: 'Mạng máy tính cơ bản',
      giaoVien: 'Trần Thị B',
      soLuongSinhVien: 45,
      thoiGianHoc: 'Thứ 3, 13:00 - 15:00',
      phongHoc: 'B305',
      moTa: 'Giới thiệu về kiến trúc mạng, giao thức và các thiết bị mạng.'
    },
    {
      id: 3,
      maLop: 'KTPM40',
      tenLop: 'Phân tích thiết kế hệ thống',
      giaoVien: 'Lê Văn C',
      soLuongSinhVien: 35,
      thoiGianHoc: 'Thứ 4, 10:00 - 12:00',
      phongHoc: 'C102',
      moTa: 'Học cách phân tích yêu cầu và thiết kế các hệ thống phần mềm.'
    },
    {
      id: 4,
      maLop: 'HTTT41',
      tenLop: 'Hệ quản trị cơ sở dữ liệu',
      giaoVien: 'Phạm Thị D',
      soLuongSinhVien: 50,
      thoiGianHoc: 'Thứ 5, 15:00 - 17:00',
      phongHoc: 'D203',
      moTa: 'Tìm hiểu về các hệ quản trị CSDL, thiết kế CSDL và SQL.'
    },
    {
      id: 5,
      maLop: 'CNTT43',
      tenLop: 'Cấu trúc dữ liệu và giải thuật',
      giaoVien: 'Hoàng Văn E',
      soLuongSinhVien: 40,
      thoiGianHoc: 'Thứ 6, 8:00 - 10:00',
      phongHoc: 'E101',
      moTa: 'Nghiên cứu các cấu trúc dữ liệu và giải thuật cơ bản và nâng cao.'
    }
  ];

  constructor() { }

  getClasses(): Observable<Class[]> {
    return of(this.classes);
  }

  // Bạn có thể thêm các phương thức khác ở đây (ví dụ: getClassById, addClass, updateClass, deleteClass)
}