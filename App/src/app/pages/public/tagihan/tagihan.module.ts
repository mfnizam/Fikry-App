import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TagihanPage } from './tagihan.page';

import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
	{ 
		path: '', 
		component: TagihanPage 
	}
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TagihanPage]
})
export class TagihanPageModule {}
