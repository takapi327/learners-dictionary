import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TryAngular2Component } from './try-angular2.component';

describe('TryAngular2Component', () => {
  let component: TryAngular2Component;
  let fixture: ComponentFixture<TryAngular2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TryAngular2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TryAngular2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
