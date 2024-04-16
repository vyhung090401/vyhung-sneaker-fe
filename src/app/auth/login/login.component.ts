import { error } from 'jquery';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { StorageService } from '../../service/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  returnUrl!: string;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  showSuccess(message: any, title: any) {
    this.toast.success(message, title, {
      timeOut: 2000,
    });
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: (res) => {
        console.log(res);
        this.storageService.saveToken(res.data.token);
        this.storageService.saveUser(res.data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.storageService.userChange.next(res.data);
        if (this.roles && this.roles.includes('ROLE_USER')) {
          this.router.navigate(['/home']);
          this.showSuccess('Login Successfully!', 'Notification!');
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }
}
