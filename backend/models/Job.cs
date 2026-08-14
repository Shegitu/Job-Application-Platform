namespace JobPlatform.Models;

public class Job
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RequiredLanguages { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}