import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnChanges,
    OnInit,
    ViewEncapsulation,
    computed,
    input,
    signal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ColHeader } from '../../models/model';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-table',
    imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIcon, RouterLink],
    templateUrl: './table.html',
    styleUrl: './table.scss',
    encapsulation: ViewEncapsulation.None,
})
export class Table<T> implements OnInit, OnChanges {
    @Input() colHeaders!: ColHeader<T>[];
    dataSource = input<T[]>([]);

    colKeys: (keyof T)[] = [];
    totalItems = 1;
    itemsPerPage = 5;
    totalPages = 1;
    currentPage = signal<number>(1);
    displayDataSource = computed(() => {
        const start = this.itemsPerPage * (this.currentPage() - 1);
        const end = start + this.itemsPerPage;
        return this.dataSource().slice(start, end);
    });

    ngOnInit(): void {
        this.colKeys = this.colHeaders.map((c) => c.key);
    }

    ngOnChanges(): void {
        console.log(this.dataSource());
        this.totalItems = this.dataSource().length;
        this.totalPages = Math.ceil(this.dataSource().length / this.itemsPerPage);
    }

    handleNextPage(): void {
        if(this.currentPage() < this.totalPages){
            this.currentPage.update(p => p + 1);
        }
    }

    handlePreviousPage(): void {
        if(this.currentPage() > 1){
            this.currentPage.update(p => p - 1);
        }
    }

    handleFindPage(event: Event): void {
        const value = Number((event.target as HTMLInputElement).value);
        if(isNaN(value)) return;
        this.currentPage.set(value);
    }


}
