import {Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {User} from "../../auth/user";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user!: User;
  constructor(public auth: AuthService) {
  }

  async ngOnInit() {
    this.auth.getUser().subscribe(data => this.user = data);
  }

}
