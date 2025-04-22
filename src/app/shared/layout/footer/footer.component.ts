import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  callModal: boolean = false
  callModalComplete: boolean = false

  callForm = this.fb.group({
    name: ["", Validators.required],
    phone: ["", [Validators.required, Validators.pattern(/^\d{11}$/)]]
  })

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  openCallModal(){
    this.callModal = true
  }

  callModalClose(){
    this.callModal = false
    this.callModalComplete = false
    this.callForm.patchValue({
      name: "",
      phone: ""
    })
    this.callForm.get('phone')?.markAsPristine()
    this.callForm.get('phone')?.markAsUntouched()
  }

  proccessModalCall(){
    if(this.callForm.valid && this.callForm.value.name && this.callForm.value.phone){
      this.callModalComplete = true
    }
  }

  goToAnchor(anchor: string) {
    this.router
      .navigate([], {
        fragment: '',
        queryParamsHandling: 'preserve',
        replaceUrl: true,
      })
      .then(() => {
        this.router.navigate([], {
          fragment: anchor,
          queryParamsHandling: 'preserve',
        });
      });
  }
}
