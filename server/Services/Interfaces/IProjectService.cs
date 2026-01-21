using TaskManagement.DTOs;

namespace TaskManagement.Services.Interfaces
{
    public interface IProjectService
    {
        Task<ServiceResponse<List<ProjectDTO>?>> GetProjectsByTeamIdAsync(int? teamId);
        Task<ServiceResponse<ProjectDTO?>> GetProjectByIdAsync(int? projectId);
        Task<ServiceResponse<ProjectDTO>> UpdateProjectAsync(EditProjectRequestDTO request);
        Task<ServiceResponse<ProjectDTO>> CreateProjectAsync(AddProjectRequestDTO project);
    }
}
