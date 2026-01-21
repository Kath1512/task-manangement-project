using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TaskManagement.Models;
using TaskManagement.Repositories.Interfaces;

namespace TaskManagement.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly TaskmanagementContext _db;
        public ProjectRepository(TaskmanagementContext db)
        {
            _db = db;
        }
        public async Task<List<Project>?> GetProjectsByTeamId(int? teamId)
        {
            var query = _db.Projects.AsQueryable();
            if (teamId.HasValue)
            {
                query = query.Where(p => p.TeamId == teamId);
            }
            query = query.Include(p => p.Creator)
                         .Include(p => p.Leader)
                         .OrderByDescending(p => p.CreatedAt);
            return await query.ToListAsync();
        }
        public async Task<Project?> GetProjectById(int? projectId)
        {
            return await _db.Projects
                               .Include(p => p.Creator)
                               .Include(p => p.Leader)
                               .FirstOrDefaultAsync(p => p.Id == projectId);
        }
        public async Task CreateProject(Project project)
        {
            Console.WriteLine(JsonSerializer.Serialize(project));
            await _db.AddAsync(project);
        }
        public async Task<int> SaveChanges()
        {
            return await _db.SaveChangesAsync();
        }
    }
}
