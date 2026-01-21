using Dapper;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using TaskManagement.DTOs;
using TaskManagement.Models;
using TaskManagement.Services;
using TaskManagement.Services.Interfaces;
namespace TaskManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ICacheService _cacheService;
        public UsersController(IUserService userService, ICacheService cacheService)
        {
            _userService = userService;
            _cacheService = cacheService;
        }
        [HttpGet("")]
        public async Task<IActionResult> GetUsersByTeam([FromQuery] int? teamId, UserRole? role)
        {
            string key_teamId = teamId is not null ? $"team_id:{teamId}" : "";
            string key_role = role is not null ? $"role:{role}" : "";
            string key = $"myapp:users:{key_teamId}:{key_role}";
            var cacheData = await _cacheService.GetDataAsync<List<UserResponseDTO>>(key);
            string successMessage = "Return all relevant users";
            if(cacheData is not null)
            {
                return Ok(ApiResponse.OkFromCache(successMessage + " from cache", cacheData));
            }
            var filter = new FilterDTO { TeamId = teamId, Role = role };
            var response = await _userService.GetUsersByFilterAsync(filter);
            if(response.Success == false)
            {
                return StatusCode(response.ErrorCode ?? 500, ApiResponse.Error(response.ErrorMessage ?? "Internal Server Error"));
            }
            if(response.Data is not null) await _cacheService.SetDataAsync<List<UserResponseDTO>>(key, response.Data);
            return Ok(ApiResponse.Ok("Return all relevant users", response.Data!));
        }
    }
}
