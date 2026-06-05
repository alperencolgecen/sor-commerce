using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize]
public class UrunController : ControllerBase
{
    private readonly AppDbContext _context;
    public UrunController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _context.Urunler.ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var urun = await _context.Urunler.FindAsync(id);
        return urun == null ? NotFound() : Ok(urun);
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
