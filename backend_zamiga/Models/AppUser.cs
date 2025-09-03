using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace backend_zamiga.Models
{
    public class AppUser : IdentityUser
    {
        public List<Student> Students { get; set; } = new List<Student>();
    }
}