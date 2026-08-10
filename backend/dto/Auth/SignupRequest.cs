using System.ComponentModel.DataAnnotations;

namespace JobPlatform.DTOs.Auth;

public class SignupRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Gender { get; set; } = string.Empty;

    [Required]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string Location { get; set; } = string.Empty;
}

public class EmailExtractRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class EmailExtractResponse
{
    public string? Name { get; set; }
    public string? Location { get; set; }
}