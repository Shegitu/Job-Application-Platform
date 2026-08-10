using System.ComponentModel.DataAnnotations;

namespace JobPlatform.DTOs.Application;

public class ApplicationRequest
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int ResumeId { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "Please select at least one language.")]
    public List<string> Languages { get; set; } = new();
}

public class ApplicationResponse
{
    public int Id { get; set; }
    public string Status { get; set; } = string.Empty;
}