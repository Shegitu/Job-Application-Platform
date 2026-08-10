namespace JobPlatform.DTOs.Resume;

public class ResumeUploadResponse
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class ExtractedLanguagesResponse
{
    public List<string> ExtractedLanguages { get; set; } = new();
}