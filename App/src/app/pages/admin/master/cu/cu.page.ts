import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MasterService, Kelas, Siswa } from '../../../../services/master/master.service';
import { User } from '../../../../services/user/user.service';
import { ServerService } from '../../../../services/server/server.service';
import { ModalService } from '../../../../services/modal/modal.service';
import { ModalComponent } from '../../../../services/modal/modal/modal.component';

@Component({
  selector: 'app-cu',
  templateUrl: './cu.page.html',
  styleUrls: ['./cu.page.scss'],
})
export class CuPage implements OnDestroy {
	private destroy$: Subject<void> = new Subject<void>();
  jenis;
  update = false;
  dataMaster;
  dataKelas: Kelas[] = [];
  dataSiswa: Siswa[] = [];
  dataSiswaUi: Siswa[] = [];

  form: FormGroup = new FormGroup({
    namaLengkap: new FormControl(null, [Validators.required]),
    jenisKelamin: new FormControl(null, [Validators.required]),
  })

  gantiPass = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private active: ActivatedRoute,
    private navCtrl: NavController,
    private master: MasterService,
    private server: ServerService,
    private modal: ModalService) {
  	active.params
  	.pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if(!data['jenis']) return this.goBack();

      this.jenis = data['jenis'];
      this.update = data['update'] == 'true'? true : false;
      if(this.jenis == 'wali murid'){
        this.dataMaster = this.master.getValueWaliMurid().find(v => v._id == data['id']);
      }else if(this.jenis == 'siswa'){
        this.dataMaster = this.master.getValueSiswa().find(v => v._id == data['id']);
      }
      this.setForm();
    })

  }

  setForm(){
    if(this.update) this.form.addControl('_id', new FormControl (this.dataMaster?._id || null, [Validators.required]));
    this.form.controls.namaLengkap.setValue(this.dataMaster?.namaLengkap || null);
    this.form.controls.jenisKelamin.setValue(Number(this.dataMaster?.jenisKelamin));

    if(this.jenis == 'siswa'){
      console.log(this.dataMaster)
      this.form.addControl('nisn', new FormControl(this.dataMaster?.nisn || null, [Validators.required]))
      this.form.addControl('kelas', new FormControl(this.dataMaster?.kelas?._id || null, [Validators.required]))
      if(this.master.getValueKelas().length < 1){
        this.server.ambilKelas().then(data => {
          if(data.success){
            this.master.setDataKelas(data.kelas);
            this.dataKelas = data.kelas;
            this.cdr.detectChanges();
          }
        })
      }else{
        this.dataKelas = this.master.getValueKelas();
      }
      // this.form.addControl('waliMurid', new FormControl([], [Validators.required]));
      // this.dataWaliMurid = this.master.getValueWaliMurid();
    } else if(this.jenis == 'wali murid'){
      this.form.addControl('email', new FormControl(this.dataMaster?.email || null, [Validators.required, Validators.email]))
      this.form.addControl('noTlp', new FormControl(this.dataMaster?.noTlp || null))
      this.form.addControl('tglLahir', new FormControl(this.dataMaster?.tglLahir || null))
      this.form.addControl('alamat', new FormControl(this.dataMaster?.alamat || null))
      this.form.addControl('nik', new FormControl(this.dataMaster?.nik || null, [Validators.required]))
      this.form.addControl('password', new FormControl(null, this.dataMaster?.hasPassword? [] : [Validators.required]))
      this.form.addControl('siswa', new FormControl(this.dataMaster?.siswa? this.dataMaster?.siswa.map(v => v._id) : []));
      this.dataSiswaUi = this.dataMaster?.siswa || [];
      this.server.ambilSiswa().then(data => {
        if(data.success){
          this.master.setDataSiswa(data.siswa);
          this.dataSiswa = data.siswa;
        }
      })
    }
  }

  ngOnDestroy(){
  	this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(){
  	this.navCtrl.back();
  }

  // kurang siswa pada edit/simpan wali murid
  simpan(){
    this.modal.showLoading('Menambahkan Data');
    if(this.update){
      if(this.jenis == 'siswa'){
        this.server.editSiswa(this.form.value).then(data => {
          this.modal.hideLoading();
          if(data.success){
            let valSiswa = this.master.getValueSiswa();
            let ind = valSiswa.findIndex(e => e._id == data.siswa._id);
            if(ind < 0) {
              this.modal.showToast('Gagal Menyimpan Data Siswa', 'danger');
              setTimeout(_ => {
                this.goBack();
              }, 500)
              return
            }else{
              valSiswa[ind] = data.siswa;
              this.master.setDataSiswa(valSiswa);
              this.modal.showToast('Berhasil Menyimpan Data Siswa', 'success');
              setTimeout(_ => {
                this.goBack();
              }, 500)
            }
          }else{
            this.modal.showToast('Gagal Menyimpan Data Siswa', 'danger');
          }
        }).catch(err => {
          console.log(err);
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menyimpan Data Siswa', 'danger');
        })
      }else if(this.jenis == 'wali murid'){
        console.log(this.form.value);
        this.server.editWaliMurid(this.form.value).then(data => {
          this.modal.hideLoading();
          console.log(data)
          if(data.success){
            let valWaliMurid = this.master.getValueWaliMurid();
            let ind = valWaliMurid.findIndex(e => e._id == data.waliMurid._id);
            if(ind < 0) {
              this.modal.showToast('Gagal Menyimpan Data Wali Murid', 'danger');
              setTimeout(_ => {
                this.goBack();
              }, 500)
              return
            }else{
              valWaliMurid[ind] = data.waliMurid;
              this.master.setDataWaliMurid(valWaliMurid);
              this.modal.showToast('Berhasil Menyimpan Data Wali Murid', 'success');
              setTimeout(_ => {
                this.goBack();
              }, 500)
            }
          }else{
            this.modal.showToast('Gagal Menyimpan Data Wali Murid', 'danger');
          }
        }).catch(err => {
          console.log(err);
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menyimpan Data Wali Murid', 'danger');
        })
      }
    }else{
      if(this.jenis == 'siswa'){
        this.server.tambahSiswa(this.form.value).then(data => {
          console.log(data, 'tambah siswa')
          this.modal.hideLoading()
          if(data.success){
            this.master.setDataSiswa([...this.master.getValueSiswa(), data.siswa]);
            this.modal.showToast('Berhasil Menambahkan Siswa', 'success');
            setTimeout(_ => {
              this.goBack();
            }, 500)
          }else{
            this.modal.showToast('Gagal Menambahkan Siswa', 'danger');
          }
        }).catch(err => {
          console.log(err);
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menambahkan Siswa', 'danger');
        })
      }else if(this.jenis == 'wali murid'){
        this.server.tambahWaliMurid(this.form.value).then(data => {
          this.modal.hideLoading();
          if(data.success){
            this.master.setDataWaliMurid([...this.master.getValueWaliMurid(), data.waliMurid]);
            this.modal.showToast('Berhasil Menambahkan Wali Murid', 'success');
            setTimeout(_ => {
              this.goBack();
            }, 500)
          }else{
            this.modal.showToast('Gagal Menambahkan Wali Murid', 'danger');
          }
        }).catch(err => {
          console.log(err);
          this.modal.hideLoading();
          this.modal.showToast('Gagal Menambahkan Wali Murid', 'danger');
        })
      }
    }
  }

  pilihSiswa(){
    if(this.dataSiswa.length < 1) {
      this.modal.showToast("Tidak Ada Data Siswa", "warning")
      return false;
    }

    let data = this.dataSiswa.map(v => { 
      return {
        id: v._id, 
        title: v.namaLengkap, 
        imgUrl: true,
        subTitle: '<small>' + v.kelas.title + ' - ' + v.nisn + '</small>',
        checked: this.dataSiswaUi.some(e => e._id == v._id),
        disabled: this.dataMaster?.siswa? this.dataMaster?.siswa.map(v => v._id).includes(v._id)? false : v.hasParent : v.hasParent
      };
    });

    this.modal.showModal({
      jenis: 'select',
      header: 'Pilih Siswa',
      data: data,
      button: [{ 
        title: 'Batal', 
        role: 'batal'
      }, {
        title: 'Pilih', 
        submit: true/* role pada submit selalu 'ok'*/
      }]
    }, ModalComponent).then(data => {
      console.log(data)
      if(data.role == 'ok'){
        this.dataSiswaUi = [];
        let wform = [];
        Object.keys(data.data).forEach((v: any) => {
          if(data.data[v]){
            wform.push(v);
            this.dataSiswaUi.push(this.dataSiswa.find(e => e._id == v));
          }
        })
        this.form.controls.siswa.setValue(wform);
      }
    })
  }

  hapusSiswa(id){
    if(this.form.controls.siswa){
      this.dataSiswaUi = this.dataSiswaUi.filter(v => v._id != id);
      this.form.controls.siswa.setValue(this.dataSiswaUi.filter(v => v._id != id).map(v => v._id));
    }
  }

}
