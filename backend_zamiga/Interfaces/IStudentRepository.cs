using System.Collections.Generic;
using System.Threading.Tasks;
using backend_zamiga.Models;
using backend_zamiga.Helpers;

namespace backend_zamiga.Interfaces
{
    public interface IStudentRepository
    {
        Task<List<Student>> GetAllStudentsAsync(StudentQueryObject queryObject);
        Task<Student?> GetStudentByIdAsync(int id);
        Task<Student> CreateStudentAsync(Student studentModel);
        Task<Student?> UpdateStudentAsync(int id, Student studentModel);
        Task<Student?> DeleteStudentAsync(int id);
        Task<bool> StudentExists(int id);
        Task<int> GetTotalStudentsCountAsync(StudentQueryObject queryObject);
    }









    
}