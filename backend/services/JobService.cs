using JobPlatform.Data;
using JobPlatform.DTOs.Job;
using JobPlatform.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPlatform.Services;

public class JobService
{
    private readonly ApplicationDbContext _context;
    private readonly EmailService _emailService;

    public JobService(ApplicationDbContext context, EmailService emailService)
    {
        _context = context;
        _emailService = emailService;
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
                .ToList(),
                 Deadline = j.Deadline
        }).ToList();
    }

    public async Task<ApplyToJobResponse> ApplyToJobAsync(int userId, int jobId, ApplyToJobRequest request)
    {
        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId);
        if (job == null)
        {
            throw new KeyNotFoundException("Job not found.");
        }

        var resume = await _context.Resumes.FirstOrDefaultAsync(r => r.UserId == userId);
        if (resume == null)
        {
            throw new InvalidOperationException("Please complete your profile (resume + languages) before applying.");
        }

        var alreadyApplied = await _context.Applications
            .AnyAsync(a => a.UserId == userId && a.JobId == jobId);
        if (alreadyApplied)
        {
            throw new InvalidOperationException("You have already applied to this job.");
        }

        var application = new Application
        {
            UserId = userId,
            ResumeId = resume.Id,
            JobId = jobId,
            CoverLetter = request.CoverLetter,
            Status = "Pending"
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user != null)
        {
            var subject = $"Application Received: {job.Title}";
            var body = $"Hi {user.Name},\n\nWe've received your application for {job.Title} at {job.Company}. " +
                       "We'll be in touch once your application has been reviewed.\n\nThank you,\nRaras Technologies";
            await _emailService.SendEmailAsync(user.Email, subject, body);
        }

        return new ApplyToJobResponse { ApplicationId = application.Id, Status = application.Status };
    }

    public async Task<List<MyApplicationResponse>> GetMyApplicationsAsync(int userId)
    {
        var applications = await _context.Applications
            .Where(a => a.UserId == userId)
            .ToListAsync();

        var jobs = await _context.Jobs.ToListAsync();

        return applications.Select(a =>
{
    var job = jobs.FirstOrDefault(j => j.Id == a.JobId);
    return new MyApplicationResponse
    {
        ApplicationId = a.Id,
        JobId = a.JobId,
        JobTitle = job?.Title ?? "Unknown",
        Company = job?.Company ?? "Unknown",
        Status = a.Status,
        CoverLetter = a.CoverLetter,
        DecisionMessage = a.DecisionMessage,
        SubmittedAt = a.SubmittedAt
    };
}).OrderByDescending(a => a.SubmittedAt).ToList();
    }

    public async Task<JobResponse?> GetJobByIdAsync(int jobId)
    {
        var j = await _context.Jobs.FirstOrDefaultAsync(x => x.Id == jobId);
        if (j == null) return null;

        return new JobResponse
        {
            Id = j.Id,
            Title = j.Title,
            Company = j.Company,
            Location = j.Location,
            Description = j.Description,
            RequiredLanguages = j.RequiredLanguages
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToList(),
            Deadline = j.Deadline
        };
    }
}