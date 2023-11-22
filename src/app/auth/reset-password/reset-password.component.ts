import { AuthService } from './../../service/auth.service';
import { StorageService } from './../../service/storage.service';
import { AccountService } from './../../service/account.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth} from '@angular/fire/compat/auth'
import { Phonenumber } from 'src/app/model/phonenumber';
import { WindowService } from 'src/app/service/window.service';
import { initializeApp } from 'firebase/app';
import { RecaptchaVerifier, getAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  currentUser: any;
  isActive = false;
  id!: number;
  windowRef: any;
  phone:any;
  verificationCode!: string;
  country!: string;
  area!: string;
  prefix!: string;
  line!: string;
  phoneNumber = new Phonenumber()
  verifySuccess = false;
  rsPassForm: FormGroup= new FormGroup({});
  isSubmitted = false;



  constructor(private activatedRoute: ActivatedRoute
              ,private accountService: AccountService
              ,private storageService: StorageService
              ,private angularFireAuth: AngularFireAuth
              ,private win: WindowService
              ,private fb: FormBuilder
              ,private toast: ToastrService
              ,private authService: AuthService
              ,private router: Router) { }

  ngOnInit(): void {
    this.storageService.userChange.subscribe(res => {
      console.log(res);
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

    const app = initializeApp(environment.firebase);

    const auth = getAuth(app);

    this.windowRef = this.win.windowRef;

    this.windowRef.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container',{app},auth);

    this.windowRef.recaptchaVerifier.render().then( (widgetId: any) => {
      this.windowRef.recaptchaWidgetId = widgetId
    });

  }

  // forgotPassword(phoneNumber: string){
  //   const appVerifier = this.windowRef.recaptchaVerifier;
  //   this.angularFireAuth['signInWithPhoneNumber'](phoneNumber,appVerifier).then((res: any) => {
  //     this.windowRef.confirmationResult = res;
  //   }).catch((error: any) => console.log('error', error))
  // }

  verifyLoginCode() {
    this.windowRef.confirmationResult.confirm(this.verificationCode).then((res: any) => {
      this.verifySuccess = true;

    })
    .catch( (error: any) => console.log(error, "Incorrect code entered?"));
  }

  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = this.phoneNumber.e164;

    let phone = this.currentUser.phone;
    phone = phone.substr(1);
    phone = "+84" + phone
    console.log(phone);

    this.phone = phone;

    firebase.auth()
            .signInWithPhoneNumber(this.phone, appVerifier)
            .then((res: any) => {

                this.windowRef.confirmationResult = res;

            })
            .catch( (error: any) => console.log('error', error) );

  }



showSuccess(message:any, title:any) {
  this.toast.success(message, title,{
    timeOut: 2000,
  });

}

Save(){
  this.isSubmitted = true;
  if(this.rsPassForm){
    this.authService.reset(this.currentUser.username,this.rsPassForm.value.newPassword).subscribe(res => {
      console.log(this.rsPassForm.value.newPassword);
    });
    this.showSuccess('Change Password Successfully!','Notification')
    this.router.navigate(['/auth/login'])
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
