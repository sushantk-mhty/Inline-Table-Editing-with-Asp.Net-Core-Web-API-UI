import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { bankAccountModel } from '../models/bankAccountmodel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(private http:HttpClient) { }
  
  postBankAccount(formData:bankAccountModel):Observable<bankAccountModel> {
    return this.http.post(environment.apiBaseURI + '/BankAccount', formData);
  }
  putBankAccount(formData:bankAccountModel):Observable<bankAccountModel>  {
    return this.http.put(environment.apiBaseURI + '/BankAccount/' + formData.bankAccountId, formData);
  }

  deleteBankAccount(id:number) {
    return this.http.delete(environment.apiBaseURI + '/BankAccount/' + id);
  }

  getBankAccountList():Observable<bankAccountModel[]> {
    return this.http.get<bankAccountModel[]>(environment.apiBaseURI + '/BankAccount');
  }
}
