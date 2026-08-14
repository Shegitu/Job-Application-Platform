namespace JobPlatform.DTOs;

public class CreateAnnouncementRequest
{
    public string? Title { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool SendEmail { get; set; } = false;
    public int? TargetUserId { get; set; }
}

public class AnnouncementResponse
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string Message { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public int? TargetUserId { get; set; }
}
