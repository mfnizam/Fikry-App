import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TagihanService, Tagihan } from '../../../../services/tagihan/tagihan.service';
import { ServerService } from '../../../../services/server/server.service';
import { StorageService } from '../../../../services/storage/storage.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { UserService, User } from '../../../../services/user/user.service';

import { AnimationController, Animation } from '@ionic/angular';

@Component({
	selector: 'app-detail',
	templateUrl: './detail.page.html',
	styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();
	url;
	userData: any;
	dataTagihan: Tagihan;
	bayarLoading = false;
	bayarStatus = false;

	@ViewChild('bayarFab', { read: ElementRef }) bayarFab: ElementRef;
	fabAnimation: Animation;
	jumlahBayar = 0;

	constructor(
		private router: Router,
		private navCtrl: NavController,
		private active: ActivatedRoute,
		private tagihan: TagihanService,
		private server: ServerService,
		private storage: StorageService,
		private animate: AnimationController,
		private modal: ModalService,
		private user: UserService) {
		active.params
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.storage.getDecodedStorage('user:data').then((sdata: any) => {
				this.userData = sdata;
				this.setDataTagihan(data['id'], data['idSiswa']);
				if(!this.dataTagihan){
					this.modal.showLoading('Memuat Data..');
					this.ambilTagihan(this.userData?._id, data['id'], data['idSiswa']);
					this.ambilBayar(this.userData?._id, data['id'], data['idSiswa']);
					this.ambilTagihanHistori(this.userData?._id, data['id'], data['idSiswa']);
				}
			})
		})

		this.tagihan.getDataBayar()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.jumlahBayar = data.length;
			if(this.fabAnimation) this.fabAnimation.play();
		});

		this.url = router.url;
	}

	ngAfterViewInit(){
		if(this.router.url.includes('/public/bayar')) return;

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

	ambilTagihan(idUser, id, idSiswa){
		this.server.tagihan(idUser).then(data => {
			this.modal.hideLoading()
			console.log(data);
			if(data.success){
				this.tagihan.setDataTagihan(data.tagihan.filter(v => !this.tagihan.getValueBayar().some(e => (e._id == v._id && e.siswa._id == v.siswa._id) )));
				this.setDataTagihan(id, idSiswa);
			}
		}).catch(err => {
			this.modal.hideLoading()
			console.log(err)
		})
	}

	ambilBayar(idUser, id, idSiswa){
		this.server.bayar(idUser).then(data => {
			console.log(data);
			this.modal.hideLoading()
			if(data.success){
				this.tagihan.setDataBayar(data.bayar);
				this.setDataTagihan(id, idSiswa);
			}
		}).catch(err => {
			this.modal.hideLoading()
			console.log(err)
		})
	}

	ambilTagihanHistori(idUser, id, idSiswa){
    this.server.tagihanHistori(idUser).then(data => {
    	this.modal.hideLoading()
      if(data.success){
        this.tagihan.setDataHistori(data.histori);
        this.setDataTagihan(id, idSiswa);
      }
    }).catch(err => {
      this.modal.hideLoading();
      console.log(err);
    })
  }

	setDataTagihan(id, idSiswa){
		this.bayarStatus = this.tagihan.getValueBayar().some(v => v._id == id && v.siswa._id == idSiswa)

		if(this.bayarStatus){
			this.dataTagihan = this.tagihan.getValueBayar().find(v => (v._id == id && v.siswa._id == idSiswa));
		} else {
			this.dataTagihan = this.tagihan.getValueTagihan().find(v => (v._id == id && v.siswa._id == idSiswa));
			if(!this.dataTagihan) {
				this.dataTagihan = this.tagihan.getValueHistori().find(v => (v._id == id && v.siswa._id == idSiswa));
				if(this.dataTagihan) this.dataTagihan.lunas = true;
			}
		}
	}

	ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
	}

	goBack(){
		this.navCtrl.back();
	}

	bayar(id, idSiswa){
		if(!this.userData || !this.dataTagihan || !this.dataTagihan.siswa) return this.modal.showToast('Tidak dapat menambahkan tagihan ke daftar bayar');
		this.bayarLoading = true;

		this.server.bayarTambah(this.userData._id, id, idSiswa).then(data => {
			this.bayarLoading = false;

			if(data.success){
				this.tagihan.setDataTagihan(this.tagihan.getValueTagihan().filter(v => !(v._id == this.dataTagihan._id && v.siswa._id == this.dataTagihan.siswa._id)));
				this.modal.showAction('Tagihan Berhasil Ditambahkan ke Daftar Bayar?', [{
					id: 'lihat', text: 'Lihat Daftar Bayar'
				}, {
					id: 'batal', text: 'Lihat Nanti', role: 'cancel'
				}]).then(data => {
					this.tagihan.setDataBayar([...this.tagihan.getValueBayar(), this.dataTagihan]);
					this.bayarStatus = this.tagihan.getValueBayar().some(v => v._id == id && v.siswa._id == idSiswa)

					if(data == 'lihat'){
						this.router.navigate(['/public/list/tagihan/bayar']);
					}
				})
			}else{
				this.modal.showToast('Gagal dapat menambahkan tagihan dari daftar bayar');
			}
		}).catch(err => {
			console.log(err);
			this.modal.showToast('Gagal dapat menambahkan tagihan dari daftar bayar');
		})
	}

	bayarNanti(id, idSiswa){
		if(!this.userData || !this.dataTagihan || !this.dataTagihan.siswa) return this.modal.showToast('Tidak dapat menghapus tagihan dari daftar bayar');
		this.bayarLoading = true;

		this.server.bayarNanti(this.userData._id, id, idSiswa).then(data => {
			console.log(data);
			this.bayarLoading = false;
			if(data.success){
				this.tagihan.setDataBayar(this.tagihan.getValueBayar().filter(v => !(v._id == id && v.siswa._id == idSiswa)));
        this.tagihan.setDataTagihan([...this.tagihan.getValueTagihan(), this.dataTagihan]);
        this.bayarStatus = this.tagihan.getValueBayar().some(v => v._id == id && v.siswa._id == idSiswa)
			}else{
				this.modal.showToast('Gagal dapat menghapus tagihan dari daftar bayar')
			}
		}).catch(err => {
			console.log(err);
			this.bayarLoading = false;
			this.modal.showToast('Gagal dapat menghapus tagihan dari daftar bayar');
		})
	}
}

