import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, OnChanges, OnInit, Output, output, signal, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { APIResponse, IAddStaffForm, IEditProjectForm, IProject, IProjectForm, IStaff, ITeam, Status, User } from '../../models/model';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../services/project-service/project-service';
import { UserService } from '../../services/user-service/user-service';
import { AuthService } from '../../services/auth-service/auth-service';

@Component({
  selector: 'app-modal-add-staff',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-add-staff.html',
  styleUrl: './modal-add-staff.scss'
})
export class ModalAddStaff implements OnInit{
    // @Output() closeEvent = new EventEmitter<void>();
    private fb = inject(FormBuilder);
    private toastr = inject(ToastrService);
    private userService = inject(UserService);
    private authService = inject(AuthService);

    currentUser = computed(() => this.userService.currentUser());
    currentProjectDetail = input<IProject>();
    editProjectForm: FormGroup = this.fb.group({});
    leaders = signal<IStaff[]>([]);
    teams = computed(() => this.leaders().map<ITeam>(l => ({ leaderId: l.leaderId, teamId: l.teamId })));
    inputLabels: {key: keyof IAddStaffForm, name:string}[] = [
        {key: "username", name: "Username"},
        {key: "email", name: "Email"},
        {key: "fullName", name: "Full name"},
        {key: "password", name: "password"},
    ]
    teamsOption = computed(() => this.teams().map(t => t.teamId))
    userRoleOptions = ['developer', 'admin', 'leader'];
    selectLabels = computed(() => [
        {key: "role", name: "Role", options: this.userRoleOptions },
        {key: "teamId", name: "Team id", options: this.teamsOption() },
    ])

    AddStaffForm: FormGroup = this.fb.group({
        username: this.fb.control('', {nonNullable: true}),
        email: this.fb.control('', {nonNullable: true}),
        password: this.fb.control('', {nonNullable: true}),
        fullName: this.fb.control('', {nonNullable: true}),
        role: this.fb.control('developer', {nonNullable: true}),
        teamId: this.fb.control(this.currentUser()?.teamId || 1, {nonNullable: true}),
    });

    ngOnInit(): void {
        this.userService.getAllLeaders().subscribe({
            next: data => {
                this.leaders.set(data.data!);

            },
            error: err => this.toastr.error(err)
        })
    }



    closeEvent = output<void>();
    addProjectEvent = output<IStaff>();

    closeModal(){
        this.closeEvent.emit();
    }

    emitProject(values: IStaff){
        this.addProjectEvent.emit(values);
    }

    validate(values: IAddStaffForm): boolean{
        for(let [key, value] of Object.entries(values)){
            value = value.toString();
            if(!value.trim()){
                this.toastr.error(`${key} cannot be empty`)
                return false;
            }
        }
        return true;
    }

    handleAddStaff(): void {
        if(this.AddStaffForm == null) return;
        let values: IAddStaffForm = this.AddStaffForm.getRawValue();
        values.leaderId = this.teams().find(t => t.teamId == values.teamId)?.leaderId;
        if(!this.validate(values)){
            return;
        }
        console.log(values);
        this.authService.addStaff(values).subscribe({
            next: (data: APIResponse<IStaff>) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        });
    }

    handleSuccess(data: APIResponse<IStaff>): void {
        if(data.success == true){
            this.toastr.success(data.message);
            console.log(data.data);
            this.emitProject(data?.data!);
            this.closeModal();
            return;
        }
        this.toastr.error("Unknown error");
    }

    handleError(err: string): void {
        this.toastr.error(err);
    }

}
