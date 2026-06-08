// register.component.ts

import { Component, OnInit, output, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

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

  ngOnInit(): void {}

  register() {
    this.authService.register(this.model).subscribe({
      next: () => {
        console.log('تم التسجيل بنجاح');
        this.cancelRegister.emit(false);
      },
      error: (err) => {
        console.error('خطأ في التسجيل:', err);
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false); // ✅ يبعت إشارة للـ parent
    console.log('ليس الأن');
  }
}
