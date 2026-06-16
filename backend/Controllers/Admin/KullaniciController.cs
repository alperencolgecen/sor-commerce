using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;

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
    public async Task<IActionResult> GetAll()
    {
        try
        {
            _logger.LogInformation("Getting all users");
            return Ok(await _context.Kullanicilar.Select(k => new { k.Id, k.Ad, k.Email }).ToListAsync());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting users");
            return StatusCode(500, new { message = "Kullanıcılar yüklenirken hata oluştu" });
        }
    }
}
