using Mapster;
using TaskManagement.DTOs;
using TaskManagement.Models;

namespace TaskManagement.Mappings
{
    public class MappingConfig
    {
        public static void RegisterMappings()
        {
            TypeAdapterConfig<Project, ProjectDTO>.NewConfig()
            .Map(dest => dest.Creator, src => src.Creator!.FullName)
            .Map(dest => dest.Leader, src => src.Leader!.FullName);

            TypeAdapterConfig.GlobalSettings.Default.NameMatchingStrategy(NameMatchingStrategy.IgnoreCase);
        }
    }
}
