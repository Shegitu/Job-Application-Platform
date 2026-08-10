using JobPlatform.DTOs.Application;
using JobPlatform.DTOs.Experience;
using JobPlatform.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobPlatform.Controllers;

[ApiController]
[Route("api")]
public class ApplicationController : ControllerBase
{
    private readonly ApplicationService _applicationService;

    public ApplicationController(ApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [HttpPost("experience")]
    public async Task<IActionResult> SaveExperience([FromBody] ExperienceRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Please check your experience details." });
        }

        try
        {
            var experience = await _applicationService.SaveExperienceAsync(request);
            return Ok(experience);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("application/submit")]
    public async Task<IActionResult> Submit([FromBody] ApplicationRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Please check your application details." });
        }

        try
        {
            var result = await _applicationService.SubmitApplicationAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}