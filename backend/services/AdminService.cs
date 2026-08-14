using JobPlatform.Data;
using JobPlatform.DTOs.Admin;
using JobPlatform.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPlatform.Services;

public class AdminService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly EmailService _emailService;

    public AdminService(ApplicationDbContext context, IConfiguration configuration, EmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    public string? Login(string username, string password)
    {
        var configuredUsername = _configuration["AdminSettings:Username"];
        var configuredHash = _configuration["AdminSettings:PasswordHash"];

        if (username != configuredUsername || string.IsNullOrEmpty(configuredHash))
        {
            return null;
        }

        bool isValid = BCrypt.Net.BCrypt.Verify(password, configuredHash);

        return isValid ? _configuration["AdminSettings:Token"] : null;
    }

    public async Task<List<AdminUserOverview>> GetUsersOverviewAsync()
    {
        var applications = await _context.Applications.ToListAsync();
        var applicantUserIds = applications.Select(a => a.UserId).Distinct().ToList();

        var users = await _context.Users
            .Where(u => applicantUserIds.Contains(u.Id))
            .ToListAsync();

        var experiences = await _context.Experiences.ToListAsync();
        var resumes = await _context.Resumes.ToListAsync();
        var languages = await _context.Languages.ToListAsync();
        var jobs = await _context.Jobs.ToListAsync();

        var result = new List<AdminUserOverview>();

        foreach (var user in users)
        {
            var experience = experiences.FirstOrDefault(e => e.UserId == user.Id);
            var resume = resumes.FirstOrDefault(r => r.UserId == user.Id);
            var userApplications = applications.Where(a => a.UserId == user.Id).ToList();
            var userLanguages = resume != null
                ? languages.Where(l => l.ResumeId == resume.Id).Select(l => l.Name).ToList()
                : new List<string>();

            result.Add(new AdminUserOverview
            {
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Location = user.Location,
                YearsOfExperience = experience?.YearsOfExperience,
                Role = experience?.Role,
                ResumeFileName = resume?.FileName,
                Languages = userLanguages,
                Applications = userApplications.Select(a => new AdminApplicationOverview
                {
                    ApplicationId = a.Id,
                    JobId = a.JobId,
                    JobTitle = jobs.FirstOrDefault(j => j.Id == a.JobId)?.Title ?? "Unknown",
                    Status = a.Status,
                    CoverLetter = a.CoverLetter,
                    SubmittedAt = a.SubmittedAt
                }).ToList()
            });
        }

        return result;
    }

    public async Task<Job> CreateJobAsync(CreateJobRequest request)
    {
        var job = new Job
        {
            Title = request.Title,
            Company = request.Company,
            Location = request.Location,
            Description = request.Description,
            RequiredLanguages = string.Join(", ", request.RequiredLanguages),
            Deadline = request.Deadline
        };

        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();
        return job;
    }

    public async Task DecideApplicationAsync(int applicationId, string decision, string message)
{
    var application = await _context.Applications.FirstOrDefaultAsync(a => a.Id == applicationId);
    if (application == null)
    {
        throw new KeyNotFoundException("Application not found.");
    }

    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == application.UserId);
    if (user == null)
    {
        throw new KeyNotFoundException("User not found.");
    }

    var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == application.JobId);

    application.Status = decision;
    application.DecisionMessage = message;
    await _context.SaveChangesAsync();

    var subject = $"Application Update: {job?.Title ?? "Your Application"} — {decision}";
    await _emailService.SendEmailAsync(user.Email, subject, message);
}

    public async Task<int> DecideBulkAsync(BulkDecideRequest request)
{
    var applicationsQuery = _context.Applications.Where(a => a.Status == "Pending");

    if (request.JobId.HasValue)
    {
        applicationsQuery = applicationsQuery.Where(a => a.JobId == request.JobId.Value);
    }

    var pendingApplications = await applicationsQuery.ToListAsync();
    var jobs = await _context.Jobs.ToListAsync();
    var users = await _context.Users.ToListAsync();

    foreach (var application in pendingApplications)
    {
        application.Status = request.Decision;
        application.DecisionMessage = request.Message;

        var user = users.FirstOrDefault(u => u.Id == application.UserId);
        var job = jobs.FirstOrDefault(j => j.Id == application.JobId);

        if (user != null)
        {
            var subject = $"Application Update: {job?.Title ?? "Your Application"} — {request.Decision}";
            await _emailService.SendEmailAsync(user.Email, subject, request.Message);
        }
    }

    await _context.SaveChangesAsync();
    return pendingApplications.Count;
} }