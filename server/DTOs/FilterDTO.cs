using TaskManagement.Models;

namespace TaskManagement.DTOs
{
    public class FilterDTO
    {
        public UserRole? Role { get; set; }
        public int? TeamId { get; set; }
        public int? LeaderId { get; set; }
        public string? FullName { get; set; }
    }
}
