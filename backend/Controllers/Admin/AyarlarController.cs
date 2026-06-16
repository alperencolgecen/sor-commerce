using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize]
public class AyarlarController : ControllerBase
{
    private readonly AppSettingsService _settings;
    private readonly ILogger<AyarlarController> _logger;

    public AyarlarController(AppSettingsService settings, ILogger<AyarlarController> logger)
    {
        _settings = settings;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        try
        {
            var data = _settings.GetAll();
            return Ok(new
            {
                smtpHost = data.GetValueOrDefault("smtpHost", ""),
                smtpPort = data.GetValueOrDefault("smtpPort", "587"),
                smtpUsername = data.GetValueOrDefault("smtpUsername", ""),
                smtpPassword = data.GetValueOrDefault("smtpPassword", ""),
                smtpFrom = data.GetValueOrDefault("smtpFrom", "noreply@sor-ticaret.com"),
                smtpFromName = data.GetValueOrDefault("smtpFromName", "SOR Ticaret"),
                smsProvider = data.GetValueOrDefault("smsProvider", ""),
                smsApiKey = data.GetValueOrDefault("smsApiKey", ""),
                smsApiUrl = data.GetValueOrDefault("smsApiUrl", ""),
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting settings");
            return StatusCode(500, new { message = "Ayarlar yüklenirken hata oluştu" });
        }
    }

    [HttpPut]
    public IActionResult Update([FromBody] Dictionary<string, string> settings)
    {
        try
        {
            _logger.LogInformation("Updating {Count} settings", settings.Count);
            _settings.SetMany(settings);
            return Ok(new { message = "Ayarlar güncellendi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating settings");
            return StatusCode(500, new { message = "Ayarlar güncellenirken hata oluştu" });
        }
    }
}
