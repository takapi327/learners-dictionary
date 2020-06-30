import { Component, OnInit, OnDestroy } from '@angular/core';
import { TryAngular2Component } from './try-angular2/try-angular2.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  interval: any;
  comps = [TryAngular2Component];
  current = 0;
  banner: any = TryAngular2Component;
  ngOnInit() {
    this.interval = setInterval(() => {
      this.current = (this.current + 1) % this.comps.length;
      this.banner = this.comps[this.current];
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
