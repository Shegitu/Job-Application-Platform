using JobPlatform.DTOs.Resume;
using JobPlatform.Filters;
using JobPlatform.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobPlatform.Controllers;

[ApiController]
[Route("api/resume")]
public class ResumeController : ControllerBase
{
    private readonly ResumeService _resumeService;

    public ResumeController(ResumeService resumeService)
    {
        _resumeService = resumeService;
    }

    [HttpPost("upload")]
    [ServiceFilter(typeof(UserAuthFilter))]
    public async Task<IActionResult> Upload([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Please select a resume file to upload." });
        }

        var userId = (int)HttpContext.Items["CurrentUserId"]!;

        try
        {
            var result = await _resumeService.UploadAsync(userId, file);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}/languages")]
    [ServiceFilter(typeof(UserAuthFilter))]
    public async Task<IActionResult> GetLanguages(int id)
    {
        try
        {
            var result = await _resumeService.ExtractLanguagesAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/languages")]
    [ServiceFilter(typeof(UserAuthFilter))]
    public async Task<IActionResult> ConfirmLanguages(int id, [FromBody] ConfirmLanguagesRequest request)
    {
        if (request.Languages.Count == 0)
        {
            return BadRequest(new { message = "Please select at least one language." });
        }

        try
        {
            await _resumeService.ConfirmLanguagesAsync(id, request.Languages);
            return Ok(new { message = "Profile saved." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}