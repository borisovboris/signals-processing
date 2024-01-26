import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityNameChipsAutocompleteComponent } from './city-name-chips-autocomplete.component';

describe('CityNameChipsAutocompleteComponent', () => {
  let component: CityNameChipsAutocompleteComponent;
  let fixture: ComponentFixture<CityNameChipsAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityNameChipsAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CityNameChipsAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
