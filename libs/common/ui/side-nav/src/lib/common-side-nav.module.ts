import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonRouterModule } from '@ztp/common/data-access/router';
import { CommonUiSideNavComponent } from './side-nav.component';
import { HamburgerComponent } from './hamburger.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [CommonUiSideNavComponent, HamburgerComponent],
  imports: [CommonModule, RouterModule, CommonRouterModule, MatIconModule],
  exports: [CommonUiSideNavComponent],
})
export class CommonUiSideNavModule {}
