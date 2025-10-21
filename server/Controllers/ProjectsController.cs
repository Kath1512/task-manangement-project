using Microsoft.AspNetCore.Mvc;
using Dapper;
using Npgsql;
using UserManagement;
using Microsoft.OpenApi.Any;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TaskManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly string _connString;
        public ProjectsController(IConfiguration config) 
        {
            _connString = config.GetConnectionString("DefaultConnection")!;
            Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
        }
        // GET: api/<ProjectController>
        [HttpGet("")]
        public IActionResult GetAllProjects([FromQuery] int teamId)
        {
            try
            {
                using var db = new NpgsqlConnection(_connString);
                var findProjectsSQL = teamId == -1 ? """
                    SELECT p.*, u_creator.full_name AS creator, u_leader.full_name AS leader
                    FROM projects p
                    JOIN Users u_creator ON u_creator.id = p.creator_id
                    JOIN Users u_leader ON u_leader.id = p.leader_id
                    ORDER BY id DESC
                    """ :
                    """
                    SELECT p.*, u_creator.full_name AS creator, u_leader.full_name AS leader
                    FROM projects p
                    JOIN Users u_creator ON u_creator.id = p.creator_id
                    JOIN Users u_leader ON u_leader.id = p.leader_id
                    WHERE p.team_id = @TeamId
                    ORDER BY id DESC
                    """;
                var projects = db.Query<Project>(findProjectsSQL, new {TeamId = teamId});
                return Ok(new {success = true, message = "Returned all projects", data = projects});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { sucess = false, message = "Internal Server error " + ex.Message });
            }
        }
        [HttpGet("{ProjectId}")]
        public async Task<IActionResult> GetProjectById(int ProjectId)
        {
            try
            {
                using var db = new NpgsqlConnection(_connString);
                var findProjectByIdSQL = """
                    SELECT p.*, u_creator.full_name AS creator, u_leader.full_name AS leader
                    FROM projects p
                    JOIN Users u_creator ON u_creator.id = p.creator_id
                    JOIN Users u_leader ON u_leader.id = p.leader_id
                    WHERE p.id = @ProjectId
                    """;
                var project = await db.QueryFirstOrDefaultAsync<Project>(findProjectByIdSQL, new { ProjectId = ProjectId });
                if(project == null)
                {
                    return NotFound(new { success = false, message = "Project not found" });
                }
                return Ok(new { success = true, message = "OK", data = project });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { sucess = false, message = "Internal Server error " + ex.Message });
            }
        }
        [HttpPost("add-project")]
        public IActionResult AddProject([FromBody] ProjectDTO projectDTO)
        {
            try
            {
                using var db = new NpgsqlConnection(_connString);
                var addProjectSQL = """
                    INSERT INTO Projects(description, creator_id, leader_id, team_id, status, deadline, note, title)
                    VALUES (@Description, @CreatorId, @LeaderId, @TeamId, CAST(@Status AS type_status), @Deadline, @Note, @Title)
                    RETURNING id;
                    """;
                var findProjectSQL = """
                    SELECT p.*, u_creator.full_name AS creator, u_leader.full_name AS leader
                    FROM projects p
                    JOIN Users u_creator ON u_creator.id = p.creator_id
                    JOIN Users u_leader ON u_leader.id = p.leader_id
                    WHERE p.id = @ProjectId
                    """;
                int projectId = db.ExecuteScalar<int>(addProjectSQL, projectDTO);
                var project = db.QueryFirstOrDefault<Project>(findProjectSQL, new {ProjectId = projectId});
                return Ok(new {success = true, message = "Added new project", data = project});
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { sucess = false, message = "Internal Server error " + ex.Message });
            }
        }
    }
}
