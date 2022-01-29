import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PembayaranService, Pembayaran } from '../../../../services/pembayaran/pembayaran.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ModalComponent } from '../../../../services/modal/modal/modal.component';
import { CameraService } from '../../../../services/camera/camera.service';
import { ServerService } from '../../../../services/server/server.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnDestroy{
	private destroy$: Subject<void> = new Subject<void>();

	dataPembayaran: Pembayaran;
  constructor(
    private navCtrl: NavController,
  	private active: ActivatedRoute,
  	private pembayaran: PembayaranService,
    private modal: ModalService,
    private camera: CameraService,
    private server: ServerService
  ) {
  	this.active.params
  	.pipe(takeUntil(this.destroy$))
  	.subscribe(data => {
  		this.dataPembayaran = this.pembayaran.getValuePembayaran().find(v => v._id == data['id']);
      if(!this.dataPembayaran) this.dataPembayaran = this.pembayaran.getValueHistori().find(v => v._id == data['id']);
  	})
  }

  ngOnDestroy(){
  	this.destroy$.next();
  	this.destroy$.complete();
  }

  goBack(){
    this.navCtrl.back();
  }
  
  unggahBuktiPembayaran(){
    console.log(this.dataPembayaran)
    if(!this.dataPembayaran) return this.modal.showToast('Tidak Dapat Mengunggah Bukti Pembayaran');
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
          this.server.pembayaranBuktiUpload(data.path, 'bp'+ this.dataPembayaran._id, {
            idUser: this.dataPembayaran.user,
            idPembayaran: this.dataPembayaran._id,
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

  lihatBuktiPembayaran(){
    if(!this.dataPembayaran.buktiPembayaran || this.dataPembayaran.buktiPembayaran.length < 1) return this.modal.showToast('Gagal, Coba beberapa saat lagi..', 'warning')
    let dataBukti = this.dataPembayaran.buktiPembayaran[this.dataPembayaran.buktiPembayaran.length - 1];
    this.modal.showModal({
      jenis: 'photo',
      header: 'Bukti Pembayaran',
      search: false,
      data: [{
        id: 'photo',
        imgUrl: this.server.otherServer + dataBukti.imgUrl
      }],
      button: [{ 
        title: 'OK', 
        role: 'batal'
      }]
    }, ModalComponent)
  }

}
