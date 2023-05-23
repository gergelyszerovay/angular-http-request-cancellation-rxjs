import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFetchComponent } from './ui-fetch.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpRequestState, MessageResponseType } from './model';
import { BehaviorSubject, EMPTY, Subscription, catchError, of, skip, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UiFetchComponent
  ],
  selector: 'app-fetch-with-rxjs5',
  template: `
<app-ui-fetch-component
  [httpRequestState]="httpRequestState$ | async"
  [message]="message$ | async"
  title="Example 5: RxJs (user triggered + auto request cancellation by switchMap())"
  [hasCancelButton]="true"
  (onFetchData)="fetchData($event)"
  (onCancel)="cancelAllRequests()"
>
</app-ui-fetch-component>
   `
})
export class FetchWithRxJs5Component {
  private http = inject(HttpClient);

  protected httpRequestState$ = new BehaviorSubject<HttpRequestState>('EMPTY');
  protected message$ = new BehaviorSubject<string | null>(null);

  protected triggerFetch$ = new BehaviorSubject<{ path?: string, cancel?: boolean }>(
    { path: '' });

  constructor() {
    this.triggerFetch$.pipe(
      skip(1), // we doesn't want an initial fetch on component creation
      takeUntilDestroyed(),
      tap(() => this.httpRequestState$.next('FETCHING')),
      switchMap(({ path, cancel }) => {
        if (cancel) {
          return of();
        }
        const url = `http://localhost:3000/${path}`;
        console.log('http.get', url);
        return this.http.get<MessageResponseType>(url)
          .pipe(
            tap((response) => {
              this.message$.next(response.message);
              this.httpRequestState$.next('FETCHED');
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              this.httpRequestState$.next({ errorMessage: 'Request error' });
              return EMPTY;
            })
          );
        })).subscribe();
  }

  cancelAllRequests() {
    this.triggerFetch$.next({ cancel: true });
  }

  fetchData(path: string) {
    this.triggerFetch$.next({ path });
  }
}
