using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class SmsController : ControllerBase
{
    private readonly ISmsService _sms;
    private readonly ILogger<SmsController> _logger;

    public SmsController(ISmsService sms, ILogger<SmsController> logger)
    {
        _sms = sms;
        _logger = logger;
    }

    [HttpPost("send-code")]
    public async Task<IActionResult> SendCode([FromBody] SmsSendRequest request)
    {
        try
        {
            _logger.LogInformation("Sending SMS code to {Phone}", request.Phone);
            var code = new Random().Next(100000, 999999).ToString();
            var message = $"{code} bankacilik isleminizin dogrulama kodudur. Kodu kimseyle paylasmayiniz.";
            var sent = await _sms.SendSmsAsync(request.Phone, message);
            if (!sent) return StatusCode(500, new { message = "SMS gonderilemedi" });
            return Ok(new { code });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending SMS to {Phone}", request.Phone);
            return StatusCode(500, new { message = "SMS gonderilirken hata olustu" });
        }
    }
}

public class SmsSendRequest
{
    public string Phone { get; set; }
}
