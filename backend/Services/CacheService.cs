using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace backend.Services;

public interface ICacheService
{
    Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiry = null);
    void Remove(string key);
}

public class CacheService : ICacheService
{
    private readonly IMemoryCache _memoryCache;
    private readonly ConnectionMultiplexer _redis;
    private readonly bool _redisAvailable;

    public CacheService(IMemoryCache memoryCache, IConfiguration config)
    {
        _memoryCache = memoryCache;
        var redisConfig = config.GetSection("Redis");
        var enabled = redisConfig.GetValue<bool>("Enabled");
        var connection = redisConfig.GetValue<string>("Connection") ?? "localhost:6379";

        if (enabled)
        {
            try
            {
                _redis = ConnectionMultiplexer.Connect($"{connection},abortConnect=false");
                _redisAvailable = true;
            }
            catch
            {
                _redisAvailable = false;
            }
        }
    }

    public async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiry = null)
    {
        expiry ??= TimeSpan.FromMinutes(5);

        if (_redisAvailable)
        {
            try
            {
                var db = _redis.GetDatabase();
                var cached = await db.StringGetAsync(key);
                if (cached.HasValue)
                    return System.Text.Json.JsonSerializer.Deserialize<T>(cached);

                var value = await factory();
                var serialized = System.Text.Json.JsonSerializer.Serialize(value);
                await db.StringSetAsync(key, serialized, TimeSpan.FromMinutes(5));
                if (expiry.HasValue)
                    await db.KeyExpireAsync(key, expiry.Value);
                return value;
            }
            catch
            {
                // Redis failed, fall through to memory cache
            }
        }

        return await _memoryCache.GetOrCreateAsync(key, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = expiry;
            return await factory();
        });
    }

    public void Remove(string key)
    {
        _memoryCache.Remove(key);
        if (_redisAvailable)
        {
            try { _redis.GetDatabase().KeyDelete(key); }
            catch { }
        }
    }
}
