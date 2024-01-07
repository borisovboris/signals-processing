import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { SignalsService } from '../../generated-sources/openapi';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, MatTabsModule, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{
  title = 'signals-processing';

  constructor(readonly service: SignalsService, readonly client: HttpClient) {
    // this.service.getMethodName().subscribe(data => console.log(data));
    
    
  }

  ngOnInit(): void {
    this.service.create({ id: 2 }).subscribe(data => console.log(data));
    // this.service.getMethodName().subscribe(data => console.log(data));
  }

}
