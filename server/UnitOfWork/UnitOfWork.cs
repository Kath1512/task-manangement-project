using TaskManagement.Models;
using TaskManagement.Repositories.Interfaces;

namespace TaskManagement.UnitOfWork
{
    public class UnitOfWork
    {
        private readonly TaskmanagementContext _dbContext;
        private readonly IUserRepository _userRepository;
        public UnitOfWork(TaskmanagementContext dbContext, IUserRepository userRepository)
        {
            _dbContext = dbContext;
            _userRepository = userRepository;
        }

    }
}
