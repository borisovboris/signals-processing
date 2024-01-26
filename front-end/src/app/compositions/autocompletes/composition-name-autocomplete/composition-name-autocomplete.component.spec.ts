import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionNameAutocompleteComponent } from './composition-name-autocomplete.component';

describe('CompositionNameAutocompleteComponent', () => {
  let component: CompositionNameAutocompleteComponent;
  let fixture: ComponentFixture<CompositionNameAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionNameAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompositionNameAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
