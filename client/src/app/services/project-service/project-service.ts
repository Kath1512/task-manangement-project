import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { APIResponse, cacheResponse, IEditProjectForm, IProject, IProjectForm } from '../../models/model';
import { addProjectRoute, editProjectRoute, getProjectsRoute } from '../../shared/utils/APIRoute';
import { ApiService } from '../api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
    private apiService = inject(ApiService);
    private cacheRefereshDuration = 5 * 60 * 1000;
    private lastCache = 0;
    currentProject = signal<IProject[]>([])

    refereshProjectCache(): void {
        this.currentProject.set([]);
    }

    getProjectsByTeam(teamId: number): Observable<APIResponse<IProject[]>>{
        if(!this.currentProject().length || Date.now() - this.lastCache > this.cacheRefereshDuration) {
            this.lastCache = Date.now();
            return this.apiService.get<APIResponse<IProject[]>>(`${getProjectsRoute}?teamId=${teamId}`).pipe(
                tap(data => this.currentProject.set(data.data!))
            );
        }
        const cacheResponse: APIResponse<IProject[]> = {
            data: this.currentProject(),
            message: 'Returned projects from cache',
            success: true
        };
        return of(cacheResponse);
    }

    addProject(values: IProjectForm): Observable<APIResponse<IProject>> {
        return this.apiService.post<APIResponse<IProject>>(addProjectRoute, values).pipe(
            tap(data => this.currentProject.update(prev => [data.data!, ...prev]))
        );
    }

    getProjectById(projectId: number): Observable<APIResponse<IProject>>{
        const project: IProject | undefined = this.currentProject().find(p => p.id == projectId)
        if(project){
            const response = new cacheResponse<IProject>(`Return project id: ${projectId} from cache`, project)
            return of(response)
        }
        return this.apiService.get<APIResponse<IProject>>(`${getProjectsRoute}/${projectId}`);
    }

    editProject(values: IEditProjectForm): Observable<APIResponse<IProject>> {
        return this.apiService.patch<APIResponse<IProject>>(editProjectRoute, values).pipe(
            tap(data => this.currentProject.update(prev => prev.map(p => {
                if(p.id == data?.data?.id){
                    return data.data;
                }
                return p;
            })))
        );
    }
}
