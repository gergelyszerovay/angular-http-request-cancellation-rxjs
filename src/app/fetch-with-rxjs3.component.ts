import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFetchComponent } from './ui-fetch.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpRequestState, MessageResponseType } from './model';
import { BehaviorSubject, EMPTY, Subscription, catchError, tap } from 'rxjs';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UiFetchComponent
  ],
  selector: 'app-fetch-with-rxjs3',
  template: `
<app-ui-fetch-component
  [httpRequestState]="httpRequestState$ | async"
  [message]="message$ | async"
  [hasCancelButton]="true"
  title="Example 3: RxJs (auto request cancellation)"
  (onFetchData)="fetchData($event)"
  (onCancel)="cancelAllRequests()"
>
</app-ui-fetch-component>
   `
})
export class FetchWithRxJs3Component {
  private http = inject(HttpClient);

  protected httpRequestState$ = new BehaviorSubject<HttpRequestState>('EMPTY');
  protected message$ = new BehaviorSubject<string | null>(null);

  protected subscriptions: Subscription[] = [];

  cancelAllRequests(updateState = true) {
    if (!this.subscriptions.length) {
      return;
    }
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
    if (updateState) {
      this.httpRequestState$.next({ errorMessage: 'All requests were canceled' });
    }
  }

  fetchData(path: string) {
    const url = `http://localhost:3000/${path}`;
    console.log('http.get', url);
    this.cancelAllRequests(false);
    this.httpRequestState$.next('FETCHING');
    const subscription = this.http.get<MessageResponseType>(url)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.httpRequestState$.next({ errorMessage: 'Request error' });
          return EMPTY;
        }),
      ).subscribe((response) => {
        this.message$.next(response.message);
        this.httpRequestState$.next('FETCHED');
      });
    this.subscriptions.push(subscription);
  }
}

