using JobPlatform.Data;
using JobPlatform.DTOs.Experience;
using JobPlatform.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPlatform.Services;

public class ApplicationService
{
    private readonly ApplicationDbContext _context;

    public ApplicationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Experience> SaveExperienceAsync(ExperienceRequest request)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == request.UserId);
        if (!userExists)
        {
            throw new InvalidOperationException("User not found.");
        }

        var existing = await _context.Experiences.FirstOrDefaultAsync(e => e.UserId == request.UserId);

        if (existing != null)
        {
            existing.YearsOfExperience = request.YearsOfExperience;
            existing.Role = request.Role;
            existing.Description = request.Description;
        }
        else
        {
            existing = new Experience
            {
                UserId = request.UserId,
                YearsOfExperience = request.YearsOfExperience,
                Role = request.Role,
                Description = request.Description
            };
            _context.Experiences.Add(existing);
        }

        await _context.SaveChangesAsync();
        return existing;
    }
}