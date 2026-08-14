using JobPlatform.DTOs.Auth;
using JobPlatform.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobPlatform.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpGet("profile")]
[ServiceFilter(typeof(JobPlatform.Filters.UserAuthFilter))]
public async Task<IActionResult> GetProfile()
{
    var userId = (int)HttpContext.Items["CurrentUserId"]!;

    try
    {
        var profile = await _authService.GetProfileAsync(userId);
        return Ok(profile);
    }
    catch (KeyNotFoundException ex)
    {
        return NotFound(new { message = ex.Message });
    }
}

[HttpPut("profile")]
[ServiceFilter(typeof(JobPlatform.Filters.UserAuthFilter))]
public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
{
    var userId = (int)HttpContext.Items["CurrentUserId"]!;

    try
    {
        await _authService.UpdateProfileAsync(userId, request);
        return Ok(new { message = "Profile updated." });
    }
    catch (KeyNotFoundException ex)
    {
        return NotFound(new { message = ex.Message });
    }
}
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Please check your information and try again." });
        }

        try
        {
            var result = await _authService.SignupAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Please enter a valid email and password." });
        }

        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("extract")]
    public IActionResult Extract([FromBody] EmailExtractRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Please provide a valid email." });
        }

        var result = _authService.ExtractFromEmail(request.Email);
        return Ok(result);
    }
}