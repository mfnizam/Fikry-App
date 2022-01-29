import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { StorageService } from '../storage/storage.service';
import { TagihanService } from '../tagihan/tagihan.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
  	private router: Router,
  	private storage: StorageService,
    private tagihan: TagihanService) { }

  canActivate(): Promise<boolean | UrlTree> {
    return this.storage.getDecodedStorage('user:data').then(data => {
      if(data && data['_id'] && !data['isAdmin']){
        return true;
      }else if(data && data['_id']){
        return this.router.parseUrl('/admin');
      }else{
        return this.router.parseUrl('/masuk');
        this.tagihan.setDataBayar([]);
        this.tagihan.setDataTagihan([]);
      }
    }).catch(err => {
      console.log(err, 'err getStorage - canActivate - AuthGuardService');
      return this.router.parseUrl('/masuk');
      this.tagihan.setDataBayar([]);
      this.tagihan.setDataTagihan([]);
    })
  }
}
