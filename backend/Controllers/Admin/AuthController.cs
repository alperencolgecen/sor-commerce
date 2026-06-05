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
    private const string AdminUser = "admin";
    private const string AdminPass = "admin123";

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        if (req.Username != AdminUser || req.Password != AdminPass)
            return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı" });

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SorTicaretAdminSecretKey2026!@#$%"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: "SorTicaret",
            audience: "SorTicaretAdmin",
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
