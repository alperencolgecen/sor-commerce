using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize]
public class KullaniciController : ControllerBase
{
    private readonly AppDbContext _context;
    public KullaniciController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Kullanicilar.Select(k => new { k.Id, k.Ad, k.Email }).ToListAsync());
}
