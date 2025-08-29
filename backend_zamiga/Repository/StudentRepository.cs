using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend_zamiga.Data;
using backend_zamiga.Interfaces;
using backend_zamiga.Models;
using Microsoft.EntityFrameworkCore;
using backend_zamiga.Helpers; 

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

        public async Task<List<Student>> GetAllStudentsAsync(StudentQueryObject queryObject)
        {
            var studentsQuery = _context.Students.AsQueryable();

            if (!string.IsNullOrWhiteSpace(queryObject.SearchCode))
            {
                studentsQuery = studentsQuery.Where(s => s.MaSv.Contains(queryObject.SearchCode));
            }
            if (!string.IsNullOrWhiteSpace(queryObject.SearchName))
            {
                studentsQuery = studentsQuery.Where(s => s.HoTen.Contains(queryObject.SearchName));
            }
            if (!string.IsNullOrWhiteSpace(queryObject.SearchClass))
            {
                studentsQuery = studentsQuery.Where(s => s.Lop.Contains(queryObject.SearchClass));
            }
            if (!string.IsNullOrWhiteSpace(queryObject.SearchMajor))
            {
                studentsQuery = studentsQuery.Where(s => s.ChuyenNganh.Contains(queryObject.SearchMajor));
            }

            // Sắp xếp
            if (!string.IsNullOrWhiteSpace(queryObject.SortBy))
            {
                switch (queryObject.SortBy.ToLower())
                {
                    case "name":
                    case "hoten":
                        studentsQuery = (queryObject.SortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.HoTen) : studentsQuery.OrderBy(s => s.HoTen);
                        break;
                    case "dob":
                    case "ngaysinh":
                        studentsQuery = (queryObject.SortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.NgaySinh) : studentsQuery.OrderBy(s => s.NgaySinh);
                        break;
                    case "code":
                    case "masv":
                        studentsQuery = (queryObject.SortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.MaSv) : studentsQuery.OrderBy(s => s.MaSv);
                        break;
                    case "lop":
                        studentsQuery = (queryObject.SortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.Lop) : studentsQuery.OrderBy(s => s.Lop);
                        break;
                    case "chuyennganh":
                        studentsQuery = (queryObject.SortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.ChuyenNganh) : studentsQuery.OrderBy(s => s.ChuyenNganh);
                        break;
                    default:
                        // Mặc định sắp xếp theo ID nếu không khớp hoặc không hợp lệ
                        studentsQuery = (queryObject.SortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.Id) : studentsQuery.OrderBy(s => s.Id);
                        break;
                }
            } else {
                 // Mặc định sắp xếp theo ID nếu không có tiêu chí sắp xếp được cung cấp
                studentsQuery = (queryObject.SortOrder?.ToLower() == "desc") ? studentsQuery.OrderByDescending(s => s.Id) : studentsQuery.OrderBy(s => s.Id);
            }

            // Phân trang
            var skipAmount = (queryObject.PageNumber - 1) * queryObject.PageSize;

            return await studentsQuery
                .Skip(skipAmount)
                .Take(queryObject.PageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalStudentsCountAsync(StudentQueryObject queryObject)
        {
            var studentsQuery = _context.Students.AsQueryable();

            if (!string.IsNullOrWhiteSpace(queryObject.SearchCode))
            {
                studentsQuery = studentsQuery.Where(s => s.MaSv.Contains(queryObject.SearchCode));
            }
            if (!string.IsNullOrWhiteSpace(queryObject.SearchName))
            {
                studentsQuery = studentsQuery.Where(s => s.HoTen.Contains(queryObject.SearchName));
            }
            if (!string.IsNullOrWhiteSpace(queryObject.SearchClass))
            {
                studentsQuery = studentsQuery.Where(s => s.Lop.Contains(queryObject.SearchClass));
            }
            if (!string.IsNullOrWhiteSpace(queryObject.SearchMajor))
            {
                studentsQuery = studentsQuery.Where(s => s.ChuyenNganh.Contains(queryObject.SearchMajor));
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

            existingStudent.HoTen = studentModel.HoTen;
            existingStudent.GioiTinh = studentModel.GioiTinh;
            existingStudent.NgaySinh = studentModel.NgaySinh;
            existingStudent.Lop = studentModel.Lop;
            existingStudent.ChuyenNganh = studentModel.ChuyenNganh;

            await _context.SaveChangesAsync();
            return existingStudent;
        }
    }
}