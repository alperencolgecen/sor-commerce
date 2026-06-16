using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Services;

namespace backend.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class UrunController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<UrunController> _logger;
    private readonly ICacheService _cache;

    public UrunController(AppDbContext context, ILogger<UrunController> logger, ICacheService cache)
    {
        _context = context;
        _logger = logger;
        _cache = cache;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        try
        {
            _logger.LogInformation("Getting products page {Page} limit {Limit}", page, limit);
            var cacheKey = $"urunler_{page}_{limit}";
            var result = await _cache.GetOrSetAsync(cacheKey, async () =>
            {
                var query = _context.Urunler.AsQueryable();
                var total = await query.CountAsync();
                var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();
                return new PagedResponse<Urun>
                {
                    Items = items,
                    Total = total,
                    Page = page,
                    Limit = limit,
                };
            }, TimeSpan.FromMinutes(2));
            return Ok(result);
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
            var cacheKey = $"urunler_kategori_{kategori}_{page}_{limit}";
            var result = await _cache.GetOrSetAsync(cacheKey, async () =>
            {
                var query = _context.Urunler.Where(u => u.Kategori.ToLower() == kategori.ToLower());
                var total = await query.CountAsync();
                var items = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();
                return new PagedResponse<Urun>
                {
                    Items = items,
                    Total = total,
                    Page = page,
                    Limit = limit,
                };
            }, TimeSpan.FromMinutes(2));
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products by category {Category}", kategori);
            return StatusCode(500, new { message = "Kategori ürünleri yüklenirken hata oluştu" });
        }
    }
}
