import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  addRequest(name: string, phone: string, service: string, type: string): Observable<DefaultResponseType>{
    const body = {
      name: name,
      phone: phone,
      service: service,
      type: type
    }

    return this.http.post<DefaultResponseType>(environment.api + "requests", body)
  }
}
