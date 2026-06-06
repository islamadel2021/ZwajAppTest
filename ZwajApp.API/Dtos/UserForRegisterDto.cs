using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ZwajApp.API.Dtos
{
    public class UserForRegisterDto
    {
       [Required(ErrorMessage = "اسم المستخدم مطلوب!")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "كلمة المرور مطلوبة!")]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "يجب أن لا تقل كلمة المرور عن 4 أحرف ولا تزيد عن 8 أحرف")]
        public string Password { get; set; } = string.Empty;
    }
}