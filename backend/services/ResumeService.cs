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

    private static readonly Dictionary<string, string[]> KnownLanguages = new()
{
    { "English", new[] { "english" } },
    { "Amharic", new[] { "amharic" } },
    { "Afaan Oromo", new[] { "afaan oromo", "oromic","oromo", "oromiffa" } },
    { "Tigrinya", new[] { "tigrinya", "tigrigna" } },
    {"Guragenya", new[] {"guragenya"}},
    { "Somali", new[] { "somali" } },
    { "French", new[] { "french", "français" } },
    { "Arabic", new[] { "arabic" } },
    { "Spanish", new[] { "spanish", "español" } },
    { "German", new[] { "german", "deutsch" } },
    { "Italian", new[] { "italian" } },
    { "Portuguese", new[] { "portuguese" } },
    { "Chinese", new[] { "chinese", "mandarin", "cantonese" } },
    { "Japanese", new[] { "japanese" } },
    { "Korean", new[] { "korean" } },
    { "Hindi", new[] { "hindi" } },
    { "Russian", new[] { "russian" } },
    { "Turkish", new[] { "turkish" } },
    { "Swahili", new[] { "swahili", "kiswahili" } },
    { "Dutch", new[] { "dutch" } },
    { "Greek", new[] { "greek" } },
    { "Hebrew", new[] { "hebrew" } },
    { "Polish", new[] { "polish" } },
    { "Vietnamese", new[] { "vietnamese" } },
    { "Thai", new[] { "thai" } },
    { "Persian", new[] { "persian", "farsi" } },
    { "Urdu", new[] { "urdu" } }
};

    public ResumeService(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    public async Task<Models.Resume?> GetResumeByUserIdAsync(int userId)
    {
        return await _context.Resumes.FirstOrDefaultAsync(r => r.UserId == userId);
    }

    public async Task<ResumeUploadResponse> UploadAsync(int userId, IFormFile file)
    {
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

        var detected = DetectLanguagesFromFile(resume.FilePath);

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

    public async Task ConfirmLanguagesAsync(int resumeId, List<string> selectedLanguages)
    {
        var resume = await _context.Resumes.FirstOrDefaultAsync(r => r.Id == resumeId);
        if (resume == null)
        {
            throw new KeyNotFoundException("Resume not found.");
        }

        var existingLanguages = _context.Languages.Where(l => l.ResumeId == resumeId);
        _context.Languages.RemoveRange(existingLanguages);

        foreach (var lang in selectedLanguages)
        {
            _context.Languages.Add(new Language { ResumeId = resumeId, Name = lang });
        }

        resume.Status = "Completed";
        await _context.SaveChangesAsync();
    }

    private List<string> DetectLanguagesFromFile(string filePath)
    {
        if (!File.Exists(filePath))
        {
            return new List<string> { "English" };
        }

        string text;
        try
        {
            text = ResumeTextExtractor.ExtractText(filePath).ToLowerInvariant();
        }
        catch
        {
            return new List<string> { "English" };
        }

        var found = new List<string>();

        foreach (var (languageName, keywords) in KnownLanguages)
        {
            if (keywords.Any(keyword => text.Contains(keyword)))
            {
                found.Add(languageName);
            }
        }

        if (found.Count == 0)
        {
            found.Add("English");
        }

        return found;
    }
}

