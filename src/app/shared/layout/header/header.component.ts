import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { UserInfoType } from 'src/types/user-info.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false
  userName: string = ""

  constructor(private authService: AuthService) {
    this.isLogged = authService.getIsLogged()
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLogged = loggedIn;
    
      if (loggedIn) {
        this.authService.getUserInfo().subscribe({
          next: (data: UserInfoType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message);
            }
            this.userName = (data as UserInfoType).name;
          }
        });
      } else {
        this.userName = ''; 
      }
    });
  }

  logout(): void{
    this.authService.logout()
  }

}
