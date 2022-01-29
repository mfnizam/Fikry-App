import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PembayaranService, Pembayaran } from '../../../services/pembayaran/pembayaran.service';
import { TagihanService } from '../../../services/tagihan/tagihan.service';
import { StorageService } from '../../../services/storage/storage.service';
import { ServerService } from '../../../services/server/server.service';
import { CameraService } from '../../../services/camera/camera.service';
import { ModalService } from '../../../services/modal/modal.service';
import { ModalComponent } from '../../../services/modal/modal/modal.component';

@Component({
	selector: 'app-pembayaran',
	templateUrl: './pembayaran.page.html',
	styleUrls: ['./pembayaran.page.scss'],
})
export class PembayaranPage implements OnDestroy {
	private destroy$: Subject<void> = new Subject<void>();
	userData;

	segmentValue = 'pembayaran';

	dataPembayaran: Pembayaran[] = [];
	dataPembayaranUi: Pembayaran[] = [];
	pembayaranLoading = 0;

	dataHistori: Pembayaran[] = [];
	dataHistoriUi: Pembayaran[] = [];
	historiLoading = 0;


	@ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

	constructor(
		private pembayaran: PembayaranService,
		private storage: StorageService,
		private server: ServerService,
		private camera: CameraService,
		private modal: ModalService
		) {

		this.pembayaran.getDataPembayaran()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.dataPembayaran = data;
			this.dataPembayaranUi = data;
		})

		this.pembayaran.getDataHistori()
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.dataHistori = data;
			this.dataHistoriUi = data;
		})

	}

	ionViewDidEnter(){
		this.storage.getDecodedStorage('user:data').then((data: any) => {
			this.userData = data;
			this.ambilPembayaran(data._id);
			this.ambilHistori(data._id);
		})
	}

	ambilPembayaran(idUser){
		this.pembayaranLoading = 1;
		this.server.pembayaran(idUser).then(data => {
			this.pembayaranLoading = 0;
			console.log(data);
			if(data.success){
				this.pembayaran.setDataPembayaran(data.pembayaran)
			}else{
				this.pembayaranLoading = 2;
			}
		}).catch(err => {
			console.log(err);
			this.pembayaranLoading = 2;
		})
	}

	ambilHistori(idUser){
		this.historiLoading = 1;
		this.server.histori(idUser).then(data => {
			this.historiLoading = 0;
			console.log(data, 'hostori');
			if(data.success){
				this.pembayaran.setDataHistori(data.histori)
			}else{
				this.historiLoading = 2;
			}
		}).catch(err => {
			console.log(err);
			this.historiLoading = 2;
		})
	}

	ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
	}

	loadData(event) {
	}

	unggahBuktiPembayaran(p){
		console.log(p)
		this.camera.camera('camera').then(data => {
			console.log(data, 'data from camera')

			this.modal.showModal({
				jenis: 'photo',
				header: 'Unggah Bukti Pembayaran',
				search: false,
				data: [{
					id: 'photo',
					imgUrl: data.webPath
				}],
				button: [{ 
					title: 'Batal', 
					role: 'batal'
				}, {
					title: 'Unggah', 
					submit: true/* rele pada submit selalu 'ok'*/
				}]
			}, ModalComponent).then(mdata => {
				if(mdata.role == 'ok'){
					this.modal.showLoading('Menyimpan Bukti Pembayaran..', false, 0)
					this.server.pembayaranBuktiUpload(data.path, 'bp'+ p._id, {
						idUser: p.user,
						idPembayaran: p._id,
					}).then(data => {
						console.log(data);
						this.modal.hideLoading();
						if(data.success){
							this.modal.showToast('Berhasil Menyimpan Bukti Pembayaran', 'success');
							this.pembayaran.setDataPembayaran(this.pembayaran.getValuePembayaran().map(v => v._id == data.pembayaran._id? data.pembayaran : v))
						}else{
							this.modal.showToast('Gagal, Coba Beberapa Saat Lagi..', 'danger')	
						}
					}).catch(err => {
						console.log(err, 'err upload bukti bayar')
						this.modal.hideLoading();
						this.modal.showToast('Gagal, Coba Beberapa Saat Lagi..', 'danger')
					})
				}
			})
		})
	}

}
