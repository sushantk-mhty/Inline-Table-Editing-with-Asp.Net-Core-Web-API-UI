import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankService } from '../shared/bank.service';
import { bankModel } from '../models/bankmodel';
import { BankAccountService } from '../shared/bank-account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
})
export class BankAccountComponent implements OnInit,OnDestroy {

  bankAccountForms: any = this.fb.array([]);
  public bankList?:bankModel[];
  notification:any=null;
  private getBankListSubscription?:Subscription;
  private getBankAccountListSubscription?:Subscription;
  private postBankAccountListSubscription?:Subscription;
  private putBankAccountListSubscription?:Subscription;
  private deleteBankAccountListSubscription?:Subscription;
  constructor(private fb: FormBuilder, private bankService: BankService, private bankAccountService:BankAccountService) {}

  ngOnInit() {
    this.getBankListSubscription=this.bankService.getBankList().subscribe(res=>
      this.bankList = res as []
    );
    this.getBankAccountListSubscription=this.bankAccountService.getBankAccountList().subscribe(
      res=>{
        if(res.length == 0){
          this.addBankAccountForm();
        }
        else{
          (res as []).forEach((bankAccount: any) => {
            this.bankAccountForms.push(this.fb.group({
              bankAccountId: [bankAccount.bankAccountId],
              accountNumber: [bankAccount.accountNumber, Validators.required],
              accountHolder: [bankAccount.accountHolder, Validators.required],
              bankId: [bankAccount.bankId, Validators.min(1)],
              IFSC: [bankAccount.ifsc, Validators.required]
            }));
          });
        }
      }
    )
  }

  addBankAccountForm() {
    this.bankAccountForms.push(this.fb.group({
      bankAccountId: [0],
      accountNumber: ['', Validators.required],
      accountHolder: ['', Validators.required],
      bankId: [0, Validators.min(1)],
      IFSC: ['', Validators.required]
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.bankAccountId == 0)
      this.postBankAccountListSubscription=this.bankAccountService.postBankAccount(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ bankAccountId: res.bankAccountId });
          this.showNotification('insert');
        });
    else
      this.putBankAccountListSubscription=this.bankAccountService.putBankAccount(fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
  }
  onDelete(bankAccountId:number, i:any) {
    if (bankAccountId == 0)
      this.bankAccountForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?'))
      this.deleteBankAccountListSubscription=this.bankAccountService.deleteBankAccount(bankAccountId).subscribe(
        res => {
          this.bankAccountForms.removeAt(i);
          this.showNotification('delete');
        });
  }
  showNotification(category:string) {
    switch (category) {
      case 'insert':
        this.notification = { class: 'text-success', message: 'saved!' };
        break;
      case 'update':
        this.notification = { class: 'text-primary', message: 'updated!' };
        break;
      case 'delete':
        this.notification = { class: 'text-danger', message: 'deleted!' };
        break;

      default:
        break;
    }
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }
  ngOnDestroy(): void {
    this.getBankListSubscription?.unsubscribe();
    this.getBankAccountListSubscription?.unsubscribe();
    this.postBankAccountListSubscription?.unsubscribe();
    this.putBankAccountListSubscription?.unsubscribe();
    this.deleteBankAccountListSubscription?.unsubscribe();
  }
}
