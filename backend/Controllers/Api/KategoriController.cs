using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Services;

namespace backend.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class KategoriController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<KategoriController> _logger;
    private readonly ICacheService _cache;

    public KategoriController(AppDbContext context, ILogger<KategoriController> logger, ICacheService cache)
    {
        _context = context;
        _logger = logger;
        _cache = cache;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            _logger.LogInformation("Getting all categories");
            return Ok(await _cache.GetOrSetAsync("kategoriler",
                () => _context.Kategoriler.ToListAsync(),
                TimeSpan.FromMinutes(10)));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories");
            return StatusCode(500, new { message = "Kategoriler yüklenirken hata oluştu" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            _logger.LogInformation("Getting category {CategoryId}", id);
            var kategori = await _context.Kategoriler.FindAsync(id);
            if (kategori == null) return NotFound();
            return Ok(kategori);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting category {CategoryId}", id);
            return StatusCode(500, new { message = "Kategori yüklenirken hata oluştu" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(Models.Kategori kategori)
    {
        try
        {
            _logger.LogInformation("Creating category: {CategoryName}", kategori.Ad);
            _context.Kategoriler.Add(kategori);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Category created with ID {CategoryId}", kategori.Id);
            return CreatedAtAction(nameof(GetById), new { id = kategori.Id }, kategori);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating category {CategoryName}", kategori.Ad);
            return StatusCode(500, new { message = "Kategori eklenirken hata oluştu" });
        }
    }
}
