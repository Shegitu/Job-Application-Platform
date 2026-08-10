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

    public async Task<User> SignupAsync(SignupRequest request)
    {
        var existing = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existing != null)
        {
            throw new InvalidOperationException("An account with this email already exists.");
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Gender = request.Gender,
            Phone = request.Phone,
            Location = request.Location
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public EmailExtractResponse ExtractFromEmail(string email)
    {
        var localPart = email.Split('@')[0];
        var name = string.Join(" ", localPart.Split('.', '_', '-'))
            .Trim();

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
}