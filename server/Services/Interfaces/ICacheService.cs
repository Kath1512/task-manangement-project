namespace TaskManagement.Services.Interfaces
{
    public interface ICacheService
    {
        Task<T?> GetDataAsync<T>(string key);
        Task SetDataAsync<T>(string key, T data);
        Task RemoveAsync(string key);

    }
}
