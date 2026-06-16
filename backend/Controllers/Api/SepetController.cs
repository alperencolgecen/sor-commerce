using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class SepetController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<SepetController> _logger;

    public SepetController(AppDbContext context, ILogger<SepetController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("siparis")]
    public async Task<IActionResult> SiparisVer([FromBody] Siparis siparis)
    {
        _logger.LogInformation("Creating order for user {UserId}", siparis.KullaniciId);
        siparis.Tarih = DateTime.UtcNow;
        siparis.Durum = "Beklemede";
        _context.Siparisler.Add(siparis);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Order {OrderId} created", siparis.Id);
        return CreatedAtAction(nameof(GetSiparis), new { id = siparis.Id }, siparis);
    }

    [HttpGet("siparis/{id}")]
    public async Task<IActionResult> GetSiparis(int id)
    {
        _logger.LogInformation("Getting order {OrderId}", id);
        var siparis = await _context.Siparisler
            .Include(s => s.Detaylar)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (siparis == null) return NotFound();
        return Ok(siparis);
    }

    [HttpGet("siparisler/{kullaniciId}")]
    public async Task<IActionResult> GetSiparisler(int kullaniciId)
    {
        _logger.LogInformation("Getting orders for user {UserId}", kullaniciId);
        var siparisler = await _context.Siparisler
            .Include(s => s.Detaylar)
            .Where(s => s.KullaniciId == kullaniciId)
            .OrderByDescending(s => s.Tarih)
            .ToListAsync();
        return Ok(siparisler);
    }
}
