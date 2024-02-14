import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteChipsComponent } from './autocomplete-chips.component';

describe('AutocompleteChipsComponent', () => {
  let component: AutocompleteChipsComponent;
  let fixture: ComponentFixture<AutocompleteChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteChipsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutocompleteChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
