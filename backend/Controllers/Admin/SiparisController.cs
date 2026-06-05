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
    public SiparisController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var siparisler = await _context.Siparisler
            .Include(s => s.Detaylar)
            .OrderByDescending(s => s.Tarih)
            .ToListAsync();
        return Ok(siparisler);
    }

    [HttpPut("{id}/durum")]
    public async Task<IActionResult> UpdateDurum(int id, [FromBody] string durum)
    {
        var siparis = await _context.Siparisler.FindAsync(id);
        if (siparis == null) return NotFound();
        siparis.Durum = durum;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
