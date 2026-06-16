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
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation("Getting all products");
        var urunler = await _context.Urunler.ToListAsync();
        return Ok(urunler);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        _logger.LogInformation("Getting product {ProductId}", id);
        var urun = await _context.Urunler.FindAsync(id);
        if (urun == null) return NotFound();
        return Ok(urun);
    }

    [HttpGet("kategori/{kategori}")]
    public async Task<IActionResult> GetByKategori(string kategori)
    {
        _logger.LogInformation("Getting products by category: {Category}", kategori);
        var urunler = await _context.Urunler
            .Where(u => u.Kategori.ToLower() == kategori.ToLower())
            .ToListAsync();
        return Ok(urunler);
    }
}
