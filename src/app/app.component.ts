import { Component, inject } from '@angular/core';
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
  title = 'Pantry';

  readonly store = inject(AppStore);
  onSearch(query: string) {
    console.log('AppComponent received search query:', query);
    this.store.setSearchQuery(query);
  }
}
