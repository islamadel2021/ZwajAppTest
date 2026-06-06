import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css'],
  standalone: true, // 1. الكومبوننت بقت مستقلة مش محتاجة Module
})
export class ValueComponent implements OnInit {
  // 2. الـ Dependency Injection الحديث بدون استخدام الـ Constructor
  private http = inject(HttpClient);

  // 3. استخدام الـ Signals بدل المتغير العادي (أسرع بكتير في الـ Rendering)
  values = signal<any>(null);

  ngOnInit(): void {
    this.getValues();
  }

  getValues(): void {
    // 4. الـ subscribe الحديثة بتاخد أوبجكت منظم (next/error) بدل باص الـ Callbacks العشوائي
    this.http.get('http://localhost:5033/api/values').subscribe({
      next: (response) => {
        this.values.set(response); // بنملا الـ Signal باستخدام ميثود set
      },
      error: (error) => {
        console.error('حصلت مشكلة في جلب البيانات:', error);
      },
    });
  }
}
