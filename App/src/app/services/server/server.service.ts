import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import { Capacitor } from '@capacitor/core';

import { Bayar } from '../tagihan/tagihan.service';


@Injectable({
  providedIn: 'root'
})
export class ServerService {

  public serverUrl = 'https://projek-satu.herokuapp.com/';
  // public serverUrl = 'http://192.168.0.100:3000/';
  // public serverUrl = 'http://10.209.25.230:3000/';
  // public serverUrl = 'http://192.168.1.70:3000/';

  public otherServer = 'https://mfnizam.com/apps/projectone/'

  constructor(
    private http: HTTP,
    private httpClient: HttpClient,
    private transfer: FileTransfer) { }

  getRequest(url){
  	return this.httpClient.get(url);
  }

  postRequest(url, data){
    if(Capacitor.isNative){
      this.http.setDataSerializer('json');
      return this.http.post(url, data, {'Content-Type': 'application/json'})
      .then(res => { return JSON.parse(res.data) })
    }else{
    	return this.httpClient.post(url, data).toPromise().then((data : any) => { return data;})
    }
  }

  // auth api
  public predaftar(eAn, nama, pass, isEmail){
  	let url = this.serverUrl + 'auth/predaftar';
  	return this.postRequest(url, { eAn: eAn, namaLengkap: nama, password: pass, isEmail: isEmail });
  }

  public masuk(eAn, password, isEmail){
    let url = this.serverUrl + 'auth/masuk';
    return this.postRequest(url, { eAn: eAn, password: password, isEmail: isEmail });
  }

  public verifyKode(eAn, nama, kode, keperluan){
    let url = this.serverUrl + 'auth/verifykode';
    return this.postRequest(url, {eAn: eAn, namaLengkap: nama, kode: kode, keperluan: keperluan});
  }

  public akunEdit(data){
    let url = this.serverUrl + 'auth/akun/edit';
    return this.postRequest(url, data);
  }

  // admin api
  public ambilKategori(){
    let url = this.serverUrl + 'api/admin/kategori';
    return this.postRequest(url, {});
  }
  public tambahKategori(data){
    let url = this.serverUrl + 'api/admin/kategori/tambah';
    return this.postRequest(url, data)
  }
  public hapusKategori(_id){
    let url = this.serverUrl + 'api/admin/kategori/hapus';
    return this.postRequest(url, {_id});
  }
  public editKategori(data){
    let url = this.serverUrl + 'api/admin/kategori/edit';
    return this.postRequest(url, data);
  }

  public ambilKelas(){
    let url = this.serverUrl + 'api/admin/kelas';
    return this.postRequest(url, {});
  }
  public tambahKelas(data){
    let url = this.serverUrl + 'api/admin/kelas/tambah';
    return this.postRequest(url, data);
  }
  public hapusKelas(_id){
    let url = this.serverUrl + 'api/admin/kelas/hapus';
    return this.postRequest(url, {_id});
  }
  public editKelas(data){
    let url = this.serverUrl + 'api/admin/kelas/edit';
    return this.postRequest(url, data);
  }

  public ambilRekening(){
    let url = this.serverUrl + 'api/admin/rekening';
    return this.postRequest(url, {});
  }
  public tambahRekening(data){
    let url = this.serverUrl + 'api/admin/rekening/tambah';
    return this.postRequest(url, data);
  }
  public hapusRekening(_id){
    let url = this.serverUrl + 'api/admin/rekening/hapus';
    return this.postRequest(url, {_id});
  }
  public editRekening(data){
    let url = this.serverUrl + 'api/admin/rekening/edit';
    return this.postRequest(url, data);
  }

  public ambilSiswa(){
    let url = this.serverUrl + 'api/admin/siswa';
    return this.postRequest(url, {});
  }
  public tambahSiswa(data){
    let url = this.serverUrl + 'api/admin/siswa/tambah';
    return this.postRequest(url, data);
  }
  public hapusSiswa(_id){
    let url = this.serverUrl + 'api/admin/siswa/hapus';
    return this.postRequest(url, {_id})
  }
  public editSiswa(data){
    let url = this.serverUrl + 'api/admin/siswa/edit';
    return this.postRequest(url, data);
  }

