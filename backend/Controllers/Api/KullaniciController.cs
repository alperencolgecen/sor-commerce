using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class KullaniciController : ControllerBase
{
    private readonly AppDbContext _context;

    public KullaniciController(AppDbContext context) => _context = context;

    [HttpPost("kayit")]
    public async Task<IActionResult> Kayit([FromBody] Kullanici kayit)
    {
        if (await _context.Kullanicilar.AnyAsync(k => k.Email == kayit.Email))
            return BadRequest(new { message = "Bu e-posta zaten kayıtlı" });

        kayit.SifreHash = BCrypt.Net.BCrypt.HashPassword(kayit.SifreHash);
        _context.Kullanicilar.Add(kayit);
        await _context.SaveChangesAsync();
        return Ok(new { id = kayit.Id, ad = kayit.Ad, email = kayit.Email });
    }

    [HttpPost("giris")]
    public async Task<IActionResult> Giris([FromBody] Kullanici giris)
    {
        var kullanici = await _context.Kullanicilar
            .FirstOrDefaultAsync(k => k.Email == giris.Email);
        if (kullanici == null || !BCrypt.Net.BCrypt.Verify(giris.SifreHash, kullanici.SifreHash))
            return Unauthorized(new { message = "E-posta veya şifre hatalı" });

        return Ok(new { id = kullanici.Id, ad = kullanici.Ad, email = kullanici.Email });
    }
}
