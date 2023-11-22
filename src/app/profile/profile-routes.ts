import { Routes } from '@angular/router';
import { ProfileAccountComponent } from './profile-account/profile-account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile.component';

export const ProfileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'profile-account',
        component: ProfileAccountComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      }
    ]
  }
]
