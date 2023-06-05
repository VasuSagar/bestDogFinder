import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogMatchComponent } from './dog-match.component';

describe('DogMatchComponent', () => {
  let component: DogMatchComponent;
  let fixture: ComponentFixture<DogMatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DogMatchComponent]
    });
    fixture = TestBed.createComponent(DogMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
