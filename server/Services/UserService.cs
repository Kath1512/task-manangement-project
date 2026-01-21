using Mapster;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Common;
using System.Net;
using TaskManagement.DTOs;
using TaskManagement.Models;
using TaskManagement.Repositories.Interfaces;
using TaskManagement.Services.Interfaces;

namespace TaskManagement.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<ServiceResponse<List<UserResponseDTO>>> GetUsersByFilterAsync(FilterDTO filter)
        {

            try
            {
                var users = await _userRepository.GetUsersByFilter(filter);
                var data = users.Adapt<List<UserResponseDTO>>();
                return ServiceResponse<List<UserResponseDTO>>.Ok(data);
            }
            catch(DbException ex)
            {
                Console.WriteLine(ex?.InnerException?.Message);
                return ServiceResponse<List<UserResponseDTO>>.Error("Unhandled Error", (int)HttpStatusCode.InternalServerError);
            }
        }

    }
}
