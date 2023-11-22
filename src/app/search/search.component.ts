import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {

  }

  enteredSearchValue: string ='';

  @Output()
  searchTextChanged: EventEmitter<string> = new EventEmitter<string>();

  onSearchTextChanged(event: any){


    this.searchTextChanged.emit(this.enteredSearchValue);

  }

}
