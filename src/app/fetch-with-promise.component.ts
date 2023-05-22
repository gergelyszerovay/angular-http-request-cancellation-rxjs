import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFetchComponent } from './ui-fetch.component';
import { HttpClient } from '@angular/common/http';
import { HttpRequestState, MessageResponseType } from './model';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UiFetchComponent
  ],
  selector: 'app-fetch-with-promise',
  template: `
<app-ui-fetch-component style="display: block"
  [httpRequestState]="httpRequestState$ | async"
  [message]="message$ | async"
  (onFetchData)="fetchData($event)"
  title="Promise"
>
</app-ui-fetch-component>
   `
})
export class FetchWithPromiseComponent {
  private http = inject(HttpClient);

  protected httpRequestState$ = new BehaviorSubject<HttpRequestState>('EMPTY');
  protected message$ = new BehaviorSubject<string | null>(null);

  async fetchData(path: string) {
    const url = `http://localhost:3000/${path}`;
    console.log('http.get', url);
    this.httpRequestState$.next('FETCHING');
    try {
      const response = await lastValueFrom(this.http.get<MessageResponseType>(url));
      this.message$.next(response.message);
      this.httpRequestState$.next('FETCHED');}
    catch(e) {
      this.httpRequestState$.next({ errorMessage: 'Request error' });
    }
  }
}
