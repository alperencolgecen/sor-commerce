using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config) => _config = config;

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        var adminUser = _config["Admin:Username"] ?? "admin";
        var adminPass = _config["Admin:Password"] ?? "admin123";

        if (req.Username != adminUser || req.Password != adminPass)
            return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı" });

        var jwtKey = _config["Jwt:Key"] ?? "SorTicaretAdminSecretKey2026!@#$%";
        var jwtIssuer = _config["Jwt:Issuer"] ?? "SorTicaret";
        var jwtAudience = _config["Jwt:Audience"] ?? "SorTicaretAdmin";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: new[] { new Claim(ClaimTypes.Name, req.Username), new Claim(ClaimTypes.Role, "admin") },
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), username = req.Username });
    }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}
