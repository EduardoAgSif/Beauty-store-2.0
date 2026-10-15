import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { DataSourceConfig, DataSourceConfigService, RequestDiagnostics } from '../services/data-source-config.service';

@Component({ selector: 'app-data-source', templateUrl: './data-source.page.html', styleUrls: ['./data-source.page.scss'], standalone: false })
export class DataSourcePage implements OnInit {
  private configService = inject(DataSourceConfigService);
  private location = inject(Location);

  config: DataSourceConfig = { environment: 'development', protocol: 'http', host: 'localhost', apiPort: 80, apiBasePath: '/backend', dbEngine: 'mysql', dbPort: 3306, timeoutMs: 5000 };
  busy = false;
  message = '';
  diagnostics: RequestDiagnostics | null = null;
  showDiagnostics = false;
  rawJson = '';
  jsonError = '';
  async ngOnInit(): Promise<void> { this.config = await this.configService.getConfig(); this.rawJson = JSON.stringify(this.config, null, 2); }
  async save(): Promise<void> {
    if (!this.config.host.trim() || !this.config.protocol || Number(this.config.apiPort) < 1 || Number(this.config.apiPort) > 65535) {
      this.message = 'Enter a valid host and API port (1–65535).'; return;
    }
    await this.configService.saveConfig(this.config);
    this.config = await this.configService.getConfig();
    this.rawJson = JSON.stringify(this.config, null, 2);
    this.message = 'Data source configuration saved.';
  }
  async testConnection(): Promise<void> {
    this.busy = true; this.message = '';
    this.diagnostics = await this.configService.testConnection();
    this.busy = false;
    const ok = typeof this.diagnostics.status === 'number' && this.diagnostics.status >= 200 && this.diagnostics.status < 300;
    this.message = ok ? 'Connection test completed. The server returned an HTTP success status.' : 'Connection test failed. Open diagnostics for details.';
    this.configService.openDiagnostics(this.diagnostics);
    this.showDiagnostics = false;
  }
  async saveAndTest(): Promise<void> { await this.save(); if (this.message === 'Data source configuration saved.') await this.testConnection(); }
  applyJson(): void {
    try {
      const parsed = JSON.parse(this.rawJson);
      this.config = { ...this.config, ...parsed };
      this.jsonError = '';
      this.message = 'JSON applied to the form. Save to persist it.';
    } catch (error: any) { this.jsonError = `Invalid JSON: ${error?.message || 'could not parse input'}`; }
  }
  back(): void { this.location.back(); }
  get configJson(): string { return JSON.stringify(this.config, null, 2); }
}
