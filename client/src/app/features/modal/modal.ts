import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, Output, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { APIResponse, IProject, IProjectForm, Status } from '../../models/model';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../services/project-service/project-service';
import { UserService } from '../../services/user-service/user-service';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class Modal {
    // @Output() closeEvent = new EventEmitter<void>();
    private fb = inject(FormBuilder);
    private toastr = inject(ToastrService);
    private projectService = inject(ProjectService)
    private userService = inject(UserService);

    currentUser = computed(() => this.userService.currentUser());

    projectForm = this.fb.group({
        title: this.fb.control('', {nonNullable: true}),
        description: this.fb.control('', {nonNullable: true}),
        deadline: this.fb.control('', {nonNullable: true}),
        status: this.fb.control<Status>('Planned', {nonNullable: true}),
        note: this.fb.control('', {nonNullable: true}),
        creatorId: this.fb.control(this.currentUser()?.id, {nonNullable: true}),
        leaderId: this.fb.control(this.currentUser()?.leaderId, {nonNullable: true}),
        teamId: this.fb.control(this.currentUser()?.teamId, {nonNullable: true})
    });

    closeEvent = output<void>();
    addProjectEvent = output<IProject>();

    closeModal(){
        this.closeEvent.emit();
    }

    emitProject(values: IProject){
        this.addProjectEvent.emit(values);
    }

    validate(values: IProjectForm): boolean{
        if(values.title.trim() === ''){
            this.toastr.error("Project must have a title");
            return false;
        }
        if(values.deadline.toString().trim() === ''){
            this.toastr.error("Project must have a deadline");
            return false;
        }
        return true;
    }

    handleAddProject(): void {
        const values: IProjectForm = this.projectForm.getRawValue();
        if(!this.validate(values)){
            return;
        }
        console.log(values);
        this.projectService.addProject(values).subscribe({
            next: (data: APIResponse<IProject>) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        });
    }

    handleSuccess(data: APIResponse<IProject>): void {
        if(data.success == true){
            this.toastr.success(data.message);
            console.log(data.data);
            this.emitProject(data.data!);
            this.closeModal();
            return;
        }
        this.toastr.error("Unknown error");
    }

    handleError(err: string): void {
        this.toastr.error(err);
    }

}
