using System;

namespace JobPlatform.Models;

public class Announcement
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool SentByAdmin { get; set; } = true;
    // Optional: target a specific user (system notification)
    public int? TargetUserId { get; set; }
}
