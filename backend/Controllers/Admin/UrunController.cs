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
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<UrunController> _logger;
    public UrunController(AppDbContext context, IWebHostEnvironment env, ILogger<UrunController> logger)
    {
        _context = context;
        _env = env;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation("Getting all products");
        return Ok(await _context.Urunler.ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        _logger.LogInformation("Getting product {ProductId}", id);
        var urun = await _context.Urunler.FindAsync(id);
        return urun == null ? NotFound() : Ok(urun);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] Urun urun, IFormFile gorselDosya)
    {
        _logger.LogInformation("Creating new product: {ProductName}", urun.Ad);
        if (gorselDosya != null)
            urun.Gorsel = await SaveImage(gorselDosya);

        urun.IndirimYuzde = urun.Fiyat > 0 && urun.IndirimFiyat > 0
            ? (int)Math.Round((1 - (double)urun.IndirimFiyat / (double)urun.Fiyat) * 100)
            : 0;

        _context.Urunler.Add(urun);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = urun.Id }, urun);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] Urun urun, IFormFile gorselDosya)
    {
        _logger.LogInformation("Updating product {ProductId}", id);
        if (id != urun.Id) return BadRequest();

        var existing = await _context.Urunler.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
        if (existing == null) return NotFound();

        if (gorselDosya != null)
            urun.Gorsel = await SaveImage(gorselDosya);
        else
            urun.Gorsel = existing.Gorsel;

        urun.IndirimYuzde = urun.Fiyat > 0 && urun.IndirimFiyat > 0
            ? (int)Math.Round((1 - (double)urun.IndirimFiyat / (double)urun.Fiyat) * 100)
            : 0;

        _context.Entry(urun).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        _logger.LogInformation("Product {ProductId} updated", id);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation("Deleting product {ProductId}", id);
        var urun = await _context.Urunler.FindAsync(id);
        if (urun == null) return NotFound();
        _context.Urunler.Remove(urun);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Product {ProductId} deleted", id);
        return NoContent();
    }

    private async Task<string> SaveImage(IFormFile file)
    {
        var uploads = Path.Combine(_env.WebRootPath, "uploads");
        if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

        var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        var filePath = Path.Combine(uploads, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
            await file.CopyToAsync(stream);

        return $"/uploads/{fileName}";
    }
}
