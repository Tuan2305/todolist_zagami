using backend_zamiga.Dtos.Student;
using backend_zamiga.Interfaces;
using backend_zamiga.Mappers;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using backend_zamiga.Helpers; 
using Microsoft.AspNetCore.Authorization;
using backend_zamiga.Data;

namespace backend_zamiga.Controllers
{
    [Route("api/student")]
    [ApiController]
    [Authorize(Roles = "Admin")] 
    public class StudentController : ControllerBase
    {
        private readonly IStudentRepository _studentRepo;
        private readonly ApplicationDbContext _context;
        public StudentController(IStudentRepository studentRepo, ApplicationDbContext context) // Inject _context
        {
            _studentRepo = studentRepo;
            _context = context; // Khởi tạo _context
        }

        // GET: /api/student?pageNumber=1&pageSize=10&searchName=...&sortBy=...&sortOrder=...
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] StudentQueryObject queryObject) // <-- Nhận StudentQueryObject
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var students = await _studentRepo.GetAllStudentsAsync(queryObject); // <-- Truyền queryObject

            var totalCount = await _studentRepo.GetTotalStudentsCountAsync(queryObject); // <-- Truyền queryObject

            var studentDto = students.Select(s => s.ToStudentDto()).ToList();

            // Thêm thông tin phân trang vào Headers
            Response.Headers.Add("X-Pagination-Total-Count", totalCount.ToString());
            Response.Headers.Add("X-Pagination-Page-Size", queryObject.PageSize.ToString());
            Response.Headers.Add("X-Pagination-Current-Page", queryObject.PageNumber.ToString());
            Response.Headers.Add("X-Pagination-Total-Pages", ((int)Math.Ceiling((double)totalCount / queryObject.PageSize)).ToString());


            return Ok(studentDto);
        }

        // Các endpoint tìm kiếm riêng biệt (SearchByCode, SearchByName, SearchByClass, SearchByMajor)
        // Hiện tại, chúng ta có thể sử dụng phương thức GetAll chung với StudentQueryObject để thực hiện các tìm kiếm này.
        // Tuy nhiên, nếu bạn vẫn muốn các endpoint riêng biệt này, chúng ta cần điều chỉnh chúng để gọi
        // GetAllStudentsAsync với một StudentQueryObject cụ thể.

        // Ví dụ điều chỉnh cho SearchByCode:
        [HttpGet("search/code/{code}")]
        public async Task<IActionResult> SearchByCode([FromRoute] string code)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var queryObject = new StudentQueryObject { SearchCode = code, PageSize = int.MaxValue }; // Lấy tất cả kết quả
            var students = await _studentRepo.GetAllStudentsAsync(queryObject);

            if (!students.Any())
            {
                return NotFound("Không tìm thấy sinh viên với mã này.");
            }

            var studentDto = students.Select(s => s.ToStudentDto()).ToList();
            return Ok(studentDto);
        }

        // Điều chỉnh tương tự cho SearchByName, SearchByClass, SearchByMajor
        [HttpGet("search/name/{name}")]
        public async Task<IActionResult> SearchByName([FromRoute] string name)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var queryObject = new StudentQueryObject { SearchName = name, PageSize = int.MaxValue };
            var students = await _studentRepo.GetAllStudentsAsync(queryObject);

            if (!students.Any())
            {
                return NotFound("Không tìm thấy sinh viên với tên này.");
            }

            var studentDto = students.Select(s => s.ToStudentDto()).ToList();
            return Ok(studentDto);
        }

        [HttpGet("search/class/{class}")]
        public async Task<IActionResult> SearchByClass([FromRoute] string @class)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var queryObject = new StudentQueryObject { SearchClass = @class, PageSize = int.MaxValue };
            var students = await _studentRepo.GetAllStudentsAsync(queryObject);

            if (!students.Any())
            {
                return NotFound("Không tìm thấy sinh viên trong lớp này.");
            }

            var studentDto = students.Select(s => s.ToStudentDto()).ToList();
            return Ok(studentDto);
        }

        [HttpGet("search/major/{major}")]
        public async Task<IActionResult> SearchByMajor([FromRoute] string major)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var queryObject = new StudentQueryObject { SearchMajor = major, PageSize = int.MaxValue };
            var students = await _studentRepo.GetAllStudentsAsync(queryObject);

            if (!students.Any())
            {
                return NotFound("Không tìm thấy sinh viên trong chuyên ngành này.");
            }

            var studentDto = students.Select(s => s.ToStudentDto()).ToList();
            return Ok(studentDto);
        }

        // Các API GetById, Create, Update, Delete vẫn giữ nguyên
        // GET: /api/student/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var student = await _studentRepo.GetStudentByIdAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(student.ToStudentDto());
        }

        // POST: /api/student/create
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateStudentRequestDto studentDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var studentModel = studentDto.ToStudentFromCreateDTO();
            await _studentRepo.CreateStudentAsync(studentModel);

            return CreatedAtAction(nameof(GetById), new { id = studentModel.Id }, studentModel.ToStudentDto());
        }

        // PUT: /api/student/update/{id}
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateStudentRequestDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var studentModel = updateDto.ToStudentFromUpdateDTO();
            var updatedStudent = await _studentRepo.UpdateStudentAsync(id, studentModel);

            if (updatedStudent == null)
            {
                return NotFound("Sinh viên không tồn tại.");
            }

            return Ok(updatedStudent.ToStudentDto());
        }

        // DELETE: /api/student/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var studentModel = await _studentRepo.DeleteStudentAsync(id);

            if (studentModel == null)
            {
                return NotFound("Sinh viên không tồn tại.");
            }

            return NoContent(); // Trả về 204 No Content nếu xóa thành công
        }
    }
}