using System.ComponentModel.DataAnnotations;

namespace UserManagement;

public class UserDTO
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Role { get; set; }
    public required string FullName { get; set; }
}

public class Staff
{
    public required int Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
}

public class UserTeam
{
    public int TeamId { get; set; }
    public int LeaderId { get; set; }
}

public class Project
{
    public required int Id { get; set; }
    public required string Description { get; set; }
    public required string Creator { get; set; }
    public required string Leader { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required string Status { get; set; }
    public required DateTime Deadline { get; set; }
    public required string Note { get; set; }
    public required string Title {get; set; }
    public required int CreatorId { get; set; }
    public required int LeaderId { get; set; }
}

public class ProjectDTO
{
    public required string Description { get; set; }
    public required int CreatorId { get; set; }
    public required int LeaderId { get; set; }
    public required int TeamId { get; set; }
    public required string Status { get; set; }
    public required DateTime Deadline { get; set; }
    public required string Note { get; set; }
    public required string Title { get; set; }
}


public enum UserRole
{
    admin, developer, leader
}
public class RegisterDTO
{
    [MinLength(1)]
    public required string Username { get; set; }

    public required string Email { get; set; }

    [MinLength(1)]
    public required string Password { get; set; }

    public required string Role { get; set; }

    public required string FullName { get; set; }
}

public class LoginDTO
{
    [Required]
    [MinLength(1)]
    public required string Username { get; set; }

    [Required]
    [MinLength(1)]
    public required string Password { get; set; }
}

public class ChangePasswordDTO
{
    public required int Id { get; set; }
    public required string OldPassword { get; set; }
    public required string NewPassword { get; set; }
    public required string ConfirmNewPassword { get; set; }
}

public class UserQueryParameters
{
    public string? Role;
    public int? TeamId;
}
