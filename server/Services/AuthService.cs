using Mapster;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text.Json;
using TaskManagement.DTOs;
using TaskManagement.Models;
using TaskManagement.Repositories.Interfaces;
using TaskManagement.Services.Interfaces;

namespace TaskManagement.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<ServiceResponse<UserResponseDTO>> LoginAsync(LoginRequestDTO loginRequest)
        {
            var user = await _userRepository.GetUserByUsernameAsync(loginRequest.Username);
            if(user == null)
            {
                return ServiceResponse<UserResponseDTO>.Error("Username not found", (int) HttpStatusCode.NotFound);
            }
            if(user.Password != loginRequest.Password)
            {
                return ServiceResponse<UserResponseDTO>.Error("Wrong password", (int)HttpStatusCode.Unauthorized);
            }
            var response = user.Adapt<UserResponseDTO>();
            return ServiceResponse<UserResponseDTO>.Ok(response);
        }
        public async Task<ServiceResponse<UserResponseDTO>> RegisterAsync(CreateUserRequestDTO registerRequest)
        {
            var user = registerRequest.Adapt<User>();
            if (user.Role.ToString() == "developer" && (user.TeamId == null || user.LeaderId == null))
            {
                return ServiceResponse<UserResponseDTO>.Error("This user must be assigned to a team and has a correspond leader", (int)HttpStatusCode.BadRequest);
            }
            try
            {
                await _userRepository.CreateUserAsync(user);
                await _userRepository.SaveChangesAsync();
                var userDto = user.Adapt<UserResponseDTO>();
                return ServiceResponse<UserResponseDTO>.Ok(userDto);
            }
            catch (DbUpdateException ex)
            {
                if(ex.InnerException != null)
                {
                    if (ex.InnerException.Message.Contains("users_username"))
                    {
                        return ServiceResponse<UserResponseDTO>.Error("Username is already existed", (int)HttpStatusCode.Conflict);
                    }
                    if (ex.InnerException.Message.Contains("users_email"))
                    {
                        return ServiceResponse<UserResponseDTO>.Error("Email is already existed", (int)HttpStatusCode.Conflict);
                    }
                }
                return ServiceResponse<UserResponseDTO>.Error("Unhandled Error", (int) HttpStatusCode.InternalServerError);
            }
        }
        public async Task<ServiceResponse<Unit>> ChangePasswordAsync(ChangePasswordRequestDTO changePasswordRequest)
        {
            var user = await _userRepository.GetUserByIdAsync(changePasswordRequest.Id);
            if(user == null)
            {
                return ServiceResponse<Unit>.Error("User not found", (int)HttpStatusCode.NotFound);
            }
            if(changePasswordRequest.OldPassword != user.Password)
            {
                return ServiceResponse<Unit>.Error("Wrong password", (int)HttpStatusCode.Unauthorized);
            }
            if(changePasswordRequest.NewPassword != changePasswordRequest.ConfirmNewPassword)
            {
                return ServiceResponse<Unit>.Error("Password confirmation does not match", (int)HttpStatusCode.BadRequest);
            }
            if(changePasswordRequest.NewPassword == changePasswordRequest.OldPassword)
            {
                return ServiceResponse<Unit>.Error("New password must be different from current password", (int)HttpStatusCode.BadRequest);
            }
            try
            {
                _userRepository.ChangePassword(user, changePasswordRequest.NewPassword);
                await _userRepository.SaveChangesAsync();
                return ServiceResponse<Unit>.Ok(default);
            }
            catch(DbUpdateException ex)
            {
                Console.Write(ex?.InnerException?.Message);
                return ServiceResponse<Unit>.Error("Unhandled error", (int)HttpStatusCode.InternalServerError);
            }
        }
    }
}
