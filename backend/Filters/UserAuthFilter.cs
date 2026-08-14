using JobPlatform.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace JobPlatform.Filters;

public class UserAuthFilter : IAsyncActionFilter
{
    private readonly ApplicationDbContext _context;

    public UserAuthFilter(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var token = context.HttpContext.Request.Headers["X-User-Token"].ToString();

        if (string.IsNullOrEmpty(token))
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Please log in." });
            return;
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.AuthToken == token);

        if (user == null)
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Session expired. Please log in again." });
            return;
        }

        context.HttpContext.Items["CurrentUserId"] = user.Id;

        await next();
    }
}