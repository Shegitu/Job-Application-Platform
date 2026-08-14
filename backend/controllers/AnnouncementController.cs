using JobPlatform.DTOs;
using JobPlatform.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobPlatform.Controllers;

[ApiController]
[Route("api/announcements")]
public class AnnouncementController : ControllerBase
{
    private readonly AnnouncementService _announcementService;

    public AnnouncementController(AnnouncementService announcementService)
    {
        _announcementService = announcementService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var items = await _announcementService.GetAnnouncementsAsync();
        var result = items.Select(a => new AnnouncementResponse
        {
            Id = a.Id,
            Title = a.Title,
            Message = a.Message,
            CreatedAt = a.CreatedAt.ToString("o"),
            TargetUserId = a.TargetUserId
        }).ToList();

        return Ok(result);
    }
}

[ApiController]
[Route("api/admin/announcements")]
public class AdminAnnouncementController : ControllerBase
{
    private readonly AnnouncementService _announcementService;

    public AdminAnnouncementController(AnnouncementService announcementService)
    {
        _announcementService = announcementService;
    }

    [HttpPost]
    [ServiceFilter(typeof(JobPlatform.Filters.AdminAuthFilter))]
    public async Task<IActionResult> Post([FromBody] CreateAnnouncementRequest request)
    {
        try
        {
            var created = await _announcementService.CreateAnnouncementAsync(request);
            return Ok(new { message = "Announcement saved.", id = created.Id });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Failed to create announcement." });
        }
    }
}
