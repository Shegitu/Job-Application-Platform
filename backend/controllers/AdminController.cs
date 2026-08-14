using JobPlatform.DTOs.Admin;
using JobPlatform.Filters;
using JobPlatform.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobPlatform.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;
    private readonly ResumeService _resumeService;

    public AdminController(AdminService adminService, ResumeService resumeService)
    {
        _adminService = adminService;
        _resumeService = resumeService;
    }
    
        [HttpPost("login")]
    public IActionResult Login([FromBody] AdminLoginRequest request)
    {
        var token = _adminService.Login(request.Username, request.Password);

        if (token == null)
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        return Ok(new AdminLoginResponse { Token = token });
    }

    [HttpGet("users")]
    [ServiceFilter(typeof(AdminAuthFilter))]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _adminService.GetUsersOverviewAsync();
        return Ok(users);
    }

    [HttpPost("jobs")]
    [ServiceFilter(typeof(AdminAuthFilter))]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobRequest request)
    {
        var job = await _adminService.CreateJobAsync(request);
        return Ok(job);
    }
   [HttpPost("applications/decide-bulk")]
[ServiceFilter(typeof(AdminAuthFilter))]
public async Task<IActionResult> DecideBulk([FromBody] BulkDecideRequest request)
{
    try
    {
        var count = await _adminService.DecideBulkAsync(request);
        return Ok(new BulkDecideResponse { UpdatedCount = count });
    }
    catch (Exception)
    {
        return StatusCode(500, new { message = "Failed to send announcements. Please check email settings." });
    }
}
    [HttpPost("applications/decide")]
    [ServiceFilter(typeof(AdminAuthFilter))]
    public async Task<IActionResult> Decide([FromBody] DecideApplicationRequest request)
    {
        try
        {
            await _adminService.DecideApplicationAsync(request.ApplicationId, request.Decision, request.Message);
            return Ok(new { message = "Decision sent." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Failed to send email. Please check email settings." });
        }
    }

    [HttpGet("users/{userId}/resume")]
    [ServiceFilter(typeof(AdminAuthFilter))]
    public async Task<IActionResult> DownloadResume(int userId)
    {
        var resume = await _resumeService.GetResumeByUserIdAsync(userId);
        if (resume == null || string.IsNullOrEmpty(resume.FilePath) || !System.IO.File.Exists(resume.FilePath))
        {
            return NotFound(new { message = "Resume not found." });
        }

        var stream = System.IO.File.OpenRead(resume.FilePath);
        var contentType = "application/octet-stream";
        return File(stream, contentType, resume.FileName);
    }
}