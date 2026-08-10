namespace JobPlatform.Models;

public class Experience
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int YearsOfExperience { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}