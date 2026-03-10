import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user-service/user-service';
import { AuthService } from '../../services/auth-service/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { APIResponse, IStaff, User } from '../../models/model';

@Component({
	selector: 'app-staff-detail',
	imports: [],
	templateUrl: './staff-detail.html',
	styleUrl: './staff-detail.scss'
})
export class StaffDetail implements OnInit {
	private fb = inject(FormBuilder)
	private toastr = inject(ToastrService);
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private router = inject(Router);
	private route = inject(ActivatedRoute);

	currentStaff = signal<IStaff | undefined>(undefined);

	handleSuccess(data: APIResponse<IStaff>): void {
		this.currentStaff.set(data.data);
		console.log(data)
	}

	handleError(err: string){
        this.toastr.error(err);
    }

	fetchUser(userId: number): void {
        const teamId: number | undefined = this.currentStaff()?.teamId;
        this.userService.getUser(userId).subscribe({
            next: (data) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        });
    }

	ngOnInit(): void {
		let userId = this.route.snapshot.paramMap.get("id") || -1;
		this.fetchUser(Number(userId))

		console.log(this.currentStaff())

	}

}
