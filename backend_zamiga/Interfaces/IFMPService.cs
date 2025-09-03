using backend_zamiga.Models;
using backend_zamiga.Services;
namespace backend_zamiga.Interfaces
{
    public interface IFMPService
    {
        Task<Student?> FindStudentByIdAsync(int id);
    }
}