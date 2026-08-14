using JobPlatform.DTOs.Experience;
using JobPlatform.Filters;
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
    [ServiceFilter(typeof(UserAuthFilter))]
    public async Task<IActionResult> SaveExperience([FromBody] ExperienceRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Please check your experience details." });
        }

        var userId = (int)HttpContext.Items["CurrentUserId"]!;
        var experience = await _applicationService.SaveExperienceAsync(userId, request);
        return Ok(experience);
    }
}