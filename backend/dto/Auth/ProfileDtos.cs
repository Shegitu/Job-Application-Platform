namespace JobPlatform.DTOs.Auth;

public class ProfileResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int? YearsOfExperience { get; set; }
    public string? Role { get; set; }
    public string? ExperienceDescription { get; set; }
    public string? ResumeFileName { get; set; }
    public List<string> Languages { get; set; } = new();
}

public class UpdateProfileRequest
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
}