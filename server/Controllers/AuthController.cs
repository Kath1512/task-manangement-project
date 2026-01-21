using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Net;
using System.Threading.Tasks;
using TaskManagement.DTOs;
using TaskManagement.Services.Interfaces;
namespace TaskManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ICacheService _cacheService;

    public AuthController(IAuthService authService, ICacheService cacheService)
    {
        _authService = authService;
        _cacheService = cacheService;
    }
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] CreateUserRequestDTO registerDTO)
    {
        var response = await _authService.RegisterAsync(registerDTO);
        if(response.Success == false)
        {
            return StatusCode(response.ErrorCode ?? (int) HttpStatusCode.InternalServerError, ApiResponse.Error(response.ErrorMessage!));
        }
        var key = "myapp:users";
        await _cacheService.RemoveAsync(key);
        return Ok(ApiResponse.Ok("Create user successfully", response.Data));
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginDTO)
    {
        var response = await _authService.LoginAsync(loginDTO);
        if(response.Success == false)
        {
            return StatusCode(response.ErrorCode ?? (int) HttpStatusCode.InternalServerError, ApiResponse.Error(response.ErrorMessage!));
        }
        return Ok(ApiResponse.Ok("Login successfully", response.Data!));
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDTO changePasswordDTO)
    {
        var response = await _authService.ChangePasswordAsync(changePasswordDTO);
        if(response.Success == false)
        {
            return StatusCode(response.ErrorCode ?? (int)HttpStatusCode.InternalServerError, ApiResponse.Error(response.ErrorMessage!));
        }
        return Ok(ApiResponse.Ok("Update password successfully", default));
    }
}