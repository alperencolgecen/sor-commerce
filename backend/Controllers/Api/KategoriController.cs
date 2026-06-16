using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        _logger.LogInformation("Getting category {CategoryId}", id);
        var kategori = await _context.Kategoriler.FindAsync(id);
        if (kategori == null) return NotFound();
        return Ok(kategori);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Models.Kategori kategori)
    {
        _logger.LogInformation("Creating category: {CategoryName}", kategori.Ad);
        _context.Kategoriler.Add(kategori);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Category created with ID {CategoryId}", kategori.Id);
        return CreatedAtAction(nameof(GetById), new { id = kategori.Id }, kategori);
    }
}
