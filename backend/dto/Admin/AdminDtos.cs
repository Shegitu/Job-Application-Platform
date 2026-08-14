namespace JobPlatform.DTOs.Admin;

public class AdminLoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AdminLoginResponse
{
    public string Token { get; set; } = string.Empty;
}

public class AdminApplicationOverview
{
    public int ApplicationId { get; set; }
    public int JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? CoverLetter { get; set; }
    public DateTime SubmittedAt { get; set; }
}

public class AdminUserOverview
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int? YearsOfExperience { get; set; }
    public string? Role { get; set; }
    public string? ResumeFileName { get; set; }
    public List<string> Languages { get; set; } = new();
    public List<AdminApplicationOverview> Applications { get; set; } = new();
}

public class CreateJobRequest
{
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> RequiredLanguages { get; set; } = new();
    public DateTime? Deadline { get; set; }
}


public class BulkDecideRequest
{
    public int? JobId { get; set; }
    public string Decision { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class BulkDecideResponse
{
    public int UpdatedCount { get; set; }
}
public class DecideApplicationRequest
{
    public int ApplicationId { get; set; }
    public string Decision { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}