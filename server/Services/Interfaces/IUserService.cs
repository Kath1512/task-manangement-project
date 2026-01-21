using TaskManagement.DTOs;
using TaskManagement.Models;

namespace TaskManagement.Services.Interfaces
{
    public interface IUserService
    {
        public Task<ServiceResponse<List<UserResponseDTO>>> GetUsersByFilterAsync(FilterDTO filter);
    }
}
