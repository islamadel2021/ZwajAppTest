import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

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
  private router = inject(Router); // ✅ inject بدل constructor

  ngOnInit(): void {}

  login() {
    this.authService.login(this.model).subscribe({
      next: () => {
        this.alertify.success('تم الدخول بنجاح');
        this.router.navigate(['/members']); // ✅ navigate بعد اللوجين
      },
      error: (error) => {
        this.alertify.error(error);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.alertify.message('تم تسجيل الخروج');
    this.router.navigate(['']); // ✅ navigate بعد اللوج اوت
  }
}
