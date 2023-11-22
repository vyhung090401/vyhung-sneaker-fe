import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReceiptComponent } from './inventory-receipt.component';

describe('InventoryReceiptComponent', () => {
  let component: InventoryReceiptComponent;
  let fixture: ComponentFixture<InventoryReceiptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryReceiptComponent]
    });
    fixture = TestBed.createComponent(InventoryReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
