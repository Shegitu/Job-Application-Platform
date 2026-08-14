using System.ComponentModel.DataAnnotations;

namespace JobPlatform.DTOs.Experience;

public class ExperienceRequest
{
    [Range(0, int.MaxValue, ErrorMessage = "Years of experience must be 0 or greater.")]
    public int YearsOfExperience { get; set; }

    [Required]
    public string Role { get; set; } = string.Empty;

    public string? Description { get; set; }
}