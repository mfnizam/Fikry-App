import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { Modals, Toast } = Plugins;

import { 
  AlertController, 
  ToastController, 
  ActionSheetController, 
  LoadingController, 
  ModalController
} from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private l;

  constructor(
    private alert: AlertController,
    private toast: ToastController,
    private action: ActionSheetController,
    private loading: LoadingController,
    private modal: ModalController) { }

  async showAlert(t, m, btn = ['OK']){
    const alert = await  this.alert.create({
      cssClass: 'alert-custom',
      header: t,
      // subHeader: t,
      message: m,
      buttons: btn,
      mode: 'ios'
    })
    return await alert.present();
  }

  showConfirm(t, m, btnt = ['Cancel', 'Ok']) : Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.alert.create({
        cssClass: 'alert-custom',
        header: t,
        // subHeader: t,
        message: m,
        buttons: [{
          text: btnt[0],
          role: 'cancel',
          handler: () => resolve(false)
        }, {
          text: btnt[1],
          handler: () => resolve(true)
        }],
        mode: 'ios'
      }).then(p => p.present())
    })
  }

  async showToast(t, color: string = 'dark', d: number = 2000, p: any = 'bottom'){
    let to = await this.toast.create({
      message: t,
      duration: d,
      color: color,
      mode: 'ios',
      cssClass: 'taost-custom',
      buttons: [{
        text: 'Selesai',
        role: 'cancel'
      }
      ]
    });

    to.present();
  }

  async showPrompt(h, m, i: Array<any>, b = ['Batal', 'Ok']) {
    let a = await this.alert.create({
      cssClass: 'prompt-custom',
      header: h,
      message: m,
      inputs: i,
      mode: 'ios',
      buttons: [{
        text: b[0],
        role: 'cancel',
      }, {
        text: b[1],
        role: 'ok'
      }]
    })
    await a.present()
    // .then(data => {
    //   // 'alert-input-wrapper'
    // });
    return a.onDidDismiss()
  }

  showAction(t, b: Array<any>) {
    return new Promise((resolve, reject) => {
      b.map(v => {
        v.handler = () => resolve(v.id);
      })
      this.action.create({
        header: t,
        mode: 'ios',
        buttons: b
      }).then(p => p.present())

    })
  }

  async showLoading(t, bd = true, d = 15000){
    this.l = await this.loading.create({
      message: t,
      backdropDismiss: bd,
      mode: 'ios',
      duration: d,
    });
    await this.l.present();
  }
  hideLoading(){
    try{
      if(this.l){
          return this.l.dismiss();
      }else{
        setTimeout(() => {
          if(this.l) return this.l.dismiss();
        }, 1500);
      }
    }catch(err){
      console.log(err);
    }
  }

  async showModal(d, m) {
    const modal = await this.modal.create({
      component: m,
      cssClass: 'modal-custom',
      componentProps: d
    });
    await modal.present();
    return await modal.onDidDismiss();
  }


  // native modal
  showAlertNative(t, m){
  	return Modals.alert({
  		title: t,
  		message: m
  	});
  }

  showConfirmNative(t, m){
  	return Modals.confirm({
  		title: t,
  		message: m
  	})
  }

  showPromptNative(t, m){
  	return Modals.prompt({
  		title: t,
  		message: m
  	})
  }

  showActionNative(t, m, o){
  	return Modals.showActions({
  		title: t,
  		message: m,
  		options: o
  	})
  }

  showToastNative(t, d: any = "short", p: any = 'bottom'){
  	return Toast.show({
  		text: t,
  		duration: d,
  		position: p
  	})
  }
}
