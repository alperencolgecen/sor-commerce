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
        try
        {
            _logger.LogInformation("Getting all categories");
            return Ok(await _context.Kategoriler.ToListAsync());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories");
            return StatusCode(500, new { message = "Kategoriler yüklenirken hata oluştu" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(Kategori kategori)
    {
        try
        {
            _logger.LogInformation("Creating category: {CategoryName}", kategori.Ad);
            _context.Kategoriler.Add(kategori);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Category created with ID {CategoryId}", kategori.Id);
            return Ok(kategori);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating category {CategoryName}", kategori.Ad);
            return StatusCode(500, new { message = "Kategori eklenirken hata oluştu" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Kategori kategori)
    {
        try
        {
            _logger.LogInformation("Updating category {CategoryId}", id);
            var existing = await _context.Kategoriler.FindAsync(id);
            if (existing == null) return NotFound();
            existing.Ad = kategori.Ad;
            if (kategori.Ikon != null) existing.Ikon = kategori.Ikon;
            if (kategori.Renk != null) existing.Renk = kategori.Renk;
            await _context.SaveChangesAsync();
            _logger.LogInformation("Category {CategoryId} updated", id);
            return Ok(existing);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating category {CategoryId}", id);
            return StatusCode(500, new { message = "Kategori güncellenirken hata oluştu" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            _logger.LogInformation("Deleting category {CategoryId}", id);
            var cat = await _context.Kategoriler.FindAsync(id);
            if (cat == null) return NotFound();
            _context.Kategoriler.Remove(cat);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Category {CategoryId} deleted", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting category {CategoryId}", id);
            return StatusCode(500, new { message = "Kategori silinirken hata oluştu" });
        }
    }
}
