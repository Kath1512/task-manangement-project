import { APIResponse, User } from '../../models/model';
import { UserService } from '../../services/user-service/user-service';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { IChangePasswordForm } from '../../models/model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss'
})
export class MyProfile {
    private fb = inject(FormBuilder);
    private toastr = inject(ToastrService);
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private router = inject(Router);

    currentUser = computed(() => this.userService.currentUser())

    changePasswordForm = this.fb.group({
        oldPassword: this.fb.control('', {nonNullable: true}),
        newPassword: this.fb.control('', {nonNullable: true}),
        confirmNewPassword: this.fb.control('', {nonNullable: true}),
    });

    validate(values: IChangePasswordForm): boolean{
        const nameMap = new Map();
        nameMap.set('oldPassword', 'Old password');
        nameMap.set('newPassword', 'New password');
        nameMap.set('confirmNewPassword', 'New password confirm');
        for(const [key, value] of Object.entries(values)){
            if(key == 'id'){
                continue;
            }
            if(value.trim() === ''){
                this.toastr.error(`${nameMap.get(key)} must not be empty`);
                return false;
            }
        }
        if(values.newPassword != values.confirmNewPassword){
            this.toastr.error('New passwords do not match. Try again!');
            return false;
        }
        return true;
    }

    handleChangePassword(): void {
        const values: IChangePasswordForm = {
            ...this.changePasswordForm.getRawValue(),
            id: this.currentUser()?.id!
        };
        if(!this.validate(values)){
            return;
        }
        console.log(values);
        this.authService.changePassword(values).subscribe({
            next: (data) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        });
    }

    handleSuccess(data: APIResponse<null>): void {
        if(data.success === true){
            this.toastr.success(data.message);
            this.router.navigate(["/projects"]);
        }
        else{
            this.toastr.error("Unexpected error. Please try again!");
        }
    }

    handleError(err: string): void {
        this.toastr.error(err);
    }
}
