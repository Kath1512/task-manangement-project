import { UserService } from '../../services/user-service/user-service';
import { ProjectService } from '../../services/project-service/project-service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { APIResponse, IProject } from '../../models/model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorPage } from '../error-page/error-page';
import { CommonModule } from '@angular/common';
import { ModalEditProject } from '../modal-edit-project/modal';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project-detail',
  imports: [ErrorPage, CommonModule, ModalEditProject, MatIcon],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetail implements OnInit {
    private route = inject(ActivatedRoute);
    private projectService = inject(ProjectService);
    private toastr = inject(ToastrService);
    private userService = inject(UserService);
    currentUser = computed(() => this.userService.currentUser());
    currentProject = signal<IProject | null>(null);
    displayProject = signal<([string, any])[] | null>(null);
    isOpenEditProjectModal = false;
    isPermitted = computed(() => this.currentProject()?.teamId == this.currentUser()?.teamId || this.currentUser()?.role == 'admin');
    canEdit = computed(() => (this.currentUser()?.id == this.currentProject()?.leaderId) ||
                            (this.currentUser()?.id == this.currentProject()?.creatorId));

    fetchProjectById(projectId: number): void {
        this.projectService.getProjectById(projectId).subscribe({
            next: (data) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        })
    }
    ngOnInit(): void {
        if(this.currentUser() == null) return;
        const projectId = this.route.snapshot.paramMap.get('id');
        if(projectId == null || Number.isNaN(projectId)) return;
        this.fetchProjectById(Number(projectId));
    }

    handleSuccess(data: APIResponse<IProject>){
        if(data.success == true){
            const thisProject = data.data;
            this.displayProject.set(Object.entries<any>(thisProject!));
            this.currentProject.set(thisProject!)
            console.log(data);
            return;
        }
        this.toastr.error("Unknown error");
    }

    handleError(err: string){
        this.toastr.error(err);
    }
}
