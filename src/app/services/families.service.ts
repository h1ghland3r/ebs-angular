import { Injectable } from '@angular/core';
import { Family } from './../models/families';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamiliesService {

  constructor(
    private http: HttpClient
  ) { }

  getfamilies() {
    return this.http.get<Family[]>(`${environment.endpoints.families}`);
  }

  getFamily(id: number) {
    return this.http.get<Family>(`${environment.endpoints.families}/${id}`);
  }

  createFamily(family: Family) {
    return this.http.post<Family>(`${environment.endpoints.families}`, family);
  }
}
