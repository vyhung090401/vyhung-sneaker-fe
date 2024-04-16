import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [MatGridListModule],
})
export class HomeComponent implements OnInit {
  content: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {}
}