  public ambilWaliMurid(){
    let url = this.serverUrl + 'api/admin/waliMurid';
    return this.postRequest(url, {});
  }
  public tambahWaliMurid(data){
    let url = this.serverUrl + 'api/admin/waliMurid/tambah';
    return this.postRequest(url, data)
  }
  public hapusWaliMurid(_id){
    let url = this.serverUrl + 'api/admin/waliMurid/hapus';
    return this.postRequest(url, {_id})
  }
  public editWaliMurid(data){
    let url = this.serverUrl + 'api/admin/waliMurid/edit';
    return this.postRequest(url, data);
  }

  public ambilTagihan(){
    let url = this.serverUrl + 'api/admin/tagihan';
    return this.postRequest(url, {});
  }
  public tambahTagihan(data){
    let url = this.serverUrl + 'api/admin/tagihan/tambah';
    return this.postRequest(url, data);
  }
  public hapusTagihan(_id){
    let url = this.serverUrl + 'api/admin/tagihan/hapus';
    return this.postRequest(url, {_id});
  }
  public editTagihan(data){
    let url = this.serverUrl + 'api/admin/tagihan/edit';
    return this.postRequest(url, data);
  }
  // public ambilTagihanPenerima(_id){
  //   let url = this.serverUrl + 'api/admin/tagihan/penerima';
  //   return this.postRequest(url, {_id});
  // }
  public ambilTagihanPenerimaBelumLunas(_id){
    let url = this.serverUrl + 'api/admin/tagihan/penerima/belumLunas';
    return this.postRequest(url, {_id});
  }
  public ambilTagihanPenerimaLunas(_id){
    let url = this.serverUrl + 'api/admin/tagihan/penerima/lunas';
    return this.postRequest(url, {_id});
  }

  public ambilPembayaran(status: number[]){
    let url = this.serverUrl + 'api/admin/pembayaran';
    return this.postRequest(url, {status: status});
  }
  public editPembayaran(data){
    let url = this.serverUrl + 'api/admin/pembayaran/bukti/verifikasi';
    return this.postRequest(url, data);
  }

  //public api
  public tagihan(idUser){
    let url = this.serverUrl + 'api/tagihan';
    return this.postRequest(url, {idUser});
  }
  public tagihanHistori(idUser){
    let url = this.serverUrl + 'api/tagihan/histori';
    return this.postRequest(url, {idUser});
  }

  public bayar(idUser){
    let url = this.serverUrl + 'api/bayar';
    return this.postRequest(url, {idUser});
  }
  public bayarTambah(idUser, idTagihan, idSiswa){
    let url = this.serverUrl + 'api/bayar/tambah';
    return this.postRequest(url, {idUser, idTagihan, idSiswa});
  }
  public bayarNanti(idUser, idTagihan, idSiswa){
    let url = this.serverUrl + 'api/bayar/nanti';
    return this.postRequest(url, {idUser, idTagihan, idSiswa});
  }
  public bayarPembayaran(idUser, rekening, bayar: Bayar[]){
    let url = this.serverUrl + 'api/bayar/pembayaran';
    return this.postRequest(url, {idUser, rekening, bayar})
  }

  public pembayaran(idUser){
    let url = this.serverUrl + 'api/pembayaran';
    return this.postRequest(url, {idUser})
  }
  public histori(idUser){
    let url = this.serverUrl + 'api/pembayaran/histori';
    return this.postRequest(url, {idUser})
  }
  public pembayaranBuktiUpload(imgUrl, fileName, params){
    let url = this.serverUrl + 'api/pembayaran/bukti/upload'
    return this.transfer.create().upload(imgUrl, url, {
      fileKey: 'foto',
      fileName: fileName,
      chunkedMode: false,
      mimeType: "image/jpeg",
      params : params,
      headers: {}
    })
    .then(res => { return JSON.parse(res.response) })
  }
}