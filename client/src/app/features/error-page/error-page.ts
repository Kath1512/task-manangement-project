import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss'
})
export class ErrorPage {
    errorMessage = input<string>();
}
