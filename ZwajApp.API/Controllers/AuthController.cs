using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{
 [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
private readonly IConfiguration _config; 

    // 🎯 وهنا بتحقنه جوه الـ Constructor عشان الـ .NET تملأ قيمته أوتوماتيك
    public AuthController(IAuthRepository repo, IConfiguration config)
    {
        _repo = repo;
        _config = config; // التروس بتقفل هنا
    }

        // 2️⃣ ميثود الـ Register (إنشاء حساب جديد)
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            // تحويل اسم المستخدم لـ حروف صغيرة (Lowercase) لتوحيد البيانات في الداتابيز
            userForRegisterDto.UserName = userForRegisterDto.UserName.ToLower();

            // الشيك الأول: هل الاسم ده متأخد قبل كدا؟
            if (await _repo.UserExists(userForRegisterDto.UserName))
                return BadRequest("اسم المستخدم مسجل من قبل!");

            // إنشاء كائن المستخدم الجديد لتمريره للـ Repo
            var userToCreate = new User
            {
                UserName = userForRegisterDto.UserName
            };

            // استدعاء ميثود الـ Register وتشفير الباسورد وحفظ البيانات
            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            // في المرحلة دي بنرجع 201 Created (المحاضر هيرجعها كاملة بعدين مع الـ Routes)
            return StatusCode(201);
        }

        [HttpPost("login")]
public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
{
    // 1. التشييك على الحساب من الـ Repository
    var userFromRepo = await _repo.Login(userForLoginDto.UserName.ToLower(), userForLoginDto.Password);

    if (userFromRepo == null)
        return Unauthorized(); // ترجع 401 لو الاسم أو الباسورد غلط

    // 2. بناء الـ Claims (بيانات اليوزر جوه الـ Token)
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
        new Claim(ClaimTypes.Name, userFromRepo.UserName)
    };

    // 3. قراءة المفتاح السري وتشفيره
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

    // 4. تجهيز مواصفات الـ Token (الـ Descriptor) تاريخ الانتهاء يوم واحد
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(1),
        SigningCredentials = creds
    };

    // 5. إنشاء الـ Token وتحويلها لنص مرئي
    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);

    // 6. إرجاع الـ Token بنجاح (200 OK)
    return Ok(new {
        token = tokenHandler.WriteToken(token)
    });
}
    }
}