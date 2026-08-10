using JobPlatform.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPlatform.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Experience> Experiences => Set<Experience>();
}