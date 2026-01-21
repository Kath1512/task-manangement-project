using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using TaskManagement.Services.Interfaces;

namespace TaskManagement.Services
{
    public class CacheService : ICacheService
    {
        private readonly IDistributedCache? _cache;
        public CacheService(IDistributedCache cache)
        {
            _cache = cache;
        }

        public async Task<T?> GetDataAsync<T>(string key)
        {
            if (_cache is null) return default;
            var data = await _cache.GetStringAsync(key);
            if (string.IsNullOrEmpty(data)) return default;
            return JsonSerializer.Deserialize<T>(data);
        }
        public async Task SetDataAsync<T>(string key, T data)
        {

            if (_cache is null) return;
            var json = JsonSerializer.Serialize(data);
            var options = new DistributedCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)

            };
            await _cache.SetStringAsync(key, json, options);
        }

        public async Task RemoveAsync(string key)
        {
            if (_cache is null) return;
            await _cache.RemoveAsync(key);
        }

    }
}
