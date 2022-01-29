import { Component, OnDestroy, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TagihanService, Tagihan } from '../../../services/tagihan/tagihan.service';
import { ModalService } from '../../../services/modal/modal.service';
import { ServerService }  from '../../../services/server/server.service';
import { StorageService } from '../../../services/storage/storage.service';
import { User } from '../../../services/user/user.service';

import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-beranda',
  templateUrl: 'beranda.page.html',
  styleUrls: ['beranda.page.scss']
})
export class BerandaPage implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userData: User;
  dataTagihan: Tagihan[];
  tagihanLoading = 0;
  dataInfo = [];

  @ViewChildren('tagihanList', { read: ElementRef }) tagihanList: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private tagihan: TagihanService,
    private animate: AnimationController,
    private modal: ModalService,
    private server: ServerService,
    private storage: StorageService) {

    this.tagihan.getDataTagihan()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataTagihan = data;
    })
  }

  ionViewDidEnter(){
    this.storage.getDecodedStorage('user:data').then((data: any) => {
      this.ambilTagihan(data._id);
      this.userData = data;
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  ambilTagihan(idUser){
    this.tagihanLoading = 1;
    this.server.tagihan(idUser).then(data => {
      console.log(data);
      if(data.success){
        this.tagihanLoading = 0;
        this.tagihan.setDataTagihan(data.tagihan.filter(v => !this.tagihan.getValueBayar().some(e => (e._id == v._id && e.siswa._id == v.siswa._id))));
        this.dataTagihan = this.tagihan.getValueTagihan();

        console.log(this.tagihan.getValueTagihan());
      }else{
        this.tagihanLoading = 2;
      }
    }).catch(err => {
      this.tagihanLoading = 2;
      console.log(err)
    })
  }

  tambahBayar(id, idSiswa, i){
    if(!this.userData) return;
    let dataTagihan = this.dataTagihan.find(v => v._id == id && v.siswa._id == idSiswa);
    this.dataTagihan[i]['loading'] = true;

    this.server.bayarTambah(this.userData._id, id, idSiswa).then(data => {
      this.dataTagihan[i]['loading'] = false;
      if(data.success){
        let containerElement = this.tagihanList.toArray()[i].nativeElement;
        const deleteAnimation = this.animate.create()
        .addElement(containerElement)
        .duration(200)
        .easing('ease-out')
        .fromTo('opacity', '1', '0')
        .fromTo('transform', 'translateX(0)', 'translateX(100%)');
        deleteAnimation.play();

        setTimeout(_ => {
          this.tagihan.setDataTagihan([...this.dataTagihan.filter(v => !(v._id == id && v.siswa._id == idSiswa))])
          this.modal.showAction('Tagihan Berhasil Ditambahkan ke Daftar Bayar?', [{
            id: 'lihat', text: 'Lihat Daftar Bayar'
          }, {
            id: 'batal', text: 'Lihat Nanti', role: 'cancel'
          }]).then(data => {
            this.tagihan.setDataBayar([...this.tagihan.getValueBayar(), dataTagihan]);
            if(data == 'lihat'){
              this.router.navigate(['/public/bayar']);
            }
          })
        }, 500)
      }else{
        this.modal.showToast('Gagal menambahkan ke daftar bayar', 'danger');
      }
    }).catch(err => {
      console.log(err);
      this.dataTagihan[i]['loading'] = false;
      this.modal.showToast('Gagal menambahkan ke daftar bayar', 'danger')
    })
  }

}
