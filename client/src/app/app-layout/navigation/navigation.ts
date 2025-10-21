import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ColHeader, IProject, User } from '../../models/model';
import { UserService } from '../../services/user-service/user-service';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../shared/directives/click-outisde-directive/click-outside-directive';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule, ClickOutsideDirective],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation implements OnInit {
    private userService = inject(UserService);
    private router = inject(Router);
    isUserMenuOpen = false;
    isLogin = computed(() => this.userService.currentUser() != null);
    currentUser = computed(() => this.userService.currentUser());


    toggleUserMenu(): void {
        this.isUserMenuOpen = !this.isUserMenuOpen;
    }

    handleLogout(): void {
        this.userService.logOut();
        this.router.navigate(["/projects"]);
        this.resetAll();
    }

    resetAll(): void {
        this.isUserMenuOpen = false;
    }

    ngOnInit(): void {
        this.userService.updateCurrentUser();
    }

}
