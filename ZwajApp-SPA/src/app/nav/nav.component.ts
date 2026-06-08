import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  imports: [FormsModule], // بنستدعي الـ FormsModule هنا عشان يفهم الفورم والـ ngModel
})
export class NavComponent implements OnInit {
  model: { username: string; password: string } = {
    username: '',
    password: '',
  };

  public authService = inject(AuthService);

  ngOnInit(): void {}

  login() {
    this.authService.login(this.model).subscribe({
      next: (response) => {
        console.log('تم الدخول بنجاح');
        console.log(response);
      },
      error: (err) => {
        console.error('خطأ في تسجيل الدخول:', err);
      },
      complete: () => {
        console.log('اكتملت العملية');
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
