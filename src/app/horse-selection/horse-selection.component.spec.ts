import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseSelectionComponent } from './horse-selection.component';

describe('HorseSelectionComponent', () => {
  let component: HorseSelectionComponent;
  let fixture: ComponentFixture<HorseSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorseSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorseSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
