namespace backend.Services;

public class SmsService : ISmsService
{
    private readonly ILogger<SmsService> _logger;

    public SmsService(ILogger<SmsService> logger)
    {
        _logger = logger;
    }

    public Task<bool> SendSmsAsync(string phone, string message)
    {
        _logger.LogInformation("SMS sent to {Phone}: {Message}", phone, message);
        return Task.FromResult(true);
    }
}
