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
        try
        {
            _logger.LogInformation("Creating order for user {UserId}", siparis.KullaniciId);
            siparis.Tarih = DateTime.UtcNow;
            siparis.Durum = "Beklemede";
            foreach (var detay in siparis.Detaylar)
            {
                var urun = await _context.Urunler.FindAsync(detay.UrunId);
                if (urun != null)
                {
                    detay.UrunAd = urun.Ad;
                    detay.UrunGorsel = urun.Gorsel;
                    urun.StokMiktari = Math.Max(0, urun.StokMiktari - detay.Adet);
                    if (urun.StokMiktari == 0) urun.Stokta = false;
                }
            }
            _context.Siparisler.Add(siparis);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Order {OrderId} created", siparis.Id);
            return CreatedAtAction(nameof(GetSiparis), new { id = siparis.Id }, siparis);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order for user {UserId}", siparis.KullaniciId);
            return StatusCode(500, new { message = "Sipariş oluşturulurken hata oluştu" });
        }
    }

    [HttpGet("siparis/{id}")]
    public async Task<IActionResult> GetSiparis(int id)
    {
        try
        {
            _logger.LogInformation("Getting order {OrderId}", id);
            var siparis = await _context.Siparisler
                .Include(s => s.Detaylar)
                .FirstOrDefaultAsync(s => s.Id == id);
            if (siparis == null) return NotFound();
            return Ok(siparis);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order {OrderId}", id);
            return StatusCode(500, new { message = "Sipariş yüklenirken hata oluştu" });
        }
    }

    [HttpGet("siparisler/{kullaniciId}")]
    public async Task<IActionResult> GetSiparisler(int kullaniciId)
    {
        try
        {
            _logger.LogInformation("Getting orders for user {UserId}", kullaniciId);
            var siparisler = await _context.Siparisler
                .Include(s => s.Detaylar)
                .Where(s => s.KullaniciId == kullaniciId)
                .OrderByDescending(s => s.Tarih)
                .ToListAsync();
            return Ok(siparisler);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders for user {UserId}", kullaniciId);
            return StatusCode(500, new { message = "Siparişler yüklenirken hata oluştu" });
        }
    }
}
