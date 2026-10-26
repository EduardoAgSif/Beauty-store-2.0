import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

export interface DataSourceConfig {
  environment: string;
  protocol: 'http' | 'https';
  host: string;
  apiPort: number;
  apiBasePath: string;
  dbEngine: string;
  dbPort: number;
  timeoutMs: number;
}

export interface RequestDiagnostics {
  timestamp: string;
  method: string;
  url: string;
  protocol: string;
  host: string;
  port: number | string;
  headers: Record<string, string>;
  payload: unknown;
  status?: number | string;
  response?: unknown;
  error?: string;
  destinationHost?: string;
  destinationIp?: string;
  destinationIpNote?: string;
  timeoutMs?: number;
  responseHeaders?: Record<string, string>;
}

const DEFAULT_CONFIG: DataSourceConfig = {
  environment: 'development',
  protocol: 'http',
  host: 'localhost',
  apiPort: 80,
  apiBasePath: '/backend',
  dbEngine: 'mysql',
  dbPort: 3306,
  timeoutMs: 5000
};

@Injectable({ providedIn: 'root' })
export class DataSourceConfigService {
  private readonly diagnosticsSubject = new BehaviorSubject<{ visible: boolean; details: RequestDiagnostics | null }>({ visible: false, details: null });
  readonly diagnostics$ = this.diagnosticsSubject.asObservable();

  async getConfig(): Promise<DataSourceConfig> {
    return { ...DEFAULT_CONFIG };
  }

  async getApiBaseUrl(): Promise<string> {
    const c = await this.getConfig();
    const port = (c.protocol === 'https' && Number(c.apiPort) === 443) || (c.protocol === 'http' && Number(c.apiPort) === 80)
      ? '' : `:${Number(c.apiPort)}`;
    return `${c.protocol}://${c.host.trim()}${port}${this.normalizePath(c.apiBasePath)}`;
  }

  async getEndpoint(fileName: string): Promise<string> {
    return `${await this.getApiBaseUrl()}/${fileName.replace(/^\/+/, '')}`;
  }

  openDiagnostics(details: RequestDiagnostics): void {
    this.diagnosticsSubject.next({ visible: true, details });
  }

  closeDiagnostics(): void {
    this.diagnosticsSubject.next({ visible: false, details: this.diagnosticsSubject.value.details });
  }

  /** Executes an API request and captures the full client-visible request/response diagnostics. */
  async request<T = unknown>(method: string, url: string, payload: unknown = null, headers: Record<string, string> = { Accept: 'application/json' }): Promise<{ data: T; status: number; diagnostics: RequestDiagnostics }> {
    const c = await this.getConfig();
    const destination = this.getDestination(url, c);
    const details: RequestDiagnostics = {
      timestamp: new Date().toISOString(), method: method.toUpperCase(), url,
      protocol: destination.protocol || c.protocol,
      host: destination.host || c.host,
      port: destination.port || c.apiPort,
      destinationHost: destination.host || c.host,
      destinationIp: destination.host || c.host,
      destinationIpNote: 'El navegador/app puede mostrar el host configurado, pero no puede consultar de forma fiable la IP real resuelta por DNS.',
      headers: this.safeHeaders(headers), payload: this.safeResponse(payload), timeoutMs: Number(c.timeoutMs) || 5000
    };

    try {
      const response = await axios.request<T>({
        method,
        url,
        data: payload === null ? undefined : payload,
        headers,
        timeout: Number(c.timeoutMs) || 5000
      });
      details.status = response.status;
      details.response = this.safeResponse(response.data);
      details.responseHeaders = this.safeHeaders(response.headers as Record<string, unknown>);
      return { data: response.data, status: response.status, diagnostics: details };
    } catch (error: any) {
      details.status = error?.response?.status ?? error?.code ?? 'NETWORK_ERROR';
      details.response = error?.response?.data != null ? this.safeResponse(error.response.data) : null;
      details.responseHeaders = error?.response?.headers ? this.safeHeaders(error.response.headers) : {};
      details.error = error?.message || 'Request failed';
      // Auto-popup removed to prevent interrupting user browsing
      throw Object.assign(error instanceof Error ? error : new Error(details.error), { requestDiagnostics: details, originalError: error });
    }
  }

  async testConnection(): Promise<RequestDiagnostics> {
    const url = await this.getEndpoint('api.php');
    try {
      const result = await this.request('GET', url, null, { Accept: 'application/json' });
      return result.diagnostics;
    } catch (error: any) {
      return error?.requestDiagnostics || {
        timestamp: new Date().toISOString(), method: 'GET', url, protocol: '', host: '', port: '',
        headers: { Accept: 'application/json' }, payload: null, status: 'NETWORK_ERROR', error: error?.message || 'Connection failed'
      };
    }
  }

  private getDestination(url: string, config: DataSourceConfig): { protocol: string; host: string; port: number | string } {
    try {
      const parsed = new URL(url);
      const defaultPort = parsed.protocol === 'https:' ? '443' : '80';
      return { protocol: parsed.protocol.replace(':', ''), host: parsed.hostname, port: parsed.port || defaultPort };
    } catch {
      return { protocol: config.protocol, host: config.host, port: config.apiPort };
    }
  }

  private safeHeaders(value: Record<string, unknown>): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, item] of Object.entries(value || {})) {
      result[key] = /authorization|cookie|token|secret|api[-_]?key/i.test(key) ? '[REDACTED]' : String(item).slice(0, 1000);
    }
    return result;
  }

  private normalizePath(path: string): string {
    const clean = (path || '').trim().replace(/^\/+|\/+$/g, '');
    return clean ? `/${clean}` : '';
  }

  safeResponse(value: unknown): unknown {
    const redact = (item: any): any => {
      if (Array.isArray(item)) return item.map(redact);
      if (item && typeof item === 'object') {
        const result: Record<string, unknown> = {};
        for (const [key, nested] of Object.entries(item)) {
          result[key] = /password|token|secret|authorization|api[-_]?key/i.test(key) ? '[REDACTED]' : redact(nested);
        }
        return result;
      }
      if (typeof item === 'string') return item.slice(0, 4000);
      return item;
    };
    try { return redact(value); } catch { return String(value); }
  }
}
