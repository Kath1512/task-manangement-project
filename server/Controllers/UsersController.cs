using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Dapper;
using Npgsql;
using UserManagement;
using TaskManagement.Services;

namespace TaskManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly string _connString;
        private readonly IUserService _userService;
        public UsersController(IConfiguration config, IUserService userService)
        {
            _connString = config.GetConnectionString("DefaultConnection")!;
            Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] int? teamId)
        {
            var users = await _userService.GetUsers(teamId);
            if(users == null)
            {
                return NotFound(new { message = "Team not found or Team has no member" });
            }
            return Ok(new { success = true, message = "Ok", data = users });
        }

        [HttpGet("teams/{teamId}")]
        public IActionResult GetUsersByTeam(int teamId)
        {
            var db = new NpgsqlConnection(_connString);
            try
            {
                var findUsersSQL = teamId == -1 ? //return all users
                        """
                        SELECT full_name, id, email, role FROM Users 
                        WHERE role != 'admin'
                        """ : //return users by team
                        """
                        SELECT u.full_name, u.id, u.email, u.role
                        FROM (
                            SELECT UNNEST(member_ids) AS user_id
                            FROM Teams
                            WHERE id = @TeamId
                        ) AS mem
                        JOIN Users u ON mem.user_id = u.id AND u.role = 'developer'
                        """;
                var users = db.Query<Staff>(findUsersSQL, new { Teamid = teamId});
                if(users == null || users.Count() == 0)
                {
                    return BadRequest(new { success = false, message = "This team does not exist" });
                }
                return Ok(new { success = true, message = "Returned all users", data = users });
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" + ex.Message });
            }
        }
        [HttpGet("leaders")]
        public IActionResult GetLeaders()
        {
            var db = new NpgsqlConnection(_connString);
            try
            {
                var findLeadersSQL = """
                    SELECT u.full_name, u.id, u.email, u.role
                    FROM Teams t 
                    JOIN Users u ON t.leader_id = u.id
                    """;
                var users = db.Query<Staff>(findLeadersSQL);
                if (users == null || users.Count() == 0)
                {
                    return BadRequest(new { success = false, message = "This team does not exist" });
                }
                return Ok(new { success = true, message = "Returned all leaders", data = users });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error" + ex.Message });
            }
        }
    }
}
