import { AfterViewChecked, ChangeDetectorRef, Component, inject, NgZone, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    //   template: `
    //     <div class="users" *ngFor="let user of currentUsers">
    //         {{user.username}}
    //     </div>
    //   `,
    templateUrl: './profile.html',
    styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
    data: any;

    ngOnInit(): void {

    }
}
