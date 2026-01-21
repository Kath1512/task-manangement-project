using System.ComponentModel.DataAnnotations;
using System.Net;
using TaskManagement.Models;

namespace TaskManagement.DTOs
{
    public class CreateUserRequestDTO
    {
        [MinLength(1)]
        public required string Username { get; set; }

        public required string Email { get; set; }

        [MinLength(1)]
        public required string Password { get; set; }

        public required string Role { get; set; }

        public required string FullName { get; set; }
        public int? TeamId { get; set; }
        public int? LeaderId { get; set; }
    }
    public class LoginRequestDTO
    {
        [Required]
        [MinLength(1)]
        public required string Username { get; set; }
        [Required]
        [MinLength(1)]
        public required string Password { get; set; }
    }

    public class ChangePasswordRequestDTO
    {
        public required int Id { get; set; }
        public required string OldPassword { get; set; }
        public required string NewPassword { get; set; }
        public required string ConfirmNewPassword { get; set; }
    }

    public class UserResponseDTO
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string FullName { get; set; }
        public required string Role { get; set; }
        public int? TeamId { get; set; }
        public int? LeaderId { get; set; }
    }


    
}
