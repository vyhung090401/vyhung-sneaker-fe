import { StorageService } from './../../service/storage.service';
import { Account, UserInfo } from 'src/app/model/account';
import { AccountService } from './../../service/account.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
})
export class ForgotComponent implements OnInit {
  phoneNumber!: string;
  isActive = false;
  account!: Account;
  errorMessage = '';
  existPhone = true;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {}

  checkAvailableAccount(phoneNumber: string) {
    this.accountService.getAccountByPhone(phoneNumber).subscribe(
      (res) => {
        console.log(res);
        this.storageService.userChange.next(res);
        this.router.navigate(['auth/reset-password']);
      },
      (err) => {
        if (err.status === 400) {
          this.existPhone = false;
          this.errorMessage = err.error;
        }
      }
    );
  }
}
