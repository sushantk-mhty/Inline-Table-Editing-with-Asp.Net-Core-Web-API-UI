import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { bankModel } from '../models/bankmodel';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http:HttpClient) { }

  getBankList():Observable<bankModel[]>{
   return this.http.get<bankModel[]>(environment.apiBaseURI+'/Bank');
  }
}
