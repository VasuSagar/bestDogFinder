import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../utils/api-constants';
import { Dog, DogIdQueryParams, Match } from '../utils/models';
import { Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DogsService {
  baseUrl = API_BASE_URL;
  constructor(private http: HttpClient) { }

  getDogIds(dogIdQueryParams: DogIdQueryParams): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/dogs/search", { params: dogIdQueryParams as any, withCredentials: true, observe: 'response' as 'response', responseType: 'json' }).pipe(map(response => response.body));
  }

  getDogDetails(dogIds: string[]): Observable<Dog[]> {
    return this.http.post<Dog[]>(this.baseUrl + "/dogs", dogIds, { withCredentials: true, observe: 'response' as 'response', responseType: 'json' }).pipe(map(response => response.body as Dog[]));
  }

  getDogBreeds(): Observable<string[]> {
    return this.http.get<any>(this.baseUrl + "/dogs/breeds", { withCredentials: true, observe: 'response' as 'response', responseType: 'json' }).pipe(map(response => response.body));
  }

  getDogMatch(dogIds: string[]): Observable<Match> {
    return this.http.post<any>(this.baseUrl + "/dogs/match", dogIds, { withCredentials: true, observe: 'response' as 'response', responseType: 'json' }).pipe(map(response => response.body));
  }
}
