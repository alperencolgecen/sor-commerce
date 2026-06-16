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
    private readonly ILogger<UrunController> _logger;

    public UrunController(AppDbContext context, ILogger<UrunController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        try
        {
            _logger.LogInformation("Getting products page {Page} limit {Limit}", page, limit);
            var query = _context.Urunler.AsQueryable();
            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();
            return Ok(new PagedResponse<Urun>
            {
                Items = items,
                Total = total,
                Page = page,
                Limit = limit,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all products");
            return StatusCode(500, new { message = "Ürünler yüklenirken hata oluştu" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            _logger.LogInformation("Getting product {ProductId}", id);
            var urun = await _context.Urunler.FindAsync(id);
            if (urun == null) return NotFound();
            return Ok(urun);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product {ProductId}", id);
            return StatusCode(500, new { message = "Ürün yüklenirken hata oluştu" });
        }
    }

    [HttpGet("kategori/{kategori}")]
    public async Task<IActionResult> GetByKategori(string kategori, [FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        try
        {
            _logger.LogInformation("Getting products by category: {Category}", kategori);
            var query = _context.Urunler.Where(u => u.Kategori.ToLower() == kategori.ToLower());
            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();
            return Ok(new PagedResponse<Urun>
            {
                Items = items,
                Total = total,
                Page = page,
                Limit = limit,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products by category {Category}", kategori);
            return StatusCode(500, new { message = "Kategori ürünleri yüklenirken hata oluştu" });
        }
    }
}
