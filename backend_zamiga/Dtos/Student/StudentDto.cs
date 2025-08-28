using System;

namespace backend_zamiga.Dtos.Student
{
    public class StudentDto
    {
        public int Id { get; set; }
        public string MaSv { get; set; }
        public string HoTen { get; set; }
        public string GioiTinh { get; set; }
        public DateTime NgaySinh { get; set; }
        public string Lop { get; set; }
        public string ChuyenNganh { get; set; }
    }
}