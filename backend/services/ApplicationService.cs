using JobPlatform.Data;
using JobPlatform.DTOs.Application;
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

    public async Task<ApplicationResponse> SubmitApplicationAsync(ApplicationRequest request)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == request.UserId);
        if (!userExists)
        {
            throw new InvalidOperationException("User not found.");
        }

        var resume = await _context.Resumes.FirstOrDefaultAsync(r => r.Id == request.ResumeId);
        if (resume == null)
        {
            throw new InvalidOperationException("Resume not found.");
        }

        if (request.Languages.Count == 0)
        {
            throw new InvalidOperationException("Please select at least one language.");
        }

        var existingLanguages = _context.Languages.Where(l => l.ResumeId == request.ResumeId);
        _context.Languages.RemoveRange(existingLanguages);

        foreach (var lang in request.Languages)
        {
            _context.Languages.Add(new Language { ResumeId = request.ResumeId, Name = lang });
        }

        var application = new Application
        {
            UserId = request.UserId,
            ResumeId = request.ResumeId,
            Status = "Submitted"
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        return new ApplicationResponse { Id = application.Id, Status = application.Status };
    }
}