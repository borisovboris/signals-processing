import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-actions',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './list-actions.component.html',
  styleUrl: './list-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListActionsComponent {
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit();
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit();
  }
}
