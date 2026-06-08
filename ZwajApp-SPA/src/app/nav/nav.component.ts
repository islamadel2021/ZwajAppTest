import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  imports: [FormsModule, TitleCasePipe], // بنستدعي الـ FormsModule هنا عشان يفهم الفورم والـ ngModel
})
export class NavComponent implements OnInit {
  model: { username: string; password: string } = {
    username: '',
    password: '',
  };

  authService = inject(AuthService);
  private alertify = inject(AlertifyService);

  ngOnInit(): void {}

  login() {
    this.authService.login(this.model).subscribe({
      next: () => {
        this.alertify.success('تم الدخول بنجاح');
      },
      error: (error) => {
        this.alertify.error(error);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.alertify.message('تم تسجيل الخروج');
  }
}
