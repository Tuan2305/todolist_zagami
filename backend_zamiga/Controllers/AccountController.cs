using System;
using System.Linq;
using System.Threading.Tasks;
using backend_zamiga.Data;
using backend_zamiga.Dtos.Account;
using backend_zamiga.Interfaces;
using backend_zamiga.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Thêm namespace này
using backend_zamiga.Interfaces;

namespace backend_zamiga.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly ApplicationDbContext _context; // Dùng để kiểm tra vai trò

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _context = context;
        }

        // POST: /api/account/register/student
        [HttpPost("register/student")]
        public async Task<IActionResult> RegisterStudent([FromBody] RegisterDto registerDto)
        {
            return await RegisterUser(registerDto, "Student");
        }

        // POST: /api/account/register/admin
        [HttpPost("register/admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterDto registerDto)
        {
            return await RegisterUser(registerDto, "Admin");
        }

        // Endpoint RegisterLecture đã bị loại bỏ

        private async Task<IActionResult> RegisterUser(RegisterDto registerDto, string roleName)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var appUser = new AppUser
                {
                    UserName = registerDto.Username,
                    Email = registerDto.Email
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

                if (createdUser.Succeeded)
                {
                    var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
                    if (role == null)
                    {
                        return StatusCode(500, $"Vai trò '{roleName}' không tồn tại trong hệ thống.");
                    }

                    var addRole = await _userManager.AddToRoleAsync(appUser, roleName);

                    if (addRole.Succeeded)
                    {
                        return Ok(new NewUserDto
                        {
                            UserName = appUser.UserName,
                            Email = appUser.Email,
                            Token = _tokenService.CreateToken(appUser)
                        });
                    }
                    else
                    {
                        return StatusCode(500, addRole.Errors);
                    }
                }
                else
                {
                    return StatusCode(500, createdUser.Errors);
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }


        // POST: /api/account/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _userManager.FindByNameAsync(loginDto.Username);

                if (user == null)
                {
                    // Có thể kiểm tra email nếu bạn muốn hỗ trợ đăng nhập bằng email
                    user = await _userManager.FindByEmailAsync(loginDto.Username);
                    if (user == null) return Unauthorized("Tên đăng nhập hoặc mật khẩu không đúng.");
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

                if (result.Succeeded)
                {
                    return Ok(new NewUserDto
                    {
                        UserName = user.UserName,
                        Email = user.Email,
                        Token = _tokenService.CreateToken(user)
                    });
                }
                else
                {
                    return Unauthorized("Tên đăng nhập hoặc mật khẩu không đúng.");
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        // Logout: JWT là stateless, nên "logout" chỉ đơn thuần là xóa token ở client (frontend).
        // Không cần endpoint logout ở phía server để hủy token.
        // Token sẽ hết hạn theo thời gian được cấu hình trong JWT (Expires = DateTime.Now.AddDays(7))
    }
}