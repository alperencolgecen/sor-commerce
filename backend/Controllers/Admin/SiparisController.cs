using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize]
public class SiparisController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<SiparisController> _logger;
    public SiparisController(AppDbContext context, ILogger<SiparisController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            _logger.LogInformation("Getting all orders");
            var siparisler = await _context.Siparisler
                .Include(s => s.Detaylar)
                .OrderByDescending(s => s.Tarih)
                .ToListAsync();
            return Ok(siparisler);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders");
            return StatusCode(500, new { message = "Siparişler yüklenirken hata oluştu" });
        }
    }

    [HttpPut("{id}/durum")]
    public async Task<IActionResult> UpdateDurum(int id, [FromBody] string durum)
    {
        try
        {
            _logger.LogInformation("Updating order {OrderId} status to {Status}", id, durum);
            var siparis = await _context.Siparisler.FindAsync(id);
            if (siparis == null) return NotFound();
            siparis.Durum = durum;
            await _context.SaveChangesAsync();
            _logger.LogInformation("Order {OrderId} status updated", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order {OrderId} status", id);
            return StatusCode(500, new { message = "Sipariş durumu güncellenirken hata oluştu" });
        }
    }
}
