import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestDiagnostics } from '../../services/data-source-config.service';

@Component({
  selector: 'app-request-diagnostics',
  templateUrl: './request-diagnostics.component.html',
  styleUrls: ['./request-diagnostics.component.scss'],
  standalone: false
})
export class RequestDiagnosticsComponent {
  @Input() visible = false;
  @Input() title = 'Request diagnostics';
  @Input() details: RequestDiagnostics | null = null;
  @Output() closed = new EventEmitter<void>();
  close(): void { this.closed.emit(); }
  get formattedDetails(): string { return this.details ? JSON.stringify(this.details, null, 2) : 'No request details available.'; }
}
