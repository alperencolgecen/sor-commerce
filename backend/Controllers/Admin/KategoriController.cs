using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize]
public class KategoriController : ControllerBase
{
    private readonly AppDbContext _context;
    public KategoriController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _context.Kategoriler.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(Kategori kategori)
    {
        _context.Kategoriler.Add(kategori);
        await _context.SaveChangesAsync();
        return Ok(kategori);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Kategori kategori)
    {
        if (id != kategori.Id) return BadRequest();
        _context.Entry(kategori).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var cat = await _context.Kategoriler.FindAsync(id);
        if (cat == null) return NotFound();
        _context.Kategoriler.Remove(cat);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
