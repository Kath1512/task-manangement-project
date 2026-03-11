import { UserService } from '../../services/user-service/user-service';
import { APIResponse, ColHeader, ISearchForm, IStaff, User, UserRole } from '../../models/model';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Table } from "../table/table";
import { MatIconModule } from '@angular/material/icon';
import { ModalAddStaff } from '../modal-add-staff/modal-add-staff';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-management',
  imports: [Table, MatIconModule, ModalAddStaff, CommonModule, ReactiveFormsModule],
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.scss'
})
export class StaffManagement implements OnInit {
    private userService = inject(UserService);
    private toastr = inject(ToastrService);
    private fb = inject(FormBuilder)

    currentUser = computed(() => this.userService.currentUser());
    staffs = signal<IStaff[]>([]);
    isShowModal = false;
    filteredStaffs = signal<IStaff[]>([]);

    colHeaders: ColHeader<IStaff>[] = [
            {key: "id", label:"id"},
            {key: "fullName", label:"full name"},
            {key: "role", label:"role"},
            {key: "email", label:"email"},
            {key: "teamId", label:"team id"}
    ];

    fetchStaff(): void {
        const teamId: number | undefined = this.currentUser()?.teamId;
        this.userService.getUsers(teamId).subscribe({
            next: (data) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        });
    }
    ngOnInit(): void {
        this.fetchStaff();
    }

    handleSuccess(data: APIResponse<IStaff[]>){
        console.log(data)
        if(data.success == true){
            this.staffs.set(data.data!);
            this.filteredStaffs.set(data.data!);
            return;
        }
        this.toastr.error("Unknown error");
    }

    handleError(err: string){
        this.toastr.error(err);
    }

    searchForm = this.fb.group({
        fullName: this.fb.control<string>('', {nonNullable: true}),
        role: this.fb.control<string>('', {nonNullable: true}),
        id: this.fb.control<string>('', {nonNullable: true}),
        teamId: this.fb.control<string>('', {nonNullable: true})
    });

    clearFilter() {
        this.searchForm.reset();
    }

    handleFilter(){
        const values: ISearchForm = this.searchForm.value;
        console.log(values);
        this.filteredStaffs.set(this.staffs().filter(p => {
            let ok = true;
            for(const [k, value] of Object.entries(values)){
                const key = k as keyof ISearchForm && k as keyof IStaff;
                if(value == '') continue;
                if(!String(p[key]).match(new RegExp(value, "i"))) {
                    ok = false;
                    break;
                }
            }
            if(ok) return p;
            return;
        }));
    }

    handleRefereshProjectCache(): void{
        this.clearFilter();
        this.fetchStaff();
    }
}
