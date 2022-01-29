import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicPage } from './public.page';

const routes: Routes = [
  {
    path: '',
    component: PublicPage,
    children: [
      {
        path: 'beranda',
        loadChildren: () => import('./beranda/beranda.module').then(m => m.BerandaPageModule)
      },
      {
        path: 'tagihan',
        loadChildren: () => import('./tagihan/tagihan.module').then( m => m.TagihanPageModule)
      },
      {
        path: 'bayar',
        loadChildren: () => import('./bayar/bayar.module').then( m => m.BayarPageModule)
      },
      {
        path: 'pembayaran',
        loadChildren: () => import('./pembayaran/pembayaran.module').then( m => m.PembayaranPageModule)
      },
      {
        path: 'histori',
        loadChildren: () => import('./histori/histori.module').then(m => m.HistoriPageModule)
      },
      {
        path: 'akun',
        loadChildren: () => import('./akun/akun.module').then(m => m.AkunPageModule)
      },
      {
        path: '',
        redirectTo: 'beranda',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'list/tagihan',
    loadChildren: () => import('./tagihan/tagihan.module').then( m => m.TagihanPageModule)
  },
  {
    path: 'list/tagihan/bayar',
    loadChildren: () => import('./bayar/bayar.module').then( m => m.BayarPageModule)
  },
  {
    path: 'tagihan/detail',
    loadChildren: () => import('./tagihan/detail/detail.module').then(m => m.DetailPageModule)
  },
  {
    path: 'bayar/detail',
    loadChildren: () => import('./tagihan/detail/detail.module').then(m => m.DetailPageModule)
  },
  {
    path: 'bayar/pembayaran',
    loadChildren: () => import('./bayar/pembayaran/pembayaran.module').then( m => m.PembayaranPageModule)
  },
  {
    path: 'pembayaran/detail',
    loadChildren: () => import('./pembayaran/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'histori/detail',
    loadChildren: () => import('./tagihan/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'akun/edit',
    loadChildren: () => import('./akun/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'photo',
    loadChildren: () => import('./photo/photo.module').then( m => m.PhotoPageModule)
  },
  {
    path: '',
    redirectTo: 'beranda',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'beranda',
  },
  {
    path: 'notif',
    loadChildren: () => import('./notif/notif.module').then( m => m.NotifPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicPageRoutingModule {}
