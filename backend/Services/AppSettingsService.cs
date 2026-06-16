using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace backend.Services;

public class AppSettingsService
{
    private readonly string _filePath;
    private Dictionary<string, string> _cache;
    private readonly object _lock = new();

    public AppSettingsService(IWebHostEnvironment env)
    {
        var dir = Path.Combine(env.ContentRootPath, "App_Data");
        Directory.CreateDirectory(dir);
        _filePath = Path.Combine(dir, "settings.json");
        _cache = Load();
    }

    private Dictionary<string, string> Load()
    {
        try
        {
            if (File.Exists(_filePath))
            {
                var json = File.ReadAllText(_filePath);
                return JsonSerializer.Deserialize<Dictionary<string, string>>(json) ?? new();
            }
        }
        catch { }
        return new();
    }

    private void Save()
    {
        var json = JsonSerializer.Serialize(_cache, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(_filePath, json);
    }

    public string Get(string key, string defaultValue = "")
    {
        lock (_lock)
        {
            return _cache.TryGetValue(key, out var val) ? val : defaultValue;
        }
    }

    public void Set(string key, string value)
    {
        lock (_lock)
        {
            _cache[key] = value;
            Save();
        }
    }

    public Dictionary<string, string> GetAll()
    {
        lock (_lock)
        {
            return new Dictionary<string, string>(_cache);
        }
    }

    public void SetMany(Dictionary<string, string> values)
    {
        lock (_lock)
        {
            foreach (var kv in values)
                _cache[kv.Key] = kv.Value;
            Save();
        }
    }
}
