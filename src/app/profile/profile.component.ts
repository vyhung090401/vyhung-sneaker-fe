import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports:[RouterModule],
  standalone:true
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  isActive = false;

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }
}
