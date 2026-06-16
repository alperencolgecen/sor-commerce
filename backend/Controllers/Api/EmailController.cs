using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IEmailService _email;
    private readonly ILogger<EmailController> _logger;

    public EmailController(IEmailService email, ILogger<EmailController> logger)
    {
        _email = email;
        _logger = logger;
    }

    [HttpPost("order-confirmation")]
    public async Task<IActionResult> SendOrderConfirmation([FromBody] OrderConfirmationRequest request)
    {
        try
        {
            _logger.LogInformation("Sending order confirmation email to {Email}", request.Email);
            var itemsHtml = string.Join("", request.Items.Select(i =>
                $"<tr><td style='padding:8px 0;border-bottom:1px solid #f3f4f6'>{i.Name} x{i.Qty}</td><td style='padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right'>{i.Price} TL</td></tr>"
            ));
            var sent = await _email.SendOrderConfirmationAsync(
                request.Email, request.OrderNumber, request.CustomerName,
                request.Phone, request.AddressDetail, itemsHtml, request.Total
            );
            if (!sent) return StatusCode(500, new { message = "E-posta gonderilemedi" });
            return Ok(new { message = "E-posta gonderildi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {Email}", request.Email);
            return StatusCode(500, new { message = "E-posta gonderilirken hata olustu" });
        }
    }
}

public class OrderConfirmationRequest
{
    public string Email { get; set; }
    public string OrderNumber { get; set; }
    public string CustomerName { get; set; }
    public string Phone { get; set; }
    public string AddressDetail { get; set; }
    public string Total { get; set; }
    public List<OrderItemDto> Items { get; set; }
}

public class OrderItemDto
{
    public string Name { get; set; }
    public int Qty { get; set; }
    public string Price { get; set; }
}
