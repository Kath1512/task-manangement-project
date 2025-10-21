using Microsoft.EntityFrameworkCore;
using TaskManagement.Models;
using UserManagement;

namespace TaskManagement.Services
{
    public interface IUserService
    {
        Task<List<User>?> GetUsers(int? teamId);
    }
    public class UserService : IUserService
    {
        private readonly TaskmanagementContext _db;
        public UserService(TaskmanagementContext db)
        {
            _db = db;
        }

        public async Task<List<User>?> GetUsers(int? teamId)
        {
            var team = await _db.Teams.FirstOrDefaultAsync(t => t.Id == teamId);
            if(team == null)
            {
                return null;
            }
            var members = await _db.Users.Where(u => team.MemberIds.Contains(u.Id)).ToListAsync();
            
            return members;
        }

    }
}
