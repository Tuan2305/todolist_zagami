using backend_zamiga.Dtos.Student;
using backend_zamiga.Interfaces;
using backend_zamiga.Mappers;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace backend_zamiga.Controllers
{
    [Route("api/student")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentRepository _studentRepo;

        public StudentController(IStudentRepository studentRepo)
        {
            _studentRepo = studentRepo;
        }

        // GET: /api/student?page=1&size=10&searchName=...&sortBy=...&sortOrder=...
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int size = 10,
            [FromQuery] string? searchCode = null,
            [FromQuery] string? searchName = null,
            [FromQuery] string? searchClass = null,
            [FromQuery] string? searchMajor = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortOrder = "asc"
        )
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var students = await _studentRepo.GetAllStudentsAsync(
                searchCode, searchName, searchClass, searchMajor,
                sortBy, sortOrder, page, size
            );

            var totalCount = await _studentRepo.GetTotalStudentsCountAsync(
                searchCode, searchName, searchClass, searchMajor
            );

            var studentDto = students.Select(s => s.ToStudentDto()).ToList();

            // Thêm thông tin phân trang vào Headers
            Response.Headers.Add("X-Pagination-Total-Count", totalCount.ToString());
            Response.Headers.Add("X-Pagination-Page-Size", size.ToString());
            Response.Headers.Add("X-Pagination-Current-Page", page.ToString());
            Response.Headers.Add("X-Pagination-Total-Pages", ((int)Math.Ceiling((double)totalCount / size)).ToString());


            return Ok(studentDto);
        }

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

        // GET: /api/student/search/code/{code}
        [HttpGet("search/code/{code}")]
        public async Task<IActionResult> SearchByCode([FromRoute] string code)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var students = await _studentRepo.GetAllStudentsAsync(searchCode: code);

            if (!students.Any())
            {
                return NotFound("Không tìm thấy sinh viên với mã này.");
            }

            var studentDto = students.Select(s => s.ToStudentDto()).ToList();
            return Ok(studentDto);
        }

        // GET: /api/student/search/name/{name}
        [HttpGet("search/name/{name}")]
        public async Task<IActionResult> SearchByName([FromRoute] string name)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var students = await _studentRepo.GetAllStudentsAsync(searchName: name);

            if (!students.Any())
            {
                return NotFound("Không tìm thấy sinh viên với tên này.");
            }

            var studentDto = students.Select(s => s.ToStudentDto()).ToList();
            return Ok(studentDto);
        }

        // GET: /api/student/search/class/{class}
        [HttpGet("search/class/{class}")]
        public async Task<IActionResult> SearchByClass([FromRoute] string @class) // @class để tránh trùng từ khóa
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var students = await _studentRepo.GetAllStudentsAsync(searchClass: @class);

            if (!students.Any())
            {
                return NotFound("Không tìm thấy sinh viên trong lớp này.");
            }

            var studentDto = students.Select(s => s.ToStudentDto()).ToList();
            return Ok(studentDto);
        }

        // GET: /api/student/search/major/{major}
        [HttpGet("search/major/{major}")]
        public async Task<IActionResult> SearchByMajor([FromRoute] string major)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var students = await _studentRepo.GetAllStudentsAsync(searchMajor: major);

            if (!students.Any())
            {
                return NotFound("Không tìm thấy sinh viên trong chuyên ngành này.");
            }

            var studentDto = students.Select(s => s.ToStudentDto()).ToList();
            return Ok(studentDto);
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