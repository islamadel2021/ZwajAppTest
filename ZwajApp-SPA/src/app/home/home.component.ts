import { Component, inject, OnInit, signal } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RegisterComponent],
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);

  registerMode = signal(false);

  ngOnInit(): void {}

  registerToggle() {
    this.registerMode.update((val) => !val);
  }
}
