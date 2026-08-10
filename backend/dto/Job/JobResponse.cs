namespace JobPlatform.DTOs.Job;

public class JobResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> RequiredLanguages { get; set; } = new();
}