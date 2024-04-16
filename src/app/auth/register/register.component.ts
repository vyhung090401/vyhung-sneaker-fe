import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  cities: any;
  districts: any;
  wards: any;
  citySelected: any = { name: null, defaultValue: 'City' };
  districtSelected: any = { name: null, defaultValue: 'District' };
  wardSelected: any = { name: null, defaultValue: 'Ward' };
  fullAddress!: string;
  isSubmit = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    (this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[S]*$')]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      ward: ['', Validators.required],
    })),
      this.getCity();
  }

  getCity() {
    const api = 'https://provinces.open-api.vn/api/p';

    this.http.get(api, { withCredentials: false }).subscribe((res) => {
      console.log(res);
      this.cities = res;
    });
  }

  getDistrict(city: any) {
    const api = `https://provinces.open-api.vn/api/p/${city.code}?depth=2`;
    this.http.get(api, { withCredentials: false }).subscribe((res: any) => {
      console.log(res);
      this.districts = res.districts;
    });
  }

  getWard(district: any) {
    const api = `https://provinces.open-api.vn/api/d/${district.code}?depth=2`;
    this.http.get(api, { withCredentials: false }).subscribe((res: any) => {
      console.log(res);
      this.wards = res.wards;
    });
  }

  showSuccess(message: any, title: any) {
    this.toast.success(message, title, {
      timeOut: 2000,
    });
  }

  onSubmit(): void {
    this.isSubmit = true;
    if (this.registerForm.valid) {
      const inf = {
        username: this.registerForm.controls['username'].value,
        password: this.registerForm.controls['password'].value,
        gender: this.registerForm.controls['gender'].value,
        phone: this.registerForm.controls['phone'].value,
        birthday: this.registerForm.controls['birthday'].value,
        address:
          this.registerForm.controls['address'].value +
          ' ' +
          this.wardSelected.name +
          ', ' +
          this.districtSelected.name +
          ', ' +
          this.citySelected.name,
      };
      this.authService
        .register(
          inf.username,
          inf.password,
          inf.phone,
          inf.gender,
          inf.birthday,
          inf.address
        )
        .subscribe({
          next: (data) => {
            console.log(data);
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            this.route.navigate(['/auth/login']);
            this.showSuccess('Signup  Successfully!', 'Notification!');
          },
          error: (err) => {
            this.errorMessage = err.error.message;
            this.isSignUpFailed = true;
          },
        });
    }
  }
}
