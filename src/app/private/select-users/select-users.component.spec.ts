import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUsersComponent } from './select-users.component';

describe('SelectUsersComponent', () => {
  let component: SelectUsersComponent;
  let fixture: ComponentFixture<SelectUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


//today i completed 90 dasys strak on github, after 30 days of today i will lauch chat31 project 