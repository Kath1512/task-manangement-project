using TaskManagement.Models;

namespace TaskManagement.Repositories.Interfaces
{
    public interface IProjectRepository
    {
        Task<List<Project>?> GetProjectsByTeamId(int? teamId);
        Task<Project?> GetProjectById(int? projectId);
        Task CreateProject(Project project);
        Task<int> SaveChanges();

    }
}
