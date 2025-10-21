import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { APIResponse, ILoginForm, User } from '../../models/model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth-service/auth-service';
import { UserService } from '../../services/user-service/user-service';
@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    styleUrl: './login.scss',
    templateUrl: './login.html',
})
export class Login {
    private fb = inject(FormBuilder);
    private toastr = inject(ToastrService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private userService = inject(UserService);

    loginForm: FormGroup = this.fb.group({
        username: '',
        password: '',
    });

    validate(values: ILoginForm): boolean {
        for (const [key, value] of Object.entries(values)) {
            if (value.trim() === '') {
                this.toastr.error(`${key} must not be empty`);
                return false;
            }
            if (value.includes(' ')) {
                this.toastr.error(`${key} must not contain spaces`);
                return false;
            }
        }
        return true;
    }

    handleSubmit() {
        const values: ILoginForm = this.loginForm.getRawValue();
        if (this.validate(values) === false) {
            return;
        }
        this.authService.login(values).subscribe({
            next: (data) => this.handleAPIResponse(data),
            error: (err) => this.handleError(err),
        });
    }

    handleAPIResponse(data: APIResponse<User>): void {
        const message: string = data.message;
        const user: User = data.data!;
        console.log(data);
        this.toastr.success(message);
        localStorage.setItem("current-user", JSON.stringify(user));
        this.userService.updateCurrentUser();
        this.router.navigate(['/projects']);
    }

    handleError(errMessage: string): void {
        this.toastr.error(errMessage);
    }
}
