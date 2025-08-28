using backend_zamiga.Dtos.Student;
using backend_zamiga.Models;

namespace backend_zamiga.Mappers
{
    public static class StudentMapper
    {
        // Chuyển từ Student Model sang StudentDto
        public static StudentDto ToStudentDto(this Student studentModel)
        {
            return new StudentDto
            {
                Id = studentModel.Id,
                MaSv = studentModel.MaSv,
                HoTen = studentModel.HoTen,
                GioiTinh = studentModel.GioiTinh,
                NgaySinh = studentModel.NgaySinh,
                Lop = studentModel.Lop,
                ChuyenNganh = studentModel.ChuyenNganh
            };
        }

        // Chuyển từ CreateStudentRequestDto sang Student Model
        public static Student ToStudentFromCreateDTO(this CreateStudentRequestDto studentDto)
        {
            return new Student
            {
                MaSv = studentDto.MaSv,
                HoTen = studentDto.HoTen,
                GioiTinh = studentDto.GioiTinh,
                NgaySinh = studentDto.NgaySinh,
                Lop = studentDto.Lop,
                ChuyenNganh = studentDto.ChuyenNganh
            };
        }

        // Chuyển từ UpdateStudentRequestDto sang Student Model (cho việc cập nhật)
        // Lưu ý: ID sẽ được lấy từ URL trong controller
        public static Student ToStudentFromUpdateDTO(this UpdateStudentRequestDto studentDto)
        {
            return new Student
            {
                HoTen = studentDto.HoTen,
                GioiTinh = studentDto.GioiTinh,
                NgaySinh = studentDto.NgaySinh,
                Lop = studentDto.Lop,
                ChuyenNganh = studentDto.ChuyenNganh
            };
        }
    }
}