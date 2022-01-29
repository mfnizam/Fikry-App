import { Component, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TagihanService, Tagihan } from '../../../../services/tagihan/tagihan.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ServerService } from '../../../../services/server/server.service';
import { User } from '../../../../services/user/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();
  idTagihan: string;
  dataTagihan: Tagihan;

  segmentValue = 'belum-lunas'
  segment = [{ _id: 'belum-lunas', title: 'Belum Lunas' }, { _id: 'lunas', title: 'Lunas' }]

  penerimaBelumLunas: User[] = [];
  penerimaLunas: User[] = [];

  penerimaBelumLoading = 0;
  penerimaLunasLoading = 0;

  constructor(
  	private navCtrl: NavController,
    private active: ActivatedRoute,
    private tagihan: TagihanService,
    private modal: ModalService,
    private server: ServerService
    ) {
  	active.params
  	.pipe(takeUntil(this.destroy$))
  	.subscribe(data => {
      this.idTagihan = data.id;
      this.dataTagihan = this.tagihan.getValueTagihan().find(v => v._id == data.id);
      
      if(this.dataTagihan && this.penerimaBelumLunas.length < 1) {
        this.ambilPenerimaBelumLunas(this.dataTagihan._id);
      }

      if(this.dataTagihan && this.penerimaLunas.length < 1){
        this.ambilPenerimaLunas(this.dataTagihan._id);
      }
    })

    if(this.tagihan.getValueTagihan().length < 1){
      this.server.ambilTagihan().then(data => {
        if(data.success){
          this.tagihan.setDataTagihan(data.tagihan);
          this.dataTagihan = data.tagihan.find(v => v._id == this.idTagihan);
          
          if(this.dataTagihan && this.penerimaBelumLunas.length < 1) {
            this.ambilPenerimaBelumLunas(this.dataTagihan._id);
          }

          if(this.dataTagihan && this.penerimaLunas.length < 1){
            this.ambilPenerimaLunas(this.dataTagihan._id);
          }
        }
      })
    }
  }

  ambilPenerimaBelumLunas(id){
    this.penerimaBelumLoading = 1;
    this.server.ambilTagihanPenerimaBelumLunas(id).then(data => {
      if(data.success){
        this.penerimaBelumLoading = 0;
        this.penerimaBelumLunas = data.penerima;
      }else{
        this.penerimaBelumLoading = 2;
      }
    }).catch(err => {
      console.log(err);
      this.penerimaBelumLoading = 2;
    })
  }

  ambilPenerimaLunas(id){
    this.penerimaLunasLoading = 1;
    this.server.ambilTagihanPenerimaLunas(id).then(data => {
      console.log(data, 'data lunas')
      if(data.success){
        this.penerimaLunasLoading = 0;
        this.penerimaLunas = data.penerima;
      }else{
        this.penerimaLunasLoading = 2;
      }
    }).catch(err => {
      console.log(err);
      this.penerimaLunasLoading = 2;
    })
  }

  ngOnDestroy(){
  	this.destroy$.next();
  	this.destroy$.complete();
  }

  goBack(){
    this.navCtrl.back();
  }

  hapus(){
  	this.modal.showConfirm(
  		'Hapus Tagihan', 'Apakah anda ingin menghapus tagihan ini ', 
  		['Batal', 'Hapus'])
  	.then(e => {
  		if(e){
  			this.modal.showLoading('Menghapus Tagihan...');
        this.server.hapusTagihan(this.dataTagihan._id).then(data => {
          this.modal.hideLoading();
          if(data.success){
            this.modal.showToast('Berhasil Menghapus Tagihan', 'success');
            this.tagihan.setDataTagihan(this.tagihan.getValueTagihan().filter(v => v._id != this.dataTagihan._id));
            this.goBack();
          }else{
            this.modal.showToast('Gagal Menghapus Tagihan', 'danger');
          }
        }).catch(err => {
          this.modal.showToast('Gagal Menghapus Tagihan', 'danger');
          this.modal.hideLoading();
          console.log(err);
        })
      }
    })
  }


}
