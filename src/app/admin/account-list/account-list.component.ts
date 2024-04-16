import { Component, OnInit } from '@angular/core';
import { Account } from '../../model/account';
import { AccountService } from '../../service/account.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../product-list/dialog/dialog-confirm.component';
import { DialogCreateComponent } from '../product-list/dialog-create/dialog-create.component';
import { DialogEditComponent } from '../product-list/dialog-edit/dialog-edit.component';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
})
export class AccountListComponent implements OnInit {
  id?: number;
  accounts?: Account[];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize?: number;
  pageNumber?: number;
  searchText: string = '';
  loadedPagination = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.searchText);
    // this.getProducts();
    this.fetchAccounts();
  }
  fetchAccounts(): void {
    console.log(this.searchText);
    this.accountService
      .getAccountsList(this.currentPage, this.pageSize)
      .subscribe(
        (res) => {
          this.accounts = res.content;
          console.log(res);
          this.totalPages = res.totalPages;
          this.loadedPagination = true;
        },
        (err) => console.error()
      );
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.fetchAccounts();
    }
  }

  onSearchTextEntered(searchValue: string) {
    this.searchText = searchValue;
    this.fetchAccounts();
  }

  banAccount(id: number) {
    this.accountService.banAccount(id).subscribe((res) => {
      this.fetchAccounts();
    });
  }

  unbanAccount(id: number) {
    this.accountService.unbanAccount(id).subscribe((res) => {
      this.fetchAccounts();
    });
  }

  openDialog(id: number) {}
}
