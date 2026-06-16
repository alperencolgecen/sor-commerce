using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

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
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 50)
    {
        try
        {
            _logger.LogInformation("Getting orders page {Page} limit {Limit}", page, limit);
            var query = _context.Siparisler
                .Include(s => s.Detaylar)
                .OrderByDescending(s => s.Tarih)
                .AsQueryable();
            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();
            return Ok(new PagedResponse<Siparis>
            {
                Items = items,
                Total = total,
                Page = page,
                Limit = limit,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting orders");
            return StatusCode(500, new { message = "Siparişler yüklenirken hata oluştu" });
        }
    }

    [HttpPut("{id}/durum")]
    public async Task<IActionResult> UpdateDurum(int id, [FromQuery] string durum)
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
