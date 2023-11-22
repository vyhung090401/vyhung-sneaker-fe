import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Input() pageSize?: number;
  pageNumber?: number
  @Output() goTo: EventEmitter<number> = new EventEmitter<number>()

  constructor(){}



  ngOnInit(): void {

  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.goTo.emit(this.currentPage);
    }
  }

}
