import { UserService } from '../../services/user-service/user-service';
import { APIResponse, ColHeader, IStaff, User } from '../../models/model';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Table } from "../table/table";

@Component({
  selector: 'app-staff-management',
  imports: [Table],
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.scss'
})
export class StaffManagement implements OnInit {
    private userService = inject(UserService);
    private toastr = inject(ToastrService);

    currentUser = computed(() => this.userService.currentUser());
    dataSource = signal<IStaff[]>([]);

    colHeaders: ColHeader<IStaff>[] = [
            {key: "id", label:"id"},
            {key: "fullName", label:"full name"},
            {key: "role", label:"role"},
            {key: "email", label:"email"}
    ];

    ngOnInit(): void {
        let teamId: number = this.currentUser()?.teamId || -1;
        this.userService.getUsers(teamId).subscribe({
            next: (data) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        });
    }

    handleSuccess(data: APIResponse<IStaff[]>){
        if(data.success == true){
            this.dataSource.set(data.data!);
            console.log(this.dataSource());
            return;
        }
        this.toastr.error("Unknown error");
    }

    handleError(err: string){
        this.toastr.error(err);
    }
}
