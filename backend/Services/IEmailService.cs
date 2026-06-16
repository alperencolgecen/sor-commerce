namespace backend.Services;

public interface IEmailService
{
    Task<bool> SendOrderConfirmationAsync(string to, string orderNumber, string customerName, string phone, string addressDetail, string itemsHtml, string total);
}
