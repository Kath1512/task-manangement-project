import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, OnInit, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { APIResponse, IEditProjectForm, IProject, IProjectForm, Status } from '../../models/model';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../services/project-service/project-service';
import { UserService } from '../../services/user-service/user-service';

@Component({
  selector: 'app-modal-edit-project',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-edit-project.html',
  styleUrl: './modal-edit-project.scss'
})
export class ModalEditProject implements OnInit {
    // @Output() closeEvent = new EventEmitter<void>();
    private fb = inject(FormBuilder);
    private toastr = inject(ToastrService);
    private projectService = inject(ProjectService)
    private userService = inject(UserService);

    currentUser = computed(() => this.userService.currentUser());
    currentProjectDetail = input<IProject>()
    editProjectForm: FormGroup =this.fb.group({})

    ngOnInit(): void {
        const dl = this.currentProjectDetail()!.deadline.split('T')[0];
        this.editProjectForm = this.fb.group({
            title: this.fb.control(this.currentProjectDetail()?.title, {nonNullable: true}),
            description: this.fb.control(this.currentProjectDetail()?.description, {nonNullable: true}),
            deadline: this.fb.control(dl, {nonNullable: true}),
            status: this.fb.control<any>(this.currentProjectDetail()?.status, {nonNullable: true}),
            note: this.fb.control(this.currentProjectDetail()?.note, {nonNullable: true}),
        });
    }

    closeEvent = output<void>();
    addProjectEvent = output<IProject>();

    closeModal(){
        this.closeEvent.emit();
    }

    emitProject(values: IProject){
        this.addProjectEvent.emit(values);
    }

    validate(values: IEditProjectForm): boolean{
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

    handleEditProject(): void {
        if(this.editProjectForm == null) return;
        const values: IEditProjectForm = this.editProjectForm.getRawValue();
        if(!this.validate(values)){
            return;
        }
        console.log(values);
        this.projectService.editProject(values).subscribe({
            next: (data: APIResponse<IProject>) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        });
    }

    handleSuccess(data: APIResponse<IProject>): void {
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
