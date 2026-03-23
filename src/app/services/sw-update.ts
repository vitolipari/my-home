import { Injectable, inject } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SwUpdateService {
  private readonly swUpdate = inject(SwUpdate);

  init(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')
      )
      .subscribe(() => {
        const accept = window.confirm(
          'È disponibile una nuova versione dell’app. Vuoi ricaricare ora?'
        );

        if (accept) {
          window.location.reload();
        }
      });

    // controllo periodico aggiornamenti
    setInterval(() => {
      this.swUpdate.checkForUpdate().catch(console.error);
    }, 5 * 60 * 1000);
  }
}

