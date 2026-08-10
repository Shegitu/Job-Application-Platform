namespace JobPlatform.Models;

public class Resume
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string Status { get; set; } = "Uploaded";
}