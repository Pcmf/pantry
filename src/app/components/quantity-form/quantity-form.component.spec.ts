import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityFormComponent } from './quantity-form.component';

describe('QuantityFormComponent', () => {
  let component: QuantityFormComponent;
  let fixture: ComponentFixture<QuantityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuantityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
