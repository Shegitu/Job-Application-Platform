namespace JobPlatform.Models;

public class Application
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int ResumeId { get; set; }
    public Resume? Resume { get; set; }
    public int JobId { get; set; }
    public Job? Job { get; set; }
    public string? CoverLetter { get; set; }
    public string Status { get; set; } = "Pending";
    public string? DecisionMessage { get; set; }
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}