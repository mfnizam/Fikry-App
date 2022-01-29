import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPage } from './admin.page';

import { AdminGuardService } from '../../services/guard/admin-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: 'beranda',
        loadChildren: () => import('./beranda/beranda.module').then(m => m.BerandaPageModule),
        canActivate: [AdminGuardService]
      },
      {
        path: 'tagihan',
        loadChildren: () => import('./tagihan/tagihan.module').then( m => m.TagihanPageModule),
        canActivate: [AdminGuardService]
      },
      {
        path: 'pembayaran',
        loadChildren: () => import('./pembayaran/pembayaran.module').then( m => m.PembayaranPageModule)
      },
      {
        path: 'master',
        loadChildren: () => import('./master/master.module').then( m => m.MasterPageModule),
        canActivate: [AdminGuardService]
      },
      {
        path: 'pengguna',
        loadChildren: () => import('./pengguna/pengguna.module').then(m => m.PenggunaPageModule),
        canActivate: [AdminGuardService]
      },
      {
        path: 'akun',
        loadChildren: () => import('./akun/akun.module').then(m => m.AkunPageModule),
        canActivate: [AdminGuardService]
      },
      {
        path: '',
        redirectTo: 'tagihan',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'tagihan/detail',
    loadChildren: () => import('./tagihan/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'tagihan/cu',
    loadChildren: () => import('./tagihan/cu/cu.module').then( m => m.CuPageModule)
  },
  {
    path: 'master/data',
    loadChildren: () => import('./master/data/data.module').then( m => m.DataPageModule),
    canActivate: [AdminGuardService]
  },
  {
    path: 'master/detail',
    loadChildren: () => import('./master/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'master/cu',
    loadChildren: () => import('./master/cu/cu.module').then( m => m.CuPageModule)
  },
  {
    path: 'akun/edit',
    loadChildren: () => import('./akun/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: '',
    redirectTo: 'tagihan',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'tagihan',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
