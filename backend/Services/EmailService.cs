using System.Net;
using System.Net.Mail;

namespace backend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task<bool> SendOrderConfirmationAsync(string to, string orderNumber, string customerName, string phone, string addressDetail, string itemsHtml, string total)
    {
        try
        {
            var host = _config["Smtp:Host"];
            if (!string.IsNullOrEmpty(host))
            {
                var port = int.Parse(_config["Smtp:Port"] ?? "587");
                var username = _config["Smtp:Username"];
                var password = _config["Smtp:Password"];
                var from = _config["Smtp:From"];
                var fromName = _config["Smtp:FromName"];

                using var client = new SmtpClient(host, port);
                client.EnableSsl = true;
                client.Credentials = new NetworkCredential(username, password);

                var mail = new MailMessage
                {
                    From = new MailAddress(from, fromName),
                    Subject = $"Sipariş Onayı — {orderNumber}",
                    IsBodyHtml = true,
                    Body = $@"
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='font-family:Arial,sans-serif;background:#f5f5f5;padding:24px'>
<div style='max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)'>
<div style='background:#F27A1A;padding:24px;text-align:center'>
  <h2 style='color:#fff;margin:0'>Sipariş Onayı</h2>
</div>
<div style='padding:24px'>
  <p style='font-size:14px;color:#333'>Merhaba <strong>{customerName}</strong>,</p>
  <p style='font-size:14px;color:#333'>Siparişiniz başarıyla alındı.</p>
  <div style='background:#f9fafb;border-radius:8px;padding:14px 16px;margin:16px 0;font-size:13px;color:#6b7280'>
    <div><strong>Sipariş No:</strong> {orderNumber}</div>
    <div><strong>Telefon:</strong> {phone}</div>
    <div><strong>Teslimat:</strong> {addressDetail}</div>
  </div>
  <table style='width:100%;border-collapse:collapse;font-size:13px;margin:16px 0'>
    <thead><tr><th style='text-align:left;padding:8px 0;border-bottom:2px solid #e5e7eb;color:#6b7280'>Ürün</th><th style='text-align:right;padding:8px 0;border-bottom:2px solid #e5e7eb;color:#6b7280'>Tutar</th></tr></thead>
    <tbody>{itemsHtml}</tbody>
  </table>
  <div style='border-top:2px solid #e5e7eb;padding-top:10px;text-align:right;font-size:16px;font-weight:700;color:#1d1d1d'>Toplam: {total} TL</div>
  <p style='font-size:13px;color:#F27A1A;text-align:center;margin-top:20px'><strong>Tahmini teslimat:</strong> {DateTime.Now.AddDays(5):dd MMMM yyyy}</p>
</div>
<div style='background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#999'>
  SOR Ticaret &copy; {DateTime.Now.Year}
</div>
</div>
</body>
</html>",
                };
                mail.To.Add(to);
                await client.SendMailAsync(mail);
                _logger.LogInformation("Order confirmation email sent to {Email}", to);
            }
            else
            {
                _logger.LogInformation("EMAIL (SMTP not configured) — To: {Email}, Order: {OrderNumber}", to, orderNumber);
            }
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", to);
            return false;
        }
    }
}
