import { Component } from '@angular/core';

@Component({
  selector: 'app-pengguna',
  templateUrl: './pengguna.page.html',
  styleUrls: ['./pengguna.page.scss'],
})
export class PenggunaPage{
	segmentValue = 'semua';
  segment: any[] = [{ 
    id: 'semua', 
    value: 'Semua' 
  }, { 
    id: 'wali murid', 
    value: 'Wali Murid' 
  }, { 
    id: 'admin', 
    value: 'Admin' 
  }]
  
  pengguna = [{
  	id: 1,
  	namaLengkap: 'Cristiano Ronaldo',
  	jbl: 2,
  	siswa: 1
  	// waliMuridDari: [{
  	// 	id: '1a',
  	// 	namaLengkap: 'Cristiano Junior'
  	// }, {
  	// 	id: '1a',
  	// 	namaLengkap: 'Cristiano Second Junior '
  	// }]
  }, {
  	id: 1,
  	namaLengkap: 'Mesut Ozil',
  	jbl: 0,
  	siswa: 2
  }, {
  	id: 2,
  	namaLengkap: 'Admin Sekolah',
  	isAdmin: true
  }]
  penggunaUi = [];

  constructor() {
  	this.penggunaUi = this.pengguna;
  }

  segmentChange(e){
  	if(e.detail.value == 'semua'){
  		this.penggunaUi = this.pengguna;
  	}else if(e.detail.value == 'admin'){
  		this.penggunaUi = this.pengguna.filter(v => v.isAdmin);	
  	}else{
  		this.penggunaUi = this.pengguna.filter(v => !v.isAdmin);	
  	}
  }

}
