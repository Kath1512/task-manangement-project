using NpgsqlTypes;

namespace TaskManagement.Models
{
    public enum TypeStatus
    {
        [PgName("InProgress")]
        InProgress,
        [PgName("Planned")]
        Planned,
        [PgName("Completed")]
        Completed,
        [PgName("Cancelled")]
        Cancelled
    }

    public enum UserRole
    {
        [PgName("admin")]
        admin,
        [PgName("developer")]
        developer,
        [PgName("leader")]
        leader
    }

    public static class UserRoleMapper
    {
        public static string Map(int id)
        {
            return id switch
            {
                0 => "admin",
                1 => "developer",
                2 => "leader",
                _ => "Unknown"
            };
        }
    }
}
