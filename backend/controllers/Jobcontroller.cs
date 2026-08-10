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
}