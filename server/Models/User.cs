using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TaskManagement.Models;

public partial class User
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? FullName { get; set; }

    public virtual ICollection<Project> ProjectCreators { get; set; } = new List<Project>();
    public virtual ICollection<Project> ProjectLeaders { get; set; } = new List<Project>();
    public virtual ICollection<Team> Teams { get; set; } = new List<Team>();
}


