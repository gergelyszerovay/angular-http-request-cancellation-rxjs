import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpRequestState } from './model';


@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule
  ],
  selector: 'app-ui-fetch-component',
  template: `
<div class="block p-4 rounded-lg shadow-lg bg-white max-w-xl mb-2">
  <div class="text-gray-900 text-xl font-medium leading-tight mb-2">{{title}}</div>
  <div>
    <button (click)="onFetchData.emit('data/2000')" [disabled]="isFetchDisabled"
      class="inline-block px-6 py-2.5 bg-slate-600 text-slate-50 text-xs font-medium leading-tight rounded shadow-md m-1 disabled:opacity-75"
    >Fetch from /data/2000 (fast)</button>
    <button (click)="onFetchData.emit('data/4000')" [disabled]="isFetchDisabled"
      class="inline-block px-6 py-2.5 bg-slate-600 text-slate-50 text-xs font-medium leading-tight rounded shadow-md m-1 disabled:opacity-75"
    >Fetch from /data/4000 (slower)</button>
    <button (click)="onFetchData.emit('error')" [disabled]="isFetchDisabled"
      class="inline-block px-6 py-2.5 bg-slate-600 text-slate-50 text-xs font-medium leading-tight rounded shadow-md m-1 disabled:opacity-75"
    >Fetch from /error</button>
    <button *ngIf="hasCancelButton" (click)="onCancel.emit()"
      class="inline-block px-6 py-2.5 bg-red-600 text-slate-50 text-xs font-medium leading-tight rounded shadow-md m-1"
    >Cancel all requests</button>
  </div>
  <div *ngIf="httpRequestState === 'FETCHED' && !!message">
    {{ message }}
  </div>
  <div *ngIf="httpRequestState === 'FETCHING'">
    Loading...
  </div>
  <div *ngIf="httpRequestState && getHttpRequestStateError(httpRequestState) as errorMessage">
    ERROR: {{errorMessage}}
  </div>
</div>
   `
})
export class UiFetchComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) httpRequestState!: HttpRequestState | null;
  @Input({ required: true }) message!: string | null;
  @Input() hasCancelButton = false;
  @Input() isFetchDisabled = false;
  @Output() onFetchData: EventEmitter<string> = new EventEmitter();
  @Output() onCancel: EventEmitter<void> = new EventEmitter();

  getHttpRequestStateError(httpRequestState: HttpRequestState): string | undefined {
    return (typeof(httpRequestState) === 'object' && httpRequestState?.errorMessage) || undefined;
  }
}
