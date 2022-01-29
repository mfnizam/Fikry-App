import { Component, OnDestroy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MasterService, Kategori, Kelas, Siswa, Rekening } from '../../../services/master/master.service';
import { User } from '../../../services/user/user.service';
import { ServerService } from '../../../services/server/server.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.page.html',
  styleUrls: ['./master.page.scss'],
})
export class MasterPage implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  dataWaliMurid: User[] = [];
  waliMuridLoading = 0; // 0 done; 1 loading; 2 error
  dataSiswa: Siswa[] = [];
  siswaLoading = 0;
  dataKelas: Kelas[] = [];
  kelasLoading = 0;
  dataKategori: Kategori[] = [];
  kategoriLoading = 0;
  dataRekening: Rekening[] = [];
  rekeningLoading = 0;

  constructor(
    private master: MasterService,
    private server: ServerService) {
    master.getDataKategori()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataKategori = data;
    })

    master.getDataKelas()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataKelas = data;
    })

    master.getDataWaliMurid()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataWaliMurid = data;
    })

    master.getDataSiswa()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataSiswa = data;
    })

    master.getDataRekening()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.dataRekening = data;
    })
  }

  ionViewDidEnter(){
    this.ambilWaliMurid();
    this.ambilSiswa();
    this.ambilKelas();
    this.ambilKategori();
    this.ambilRekening();
  }

  ambilWaliMurid(){
    this.waliMuridLoading = 1;
    this.server.ambilWaliMurid().then(data => {
      if(data.success){
        this.waliMuridLoading = 0;
        this.dataWaliMurid = data.waliMurid;
        this.master.setDataWaliMurid(data.waliMurid);
      }else{
        this.waliMuridLoading = 2
      }
    }).catch(err => {
      this.waliMuridLoading = 2;
      console.log(err);
    })
  }
  ambilSiswa(){
    this.siswaLoading = 1;
    this.server.ambilSiswa().then(data => {
      if(data.success){
        this.siswaLoading = 0;
        this.dataSiswa = data.siswa;
        this.master.setDataSiswa(data.siswa);
      }else{
        this.siswaLoading = 2;
      }
    }).catch(err => {
      this.siswaLoading = 2;
      console.log(err);
    })
  }
  ambilKelas(){
    this.kelasLoading = 1;
    this.server.ambilKelas().then(data => {
      if(data.success){
        this.kelasLoading = 0;
        this.dataKelas = data.kelas;
        this.master.setDataKelas(data.kelas);
      }else{
        this.kelasLoading = 2;
      }
    }).catch(err => {
      this.kelasLoading = 2;
      console.log(err);
    })
  }
  ambilKategori(){
    this.kategoriLoading = 1;
    this.server.ambilKategori().then(data => {
      if(data.success){
        this.kategoriLoading = 0;
        this.dataKategori = data.kategori;
        this.master.setDataKategori(data.kategori);
      }else{
        this.kategoriLoading = 2
      }
    }).catch(err => {
      this.kategoriLoading = 2;
      console.log(err, 'ambil Kategori')
    })
  }
  ambilRekening(){
    this.rekeningLoading = 1;
    this.server.ambilRekening().then(data => {
      if(data.success){
        this.rekeningLoading = 0;
        this.dataRekening = data.rekening;
        this.master.setDataRekening(data.rekening);
      }else{
        this.rekeningLoading = 2
      }
    }).catch(err => {
      this.rekeningLoading = 2;
      console.log(err, 'ambil Rekening')
    })
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
