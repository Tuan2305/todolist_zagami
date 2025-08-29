import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class ModalComponent {
  @Input() title: string = 'Modal Title';
  @Input() show: boolean = false; // Điều khiển việc hiển thị modal
  @Output() close = new EventEmitter<void>(); // Sự kiện đóng modal

  onClose(): void {
    this.close.emit();
  }

  // Ngăn chặn việc click vào nền modal bên trong làm đóng modal
  onModalContentClick(event: Event): void {
    event.stopPropagation();
  }
}