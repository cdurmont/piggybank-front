import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import IPaymentMethod from "../../shared/models/IPaymentMethod";
import ITransaction from "../../shared/models/ITransaction";

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  constructor(private httpClient: HttpClient) { }

  getServiceUrl(instanceId: number): string {
    return `${environment.backendUrl}/${instanceId}/paymentMethods`;
  }

  create(instanceId: number, pm: IPaymentMethod): Observable<IPaymentMethod> {
    const serviceUrl: string = this.getServiceUrl(instanceId);
    return this.httpClient.post(`${serviceUrl}`,pm);
  }

  read(instanceId: number, filter: IPaymentMethod): Observable<IPaymentMethod[]> {
    return this.httpClient.get<IPaymentMethod[]>(this.getServiceUrl(instanceId), {params: {filter: JSON.stringify(filter)}});
  }

  getById(instanceId: number, id: number): Observable<ITransaction> {
    return this.httpClient.get<ITransaction>(`${this.getServiceUrl(instanceId)}/${id}`);
  }

  update(instanceId: number, pm: IPaymentMethod): Observable<{}> {
    const serviceUrl: string = this.getServiceUrl(instanceId);
    return this.httpClient.put(`${serviceUrl}/${pm.id}`,pm);
  }

  delete(instanceId: number, pm: IPaymentMethod): Observable<{}> {
    const serviceUrl: string = this.getServiceUrl(instanceId);
    return this.httpClient.delete(`${serviceUrl}/${pm.id}`);
  }



}
