using JobPlatform.DTOs;
using JobPlatform.Models;
using JobPlatform.Data;

namespace JobPlatform.Services;

public class AnnouncementService
{
    private static readonly List<Announcement> _announcements = new();
    private static int _nextId = 1;
    private readonly EmailService _emailService;
    private readonly ApplicationDbContext? _context;

    public AnnouncementService(EmailService emailService, ApplicationDbContext? context = null)
    {
        _emailService = emailService;
        _context = context;
    }

    public Task<List<Announcement>> GetAnnouncementsAsync()
    {
        // return a copy to avoid external mutation
        var copy = _announcements.OrderByDescending(a => a.CreatedAt).ToList();
        return Task.FromResult(copy);
    }

    public async Task<Announcement> CreateAnnouncementAsync(CreateAnnouncementRequest request)
    {
        var ann = new Announcement
        {
            Id = System.Threading.Interlocked.Increment(ref _nextId),
            Title = request.Title,
            Message = request.Message,
            CreatedAt = DateTime.UtcNow,
            SentByAdmin = true
            , TargetUserId = request.TargetUserId
        };

        _announcements.Add(ann);

        if (request.SendEmail)
        {
            try
            {
                // If a DB context exists, try to send to users from DB, otherwise just attempt to send to no one
                if (_context != null)
                {
                    var subject = string.IsNullOrEmpty(request.Title) ? "Announcement" : request.Title;

                    if (request.TargetUserId.HasValue)
                    {
                        var u = _context.Users.FirstOrDefault(x => x.Id == request.TargetUserId.Value);
                        if (u != null)
                        {
                            await _emailService.SendEmailAsync(u.Email, subject, request.Message);
                        }
                    }
                    else
                    {
                        var users = _context.Users.ToList();
                        foreach (var u in users)
                        {
                            await _emailService.SendEmailAsync(u.Email, subject, request.Message);
                        }
                    }
                }
            }
            catch
            {
                // swallow email errors; controller will translate if needed
            }
        }

        return ann;
    }
}
