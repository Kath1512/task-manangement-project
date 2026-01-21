using Mapster;
using Microsoft.EntityFrameworkCore;
using System.Net;
using TaskManagement.DTOs;
using TaskManagement.Models;
using TaskManagement.Repositories.Interfaces;
using TaskManagement.Services.Interfaces;

namespace TaskManagement.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly ICacheService _cacheService;
        public ProjectService(IProjectRepository projectRepository, ICacheService cacheSevice)
        {
            _projectRepository = projectRepository;
            _cacheService = cacheSevice;
        }
        public async Task<ServiceResponse<List<ProjectDTO>?>> GetProjectsByTeamIdAsync(int? teamId)
        {
            var projects = await _projectRepository.GetProjectsByTeamId(teamId);
            if(projects == null || projects.Count == 0)
            {
                return ServiceResponse<List<ProjectDTO>?>.Error("Team not found", 404);
            }
            var projectsDto = projects.Adapt<List<ProjectDTO>>();
            return ServiceResponse<List<ProjectDTO>?>.Ok(projectsDto);
        }
        public async Task<ServiceResponse<ProjectDTO?>> GetProjectByIdAsync(int? projectId)
        {
            var project = await _projectRepository.GetProjectById(projectId);
            if(project == null)
            {
                return ServiceResponse<ProjectDTO?>.Error("Project not found", 404);
            }
            var projectDto = project.Adapt<ProjectDTO>();
            return ServiceResponse<ProjectDTO?>.Ok(projectDto);
        }
        public async Task<ServiceResponse<ProjectDTO>> CreateProjectAsync(AddProjectRequestDTO requestDTO)
        {
            var project = requestDTO.Adapt<Project>();
            try
            {
                await _projectRepository.CreateProject(project);
                await _projectRepository.SaveChanges();
                var projectDTO = project.Adapt<ProjectDTO>();
                return ServiceResponse<ProjectDTO>.Ok(projectDTO);
            }
            catch(DbUpdateException ex)
            {
                if(ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.Message);
                }
                return ServiceResponse<ProjectDTO>.Error("Unhandled error", 500);
            }
        }
        public async Task<ServiceResponse<ProjectDTO>> UpdateProjectAsync(EditProjectRequestDTO request)
        {
            var project = await _projectRepository.GetProjectById(request.Id);
            if(project == null)
            {
                return ServiceResponse<ProjectDTO>.Error("Project not found", 404);
            }
            foreach(var prop in request.GetType().GetProperties())
            {
                var key = prop.Name;
                var newValue = prop.GetValue(request);
                var projectProp = project.GetType().GetProperty(key);
                if (newValue == null || projectProp == null || !projectProp.CanWrite || !projectProp.CanRead) continue;
                var oldValue = projectProp.GetValue(project);
                if (oldValue == null) continue;
                if (!Equals(oldValue.ToString(), newValue.ToString()))
                {
                    if(key == "Status") projectProp.SetValue(project, newValue.Adapt<TypeStatus>());
                    else projectProp.SetValue(project, newValue);
                }
            }
            try
            {
                await _projectRepository.SaveChanges();
                var projectDTO = project.Adapt<ProjectDTO>();
                return ServiceResponse<ProjectDTO>.Ok(projectDTO);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.Message);
                }
                return ServiceResponse<ProjectDTO>.Error("Unhandled error", 500);
            }
        }
    }
}
