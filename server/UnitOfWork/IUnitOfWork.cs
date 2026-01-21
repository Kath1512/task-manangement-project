using TaskManagement.Repositories.Interfaces;

namespace TaskManagement.UnitOfWork
{
    public interface IUnitOfWork
    {
        IUserRepository _userRepository { get; }
        Task SaveChangesAsync();
    }
}
