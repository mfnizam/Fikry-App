import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MasterService, Kategori, Kelas } from '../../../../services/master/master.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ModalComponent } from '../../../../services/modal/modal/modal.component';
import { ServerService } from '../../../../services/server/server.service';
import { TagihanService, Tagihan } from '../../../../services/tagihan/tagihan.service';

@Component({
  selector: 'app-cu',
  templateUrl: './cu.page.html',
  styleUrls: ['./cu.page.scss'],
})
export class CuPage implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  update = false;
  idTagihan: string;
  dataTagihan: Tagihan;

  form: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    deskripsi: new FormControl(null, [Validators.required]),
    nominal: new FormControl(null, [Validators.required]),
    waktuMulai: new FormControl(null, [Validators.required]),
    waktuAkhir: new FormControl(null, [Validators.required]),
    kategori: new FormControl(null, [Validators.required]),
    kelas: new FormControl(null, [Validators.required]),
  });

  kategori: Kategori[] = [];
  kelas: Kelas[] = []; 

  constructor(
  	private navCtrl: NavController,
    private active: ActivatedRoute,
    private master: MasterService,
    private modal: ModalService,
    private server: ServerService,
    private tagihan: TagihanService,
    private cdr: ChangeDetectorRef) {
    active.params
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.idTagihan = data['id'];
      this.update = data['update'] == 'true'? true : false;
      this.setValueForm();
      console.log('call from params')
    })

    if(this.tagihan.getValueTagihan().length < 1){
      this.modal.showLoading('Memuat Data...');
      this.server.ambilTagihan().then(data => {
        setTimeout(_ => {this.modal.hideLoading()}, 2000)
        if(data.success){
          this.tagihan.setDataTagihan(data.tagihan);
          this.setValueForm()
          console.log('call from getValueTagihan true')
        }
      }).catch(err => {
        console.log(err)
        this.modal.hideLoading();
        this.modal.showToast('Gagal Memuat Data...', 'danger');
      })
    }else{
      this.setValueForm();
      console.log('call from getValueTagihan false')
    }

    if(this.master.getValueKelas().length < 1){
      this.server.ambilKelas().then(data => {
        if(data.success){
          this.kelas = data.kelas;
          this.master.setDataKelas(data.kelas);
          this.cdr.detectChanges();
        }
      }).catch(err => console.log(err))
    }else{
      this.kelas = this.master.getValueKelas();
    }
    
    if(this.master.getValueKategori().length < 1){
      this.server.ambilKategori().then(data => {
        if(data.success){
          this.kategori = data.kategori;
          this.master.setDataKategori(data.kategori);
          this.cdr.detectChanges();
        }
      }).catch(err => console.log(err))
    }else{
      this.kategori = this.master.getValueKategori();
    }
  }

  setValueForm(){
    if(this.update && this.idTagihan){
      this.dataTagihan = this.tagihan.getValueTagihan().find(v => v._id == this.idTagihan);
      this.form.addControl('_id', new FormControl(this.idTagihan, [Validators.required]));
      if(!this.dataTagihan) return;
      this.form.controls.title.setValue(this.dataTagihan.title);
      this.form.controls.deskripsi.setValue(this.dataTagihan.deskripsi);
      this.form.controls.nominal.setValue(this.dataTagihan.nominal);
      this.form.controls.waktuMulai.setValue(this.dataTagihan.waktuMulai);
      this.form.controls.waktuAkhir.setValue(this.dataTagihan.waktuAkhir);
      this.form.controls.kategori.setValue(this.dataTagihan.kategori._id);
      this.form.controls.kelas.setValue(this.dataTagihan.kelas.map(v => v._id));
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(){
  	this.navCtrl.back();
  }

  pilihKelas(){
    let data = this.master.getValueKelas().map(v => { return { id: v._id, title: v.title } });
    this.modal.showModal({
      jenis: 'select',
      header: 'Pilih Kelas',
      data: data,
      button: [{ 
        title: 'Batal', 
        role: 'batal'
      }, {
        title: 'Pilih', 
        submit: true/* rele pada submit selalu 'ok'*/
      }]
    }, ModalComponent).then(data => {
      if(data.role == 'ok'){
        console.log(data.data)
      }
    })
  }

  simpan(){
    this.modal.showLoading('Menyimpan Data Tagihan...')

    if(this.update){
      // console.log(this.form.value);
      this.server.editTagihan(this.form.value).then(data => {
        this.modal.hideLoading();
        console.log(data);
        if(data.success){
          let valTagihan = this.tagihan.getValueTagihan();
          let ind = valTagihan.findIndex(e => e._id == data.tagihan._id);
          if(ind < 0) {
            this.modal.showToast('Gagal Menyimpan Tagihan', 'danger');
            setTimeout(_ => {
              this.goBack();
            }, 500)
            return
          }else{
            valTagihan[ind] = data.tagihan;
            this.tagihan.setDataTagihan(valTagihan);
            this.modal.showToast('Berhasil Menyimpan Tagihan', 'success');
            setTimeout(_ => {
              this.goBack();
            }, 500)
          }
        }else{
          this.modal.showToast('Gagal Menyimpan Data Tagihan', 'danger');
        }
      }).catch(err => {
        this.modal.hideLoading();
        this.modal.showToast('Gagal Menyimpan Data Tagihan', 'danger');
        console.log(err)
      })
    }else{
      this.server.tambahTagihan(this.form.value).then(data => {
        this.modal.hideLoading();
        console.log(data);
        if(data.success){
          this.modal.showToast('Berhasil Menambahkan Data Tagihan', 'success');
          this.tagihan.setDataTagihan([...this.tagihan.getValueTagihan(), data.tagihan]);
          setTimeout(_ => {
            this.goBack();
          }, 500)
        }else{
          this.modal.showToast('Gagal Menambahkan Data Tagihan', 'danger');
        }
      }).catch(err => {
        this.modal.hideLoading();
        this.modal.showToast('Gagal Menambahkan Data Tagihan', 'danger');
        console.log(err)
      })

    }
  }

}

// ion-no-padding ion-margin-bottom item md ion-focusable hydrated 
// ion-no-padding ion-margin-bottom item md ion-focusable hydrated item-interactive ion-invalid ion-pristine ion-touched

// ion-no-padding ion-margin-bottom item md ion-focusable hydrated item-interactive ion-invalid item-input item-has-placeholder item-label item-label-floating item-label-color ion-color-primary ion-pristine ion-touched

