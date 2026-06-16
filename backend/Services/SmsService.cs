using System.Net.Http.Json;

namespace backend.Services;

public class SmsService : ISmsService
{
    private readonly ILogger<SmsService> _logger;
    private readonly AppSettingsService _settings;

    public SmsService(ILogger<SmsService> logger, AppSettingsService settings)
    {
        _logger = logger;
        _settings = settings;
    }

    public async Task<bool> SendSmsAsync(string phone, string message)
    {
        var provider = _settings.Get("smsProvider", "");

        if (string.IsNullOrEmpty(provider))
        {
            _logger.LogInformation("SMS sent to {Phone}: {Message}", phone, message);
            return true;
        }

        var apiKey = _settings.Get("smsApiKey", "");
        var apiUrl = _settings.Get("smsApiUrl", "");

        if (string.IsNullOrEmpty(apiUrl))
        {
            _logger.LogWarning("SMS provider '{Provider}' configured but API URL is empty", provider);
            return false;
        }

        try
        {
            using var client = new HttpClient();
            var payload = new
            {
                api_key = apiKey,
                phone,
                message,
                provider,
            };
            var response = await client.PostAsJsonAsync(apiUrl, payload);
            var success = response.IsSuccessStatusCode;
            _logger.LogInformation("SMS via {Provider} to {Phone}: {Status}", provider, phone, success ? "OK" : "FAILED");
            return success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "SMS send failed via {Provider} to {Phone}", provider, phone);
            return false;
        }
    }
}
