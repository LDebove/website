import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  password = new FormControl('');
  authenticated: boolean = false;

  constructor(private auth: AuthService, private popup: PopupService) { }

  ngOnInit(): void {
    this.authenticated = this.auth.getAuthenticated();
    this.auth.authenticatedSubject.subscribe({
      next: (authenticated) => {
        this.authenticated = authenticated;
      }
    });
  }

  login(): void {
    let password = this.password.value ?? '';
    this.auth.authenticate(password).subscribe({
      next: (response) => {
        if(response.meta.status !== 401) {
          this.auth.authenticatedSubject.next(true);
          this.popup.closeModal();
        }
      }
    });
  }

  logout(): void {
    this.auth.authenticatedSubject.next(false);
    this.auth.disconnect();
  }
}
