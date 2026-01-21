using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TaskManagement.DTOs;
using TaskManagement.Models;
using TaskManagement.Repositories.Interfaces;
namespace TaskManagement.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connString;
        private readonly TaskmanagementContext _db;
        // Read operation
        public UserRepository(IConfiguration config, TaskmanagementContext db)
        {
            _connString = config.GetConnectionString("DefaultConnection")!;
            _db = db;

        }
        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _db.Users.FirstOrDefaultAsync<User>(u => u.Username == username);
        }
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _db.Users.FirstOrDefaultAsync<User>(u => u.Email == email);
        }
        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _db.Users.FirstOrDefaultAsync<User>(u => u.Id == id);
        }

        public async Task<List<User>?> GetUsersByFilter(FilterDTO filter)
        {
            var query = _db.Users.AsQueryable();
            if (filter.Role.HasValue)
            {
                query = query.Where(u => u.Role == filter.Role.Value);
            }
            if (filter.TeamId.HasValue)
            {
                query = query.Where(u => u.TeamId == filter.TeamId);
            }
            if (filter.LeaderId.HasValue)
            {
                query = query.Where(u => u.LeaderId == filter.LeaderId);
            }
            if (!string.IsNullOrEmpty(filter.FullName))
            {
                query = query.Where(u => u.FullName == filter.FullName);
            }
            return await query.Where(u => u.Role != UserRole.admin).OrderBy(u => u.Role == UserRole.leader ? 1 : 2).ToListAsync<User>();
        }

        //Write operation
        public async Task CreateUserAsync(User user)
        {
            Console.WriteLine(JsonSerializer.Serialize(user));
            await _db.Users.AddAsync(user);
        }
        public void ChangePassword(User user, string newPassword)
        {
            user.Password = newPassword;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _db.SaveChangesAsync();
        }
    }
}
