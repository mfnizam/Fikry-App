import { Component, OnInit, OnDestroy, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MasterService, Kategori, Kelas, Siswa, Rekening } from '../../../../services/master/master.service';
import { User } from '../../../../services/user/user.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ServerService } from '../../../../services/server/server.service';

import { AnimationController } from '@ionic/angular';

@Component({
	selector: 'app-data',
	templateUrl: './data.page.html',
	styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit, OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();
	jenis;
	dataMaster: Array<Kategori | Kelas> = [];
	masterLoading = 0;
	dataWaliMurid: User[];
	waliMuridLoading = 0;
	dataSiswa: Siswa[];
	siswaLoading = 0;
	dataRekening: Rekening[];
	rekeningLoading = 0;

	@ViewChildren('masterList', { read: ElementRef }) masterList: QueryList<ElementRef>;

	constructor(
		private router: Router,
		private active: ActivatedRoute,
		private navCtrl: NavController,
		private master: MasterService,
		private modal: ModalService,
		private animate: AnimationController,
		private server: ServerService) {
		active.params
		.pipe(takeUntil(this.destroy$))
		.subscribe(data => {
			this.jenis = data['data'];

			if(this.jenis == 'kelas'){
				master.getDataKelas()
				.pipe(takeUntil(this.destroy$))
				.subscribe(data => {
					this.dataMaster = data;
				})
			}else if(this.jenis == 'kategori'){
				master.getDataKategori()
				.pipe(takeUntil(this.destroy$))
				.subscribe(data => {
					this.dataMaster = data;
				})
			}else if(this.jenis == 'wali murid'){
				master.getDataWaliMurid()
				.pipe(takeUntil(this.destroy$))
				.subscribe(data => {
					this.dataWaliMurid = data;
				})
			}else if(this.jenis == 'siswa'){
				master.getDataSiswa()
				.pipe(takeUntil(this.destroy$))
				.subscribe(data => {
					this.dataSiswa = data;
				})
			}else if(this.jenis == 'rekening'){
				master.getDataRekening()
				.pipe(takeUntil(this.destroy$))
				.subscribe(data => {
					this.dataRekening = data;
				})
			}
		})
	}

	ngOnInit(){
		if(this.jenis == 'kategori' && this.dataMaster.length < 1){
			this.ambilKategori();
		}else if(this.jenis == 'kelas' && this.dataMaster.length < 1){
			this.ambilKelas();
		}else if(this.jenis == 'siswa' && this.dataSiswa.length < 1){
			this.ambilSiswa();
		}else if(this.jenis == 'wali murid' && this.dataWaliMurid.length < 1){
			this.ambilWaliMurid();
		}else if(this.jenis == 'rekening' && this.dataRekening.length < 1){
			this.ambilRekening();
		}
	}

	ambilSiswa(){
		this.siswaLoading = 1;
		this.server.ambilSiswa().then(data => {
			this.siswaLoading = 0;
			if(data.success){
				console.log(data.siswa)
				this.dataSiswa = data.siswa;
				this.master.setDataSiswa(data.siswa);
			}else{
				this.siswaLoading = 2
			}
		}).catch(err => {
			console.log(err)
			this.siswaLoading = 2;
		})
	}

	ambilWaliMurid(){
		this.waliMuridLoading = 1;
		this.server.ambilWaliMurid().then(data => {
			console.log(data);
			this.waliMuridLoading = 0;
			if(data.success){
				this.dataWaliMurid = data.waliMurid;
				this.master.setDataWaliMurid(data.waliMurid);
			}else{
				this.waliMuridLoading = 2;
			}
		}).catch(err => {
			console.log(err);
			this.waliMuridLoading = 2;
		})
	}

	ambilMaster(){
		if(this.jenis == 'kelas'){
			this.ambilKelas();
		}else if(this.jenis == 'kategori'){
			this.ambilKategori();
		}
	}

	ambilKelas(){
		this.masterLoading = 1;
		this.server.ambilKelas().then(data => {
			this.masterLoading = 0
			if(data.success){
				this.dataMaster = data.kelas;
				this.master.setDataKelas(data.kelas);
			}else{
				this.masterLoading = 2
			}
		}).catch(err => {
			this.masterLoading = 2
			console.log(err);
		})
	}

	ambilKategori(){
		this.masterLoading = 1;
		this.server.ambilKategori().then(data => {
			this.masterLoading = 0;
			if(data.success){
				this.dataMaster = data.kategori;
				this.master.setDataKategori(data.kategori);
			}else{
				this.masterLoading = 2;
			}
		}).catch(err => {
			this.masterLoading = 2;
			console.log(err);
		})
	}

	ambilRekening(){
		this.rekeningLoading = 1;
		this.server.ambilRekening().then(data => {
			this.rekeningLoading = 0;
			if(data.success){
				this.dataRekening = data.rekening;
				this.master.setDataRekening(data.rekening);
			}else{
				this.rekeningLoading = 2;
			}
		}).catch(err => {
			this.rekeningLoading = 2;
			console.log(err);
		})
	}

	ngOnDestroy(){
		this.destroy$.next();
		this.destroy$.complete();
	}

	goBack(){
		this.navCtrl.back();
	}

	tambah(){
		if(this.jenis == 'siswa' || this.jenis == 'wali murid'){
			return this.router.navigate(['/admin/master/cu', { jenis: this.jenis }]);
		} 

		let input = []
		if(this.jenis == 'kelas' || this.jenis == 'kategori') {
			input = [{
				name: 'title',
				type: 'text',
				placeholder: 'Isikan nama ' + this.jenis
			}]
		}else if(this.jenis == 'rekening'){
			input = [{
				name: 'namaBank',
				type: 'text',
				placeholder: 'Isikan Nama Bank, Contoh: BRI, BNI, BCA'
			}, {
				name: 'noRek',
				type: 'text',
				placeholder: 'Isikan nomer rekening'
			}, {
				name: 'atasNama',
				type: 'text',
				placeholder: 'Isikan atas nama rekening'
			}]
		}

		this.modal.showPrompt('Tambah Data ' + this.jenis, null, input).then((data: any) => {
			if(data.data && data.data.values && data.role == 'ok'){
				this.modal.showLoading('Menambahkan Data');

				if(this.jenis == 'kelas'){
					this.server.tambahKelas(data.data.values).then(data => {
						console.log(data);
						this.modal.hideLoading()

						if(data.success){
							this.modal.showToast('Berhasil Menambahkan Data Kelas', 'success');
							this.dataMaster.push(data.kelas);
							this.master.setDataKelas(this.dataMaster);
						}else{
							this.modal.showToast('Gagal Menambahkan Data Kelas', 'danger');
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menambahkan Data Kelas', 'danger');
						console.log(err)
					})
				}else if(this.jenis == 'kategori'){
					this.server.tambahKategori(data.data.values).then(data => {
						console.log(data)
						this.modal.hideLoading();

						if(data.success){
							this.modal.showToast('Berhasil Menambahkan Data Kategori', 'success');
							this.dataMaster.push(data.kategori);
							this.master.setDataKategori(this.dataMaster);
						}else{
							this.modal.showToast('Gagal Menambahkan Data Kategori', 'danger');
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menambahkan Data Kategori', 'danger');
						console.log(err)
					})
				}else if(this.jenis == 'rekening'){
					this.server.tambahRekening(data.data.values).then(data => {
						console.log(data)
						this.modal.hideLoading();

						if(data.success){
							this.modal.showToast('Berhasil Menambahkan Data Rekening', 'success');
							this.dataRekening.push(data.rekening);
							this.master.setDataRekening(this.dataRekening);
						}else{
							this.modal.showToast('Gagal Menambahkan Data Rekening', 'danger');
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menambahkan Data Rekening', 'danger');
						console.log(err)
					})
				}
			}
		})
	}

	edit(id, i){
		if(this.jenis == 'siswa' || this.jenis == 'wali murid') {
			let data: any = this.jenis == 'siswa'? this.dataSiswa[i] : this.dataWaliMurid[i];
			if(!data._id) return;
			return this.router.navigate(['/admin/master/cu', { jenis: this.jenis, update: true, id: data._id }]);
		}


		let input = [];
		if(this.jenis == 'kelas' || this.jenis == 'kategori'){
			input = [{
				name: 'title',
				type: 'text',
				value: this.dataMaster[i].title,
				placeholder: 'Isikan nama ' + this.jenis
			}]
		}else if(this.jenis == 'rekening'){
			input = [{
				name: 'namaBank',
				type: 'text',
				placeholder: 'Isikan Nama Bank, Contoh: BRI, BNI, BCA',
				value: this.dataRekening[i].namaBank,
			}, {
				name: 'noRek',
				type: 'text',
				placeholder: 'Isikan nomer rekening',
				value: this.dataRekening[i].noRek,
			}, {
				name: 'atasNama',
				type: 'text',
				placeholder: 'Isikan atas nama rekening',
				value: this.dataRekening[i].atasNama,
			}]
		}

		this.modal.showPrompt('Edit Data ' + this.jenis, null, input).then((data: any) => {
			if(data.data && data.data.values && data.role == 'ok'){
				this.modal.showLoading('Menyimpan Perubahan');
				data.data.values['_id'] = id;

				if(this.jenis == 'kategori'){
					this.server.editKategori(data.data.values).then(data => {
						this.modal.hideLoading();
						console.log(data);
						if(data.success){
							this.dataMaster[i] = data.kategori;
							this.master.setDataKategori(this.master.getValueKategori().map(v => v._id == id? data.kategori : v));
							this.modal.showToast('Berhasil Menyimpan "' + this.dataMaster[i].title, 'success');
						}else{
							this.modal.showToast('Gagal Menyimpan "' + this.dataMaster[i].title, 'danger');
						}
					}).catch(err => {
						console.log(err);
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menyimpan "' + this.dataMaster[i].title, 'danger');
					})
				}else if(this.jenis == 'kelas'){
					this.server.editKelas(data.data.values).then(data => {
						this.modal.hideLoading();
						console.log(data);
						if(data.success){
							this.dataMaster[i] = data.kelas;
							this.master.setDataKelas(this.master.getValueKelas().map(v => v._id == id? data.kelas : v));
							this.modal.showToast('Berhasil Menyimpan "' + this.dataMaster[i].title, 'success');
						}else{
							this.modal.showToast('Gagal Menyimpan "' + this.dataMaster[i].title, 'danger');
						}
					}).catch(err => {
						console.log(err);
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menyimpan "' + this.dataMaster[i].title, 'danger');
					})
				}else if(this.jenis == 'rekening'){
					this.server.editRekening(data.data.values).then(data => {
						this.modal.hideLoading();
						console.log(data);
						if(data.success){
							this.dataRekening[i] = data.rekening;
							this.master.setDataRekening(this.master.getValueRekening().map(v => v._id == id? data.rekening : v));
							this.modal.showToast('Berhasil Menyimpan Data Rekening', 'success');
						}else{
							this.modal.showToast('Gagal Menyimpan Data Rekening', 'danger');
						}
					}).catch(err => {
						console.log(err);
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menyimpan Data Rekening', 'danger');
					})
				}
			}
		})
	}

	hapus(id, i){
		let dataHapus = this.jenis == 'siswa' ? this.dataSiswa[i].namaLengkap : this.jenis == 'wali murid'? this.dataWaliMurid[i].namaLengkap : this.jenis == 'rekening'? this.dataRekening[i].noRek : this.dataMaster[i].title;		
		this.modal.showConfirm('Hapus Data ' + this.jenis, 'Apakah anda ingin menghapus data ' + this.jenis + ' <b>"' + dataHapus + '"</b>', ['Batal', 'Hapus']).then(e => {
			if(e){
				this.modal.showLoading('Menghapus Data "' + dataHapus + '"');
				const deleteAnimation = this.animate.create()
				.addElement(this.masterList.toArray()[i].nativeElement)
				.duration(200)
				.easing('ease-out')
				.fromTo('opacity', '1', '0')
				.fromTo('transform', 'translateX(0)', 'translateX(-100%)');

				if(this.jenis == 'kategori'){
					this.server.hapusKategori(id).then(data => {
						console.log(data);
						this.modal.hideLoading();
						if(data.success){
							deleteAnimation.play();
							setTimeout(_ => {
								this.master.setDataKategori(this.dataMaster.filter(v => v._id != id));
								this.modal.showToast('Berhasil Menghapus Data', 'success')
							}, 500)
						}else{
							this.modal.showToast('Gagal Menghapus Data ' + dataHapus, 'danger')
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menghapus Data ' + dataHapus, 'danger')
						console.log(err)
					})
				}
				else if(this.jenis == 'kelas'){
					this.server.hapusKelas(id).then(data => {
						console.log(data);
						this.modal.hideLoading();
						if(data.success){
							deleteAnimation.play();
							setTimeout(_ => {
								this.master.setDataKelas(this.dataMaster.filter(v => v._id != id));
								this.modal.showToast('Berhasil Menghapus Data', 'success');
							}, 500)
						}else{
							this.modal.showToast('Gagal Menghapus Data ' + dataHapus, 'danger')
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menghapus Data ' + dataHapus, 'danger')
						console.log(err)
					})
				}
				else if(this.jenis == 'siswa'){
					this.server.hapusSiswa(id).then(data => {
						console.log(data);
						this.modal.hideLoading();
						if(data.success){
							deleteAnimation.play();
							setTimeout(_ => {
								this.master.setDataSiswa(this.dataSiswa.filter(v => v._id != id));
								this.modal.showToast('Berhasil Menghapus Data', 'success')
							}, 500)
						}else{
							this.modal.showToast('Gagal Menghapus Data ' + dataHapus, 'danger')
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menghapus Data ' + dataHapus, 'danger')
						console.log(err)
					})
				}
				else if(this.jenis == 'wali murid'){
					this.server.hapusWaliMurid(id).then(data => {
						console.log(data);
						this.modal.hideLoading();
						if(data.success){
							deleteAnimation.play();
							setTimeout(_ => {
								this.master.setDataWaliMurid(this.dataWaliMurid.filter(v => v._id != id));
								this.modal.showToast('Berhasil Menghapus Data', 'success')
							}, 500)
						}else{
							this.modal.showToast('Gagal Menghapus Data ' + dataHapus, 'danger')
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menghapus Data ' + dataHapus, 'danger')
						console.log(err);
					})
				}
				else if(this.jenis == 'rekening'){
					this.server.hapusRekening(id).then(data => {
						console.log(data);
						this.modal.hideLoading();
						if(data.success){
							deleteAnimation.play();
							setTimeout(_ => {
								this.master.setDataRekening(this.dataRekening.filter(v => v._id != id));
								this.modal.showToast('Berhasil Menghapus Data', 'success');
							}, 500)
						}else{
							this.modal.showToast('Gagal Menghapus Data ' + dataHapus, 'danger')
						}
					}).catch(err => {
						this.modal.hideLoading();
						this.modal.showToast('Gagal Menghapus Data ' + dataHapus, 'danger')
						console.log(err)
					})
				}
			}
		})
	}
}
