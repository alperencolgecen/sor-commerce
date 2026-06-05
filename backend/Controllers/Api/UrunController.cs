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

    [HttpPost]
    public async Task<IActionResult> Create(Urun urun)
    {
        _context.Urunler.Add(urun);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = urun.Id }, urun);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Urun urun)
    {
        if (id != urun.Id) return BadRequest();
        _context.Entry(urun).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var urun = await _context.Urunler.FindAsync(id);
        if (urun == null) return NotFound();
        _context.Urunler.Remove(urun);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
