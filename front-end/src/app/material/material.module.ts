import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatTabsModule, MatButtonModule, MatIconModule],
  exports: [MatTabsModule, MatButtonModule, MatIconModule],
})
export class MaterialModule {}
