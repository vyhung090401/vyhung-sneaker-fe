import { AuthComponent } from './../../auth/auth.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  imports:[CommonModule,RouterModule,ReactiveFormsModule,FormsModule],
  standalone:true
})

export class ChangePasswordComponent implements OnInit {
  rsPassForm: FormGroup= new FormGroup({});
  isSubmitted = false;
  currentUser: any;


  constructor(private fb: FormBuilder
              ,private authService: AuthService
              ,private toast: ToastrService
              ,private storageService: StorageService){}
  ngOnInit(): void {
    this.storageService.userChange.subscribe(res => {
      this.currentUser = res;
    });
    this.rsPassForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required,Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      confirmNewPassword: ['', [Validators.required]],
    },
    {
      validators: [this.match('newPassword', 'confirmNewPassword')],
    },);
  }

  showSuccess(message:any, title:any) {
    this.toast.success(message, title,{
      timeOut: 2000,
    });

  }

  Save(){
    this.isSubmitted = true;
    this.validateCurrentPassword();
    if(this.rsPassForm){
      this.authService.reset(this.currentUser.username,this.rsPassForm.value.newPassword).subscribe(res => {
        console.log(this.rsPassForm.value.newPassword);
      });
      this.showSuccess('Change Password Successfully!','Notification')
    }
  }

  get currentPassword() {
    return this.rsPassForm.get('currentPassword');
  }

  get newPassword() {
    return this.rsPassForm.get('newPassword');
  }

  get confirmNewPassword() {
    return this.rsPassForm.get('confirmNewPassword');
  }

  validateCurrentPassword() {
    this.authService.validateCurrentPassword(this.currentPassword?.value).subscribe(res => {
      console.log(res);
      if(res === false){
        this.currentPassword?.setErrors({invalid: true})
      } else this.currentPassword?.setErrors(null)
    });
  }

  match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}
