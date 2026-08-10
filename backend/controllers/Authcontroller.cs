using JobPlatform.DTOs.Auth;
using JobPlatform.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobPlatform.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
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
            var user = await _authService.SignupAsync(request);
            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
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