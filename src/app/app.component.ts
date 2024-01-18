import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  TransferState,
  ViewChild,
  afterNextRender,
  makeStateKey,
} from '@angular/core';

const dataKey = makeStateKey<{ data: string }>('data');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ang-ssr';

  @ViewChild('content') contentRef!: ElementRef;
  bindingData?: { data: string };

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private transferState: TransferState
  ) {
    // afterNextRender(() => {
    //   // Safe to check `scrollHeight` because this will only run in the browser, not the server.
    //   console.log(
    //     'content height: ' + this.contentRef.nativeElement.scrollHeight
    //   );
    // });
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformID)) {
      setTimeout(() => {
        this.bindingData = { data: 'Hello1' };
        this.transferState.set(dataKey, this.bindingData);
        console.log('data is rendered', this.bindingData);
      }, 5000);
      // this.httpClient.get('http://localhost:8080/data').subscribe((r: any) => {
      //   this.bindingData = r;
      //   console.log('data is rendered', r);
      // });
    } else if (isPlatformBrowser(this.platformID)) {
      this.bindingData = this.transferState.get<{ data: string }>(dataKey, {
        data: 'Hello client',
      });

      console.log(`Client side rendering `, this.bindingData);
    }
  }
}
