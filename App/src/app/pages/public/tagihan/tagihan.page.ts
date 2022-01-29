import { Component, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TagihanService, Tagihan } from '../../../services/tagihan/tagihan.service';
import { ModalService } from '../../../services/modal/modal.service';
import { ServerService }  from '../../../services/server/server.service';
import { StorageService } from '../../../services/storage/storage.service';
import { User } from '../../../services/user/user.service';

import { AnimationController, Animation } from '@ionic/angular';

@Component({
  selector: 'app-tagihan',
  templateUrl: './tagihan.page.html',
  styleUrls: ['./tagihan.page.scss'],
})
export class TagihanPage implements OnDestroy{
  private destroy$: Subject<void> = new Subject<void>();

  segmentValue = 'belum';

  userData: User;
  
  dataTagihan: Tagihan[] = [];
  dataTagihanUi: Tagihan[] = [];
  tagihanLoading = 0;

  dataHistori: Tagihan[] = [];
  dataHistoriUi: Tagihan[] = [];
  historiLoading = 0;

  jumlahBayar = 0;

  @ViewChildren('tagihanList', { read: ElementRef }) tagihanList: QueryList<ElementRef>;
  @ViewChild('bayarFab', { read: ElementRef }) bayarFab: ElementRef;
  fabAnimation: Animation;
  
  constructor(
    private router: Router,
  	private navCtrl: NavController,
    private tagihan: TagihanService,
    private animate: AnimationController,
    private modal: ModalService,
    private server: ServerService,
    private storage: StorageService) {

    this.tagihan.getDataBayar()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if(this.fabAnimation && this.jumlahBayar != data.length) this.fabAnimation.play();
      this.jumlahBayar = data.length;
    });

    this.tagihan.getDataTagihan()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataTagihan = data;
      this.dataTagihanUi = data;
    })

    this.tagihan.getDataHistori()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataHistori = data;
      this.dataHistoriUi = data;
    })
  }

  ionViewDidEnter(){
    this.storage.getDecodedStorage('user:data').then((data: any) => {
      this.userData = data;
      this.ambilTagihan(data._id);
      this.ambilTagihanHistori(data._id);
    })
  }

  ngAfterViewInit(){
    this.fabAnimation = this.animate.create()
    .addElement(this.bayarFab.nativeElement)
    .duration(500)
    .easing('ease-out')
    .keyframes([
      { offset: 0, transform: 'scale(.6)' },
      { offset: 0.5, transform: 'scale(1.3)' },
      { offset: 0.7, transform: 'scale(.9)' },
      { offset: 1, transform: 'scale(1)' }
    ])
  }

  ambilTagihan(idUser){
    this.tagihanLoading = 1;
    this.server.tagihan(idUser).then(data => {
      console.log(data);
      if(data.success){
        this.tagihanLoading = 0;
        this.tagihan.setDataTagihan(data.tagihan.filter(v => !this.tagihan.getValueBayar().map(v => v._id + '--' + v.siswa._id).includes(v._id + '--' + v.siswa._id)));
      }else{
        this.tagihanLoading = 2;
      }
    }).catch(err => {
      this.tagihanLoading = 2;
      console.log(err)
    })
  }

  ambilTagihanHistori(idUser){
    this.historiLoading = 1;
    this.server.tagihanHistori(idUser).then(data => {
      console.log(data)
      if(data.success){
        this.historiLoading = 0;
        this.tagihan.setDataHistori(data.histori);
      }else{
        this.historiLoading = 2;
      }
    }).catch(err => {
      this.historiLoading = 2;
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(){
  	this.navCtrl.back();
  }

  tambahBayar(id, idSiswa, i){
    if(!this.userData) return
    let dataTagihan = this.dataTagihan.find(v => v._id == id && v.siswa._id == idSiswa);
    this.dataTagihan[i]['loading'] = true;

    this.server.bayarTambah(this.userData._id, id, idSiswa).then(data => {
      console.log(data)
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
