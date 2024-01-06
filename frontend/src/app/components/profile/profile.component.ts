import {Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {User} from "../../models/user";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user?: User;
  waitingForData = true;
  constructor(public auth: AuthService) {
  }

  async ngOnInit() {
    this.auth.getUser().subscribe(data => {this.user = data; this.waitingForData = false});
  }

}
