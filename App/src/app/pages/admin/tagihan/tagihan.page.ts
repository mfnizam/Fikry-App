import { Component, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TagihanService, Tagihan } from '../../../services/tagihan/tagihan.service';
import { ModalService } from '../../../services/modal/modal.service';
import { ServerService } from '../../../services/server/server.service';

import { AnimationController, Animation } from '@ionic/angular';

@Component({
  selector: 'app-tagihan',
  templateUrl: './tagihan.page.html',
  styleUrls: ['./tagihan.page.scss'],
})
export class TagihanPage implements OnDestroy{
  private destroy$: Subject<void> = new Subject<void>();
  dataTagihan: Tagihan[] = [];
  tagihanLoading = 0;

  @ViewChildren('tagihanList', { read: ElementRef }) tagihanList: QueryList<ElementRef>;
  
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private tagihan: TagihanService,
    private animate: AnimationController,
    private modal: ModalService,
    private server: ServerService) {

    this.tagihan.getDataTagihan()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataTagihan = data;
    })
  }

  ionViewDidEnter(){
    this.ambilTagihan();
  }

  ambilTagihan(){
    this.tagihanLoading = 1;
    this.server.ambilTagihan().then(data => {
      console.log(data, 'ambilTagihan')
      if(data.success){
        this.tagihanLoading = 0;
        this.dataTagihan = data.tagihan;
        this.tagihan.setDataTagihan(data.tagihan);
      }else{
        this.tagihanLoading = 2;
      }
    }).catch(err => {
      this.tagihanLoading = 2;
      console.log(err)
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(){
  	this.navCtrl.back();
  }
}
