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
    public async Task<IActionResult> Upload([FromForm] int userId, [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Please select a resume file to upload." });
        }

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
}