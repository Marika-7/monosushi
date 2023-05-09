import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountInfoComponent } from './discount-info.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('DiscountInfoComponent', () => {
  let component: DiscountInfoComponent;
  let fixture: ComponentFixture<DiscountInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountInfoComponent ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create array from description', () => {
    component.currentDiscount = {
      "name": "Рол тижня",
      "header": "50% знижки на \"Рол тижня\"",
      "description": "Щотижня діє знижка 50% на один з ролів у нашому меню.\n“Рол тижня” ви можете знайти на головній сторінці нашого сайту.\nЗнижка діє при мінімальній сумі замовлення 300 грн.\nЦя акція не поєднується з іншими акціями.",
      "imagePath": "https://firebasestorage.googleapis.com/v0/b/monosushi-a36be.appspot.com/o/images%2Fdiscount%2Fdiscount_1.jpg?alt=media&token=be7159fc-0c2b-4f83-9241-f67943078129",
      "id": 1
    };
    component.createList();
    expect(Array.isArray(component.list)).toBeTrue();
  })

});
