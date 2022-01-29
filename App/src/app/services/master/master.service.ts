import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { User } from '../user/user.service';

export class Kategori{
	_id: string;
	title: string;
	totTagAktif?: number;
}

export class Kelas{
	_id: string;
	title: string;
	totSiswa?: number;
}

export class Rekening{
  _id: string;
  namaBank: string;
  noRek: string;
  atasNama: string;
}

export class Siswa{
	_id: string;
	namaLengkap?: string;
	nisn?: string;
	jenisKelamin?: number;
	kelas?: Kelas;
	waliMurid?: User;
  hasParent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MasterService {
	private dataKategori: BehaviorSubject<Array<Kategori>> = new BehaviorSubject<Array<Kategori>>([]);
	dataKategori_ = this.dataKategori.asObservable();

	private dataKelas: BehaviorSubject<Array<Kelas>> = new BehaviorSubject<Array<Kelas>>([])	
	dataKelas_ = this.dataKelas.asObservable();

	private DataWaliMurid: BehaviorSubject<Array<User>> = new BehaviorSubject<Array<User>>([])
	DataWaliMurid_ = this.DataWaliMurid.asObservable();

	private dataSiswa: BehaviorSubject<Array<Siswa>> = new BehaviorSubject<Array<Siswa>>([])
  dataSiswa_ = this.dataSiswa.asObservable();

  private dataRekening: BehaviorSubject<Array<Rekening>> = new BehaviorSubject<Array<Rekening>>([])
  dataRekening_ = this.dataRekening.asObservable();

  constructor() { }

  setDataKategori(data: Array<Kategori>){ this.dataKategori.next(data) }
  getDataKategori(){ return this.dataKategori_ }
  getValueKategori(){ return this.dataKategori.getValue() };

  setDataKelas(data: Array<Kelas>){ this.dataKelas.next(data) }
  getDataKelas(){ return this.dataKelas_ }
  getValueKelas(){ return this.dataKelas.getValue() };

  setDataWaliMurid(data: Array<User>){ this.DataWaliMurid.next(data) }
  getDataWaliMurid(){ return this.DataWaliMurid_ }
  getValueWaliMurid(){ return this.DataWaliMurid.getValue() };

  setDataSiswa(data: Array<Siswa>){ this.dataSiswa.next(data) }
  getDataSiswa(){ return this.dataSiswa_ }
  getValueSiswa(){ return this.dataSiswa.getValue() };

  setDataRekening(data: Array<Rekening>){ this.dataRekening.next(data) }
  getDataRekening(){ return this.dataRekening_ }
  getValueRekening(){ return this.dataRekening.getValue() };

  getAllValur(): {kategori: Kategori[], kelas: Kelas[], waliMurid: User[], siswa: Siswa[], rekening: Rekening[] }{
  	return {
  		kategori: this.dataKategori.getValue(),
  		kelas: this.dataKelas.getValue(),
  		waliMurid: this.DataWaliMurid.getValue(),
  		siswa: this.dataSiswa.getValue(),
      rekening: this.dataRekening.getValue()
  	}
  }
}
