using Microsoft.OpenApi.Any;

namespace TaskManagement.DTOs
{
    public class ApiResponse
    {
        public required bool Success { get; set; }
        public string? Message { get; set; }
        public object? Data { get; set; }
        public bool FromCache { get; set; }

        public static ApiResponse Ok(string message, object? data = null) => new ApiResponse { Success = true, Message = message, Data = data };
        public static ApiResponse Error(string message) => new ApiResponse { Success = false, Message = message};
        public static ApiResponse OkFromCache(string message, object? data = null) => new ApiResponse { Success = true, FromCache = true, Message = message, Data = data };

    }

    public class ServiceResponse<T>
    {
        public required bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public int? ErrorCode { get; set; }
        public T? Data { get; set; }

        public static ServiceResponse<T> Ok(T data)
            => new ServiceResponse<T> { Success = true, Data = data };
        public static ServiceResponse<T> Error(string errorMessage, int errorCode)
            => new ServiceResponse<T> { Success = false, ErrorMessage = errorMessage, ErrorCode = errorCode };
    }
    public struct Unit { }
}
