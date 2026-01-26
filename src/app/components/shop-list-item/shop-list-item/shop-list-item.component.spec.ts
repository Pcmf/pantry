import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopListItemComponent } from './shop-list-item.component';

describe('ShopListItemComponent', () => {
  let component: ShopListItemComponent;
  let fixture: ComponentFixture<ShopListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopListItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', {})
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
