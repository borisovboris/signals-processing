import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationNameAutocompleteComponent } from './location-name-autocomplete.component';

describe('LocationNameAutocompleteComponent', () => {
  let component: LocationNameAutocompleteComponent;
  let fixture: ComponentFixture<LocationNameAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationNameAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationNameAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
