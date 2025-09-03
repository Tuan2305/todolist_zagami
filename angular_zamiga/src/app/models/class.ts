export interface Class {
  id: number;
  maLop: string;         // Mã lớp
  tenLop: string;        // Tên lớp
  giaoVien: string;      // Giáo viên phụ trách
  soLuongSinhVien: number; // Số lượng sinh viên trong lớp
  thoiGianHoc: string;   // Thời gian học (ví dụ: "Thứ 2, 8:00 - 10:00")
  phongHoc: string;      // Phòng học
  moTa: string;          // Mô tả lớp học
}