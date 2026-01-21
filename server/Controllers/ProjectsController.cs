using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;
using Npgsql;
using TaskManagement.DTOs;
using TaskManagement.Models;
using TaskManagement.Services.Interfaces;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TaskManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ICacheService _cacheService;
        public ProjectsController(IProjectService projectService, ICacheService cacheSevice) 
        {
            _projectService = projectService;
            _cacheService = cacheSevice;
        }
        // GET: api/<ProjectController>
        [HttpGet("")]
        public async Task<IActionResult> GetProjectsByTeam([FromQuery] int? teamId)
        {
            var key_teamId = teamId.HasValue ? $":team_id:{teamId}" : "";
            var key = $"myapp:projects{key_teamId}";
            var cacheData = await _cacheService.GetDataAsync<List<ProjectDTO>>(key);
            if(cacheData is not null)
            {
                return Ok(ApiResponse.OkFromCache("Return all projects", cacheData));
            }
            var response = await _projectService.GetProjectsByTeamIdAsync(teamId);
            if(response.Success == false)
            {
                return StatusCode(response.ErrorCode ?? 500, ApiResponse.Error(response.ErrorMessage ?? "Internal Server Error"));
            }
            if(response.Data is not null) await _cacheService.SetDataAsync<List<ProjectDTO>>(key, response.Data);
            return Ok(ApiResponse.Ok("Ok", response.Data));
        }
        [HttpGet("{ProjectId}")]
        public async Task<IActionResult> GetProjectById(int projectId)
        {
            var response = await _projectService.GetProjectByIdAsync(projectId);
            if (response.Success == false)
            {
                return StatusCode(response.ErrorCode ?? 500, ApiResponse.Error(response.ErrorMessage ?? "Internal Server Error"));
            }
            return Ok(ApiResponse.Ok("Ok", response.Data));
        }
        [HttpPost("add-project")]
        public async  Task<IActionResult> AddProject([FromBody] AddProjectRequestDTO projectDTO)
        {
            var response = await _projectService.CreateProjectAsync(projectDTO);
            if (response.Success == false)
            {
                return StatusCode(response.ErrorCode ?? 500, ApiResponse.Error(response.ErrorMessage ?? "Internal Server Error"));
            }
            var key = "myapp:projects";
            await _cacheService.RemoveAsync(key);
            return Ok(ApiResponse.Ok("Ok", response.Data));
        }
        [HttpPatch("{ProjectId}")]
        public async Task<IActionResult> EditProject([FromBody] EditProjectRequestDTO projectDTO)
        {
            var response = await _projectService.UpdateProjectAsync(projectDTO);
            if (response.Success == false)
            {
                return StatusCode(response.ErrorCode ?? 500, ApiResponse.Error(response.ErrorMessage ?? "Internal Server Error"));
            }
            var key = "myapp:projects";
            await _cacheService.RemoveAsync(key);
            return Ok(ApiResponse.Ok("Updated project successfully", response.Data));
        }
    }
}
