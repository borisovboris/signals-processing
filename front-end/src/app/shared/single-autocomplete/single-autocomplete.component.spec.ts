import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAutocompleteComponent } from './single-autocomplete.component';

describe('SingleAutocompleteComponent', () => {
  let component: SingleAutocompleteComponent;
  let fixture: ComponentFixture<SingleAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleAutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
