using TaskManagement.DTOs;
namespace TaskManagement.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ServiceResponse<UserResponseDTO>> LoginAsync(LoginRequestDTO loginRequest);
        Task<ServiceResponse<UserResponseDTO>> RegisterAsync(CreateUserRequestDTO registerRequest);
        Task<ServiceResponse<Unit>> ChangePasswordAsync(ChangePasswordRequestDTO registerRequest);
    }
}
