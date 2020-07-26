import { Injectable } from '@angular/core';
import { Person } from '../models/person';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  constructor(
    private http: HttpClient
  ) { }

  getPersons() {
    return this.http.get<Person[]>(`${environment.endpoints.persons}`);
  }

  getPerson(id: number) {
    return this.http.get<Person>(`${environment.endpoints.persons}/${id}`);
  }

  createPerson(person: Person) {
    return this.http.post<Person>(`${environment.endpoints.persons}`, person);
  }

  updatePerson(person) {
    return this.http.put<Person>(`${environment.endpoints.persons}/${person.id}`, person);
  }

  deletePerson(id: number) {
    return this.http.delete<Person>(`${environment.endpoints.persons}/${id}`);
  }
}
