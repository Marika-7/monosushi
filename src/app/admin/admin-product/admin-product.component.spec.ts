import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductComponent } from './admin-product.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Storage } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';

describe('AdminProductComponent', () => {
  let component: AdminProductComponent;
  let fixture: ComponentFixture<AdminProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminProductComponent ],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: Storage, useValue: {} },
        { provide: ToastrService, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set values null for inputs', () => {
    const testValues = {
      category: null,
      name: null,
      path: null,
      description: null,
      weight: null,
      price: null,
      imagePath: null,
      count: 1
    };
    component.initProductForm();
    expect(component.productForm.value).toEqual(testValues);
  });

  it('should set the opposite value', () => {
    const startValue = component.inputsIsOpen;
    component.toggleOpenForm();
    expect(component.inputsIsOpen).not.toBe(startValue);
  });

});
