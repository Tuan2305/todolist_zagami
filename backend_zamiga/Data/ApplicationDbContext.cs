using Microsoft.EntityFrameworkCore;
using backend_zamiga.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using backend_zamiga.Models;

namespace backend_zamiga.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Rất quan trọng: Gọi base.OnModelCreating

            // Cấu hình Student (giữ nguyên)
            modelBuilder.Entity<Student>()
                .HasIndex(s => s.MaSv)
                .IsUnique();

            // Cấu hình Identity Roles (chỉ còn Admin và Student)
            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Name = "Student",
                    NormalizedName = "STUDENT"
                }
                // Vai trò "Lecture" đã bị loại bỏ
            };
            modelBuilder.Entity<IdentityRole>().HasData(roles);
        }
    }
}