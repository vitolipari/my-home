import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile.component',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
    standalone: true
})
export class ProfileComponent {

    @Input() picture: string = '';

}
