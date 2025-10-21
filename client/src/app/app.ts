import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './app-layout/footer/footer';
import { Navigation } from "./app-layout/navigation/navigation";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Footer, Navigation],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {}
