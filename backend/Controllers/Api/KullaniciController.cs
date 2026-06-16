using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.Models;

namespace backend.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class KullaniciController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<KullaniciController> _logger;
    private readonly IConfiguration _config;

    public KullaniciController(AppDbContext context, ILogger<KullaniciController> logger, IConfiguration config)
    {
        _context = context;
        _logger = logger;
        _config = config;
    }

    private string GenerateJwtToken(Kullanici kullanici)
    {
        var jwtKey = _config["Jwt:Key"] ?? "SorTicaretAdminSecretKey2026!@#$%";
        var jwtIssuer = _config["Jwt:Issuer"] ?? "SorTicaret";
        var jwtAudience = _config["Jwt:Audience"] ?? "SorTicaretAdmin";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: new[]
            {
                new Claim(ClaimTypes.NameIdentifier, kullanici.Id.ToString()),
                new Claim(ClaimTypes.Name, kullanici.Ad),
                new Claim(ClaimTypes.Email, kullanici.Email),
                new Claim(ClaimTypes.Role, "customer")
            },
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpPost("kayit")]
    public async Task<IActionResult> Kayit([FromBody] Kullanici kayit)
    {
        try
        {
            _logger.LogInformation("Registering user: {Email}", kayit.Email);
            if (await _context.Kullanicilar.AnyAsync(k => k.Email == kayit.Email))
                return BadRequest(new { message = "Bu e-posta zaten kayıtlı" });

            kayit.SifreHash = BCrypt.Net.BCrypt.HashPassword(kayit.SifreHash);
            _context.Kullanicilar.Add(kayit);
            await _context.SaveChangesAsync();
            _logger.LogInformation("User {UserId} registered", kayit.Id);

            var token = GenerateJwtToken(kayit);
            return Ok(new { token, id = kayit.Id, ad = kayit.Ad, email = kayit.Email });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user {Email}", kayit.Email);
            return StatusCode(500, new { message = "Kayıt sırasında hata oluştu" });
        }
    }

    [HttpPost("giris")]
    public async Task<IActionResult> Giris([FromBody] Kullanici giris)
    {
        try
        {
            _logger.LogInformation("Login attempt: {Email}", giris.Email);
            var kullanici = await _context.Kullanicilar
                .FirstOrDefaultAsync(k => k.Email == giris.Email);
            if (kullanici == null || !BCrypt.Net.BCrypt.Verify(giris.SifreHash, kullanici.SifreHash))
                return Unauthorized(new { message = "E-posta veya şifre hatalı" });

            _logger.LogInformation("User {UserId} logged in", kullanici.Id);

            var token = GenerateJwtToken(kullanici);
            return Ok(new { token, id = kullanici.Id, ad = kullanici.Ad, email = kullanici.Email });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for {Email}", giris.Email);
            return StatusCode(500, new { message = "Giriş sırasında hata oluştu" });
        }
    }
}
