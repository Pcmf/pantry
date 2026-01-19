import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  standalone: true,
})
export class ToolbarComponent {
  readonly name = input.required<string>();
  readonly searchQuery = output<string>();

  onSearch(query: string) {
    this.searchQuery.emit(query);

  }
}
