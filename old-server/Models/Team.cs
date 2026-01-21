using System;
using System.Collections.Generic;

namespace TaskManagement.Models;

public partial class Team
{
    public int Id { get; set; }

    public List<int> MemberIds { get; set; } = null!;

    public int LeaderId { get; set; }

    public virtual User Leader { get; set; } = null!;

    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
}
