import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCompositionFormComponent } from './link-composition-form.component';

describe('LinkCompositionFormComponent', () => {
  let component: LinkCompositionFormComponent;
  let fixture: ComponentFixture<LinkCompositionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkCompositionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkCompositionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
