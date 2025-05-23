import { Component, OnInit } from '@angular/core';
import { PrimeNgModules } from '@/app/imports/import-prime-ng';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@/app/service/generalService/http.service';
import { environment } from '@/environments/environment';
import path from '@/app/types/constants/cons-path';
import { IPath } from '@/app/types/interfaces/interface-path';
import { RouterModule } from '@angular/router';
import HotToastClass from '@/app/utils/class/notification/HotToastClass';
import { enterFields } from '@/app/types/constants/const-error-message';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  imports: [...PrimeNgModules, RouterModule],
})
export class RecoverPasswordComponent implements OnInit {
  path: IPath = path;

  constructor(
    private httpService: HttpService,
    private hotToast: HotToastClass
  ) {}

  ngOnInit() {}

  formRecoverPassword = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.email,
    ]),
  });

  async onSubmitRecoverPassword() {
    this.formRecoverPassword.markAllAsTouched();

    if (this.formRecoverPassword.invalid) {
      this.hotToast.infoNotification(enterFields);
      return;
    }

    const { success, message } = await this.httpService.request(
      'POST',
      `${environment.api}sendemail/sendEmailResetPassword`,
      { body: this.formRecoverPassword.value, isASecurityEndpoint: false }
    );

    if (success) {
      this.hotToast.successNotification(
        'Revise el correo que se le envio para continuar cambiando su contraseña'
      );
      this.formRecoverPassword.reset();
    } else {
      this.hotToast.errorNotification(message);
    }
  }
}
