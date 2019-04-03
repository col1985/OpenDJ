import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AddSongRequestObject } from './../models/add-song-request.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiURL = '';

  constructor(private http: HttpClient) {}

  addSong(reqBody: AddSongRequestObject) {
    if (this.apiURL.length === 0) {
      return of(true);
    } else {
      return this.http.post(this.apiURL, reqBody);
    }
  }

  getPlaylist() {}
}
