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

    public SepetController(AppDbContext context) => _context = context;

    [HttpPost("siparis")]
    public async Task<IActionResult> SiparisVer([FromBody] Siparis siparis)
    {
        siparis.Tarih = DateTime.UtcNow;
        siparis.Durum = "Beklemede";
        _context.Siparisler.Add(siparis);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSiparis), new { id = siparis.Id }, siparis);
    }

    [HttpGet("siparis/{id}")]
    public async Task<IActionResult> GetSiparis(int id)
    {
        var siparis = await _context.Siparisler
            .Include(s => s.Detaylar)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (siparis == null) return NotFound();
        return Ok(siparis);
    }

    [HttpGet("siparisler/{kullaniciId}")]
    public async Task<IActionResult> GetSiparisler(int kullaniciId)
    {
        var siparisler = await _context.Siparisler
            .Include(s => s.Detaylar)
            .Where(s => s.KullaniciId == kullaniciId)
            .OrderByDescending(s => s.Tarih)
            .ToListAsync();
        return Ok(siparisler);
    }
}
