import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PembayaranService, Pembayaran } from '../../../services/pembayaran/pembayaran.service';
import { MasterService, Kategori } from '../../../services/master/master.service';
import { ServerService } from '../../../services/server/server.service';

@Component({
	selector: 'app-histori',
	templateUrl: 'histori.page.html',
	styleUrls: ['histori.page.scss']
})
export class HistoriPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

	segmentValue = 'semua';
	segmentTitle = 'Semua';
	segment: any[] = [{ _id: 'semua', title: 'Semua' }];
	kategori: Kategori[] = [];

	dataPembayaran: Pembayaran[];
	dataPembayaranUi: Pembayaran[];

	constructor(
		private master: MasterService,
		private pembayaran: PembayaranService,
		private server: ServerService
		) {

		// this.master.getDataKategori()
		// .pipe(takeUntil(this.destroy$))
  //   .subscribe(data => {
  //   	this.kategori = data;
		// 	this.segment = [...this.segment, ...this.kategori];
  //   });

		// this.pembayaran.getDataPembayaran()
		// .pipe(takeUntil(this.destroy$))
  //   .subscribe(data => {
  //     this.dataPembayaran = data;
  //     this.dataPembayaranUi = data;
  //   });

	}

	ionViewDidEnter(){
		// if(this.master.getValueKategori().length < 1){
		// 	this.server.ambilKategori().then(data => {
		// 		if(data.success){
		// 			this.master.setDataKategori(data.kategori);
		// 		}
		// 	})
		// }
	}

	ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

	loadData(event) {
		// setTimeout(_ => {
		// 	event.target.complete();
		// 	event.target.disabled = true;
		// }, 2000)
  }

  segmentChange(e){
  	// if(e.detail.value == 'semua'){
  	// 	this.segmentTitle = '';
  	// 	this.dataPembayaranUi = this.dataPembayaran;
  	// }else{
  	// 	this.segmentTitle = this.kategori.find(v => v._id == e.detail.value)['title'];
  	// 	this.dataPembayaranUi = this.dataPembayaran.filter(v => v.kategori._id == e.detail.value )
  	// }
  }

  lihaPembayaran(){
  	
  }

}
