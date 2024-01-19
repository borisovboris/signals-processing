import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityNameAutocompleteComponent } from './city-name-autocomplete.component';

describe('CityNameAutocompleteComponent', () => {
  let component: CityNameAutocompleteComponent;
  let fixture: ComponentFixture<CityNameAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityNameAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CityNameAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
