namespace JobPlatform.DTOs.Job;

public class JobResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> RequiredLanguages { get; set; } = new();
    public DateTime? Deadline { get; set; }
}

public class ApplyToJobRequest
{
    public string? CoverLetter { get; set; }
}

public class ApplyToJobResponse
{
    public int ApplicationId { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class MyApplicationResponse
{
    public int ApplicationId { get; set; }
    public int JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? CoverLetter { get; set; }
    public string? DecisionMessage { get; set; }
    public DateTime SubmittedAt { get; set; }
}