using System;
using System.ComponentModel.DataAnnotations;

namespace backend_zamiga.Dtos.Student
{
    public class CreateStudentRequestDto
    {
        [Required]
        [StringLength(10, ErrorMessage = "Mã sinh viên không được vượt quá 10 ký tự.")]
        public string MaSv { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Họ tên không được vượt quá 100 ký tự.")]
        public string HoTen { get; set; }

        [Required]
        [StringLength(20, ErrorMessage = "Giới tính không được vượt quá 20 ký tự.")]
        public string GioiTinh { get; set; }

        [Required]
        public DateTime NgaySinh { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Lớp không được vượt quá 50 ký tự.")]
        public string Lop { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Chuyên ngành không được vượt quá 100 ký tự.")]
        public string ChuyenNganh { get; set; }
    }
}