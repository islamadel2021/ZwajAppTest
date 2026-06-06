using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }

        // 1️⃣ ميثود تسجيل الدخول (Login)
        public async Task<User> Login(string username, string password)
        {
            // بنجيب اليوزر من الداتابيز بالاسم
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                return null; // لو مفيش يوزر بالاسم ده برجع null

            // بنشيك هل الباسورد اللي كتبه مطابق للي متشفر في الداتابيز ولا لأ
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user; // لو كله تمام برجع اليوزر بنجاح
        }

        // ميثود مساعدة للـ Login عشان تفك التشفير وتطابق الباسورد
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            // بنفتح الـ HMAC باستخدام الـ Salt القديم اللي متخزن في الداتابيز كمفتاح
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                
                // بنقارن الـ Hash الجديد بالـ Hash القديم سطر بسطر (أو بكسل بكسل)
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i]) 
                        return false; // لو حرف واحد اختلف بيبقى الباسورد غلط
                }
            }
            return true;
        }

        // 2️⃣ ميثود التسجيل الجديد (Register)
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            
            // بنشفر الباسورد الـ Plain Text ونطلع منه الـ Hash والـ Salt
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        // ميثود مساعدة للـ Register عشان تنشئ التشفير
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            // بننشئ كائن الـ HMACSHA512 أوتوماتيك وهو لوحده بيطلع مفتاح عشوائي فريد (Salt)
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key; // المفتاح العشوائي اللي هيحمي الباسورد من الـ Hackers
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)); // الباسورد بعد ما اتفرم واتشفر
            }
        }

        // 3️⃣ ميثود التشييك على وجود اليوزر (UserExists)
        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(x => x.UserName == username))
                return true; // اليوزر موجود فعلاً قبل كدا

            return false; // الاسم ده جديد وفاضي ومتاح للاستخدام
        }
    }
}