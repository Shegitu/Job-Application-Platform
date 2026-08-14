using JobPlatform.DTOs.Job;
using JobPlatform.Filters;
using JobPlatform.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobPlatform.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobController : ControllerBase
{
    private readonly JobService _jobService;

    public JobController(JobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet]
    public async Task<IActionResult> GetJobs()
    {
        var jobs = await _jobService.GetJobsAsync();

        if (jobs.Count == 0)
        {
            return NotFound(new { message = "No jobs found." });
        }

        return Ok(jobs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJobById(int id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        if (job == null)
        {
            return NotFound(new { message = "Job not found." });
        }

        return Ok(job);
    }

    [HttpPost("{id}/apply")]
    [ServiceFilter(typeof(UserAuthFilter))]
    public async Task<IActionResult> Apply(int id, [FromBody] ApplyToJobRequest request)
    {
        var userId = (int)HttpContext.Items["CurrentUserId"]!;

        try
        {
            var result = await _jobService.ApplyToJobAsync(userId, id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("mine")]
    [ServiceFilter(typeof(UserAuthFilter))]
    public async Task<IActionResult> GetMyApplications()
    {
        var userId = (int)HttpContext.Items["CurrentUserId"]!;
        var applications = await _jobService.GetMyApplicationsAsync(userId);
        return Ok(applications);
    }
}