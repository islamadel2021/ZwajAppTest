// _services/alertify.service.ts

import { Injectable } from '@angular/core';
import alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root',
})
export class AlertifyService {
  confirm(message: string, okCallback: () => void) {
    alertify.confirm(message, (e: boolean) => {
      if (e) {
        okCallback();
      }
    });
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }
}
