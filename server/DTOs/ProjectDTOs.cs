namespace TaskManagement.DTOs
{
    public class ProjectDTO
    {
        public required int Id { get; set; }
        public required string Description { get; set; }
        public required string Creator { get; set; }
        public required string Leader { get; set; }
        public required DateOnly CreatedAt { get; set; }
        public required string Status { get; set; }
        public required DateOnly Deadline { get; set; }
        public required string Note { get; set; }
        public required string Title { get; set; }
        public required int CreatorId { get; set; }
        public required int LeaderId { get; set; }
        public required int TeamId { get; set; }
    }
    public class AddProjectRequestDTO
    {
        public string Description { get; set; } = null!;
        public required int CreatorId { get; set; }
        public required int LeaderId { get; set; }
        public required int TeamId { get; set; }
        public required string Status { get; set; }
        public required DateOnly Deadline { get; set; }
        public string Note { get; set; } = null!;
        public required string Title { get; set; }
    }
    public class EditProjectRequestDTO
    {
        public required int Id { get; set; }
        public string Description { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateOnly Deadline { get; set; } = default;
        public string Note { get; set; } = null!;
        public string Title { get; set; } = null!;
    }
}
