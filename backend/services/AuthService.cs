using JobPlatform.Data;
using JobPlatform.DTOs.Auth;
using JobPlatform.Models;
using Microsoft.EntityFrameworkCore;

namespace JobPlatform.Services;

public class AuthService
{
    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<SignupResponse> SignupAsync(SignupRequest request)
    {
        var existing = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existing != null)
        {
            throw new InvalidOperationException("An account with this email already exists.");
        }

        var token = Guid.NewGuid().ToString();

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Gender = request.Gender,
            Phone = request.Phone,
            Location = request.Location,
            AuthToken = token
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new SignupResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Token = token
        };
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new InvalidOperationException("Invalid email or password.");
        }

        var token = Guid.NewGuid().ToString();
        user.AuthToken = token;
        await _context.SaveChangesAsync();

        return new LoginResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Token = token
        };
    }

    public EmailExtractResponse ExtractFromEmail(string email)
    {
        var localPart = email.Split('@')[0];
        var name = string.Join(" ", localPart.Split('.', '_', '-')).Trim();

        return new EmailExtractResponse
        {
            Name = string.IsNullOrWhiteSpace(name) ? null : CapitalizeWords(name),
            Location = null
        };
    }

    private static string CapitalizeWords(string input)
    {
        var words = input.Split(' ');
        for (int i = 0; i < words.Length; i++)
        {
            if (words[i].Length > 0)
            {
                words[i] = char.ToUpper(words[i][0]) + words[i].Substring(1);
            }
        }
        return string.Join(" ", words);
    }

    public async Task<ProfileResponse> GetProfileAsync(int userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var experience = await _context.Experiences.FirstOrDefaultAsync(e => e.UserId == userId);
        var resume = await _context.Resumes.FirstOrDefaultAsync(r => r.UserId == userId);
        var languages = resume != null
            ? await _context.Languages.Where(l => l.ResumeId == resume.Id).Select(l => l.Name).ToListAsync()
            : new List<string>();

        return new ProfileResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Gender = user.Gender,
            Phone = user.Phone,
            Location = user.Location,
            YearsOfExperience = experience?.YearsOfExperience,
            Role = experience?.Role,
            ExperienceDescription = experience?.Description,
            ResumeFileName = resume?.FileName,
            Languages = languages
        };
    }

    public async Task UpdateProfileAsync(int userId, UpdateProfileRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        user.Name = request.Name;
        user.Phone = request.Phone;
        user.Location = request.Location;
        user.Gender = request.Gender;

        await _context.SaveChangesAsync();
    }
}