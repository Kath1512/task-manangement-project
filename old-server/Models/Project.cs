using System;
using System.Collections.Generic;

namespace TaskManagement.Models;

public partial class Project
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public DateOnly? CreatedAt { get; set; }

    public DateOnly Deadline { get; set; }

    public string? Note { get; set; }

    public string? Title { get; set; }

    public int? CreatorId { get; set; }

    public int? LeaderId { get; set; }

    public int? TeamId { get; set; }

    public virtual User? Creator { get; set; }

    public virtual User? Leader { get; set; }

    public virtual Team? Team { get; set; }
}
