using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations; 

namespace backend_zamiga.Models
{
    [Table("Students")]
    public class Student
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string MaSv { get; set; }

        [Required]
        [MaxLength(100)]
        public string HoTen { get; set; }

        [Required]
        [MaxLength(20)]
        public string GioiTinh { get; set; }

        [Required]
        public DateTime NgaySinh { get; set; }

        [Required]
        [MaxLength(50)]
        public string Lop { get; set; }

        [Required]
        [MaxLength(100)]
        public string ChuyenNganh { get; set; } 
        public string? AppUserId { get; set; }
        
        // Navigation property to AppUser (optional)
        public AppUser? AppUser { get; set; }
    }
}