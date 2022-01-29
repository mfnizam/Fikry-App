import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ServerService } from '../../../services/server/server.service';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
  selector: 'app-daftar',
  templateUrl: './daftar.page.html',
  styleUrls: ['./daftar.page.scss'],
})
export class DaftarPage {
	eAn;
  nama;
  password;
  confPassword;

  nomerTlpRegex = /(\+62\s?|^0)(\d-?){7,}/; // /\+62\s\d{3}[-\.\s]??\d{3}[-\.\s]??\d{3,4}|\(0\d{2,3}\)\s?\d+|0\d{2,3}\s?\d{6,7}|\+62\s?361\s?\d+|\+62\d+|\+62\s?(?:\d{3,}-)*\d{3,5}/g;
  emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isEmail = true;  
  btnDisabled = true;
  isLoading = false;
  loginMsg = '';
  showPass = false;

  eAnErr = false;
  confErr = false;

  constructor(
  	private navCtrl: NavController,
    private router: Router,
    private server: ServerService,
    private storage: StorageService,
    ) { }

  inputChange(){
    this.loginMsg = null;
    this.eAnErr = false;
    this.confErr = false;
    if(this.emailRegex.test(this.eAn)){
      this.isEmail = true;
      this.btnDisabled = this.password && this.confPassword && this.nama? false : true;
    }else if(this.nomerTlpRegex.test(this.eAn)){
      this.isEmail = false;
      this.btnDisabled = this.nama? false : true;;
    }else{
      this.isEmail = true;
      this.btnDisabled = true;
    }
  }

  daftar(){
    this.loginMsg = this.isEmail && (this.password != this.confPassword)? 'Password dan Konfirmasi Password harus sama' : null;
    this.confErr = this.isEmail && this.password != this.confPassword;
    if(this.loginMsg) return;
    this.isLoading = true;
    console.log(this.isEmail);
    this.server.predaftar(this.eAn, this.nama, this.password, this.isEmail? true : false).then(data => {
      this.isLoading = false;
      if(data.success && data.isEmail){
        this.storage.setStorage('user:data', data.token).then(_ => {
          this.router.navigateByUrl('/');
          this.nama = this.eAn = this.password = this.confPassword = null;
        })
      }else if(data.success && !data.isEmail){
        // this.navCtrl.navigateForward('/kode/' + this.eAn + '/' + 0)
        this.router.navigate(['/kode', 0, this.eAn, this.nama])
      }else {
        console.log(data.msg);
        this.loginMsg = data.isEmail? 'Email ': 'No Tlp ' + data.msg;
        this.eAnErr = data.iseAn;
      }
    }).catch(err => {
      console.log(err);
      this.isLoading = false;
    })
  }

  goBack(){
    this.navCtrl.back();
  }

}
