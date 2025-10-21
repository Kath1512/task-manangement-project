import { Observable } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';
import { APIResponse, IStaff, User } from '../../models/model';
import { Router } from '@angular/router';
import { ApiService } from '../api-service/api-service';
import { getUsersByTeamRoute, getLeadersRoute } from '../../shared/utils/APIRoute';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiService = inject(ApiService);
    currentUser = signal<User | null>(null);

    updateCurrentUser(): void{
        if(localStorage.getItem("current-user")){
            this.currentUser.set(JSON.parse
                (localStorage.getItem("current-user")!));
        }
    }

    logOut(): void{
        localStorage.removeItem("current-user");
        this.currentUser.set(null);
    }

    getUsers(teamId: number): Observable<APIResponse<IStaff[]>> {
        return this.apiService.get<APIResponse<IStaff[]>>(`${getUsersByTeamRoute}/${teamId}`)
    }

    getAllLeaders(): Observable<APIResponse<IStaff[]>> {
        return this.apiService.get<APIResponse<IStaff[]>>(`${getLeadersRoute}`);
    }
}
