using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class UrunController : ControllerBase
{
    private readonly AppDbContext _context;

    public UrunController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var urunler = await _context.Urunler.ToListAsync();
        return Ok(urunler);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var urun = await _context.Urunler.FindAsync(id);
        if (urun == null) return NotFound();
        return Ok(urun);
    }

    [HttpGet("kategori/{kategori}")]
    public async Task<IActionResult> GetByKategori(string kategori)
    {
        var urunler = await _context.Urunler
            .Where(u => u.Kategori.ToLower() == kategori.ToLower())
            .ToListAsync();
        return Ok(urunler);
    }

}
