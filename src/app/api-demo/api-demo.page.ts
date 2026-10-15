import { Component, OnInit, inject } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Product } from '../models/product.model';
import { ApiResult, ProductPayload, ProductService } from '../services/product.service';

interface LastRequest {
  method: string;
  status: number;
  response: unknown;
}

@Component({
  selector: 'app-api-demo',
  templateUrl: './api-demo.page.html',
  styleUrls: ['./api-demo.page.scss'],
  standalone: false
})
export class ApiDemoPage implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly loadingController = inject(LoadingController);
  private readonly alertController = inject(AlertController);

  products: Product[] = [];
  form: ProductPayload = { name: '', description: '', price: 0, stock: 0 };
  editingId: number | null = null;
  isLoading = false;
  isBusy = false;
  successMessage = '';
  errorMessage = '';
  lastRequest: LastRequest | null = null;

  async ngOnInit(): Promise<void> {
    await this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    if (this.isBusy) return;
    this.isLoading = true;
    this.isBusy = true;
    this.errorMessage = '';
    try {
      const result = await this.productService.listApiProducts();
      this.products = result.data;
      this.lastRequest = { method: 'GET', status: result.httpStatus, response: result.data };
    } catch (error: unknown) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isLoading = false;
      this.isBusy = false;
    }
  }

  startEditing(product: Product): void {
    this.editingId = product.id;
    this.form = {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: Number(product.stock)
    };
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEditing(): void {
    this.editingId = null;
    this.resetForm();
  }

  async createProduct(): Promise<void> {
    if (!this.validateForm()) return;
    const payload = this.getPayload();
    await this.performRequest('POST', () => this.productService.createProduct(payload), true);
    if (!this.errorMessage) this.resetForm();
  }

  async replaceProduct(): Promise<void> {
    if (this.editingId === null || !this.validateForm()) return;
    const id = this.editingId;
    await this.performRequest('PUT', () => this.productService.replaceProduct(id, this.getPayload()), true);
    if (!this.errorMessage) this.cancelEditing();
  }

  async patchStock(): Promise<void> {
    if (this.editingId === null) return;
    const stock = Number(this.form.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      this.errorMessage = 'El stock debe ser un número entero igual o mayor que cero.';
      return;
    }
    const id = this.editingId;
    await this.performRequest('PATCH', () => this.productService.patchProduct(id, { stock }), true);
  }

  async confirmDelete(product: Product): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar producto',
      message: `¿Eliminar "${product.name}" de la API? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'confirm' }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role !== 'confirm') return;

    await this.performRequest('DELETE', () => this.productService.deleteProduct(product.id), true);
    if (this.editingId === product.id && !this.errorMessage) this.cancelEditing();
  }

  private async performRequest<T>(
    method: string,
    request: () => Promise<ApiResult<T>>,
    refreshList: boolean
  ): Promise<void> {
    this.isBusy = true;
    this.errorMessage = '';
    this.successMessage = '';
    const loading = await this.loadingController.create({
      message: `Enviando ${method} a la API…`,
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const result = await request();
      this.lastRequest = { method, status: result.httpStatus, response: result.data };
      this.successMessage = `${method} completado. Respuesta HTTP ${result.httpStatus}.`;
      if (refreshList) {
        try {
          await this.refreshProducts();
        } catch (error: unknown) {
          this.errorMessage = `La operación se completó, pero no se pudo actualizar la lista: ${this.getErrorMessage(error)}`;
        }
      }
    } catch (error: unknown) {
      this.errorMessage = this.getErrorMessage(error);
    } finally {
      this.isBusy = false;
      await loading.dismiss();
    }
  }

  private async refreshProducts(): Promise<void> {
    const result = await this.productService.listApiProducts();
    this.products = result.data;
  }

  private validateForm(): boolean {
    if (!this.form.name.trim()) {
      this.errorMessage = 'El nombre del producto es obligatorio.';
      return false;
    }
    if (!Number.isFinite(Number(this.form.price)) || Number(this.form.price) < 0) {
      this.errorMessage = 'El precio debe ser un número igual o mayor que cero.';
      return false;
    }
    if (!Number.isInteger(Number(this.form.stock)) || Number(this.form.stock) < 0) {
      this.errorMessage = 'El stock debe ser un número entero igual o mayor que cero.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  private getPayload(): ProductPayload {
    return {
      name: this.form.name.trim(),
      description: this.form.description.trim(),
      price: Number(this.form.price),
      stock: Number(this.form.stock)
    };
  }

  private resetForm(): void {
    this.form = { name: '', description: '', price: 0, stock: 0 };
    this.editingId = null;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      const response = (error as Error & {
        response?: { data?: { message?: unknown } };
      }).response;
      if (typeof response?.data?.message === 'string') return response.data.message;
      return error.message;
    }
    return 'No se pudo completar la solicitud. Revisa la conexión con la API.';
  }
}
