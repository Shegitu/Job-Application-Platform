namespace JobPlatform.Models;

public class Language
{
    public int Id { get; set; }
    public int ResumeId { get; set; }
    public Resume? Resume { get; set; }
    public string Name { get; set; } = string.Empty;
}