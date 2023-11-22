import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDashboardProductComponent } from './dialog-dashboard-product.component';

describe('DialogDashboardProductComponent', () => {
  let component: DialogDashboardProductComponent;
  let fixture: ComponentFixture<DialogDashboardProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogDashboardProductComponent]
    });
    fixture = TestBed.createComponent(DialogDashboardProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
