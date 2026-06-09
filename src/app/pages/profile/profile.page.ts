import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {AuthService} from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.page.html'
})
export class ProfilePage {

    authService = inject(AuthService);
    // readonly user = this.authService.currentUser;


    readonly user = inject(AuthService).currentUser;

}
