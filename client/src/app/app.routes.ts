// import { Component } from '@angular/core';
import { Routes } from '@angular/router';
// import { Login } from './features/login/login';
// import { Profile } from './features/profile/profile';
// import { Register } from './features/register/register';
// import { Project } from './features/project/project';
// import { ErrorPage } from './features/error-page/error-page';
// import { Home } from './features/home/home';
// import { MyProfile } from './features/my-profile/my-profile';
// import { StaffManagement } from './features/staff-management/staff-management';
// import { ProjectDetail } from './features/project-detail/project-detail';
// import { StaffDetail } from './features/staff-detail/staff-detail';

export const routes: Routes = [
    { path: 'login', loadComponent: () => import('./features/login/login').then(c => c.Login) },
    { path: 'profile', loadComponent: () => import('./features/profile/profile').then(c => c.Profile) },
    { path: 'register', loadComponent: () => import('./features/register/register').then(c => c.Register) },
    { path: 'projects', loadComponent: () => import('./features/project/project').then(c => c.Project) },
    { path: 'projects/:id', loadComponent: () => import('./features/project-detail/project-detail').then(c => c.ProjectDetail) },
    { path: 'my-profile', loadComponent: () => import('./features/my-profile/my-profile').then(c => c.MyProfile) },
    { path: 'staff', loadComponent: () => import('./features/staff-management/staff-management').then(c => c.StaffManagement) },
    { path: 'staff/:id', loadComponent: () => import('./features/staff-detail/staff-detail').then(c => c.StaffDetail) },
    { path: '', loadComponent: () => import('./features/home/home').then(c => c.Home) },
];
