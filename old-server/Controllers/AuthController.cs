using Dapper;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using UserManagement;

namespace TaskManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly string _connString;


    public AuthController(IConfiguration config)
    {
        _connString = config.GetConnectionString("DefaultConnection")!;
        Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
    }
    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDTO registerDTO)
    {
        using var db = new NpgsqlConnection(_connString);
        var InsertNewUserSQL = "INSERT INTO USERS(username, password, email, role, full_name) " +
                  "VALUES (@Username, @Password, @Email, CAST(@Role AS user_role), @FullName)" +
                  "RETURNING id";
        var findUsernameSql = "SELECT COUNT(*) FROM Users WHERE username = @Username";
        var findEmailSql = "SELECT COUNT(*) FROM Users WHERE email = @Email";
        var AddUserToTeamSQL = """
            UPDATE Teams
            SET member_ids = array_append(member_ids, @Id)
            WHERE id = 1
            RETURNING id AS team_id, leader_id
            """;
        try
        {
            var usernameExists = db.ExecuteScalar<int>(findUsernameSql, new {Username = registerDTO.Username });
            var emailExists = db.ExecuteScalar<int>(findEmailSql, new {Email = registerDTO.Email });
            if(usernameExists > 0)
            {
                return Conflict(new { success = false, message = "Username already exists" });
            }
            if(emailExists > 0)
            {
                return Conflict(new { success = true, message = "Email already exists" });
            }
            int userId = db.ExecuteScalar<int>(InsertNewUserSQL, registerDTO);
            if(registerDTO.Role == "developer")
            {
                var team = db.QuerySingle<UserTeam>(AddUserToTeamSQL, new {Id = userId});
                return Ok(new
                {
                    success = true,
                    message = "User registered successfully",
                    data = new
                    {
                        id = userId,
                        registerDTO.Username,
                        registerDTO.Email,
                        registerDTO.Role,
                        registerDTO.FullName,
                        team.TeamId,
                        team.LeaderId
                    }
                });
            }
            return Ok(new
            {
                success = true,
                message = "User registered successfully",
                data = new
                {
                    id = userId,
                    registerDTO.Username,
                    registerDTO.Email,
                    registerDTO.Role,
                    registerDTO.FullName
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { sucess = false, message = "Something went wrong " +  ex.Message });
        }
    }
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDTO loginDTO)
    {
        using var db = new NpgsqlConnection(_connString);

        var sql = """
            SELECT * FROM Users WHERE username = @Username
            """;
        var findTeamSQL = """
            SELECT id AS team_id, leader_id
            FROM Teams 
            WHERE @userId = ANY(member_ids)
            LIMIT 1
            """;
        try
        {
            var user = db.QueryFirstOrDefault<UserDTO>(sql, new { Username = loginDTO.Username });
            if (user == null)
            {
                return NotFound(new { success = false, message = "Username not found" });
            }
            if (loginDTO.Password != user.Password)
            {
                return Unauthorized(new { success = false, message = "Wrong password" });
            }

            var team = db.QueryFirstOrDefault<UserTeam>(findTeamSQL, new { userId = user.Id });
            if (team != null)
            {
                return Ok(new
                {
                    success = true,
                    message = "Login successfully",
                    data = new
                    {
                        user.Username,
                        user.Id,
                        user.Email,
                        user.Role,
                        user.FullName,
                        team.LeaderId,
                        team.TeamId
                    }
                });
            }
            return Ok(new { success = true, message = "Login successfully", data = new {
                user.Username,
                user.Id,
                user.Email,
                user.Role,
                user.FullName,
            } });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Something went wrong " + ex.Message });
        }
    }

    [HttpPost("change-password")]
    public IActionResult ChangePassword([FromBody] ChangePasswordDTO changePasswordDTO)
    {
        using var db = new NpgsqlConnection(_connString);
        var findUserSQL = """
            SELECT * FROM Users WHERE id=@Id
            """;
        var user = db.QueryFirstOrDefault<UserDTO>(findUserSQL, new { Id = changePasswordDTO.Id });
        if(user == null)
        {
            return NotFound(new { success = false, message = "User not found" });
        }
        if (user.Password != changePasswordDTO.OldPassword)
        {
            return Unauthorized(new { success = false, message = "Current password does not match" });
        }
        if(user.Password == changePasswordDTO.NewPassword)
        {
            return BadRequest(new { success = false, message = "New password must be different from the current password!" });
        }
        var updatePasswordSQL = """
            UPDATE Users
            SET password=@NewPassword
            WHERE id=@Id
            """;
        db.Execute(updatePasswordSQL, new { NewPassword =  changePasswordDTO.NewPassword, Id = changePasswordDTO.Id});
        return Ok(new { success = true, message = "Changed password successfully" });
    }
}