import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-tasks',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col w-full justify-center items-center mt-16 py-12">
      <img 
        width="200" 
        height="200" 
        [alt]="alt" 
        src="assets/no_data.svg"
        class="opacity-50 dark:opacity-40" />
      <span class="text-xl text-gray-500 dark:text-gray-400 font-medium mt-4">{{ message }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoTasksComponent {
  @Input() public alt!: string;
  @Input() public imageUrl!: string;
  @Input() public message!: string;
}