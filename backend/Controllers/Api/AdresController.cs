using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers.Api;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class AdresController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<AdresController> _logger;

    public AdresController(AppDbContext context, ILogger<AdresController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("kullanici/{kullaniciId}")]
    public async Task<IActionResult> GetByKullanici(int kullaniciId)
    {
        try
        {
            var adresler = await _context.Adresler
                .Where(a => a.KullaniciId == kullaniciId)
                .OrderByDescending(a => a.Varsayilan)
                .ThenByDescending(a => a.Id)
                .ToListAsync();
            return Ok(adresler);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting addresses for user {UserId}", kullaniciId);
            return StatusCode(500, new { message = "Adresler yüklenirken hata oluştu" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Adres adres)
    {
        try
        {
            _logger.LogInformation("Creating address for user {UserId}", adres.KullaniciId);
            if (adres.Varsayilan)
            {
                var existing = await _context.Adresler
                    .Where(a => a.KullaniciId == adres.KullaniciId && a.Varsayilan)
                    .ToListAsync();
                foreach (var e in existing) e.Varsayilan = false;
            }
            _context.Adresler.Add(adres);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Address {AddressId} created", adres.Id);
            return CreatedAtAction(nameof(GetByKullanici), new { kullaniciId = adres.KullaniciId }, adres);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating address for user {UserId}", adres.KullaniciId);
            return StatusCode(500, new { message = "Adres eklenirken hata oluştu" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Adres adres)
    {
        try
        {
            if (id != adres.Id) return BadRequest();
            var existing = await _context.Adresler.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Baslik = adres.Baslik;
            existing.Sehir = adres.Sehir;
            existing.Ilce = adres.Ilce;
            existing.AdresDetay = adres.AdresDetay;
            existing.Telefon = adres.Telefon;

            if (adres.Varsayilan && !existing.Varsayilan)
            {
                var others = await _context.Adresler
                    .Where(a => a.KullaniciId == existing.KullaniciId && a.Varsayilan && a.Id != id)
                    .ToListAsync();
                foreach (var o in others) o.Varsayilan = false;
            }
            existing.Varsayilan = adres.Varsayilan;

            await _context.SaveChangesAsync();
            _logger.LogInformation("Address {AddressId} updated", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating address {AddressId}", id);
            return StatusCode(500, new { message = "Adres güncellenirken hata oluştu" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var adres = await _context.Adresler.FindAsync(id);
            if (adres == null) return NotFound();
            _context.Adresler.Remove(adres);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Address {AddressId} deleted", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting address {AddressId}", id);
            return StatusCode(500, new { message = "Adres silinirken hata oluştu" });
        }
    }
}
