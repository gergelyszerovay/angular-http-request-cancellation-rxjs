import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchWithRxJs1Component } from './fetch-with-rxjs1.component';
import { FetchWithRxJs2Component } from './fetch-with-rxjs2.component';
import { FetchWithRxJs3Component } from './fetch-with-rxjs3.component';
import { FetchWithRxJs4Component } from './fetch-with-rxjs4.component';
import { FetchWithRxJs5Component } from './fetch-with-rxjs5.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FetchWithRxJs1Component,
    FetchWithRxJs2Component,
    FetchWithRxJs3Component,
    FetchWithRxJs4Component,
    FetchWithRxJs5Component
  ],
  selector: 'app-root',
  template: `
<div class="p-2">
  <app-fetch-with-rxjs1/>
  <app-fetch-with-rxjs2/>
  <app-fetch-with-rxjs3/>
  <app-fetch-with-rxjs4/>
  <app-fetch-with-rxjs5/>
</div>
   `
})
export class AppComponent {
}
