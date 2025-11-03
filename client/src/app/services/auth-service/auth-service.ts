import { catchError, Observable, throwError } from 'rxjs';
import { APIResponse, IAddStaffForm, IChangePasswordForm, ILoginForm, IRegisterForm, IStaff, User } from '../../models/model';
import { Injectable, inject } from '@angular/core';
import { changePasswordRoute, loginRoute, registerRoute } from '../../shared/utils/APIRoute';
import { ApiService } from '../api-service/api-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiService = inject(ApiService);

    login(values: ILoginForm): Observable<APIResponse<User>> {
        return this.apiService.post<APIResponse<User>>(loginRoute, values);
    }

    register(values: IRegisterForm): Observable<APIResponse<User>> {
        return this.apiService.post<APIResponse<User>>(registerRoute, values);
    }

    addStaff(values: IAddStaffForm): Observable<APIResponse<IStaff>> {
        return this.apiService.post<APIResponse<IStaff>>(registerRoute, values);
    }

    changePassword(values: IChangePasswordForm): Observable<APIResponse<null>> {
        return this.apiService.post<APIResponse<null>>(changePasswordRoute, values);
    }
}
