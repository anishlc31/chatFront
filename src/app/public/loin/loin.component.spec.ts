import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoinComponent } from './loin.component';

describe('LoinComponent', () => {
  let component: LoinComponent;
  let fixture: ComponentFixture<LoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
