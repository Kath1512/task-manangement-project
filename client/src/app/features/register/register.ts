import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { APIResponse, IRegisterForm, User } from '../../models/model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth-service/auth-service';
import { UserService } from '../../services/user-service/user-service';
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, CommonModule],
    templateUrl: './register.html',
    styleUrls: ['./register.scss']
})
export class Register {
    private fb = inject(FormBuilder);
    private toastr = inject(ToastrService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private userService = inject(UserService);

    registerForm = this.fb.group({
        username: this.fb.control('', {nonNullable: true}),
        password: this.fb.control('', {nonNullable: true}),
        email: this.fb.control('', {nonNullable: true}),
        role: this.fb.control<'developer' | 'leader' | 'admin'>('developer', { nonNullable: true }),
        fullName: this.fb.control('', {nonNullable: true})
    });


    validate(values: IRegisterForm): boolean{
        for(const [key, value] of Object.entries(values)){
            if(value.trim() === ''){
                this.toastr.error(`${key} must not be empty`);
                return false;
            }
            if(key == 'fullName'){
                continue;
            }
            if(value.includes(' ')){
                this.toastr.error(`${key} must not contain spaces`);
                return false;
            }
        }
        return true;
    }

    handleSubmit() {
        const values: IRegisterForm = this.registerForm.getRawValue();
        if(this.validate(values) === false){
            return;
        }
        this.authService.register(values).subscribe({
            next: (data) => this.handleAPIResponse(data),
            error: (err) => this.handleError(err)
        });
    }

    handleAPIResponse(data: APIResponse<User>): void{
        const message: string = data.message;
        const user: User = data.data!;
        this.toastr.success(message);
        localStorage.setItem("current-user", JSON.stringify(user));
        this.userService.updateCurrentUser();
        this.router.navigate(['/projects']);

    }

    handleError(errMessage: string): void{
        this.toastr.error(errMessage);
    }


}
