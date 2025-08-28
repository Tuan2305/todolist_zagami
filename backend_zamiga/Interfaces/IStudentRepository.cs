using System.Collections.Generic;
using System.Threading.Tasks;
using backend_zamiga.Models;

namespace backend_zamiga.Interfaces
{
    public interface IStudentRepository
    {
        Task<List<Student>> GetAllStudentsAsync(
            string? searchCode = null,
            string? searchName = null,
            string? searchClass = null,
            string? searchMajor = null,
            string? sortBy = null,
            string? sortOrder = "asc", // Mặc định tăng dần
            int pageNumber = 1,
            int pageSize = 10
        );
        Task<Student?> GetStudentByIdAsync(int id);
        Task<Student> CreateStudentAsync(Student studentModel);
        Task<Student?> UpdateStudentAsync(int id, Student studentModel);
        Task<Student?> DeleteStudentAsync(int id);
        Task<bool> StudentExists(int id);
        Task<int> GetTotalStudentsCountAsync(
            string? searchCode = null,
            string? searchName = null,
            string? searchClass = null,
            string? searchMajor = null
        );
    }
}