using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend_zamiga.Data;
using backend_zamiga.Interfaces;
using backend_zamiga.Models;
using Microsoft.EntityFrameworkCore;

namespace backend_zamiga.Repository
{
    public class StudentRepository : IStudentRepository
    {
        private readonly ApplicationDbContext _context;

        public StudentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Student> CreateStudentAsync(Student studentModel)
        {
            await _context.Students.AddAsync(studentModel);
            await _context.SaveChangesAsync();
            return studentModel;
        }

        public async Task<Student?> DeleteStudentAsync(int id)
        {
            var studentModel = await _context.Students.FirstOrDefaultAsync(x => x.Id == id);
            if (studentModel == null)
            {
                return null;
            }
            _context.Students.Remove(studentModel);
            await _context.SaveChangesAsync();
            return studentModel;
        }

        public async Task<List<Student>> GetAllStudentsAsync(
            string? searchCode = null,
            string? searchName = null,
            string? searchClass = null,
            string? searchMajor = null,
            string? sortBy = null,
            string? sortOrder = "asc",
            int pageNumber = 1,
            int pageSize = 10
        )
        {
            var studentsQuery = _context.Students.AsQueryable();

            // Tìm kiếm
            if (!string.IsNullOrWhiteSpace(searchCode))
            {
                studentsQuery = studentsQuery.Where(s => s.MaSv.Contains(searchCode));
            }
            if (!string.IsNullOrWhiteSpace(searchName))
            {
                studentsQuery = studentsQuery.Where(s => s.HoTen.Contains(searchName));
            }
            if (!string.IsNullOrWhiteSpace(searchClass))
            {
                studentsQuery = studentsQuery.Where(s => s.Lop.Contains(searchClass));
            }
            if (!string.IsNullOrWhiteSpace(searchMajor))
            {
                studentsQuery = studentsQuery.Where(s => s.ChuyenNganh.Contains(searchMajor));
            }

            // Sắp xếp
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                switch (sortBy.ToLower())
                {
                    case "name":
                    case "hoten":
                        studentsQuery = (sortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.HoTen) : studentsQuery.OrderBy(s => s.HoTen);
                        break;
                    case "dob":
                    case "ngaysinh":
                        studentsQuery = (sortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.NgaySinh) : studentsQuery.OrderBy(s => s.NgaySinh);
                        break;
                    case "code":
                    case "masv":
                        studentsQuery = (sortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.MaSv) : studentsQuery.OrderBy(s => s.MaSv);
                        break;
                    // Thêm các trường sắp xếp khác nếu cần
                    default:
                        // Mặc định sắp xếp theo ID nếu không khớp
                        studentsQuery = (sortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.Id) : studentsQuery.OrderBy(s => s.Id);
                        break;
                }
            } else {
                 // Mặc định sắp xếp theo ID nếu không có tiêu chí sắp xếp
                studentsQuery = (sortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.Id) : studentsQuery.OrderBy(s => s.Id);
            }


            // Phân trang
            var skipAmount = (pageNumber - 1) * pageSize;

            return await studentsQuery
                .Skip(skipAmount)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalStudentsCountAsync(
            string? searchCode = null,
            string? searchName = null,
            string? searchClass = null,
            string? searchMajor = null
        )
        {
            var studentsQuery = _context.Students.AsQueryable();

            // Áp dụng tìm kiếm tương tự GetAllStudentsAsync để lấy tổng số lượng cho kết quả tìm kiếm
            if (!string.IsNullOrWhiteSpace(searchCode))
            {
                studentsQuery = studentsQuery.Where(s => s.MaSv.Contains(searchCode));
            }
            if (!string.IsNullOrWhiteSpace(searchName))
            {
                studentsQuery = studentsQuery.Where(s => s.HoTen.Contains(searchName));
            }
            if (!string.IsNullOrWhiteSpace(searchClass))
            {
                studentsQuery = studentsQuery.Where(s => s.Lop.Contains(searchClass));
            }
            if (!string.IsNullOrWhiteSpace(searchMajor))
            {
                studentsQuery = studentsQuery.Where(s => s.ChuyenNganh.Contains(searchMajor));
            }

            return await studentsQuery.CountAsync();
        }


        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            return await _context.Students.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> StudentExists(int id)
        {
            return await _context.Students.AnyAsync(x => x.Id == id);
        }

        public async Task<Student?> UpdateStudentAsync(int id, Student studentModel)
        {
            var existingStudent = await _context.Students.FirstOrDefaultAsync(x => x.Id == id);
            if (existingStudent == null)
            {
                return null;
            }

            // Cập nhật các thuộc tính
            existingStudent.HoTen = studentModel.HoTen;
            existingStudent.GioiTinh = studentModel.GioiTinh;
            existingStudent.NgaySinh = studentModel.NgaySinh;
            existingStudent.Lop = studentModel.Lop;
            existingStudent.ChuyenNganh = studentModel.ChuyenNganh;
            // Không cho phép cập nhật MaSv vì nó có thể là khóa duy nhất hoặc trường định danh chính
            // existingStudent.MaSv = studentModel.MaSv; // Nếu bạn muốn cho phép cập nhật MaSv, hãy bỏ comment dòng này

            await _context.SaveChangesAsync();
            return existingStudent;
        }
    }
}