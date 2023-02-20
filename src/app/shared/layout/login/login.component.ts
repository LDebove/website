import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    password: new FormControl('')
  });

  constructor(private auth: AuthService, private popup: PopupService) { }

  login(): void {
    let password = this.loginForm.value['password'] ?? '';
    this.auth.authenticate(password).subscribe({
      next: (response) => {
        if(response.meta.status !== 401) {
          this.popup.closeModal();
        }
      }
    });
  }
}
