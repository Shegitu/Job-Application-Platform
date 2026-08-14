using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace JobPlatform.Filters;

public class AdminAuthFilter : IActionFilter
{
    private readonly IConfiguration _configuration;

    public AdminAuthFilter(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var expectedToken = _configuration["AdminSettings:Token"];
        var providedToken = context.HttpContext.Request.Headers["X-Admin-Token"].ToString();

        if (string.IsNullOrEmpty(expectedToken) || providedToken != expectedToken)
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Unauthorized." });
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}