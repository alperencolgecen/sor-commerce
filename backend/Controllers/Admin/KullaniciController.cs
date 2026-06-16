using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize]
public class KullaniciController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<KullaniciController> _logger;
    public KullaniciController(AppDbContext context, ILogger<KullaniciController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 50)
    {
        try
        {
            _logger.LogInformation("Getting users page {Page} limit {Limit}", page, limit);
            var query = _context.Kullanicilar.Select(k => new { k.Id, k.Ad, k.Email }).AsQueryable();
            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();
            return Ok(new PagedResponse<object>
            {
                Items = items.Cast<object>().ToList(),
                Total = total,
                Page = page,
                Limit = limit,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            return StatusCode(500, new { message = "Kullanıcılar yüklenirken hata oluştu" });
        }
    }
}
