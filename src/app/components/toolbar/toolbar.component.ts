import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  readonly name = input<string>('');
  readonly searchQuery = output<string>();

  onSearch(query: string) {
    console.log('Searching for:', query);
    // Implement search functionality here
    this.searchQuery.emit(query);

  }
}
