import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  public authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }

  login(): void {
    this.authService.login();
  }
}
