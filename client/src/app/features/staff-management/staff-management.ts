import { UserService } from '../../services/user-service/user-service';
import { APIResponse, ColHeader, IStaff, User } from '../../models/model';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Table } from "../table/table";
import { MatIconModule } from '@angular/material/icon';
import { ModalAddStaff } from '../modal-add-staff/modal-add-staff';

@Component({
  selector: 'app-staff-management',
  imports: [Table, MatIconModule, ModalAddStaff],
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.scss'
})
export class StaffManagement implements OnInit {
    private userService = inject(UserService);
    private toastr = inject(ToastrService);

    currentUser = computed(() => this.userService.currentUser());
    dataSource = signal<IStaff[]>([]);
    isShowModal = false;

    colHeaders: ColHeader<IStaff>[] = [
            {key: "id", label:"id"},
            {key: "fullName", label:"full name"},
            {key: "role", label:"role"},
            {key: "email", label:"email"},
            {key: "teamId", label:"team id"}
    ];

    ngOnInit(): void {
        const teamId: number | undefined = this.currentUser()?.teamId;
        this.userService.getUsers(teamId).subscribe({
            next: (data) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        });
    }

    handleSuccess(data: APIResponse<IStaff[]>){
        console.log(data)
        if(data.success == true){
            this.dataSource.set(data.data!);
            return;
        }
        this.toastr.error("Unknown error");
    }

    handleError(err: string){
        this.toastr.error(err);
    }
}
