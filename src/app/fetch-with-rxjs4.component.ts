import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFetchComponent } from './ui-fetch.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpRequestState, MessageResponseType } from './model';
import { BehaviorSubject, EMPTY, catchError, skip, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UiFetchComponent
  ],
  selector: 'app-fetch-with-rxjs4',
  template: `
<app-ui-fetch-component
  [httpRequestState]="httpRequestState$ | async"
  [message]="message$ | async"
  (onFetchData)="fetchData($event)"
  title="Example 4: RxJs (auto request cancellation by switchMap())"
>
</app-ui-fetch-component>
   `
})
export class FetchWithRxJs4Component {
  private http = inject(HttpClient);

  protected httpRequestState$ = new BehaviorSubject<HttpRequestState>('EMPTY');
  protected message$ = new BehaviorSubject<string | null>(null);

  protected triggerFetch$ = new BehaviorSubject<string>('');

  constructor() {
    this.triggerFetch$.pipe(
      skip(1), // we doesn't want an initial fetch on component creation
      takeUntilDestroyed(),
      tap(() => this.httpRequestState$.next('FETCHING')),
      switchMap((path) => {
        const url = `http://localhost:3000/${path}`;
        console.log('http.get', url);
        return this.http.get<MessageResponseType>(url)
          .pipe(
            catchError((errorResponse: HttpErrorResponse) => {
              this.httpRequestState$.next({ errorMessage: 'Request error' });
              return EMPTY;
            })
          );
        })).subscribe((response) => {
          this.message$.next(response.message);
          this.httpRequestState$.next('FETCHED');
        });
  }

  fetchData(path: string) {
    this.triggerFetch$.next(path);
  }
}
