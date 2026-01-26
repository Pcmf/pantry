import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { AppStore } from './store/app.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  readonly store = inject(AppStore);
  onSearch(query: string) {
    this.store.setSearchQuery(query);
  }

  constructor() {
    effect(() => {
  if (this.store.isBusy()) {
    console.log('spinner');
  }
});
  }
}
