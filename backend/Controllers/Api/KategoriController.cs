using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class KategoriController : ControllerBase
{
    private readonly AppDbContext _context;

    public KategoriController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Kategoriler.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var kategori = await _context.Kategoriler.FindAsync(id);
        if (kategori == null) return NotFound();
        return Ok(kategori);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Models.Kategori kategori)
    {
        _context.Kategoriler.Add(kategori);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = kategori.Id }, kategori);
    }
}
