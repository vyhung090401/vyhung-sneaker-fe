import { CustomerService } from './../../service/customer.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from 'src/app/model/account';

@Component({
  selector: 'app-profile-account',
  templateUrl: './profile-account.component.html',
  styleUrls: ['./profile-account.component.css'],
  imports:[CommonModule,RouterModule,ReactiveFormsModule,FormsModule],
  standalone:true
})
export class ProfileAccountComponent {
currentUser: any;
accountForm: FormGroup= new FormGroup({});
cities: any;
districts: any;
wards: any;
citySelected: any = {name: null, defaultValue: 'City'};
districtSelected: any = {name: null, defaultValue: 'District'};
wardSelected: any = {name: null, defaultValue: 'Ward'};
addressUser: string = ''
isSubmitted = false;
regexNumPhone: any = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;


constructor(private storageService: StorageService,
            private fb: FormBuilder,
            private customerService: CustomerService,
            private toast: ToastrService,
            private http: HttpClient) { }

ngOnInit(): void {
  this.currentUser = this.storageService.getUser();
  console.log(this.currentUser);
  this.addressUser = this.currentUser.address;
  const parts = this.addressUser.split(", ");

  const street = parts[0].trim(); // "140 Phạm Đình Hổ"
  this.wardSelected.defaultValue = parts[1].trim(); // "Phường 02"
  this.districtSelected.defaultValue = parts[2].trim(); // "Quận 06"
  this.citySelected.defaultValue = parts[3].trim();
  this.wardSelected.name = parts[1].trim(); // "Phường 02"
  this.districtSelected.name = parts[2].trim(); // "Quận 06"
  this.citySelected.name = parts[3].trim();
  this.accountForm = this.fb.group({
    address: ['', Validators.required],
    birthday: ['', Validators.required],
    gender: ['', Validators.required],
    phone: ['', [Validators.required,Validators.pattern(this.regexNumPhone)]],
  });


    this.accountForm.patchValue({
      address: street,
      birthday: this.currentUser.birthday,
      gender: this.currentUser.gender,
      phone: this.currentUser.phone,
    });
    this.getCity();
  }

  showSuccess(message:any, title:any) {
    this.toast.success(message, title,{
      timeOut: 2000,
    });

  }

  Save(){
    this.isSubmitted = true;
    if(this.accountForm.valid){
      const reqAccount: UserInfo = {
        phone: this.accountForm.controls['phone'].value,
        gender: this.accountForm.controls['gender'].value,
        birthday: this.accountForm.controls['birthday'].value,
        address: this.accountForm.controls['address'].value + ', ' + this.wardSelected.name + ', ' + this.districtSelected.name + ', ' + this.citySelected.name,
        id: this.currentUser.id,
        username:this.currentUser.username
      }
      console.log(reqAccount)
      this.customerService.updateCustomer(reqAccount).subscribe(res => {
        console.log(res)
        this.showSuccess('Update Information Successfully!','Notification');
        this.storageService.userChange.next(res);
        this.storageService.saveUser(res);
      })
    }
  }

  getCity(){
    const api = "https://provinces.open-api.vn/api/p";
    this.http.get(api,{withCredentials: false}).subscribe(
      res => {
        console.log(res);
        this.cities=res;
      }
    );
  }

  getDistrict(city: any) {
    const api = `https://provinces.open-api.vn/api/p/${city.code}?depth=2`;
    this.http.get(api,{withCredentials: false}).subscribe(
      (res: any) => {
        console.log(res);
        this.districts=res.districts;
      }
    );
}

getWard(district: any) {
  const api = `https://provinces.open-api.vn/api/d/${district.code}?depth=2`;
  this.http.get(api,{withCredentials: false}).subscribe(
    (res: any) => {
      console.log(res);
      this.wards=res.wards;
    }
  );
}
get phone() {
  return this.accountForm.get('phone');
}
}
