import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationNameChipsAutocompleteComponent } from './location-name-chips-autocomplete.component';

describe('LocationNameChipsAutocompleteComponent', () => {
  let component: LocationNameChipsAutocompleteComponent;
  let fixture: ComponentFixture<LocationNameChipsAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationNameChipsAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationNameChipsAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
