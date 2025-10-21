import { IProject, ColHeader, IStaff, ISearchForm } from '../../models/model';
import { Modal } from '../modal/modal';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service/user-service';
import { ErrorPage } from '../error-page/error-page';
import { ProjectService } from '../../services/project-service/project-service';
import { APIResponse } from '../../models/model';
import { ToastrService } from 'ngx-toastr';
import { MatIcon } from '@angular/material/icon';
import { Table } from '../table/table';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project',
    imports: [ErrorPage, Modal, MatIcon, Table, ReactiveFormsModule, CommonModule],
    templateUrl: './project.html',
    styleUrl: './project.scss',
})
export class Project implements OnInit {
    private userService = inject(UserService);
    private projectService = inject(ProjectService);
    private toastr = inject(ToastrService);
    private fb = inject(FormBuilder);

    isShowModal = false;
    currentUser = computed(() => this.userService.currentUser());
    projects = signal<IProject[]>([]);
    allLeaders = signal<IStaff[]>([]);
    filteredProjects = signal<IProject[]>([]);

    colHeaders: ColHeader<IProject>[] = [
        {key: "id", label:"id"},
        {key: "title", label:"title"},
        {key: "description", label:"description"},
        {key: "creator", label:"creator"},
        {key: "leader", label:"leader"},
        {key: "createdAt", label:"created at"},
        {key: "status", label:"status"},
        {key: "deadline", label:"deadline"},
        {key: "note", label:"note"}
    ];

    toggleModal(): void {
        this.isShowModal = !this.isShowModal;
    }

    handleAddNewProject(value: IProject) {
        this.projects.set([value, ...this.projects()]);
        this.filteredProjects.set([value, ...this.filteredProjects()]);
        console.log(this.projects());
        console.log(this.filteredProjects());
    }

    fetchProject(): void {
        const teamId: number = this.currentUser()?.teamId || -1;
        this.projectService.getProjectsByTeam(teamId).subscribe({
            next: (data) => this.handleSuccess(data),
            error: (err) => this.handleError(err)
        });
    }

    fetchLeaders(): void {
        this.userService.getAllLeaders().subscribe({
            next: (data) => this.allLeaders.set(data.data!),
            error: (err) => this.handleError(err)
        });
    }

    ngOnInit(): void {
        this.fetchProject();
        this.fetchLeaders();
    }

    handleSuccess(data: APIResponse<IProject[]>){
        this.projects.set(data.data!)
        this.filteredProjects.set(data.data!);
        console.log(data);
    }

    handleError(err: string){
        this.toastr.error(err);
    }

    searchForm = this.fb.group({
        title: this.fb.control<string>('', {nonNullable: true}),
        leader: this.fb.control<string>('', {nonNullable: true})
    });

    clearFilter() {
        this.searchForm.reset();
    }

    handleFilter(){
        const values: ISearchForm = this.searchForm.value;
        this.filteredProjects.set(this.projects().filter(p => {
            let ok = true;
            for(const [k, value] of Object.entries(values)){
                const key = k as keyof ISearchForm;
                if(!p[key].match(new RegExp(value, "i"))) ok = false;
            }
            if(ok) return p;
            return;
        }));
    }


    handleRefereshProjectCache(): void {
        this.projectService.refereshProjectCache();
        this.fetchProject();
        this.clearFilter();

    }

}
