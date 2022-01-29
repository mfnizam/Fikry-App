import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import { Kategori, Kelas, Siswa } from '../master/master.service';

export class Tagihan{
	_id: string;
	title: string;
	deskripsi?: string;
	nominal?: number = 0;
	waktuMulai?: Date;
	waktuAkhir?: Date;
	kategori?: Kategori;
	kategoriBackup?: any;
	kelas?: Kelas[];
	siswa?: Siswa;
	siswaBackup?: any;
	lunas?: boolean;
}

export class Bayar{
	_id?: string;
	tagihan: string;
	siswa: string;
}

@Injectable({
  providedIn: 'root'
})
export class TagihanService {
	private dataTagihan: BehaviorSubject<Array<Tagihan>> = new BehaviorSubject<Array<Tagihan>>([]);
	dataTagihan_ = this.dataTagihan.asObservable();

	private dataHistori: BehaviorSubject<Array<Tagihan>> = new BehaviorSubject<Array<Tagihan>>([]);
	dataHistori_ = this.dataHistori.asObservable();
	
	private dataBayar: BehaviorSubject<Array<Tagihan>> = new BehaviorSubject<Array<Tagihan>>([]);
	dataBayar_ = this.dataBayar.asObservable();

  constructor() { }

  setDataTagihan(data: Array<Tagihan>){ this.dataTagihan.next(data) }
  getDataTagihan(){ return this.dataTagihan_ }
  getValueTagihan(){ return this.dataTagihan.getValue() };

  setDataHistori(data: Array<Tagihan>){ this.dataHistori.next(data) }
  getDataHistori(){ return this.dataHistori_ }
  getValueHistori(){ return this.dataHistori.getValue() };

  setDataBayar(data: Array<Tagihan>){ this.dataBayar.next(data) }
  getDataBayar(){ return this.dataBayar_ }
  getValueBayar(){ return this.dataBayar.getValue() };
}
