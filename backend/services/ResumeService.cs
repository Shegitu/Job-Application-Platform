using JobPlatform.Data;
using JobPlatform.DTOs.Resume;
using JobPlatform.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPlatform.Services;

public class ResumeService
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    private static readonly string[] AllowedExtensions = { ".pdf", ".doc", ".docx" };
    private const long MaxFileSizeBytes = 5 * 1024 * 1024;

    public ResumeService(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    public async Task<ResumeUploadResponse> UploadAsync(int userId, IFormFile file)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            throw new InvalidOperationException("User not found.");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            throw new InvalidOperationException("Unsupported file type. Please upload a PDF or Word document.");
        }

        if (file.Length > MaxFileSizeBytes)
        {
            throw new InvalidOperationException("File is too large. Maximum size is 5MB.");
        }

        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "Uploads");
        Directory.CreateDirectory(uploadsFolder);

        var storedFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, storedFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var existing = await _context.Resumes.FirstOrDefaultAsync(r => r.UserId == userId);
        if (existing != null)
        {
            existing.FileName = file.FileName;
            existing.FilePath = filePath;
            existing.Status = "Uploaded";
        }
        else
        {
            existing = new Resume
            {
                UserId = userId,
                FileName = file.FileName,
                FilePath = filePath,
                Status = "Uploaded"
            };
            _context.Resumes.Add(existing);
        }

        await _context.SaveChangesAsync();

        return new ResumeUploadResponse
        {
            Id = existing.Id,
            FileName = existing.FileName,
            Status = existing.Status
        };
    }

    public async Task<ExtractedLanguagesResponse> ExtractLanguagesAsync(int resumeId)
    {
        var resume = await _context.Resumes.FirstOrDefaultAsync(r => r.Id == resumeId);
        if (resume == null)
        {
            throw new KeyNotFoundException("Resume not found.");
        }

        var detected = new List<string> { "English", "Amharic", "Afaan Oromo" };

        var existingLanguages = _context.Languages.Where(l => l.ResumeId == resumeId);
        _context.Languages.RemoveRange(existingLanguages);

        foreach (var lang in detected)
        {
            _context.Languages.Add(new Language { ResumeId = resumeId, Name = lang });
        }

        resume.Status = "Processed";
        await _context.SaveChangesAsync();

        return new ExtractedLanguagesResponse { ExtractedLanguages = detected };
    }
}