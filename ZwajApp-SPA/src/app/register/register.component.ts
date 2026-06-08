// register.component.ts

import { Component, OnInit, output, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [FormsModule],
})
export class RegisterComponent implements OnInit {
  model: { username: string; password: string } = {
    username: '',
    password: '',
  };

  // ✅ Angular 19: output() بدل EventEmitter
  cancelRegister = output<boolean>();

  private authService = inject(AuthService);
  private alertify = inject(AlertifyService);

  ngOnInit(): void {}

  register() {
    this.authService.register(this.model).subscribe({
      next: () => {
        this.alertify.success('تم التسجيل بنجاح');
        this.cancelRegister.emit(false);
      },
      error: (err) => {
        this.alertify.error('خطأ في التسجيل:' + err);
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false); // ✅ يبعت إشارة للـ parent
    this.alertify.message('تم إلغاء التسجيل');
  }
}
