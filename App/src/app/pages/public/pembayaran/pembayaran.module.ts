import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PembayaranPage } from './pembayaran.page';
import { ModalModule } from '../../../services/modal/modal/modal.module'

const routes: Routes = [
  {
    path: '',
    component: PembayaranPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModalModule
  ],
  declarations: [PembayaranPage]
})
export class PembayaranPageModule {}
