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
    private readonly ILogger<KategoriController> _logger;
    public KategoriController(AppDbContext context, ILogger<KategoriController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation("Getting all categories");
        return Ok(await _context.Kategoriler.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(Kategori kategori)
    {
        _logger.LogInformation("Creating category: {CategoryName}", kategori.Ad);
        _context.Kategoriler.Add(kategori);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Category created with ID {CategoryId}", kategori.Id);
        return Ok(kategori);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Kategori kategori)
    {
        _logger.LogInformation("Updating category {CategoryId}", id);
        if (id != kategori.Id) return BadRequest();
        _context.Entry(kategori).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        _logger.LogInformation("Category {CategoryId} updated", id);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation("Deleting category {CategoryId}", id);
        var cat = await _context.Kategoriler.FindAsync(id);
        if (cat == null) return NotFound();
        _context.Kategoriler.Remove(cat);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Category {CategoryId} deleted", id);
        return NoContent();
    }
}
