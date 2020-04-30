import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRaceReportComponent } from './pre-race-report.component';

describe('PreRaceReportComponent', () => {
  let component: PreRaceReportComponent;
  let fixture: ComponentFixture<PreRaceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreRaceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRaceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
