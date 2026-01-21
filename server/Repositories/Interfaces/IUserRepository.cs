using TaskManagement.DTOs;
using TaskManagement.Models;
namespace TaskManagement.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByIdAsync(int id);
        Task<List<User>?> GetUsersByFilter(FilterDTO filter);
        Task CreateUserAsync(User user);
        void ChangePassword(User user, string newPassword);
        Task<int> SaveChangesAsync();
    }
}
