import { TestBed } from '@angular/core/testing';
import { DataSourceConfigService, RequestDiagnostics } from './data-source-config.service';
import { ProductService } from './product.service';

describe('ProductService REST operations', () => {
  const endpoint = 'http://localhost/backend/api.php';
  const diagnostics: RequestDiagnostics = {
    timestamp: '2026-10-14T00:00:00.000Z',
    method: 'GET',
    url: endpoint,
    protocol: 'http',
    host: 'localhost',
    port: 80,
    headers: {},
    payload: null
  };

  function createService(response: unknown) {
    const request = vi.fn().mockResolvedValue({
      data: response,
      status: 200,
      diagnostics
    });
    const config = {
      getEndpoint: vi.fn().mockResolvedValue(endpoint),
      request
    };
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: DataSourceConfigService, useValue: config }
      ]
    });
    return { service: TestBed.inject(ProductService), request };
  }

  it('lists API products and retains the HTTP status', async () => {
    const { service, request } = createService({
      status: 'success',
      data: [{ id: '4', name: 'Test product', price: '12.50', stock: 3 }]
    });

    const result = await service.listApiProducts();

    expect(result.httpStatus).toBe(200);
    expect(result.data[0]).toMatchObject({ id: 4, name: 'Test product', price: 12.5, stock: 3 });
    expect(request).toHaveBeenCalledWith('GET', endpoint, null, { Accept: 'application/json' });
  });

  it('creates a product with POST and returns its server ID', async () => {
    const payload = { name: 'Test product', description: 'Description', price: 12.5, stock: 3 };
    const { service, request } = createService({
      status: 'success',
      message: 'Created',
      id: '15'
    });

    const result = await service.createProduct(payload);

    expect(result.data.id).toBe(15);
    expect(request).toHaveBeenCalledWith('POST', endpoint, payload, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    });
  });

  it('sends full PUT, partial PATCH, and DELETE requests to the selected resource', async () => {
    const { service, request } = createService({ status: 'success', message: 'Updated' });

    await service.replaceProduct(7, { name: 'Replacement', description: '', price: 20, stock: 4 });
    await service.patchProduct(7, { stock: 5 });
    await service.deleteProduct(7);

    expect(request.mock.calls.map(([method, url]) => [method, url])).toEqual([
      ['PUT', `${endpoint}?id=7`],
      ['PATCH', `${endpoint}?id=7`],
      ['DELETE', `${endpoint}?id=7`]
    ]);
    expect(request.mock.calls[0][2]).toEqual({ name: 'Replacement', description: '', price: 20, stock: 4 });
    expect(request.mock.calls[1][2]).toEqual({ stock: 5 });
    expect(request.mock.calls[2][2]).toBeNull();
  });

  it('rejects an empty PATCH without making a request', async () => {
    const { service, request } = createService({ status: 'success' });

    await expect(service.patchProduct(7, {})).rejects.toThrow('Indica al menos un campo');
    expect(request).not.toHaveBeenCalled();
  });
});
