using JobPlatform.Data;
using JobPlatform.DTOs.Job;
using Microsoft.EntityFrameworkCore;

namespace JobPlatform.Services;

public class JobService
{
    private readonly ApplicationDbContext _context;

    public JobService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<JobResponse>> GetJobsAsync()
    {
        var jobs = await _context.Jobs.ToListAsync();

        return jobs.Select(j => new JobResponse
        {
            Id = j.Id,
            Title = j.Title,
            Company = j.Company,
            Location = j.Location,
            Description = j.Description,
            RequiredLanguages = j.RequiredLanguages
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToList()
        }).ToList();
    }
}