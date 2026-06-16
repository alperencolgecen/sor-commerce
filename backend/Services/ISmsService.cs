namespace backend.Services;

public interface ISmsService
{
    Task<bool> SendSmsAsync(string phone, string message);
}
