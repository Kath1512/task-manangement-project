import { Observable, of, tap } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';
import { APIResponse, cacheResponse, IStaff, User } from '../../models/model';
import { Router } from '@angular/router';
import { ApiService } from '../api-service/api-service';
import { getUsersRoute } from '../../shared/utils/APIRoute';
@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiService = inject(ApiService);
    private cacheDurationRefresh = 60 * 60 * 1000;
    private lastCache = 0;
    currentUser = signal<User | null>(null);
    currentCacheStaff = signal<IStaff[]>([]);
    currentCacheLeaders = signal<IStaff[]>([]);

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

    getUsers(teamId: number | undefined): Observable<APIResponse<IStaff[]>> {
        if(!this.currentCacheStaff().length || Date.now() - this.lastCache > this.cacheDurationRefresh){
            this.lastCache = Date.now();
            const targetRoute = teamId ? `${getUsersRoute}?teamId=${teamId}` : getUsersRoute;
            return this.apiService.get<APIResponse<IStaff[]>>(targetRoute).pipe(
                tap(res => this.currentCacheStaff.set(res.data!))
            );
        }
        const response = new cacheResponse<IStaff[]>('Returned all staff from cache', this.currentCacheStaff());
        return of(response);
    }

    getAllLeaders(): Observable<APIResponse<IStaff[]>> {
        this.lastCache = Date.now();
        if(!this.currentCacheLeaders().length || Date.now() - this.lastCache > this.cacheDurationRefresh){
            return this.apiService.get<APIResponse<IStaff[]>>(`${getUsersRoute}?role=leader`).pipe(
                tap(res => this.currentCacheLeaders.set(res.data!))
            );
        }
        const response = new cacheResponse<IStaff[]>('Returned all leaders from cache', this.currentCacheLeaders());
        return of(response);
    }
    refereshLeadersCache(): void {
        this.currentCacheLeaders.set([]);
    }
    refereshStaffCache(): void {
        this.currentCacheStaff.set([]);
    }
    refereshCurrentUser(): void {
        this.currentUser.set(null);
    }
    refereshAll(): void{
        this.refereshLeadersCache();
        this.refereshStaffCache();
        this.refereshCurrentUser();
    }
}
