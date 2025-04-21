import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ArticleService } from 'src/app/shared/services/article.service';
import { RequestService } from 'src/app/shared/services/request.service';
import { ArticleType } from 'src/types/article.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }

  customOptions2: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      396: {
        items: 3
      }
    },
    nav: false
  }

  services = [
    {
      image: "service1",
      title: "Создание сайтов",
      desc: "В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!",
      price: 7500
    },
    {
      image: "service2",
      title: "Продвижение",
      desc: "Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!",
      price: 3500
    },
    {
      image: "service3",
      title: "Реклама",
      desc: "Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.",
      price: 1000
    },
    {
      image: "service4",
      title: "Копирайтинг",
      desc: "Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.",
      price: 750
    }
  ]

  testimonials = [
    {
      image: "testimonial1.png",
      name: "Станислав",
      text: "Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру."
    },
    {
      image: "testimonial2.png",
      name: "Алёна",
      text: "Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть."
    },
    {
      image: "testimonial3.png",
      name: "Мария",
      text: "Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!"
    },
    {
      image: "testimonial2.png",
      name: "Алёна",
      text: "Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть."
    },
  ]

  serviceForm = this.fb.group({
    service: ["", Validators.required],
    name: ["", Validators.required],
    phone: ["", [Validators.required, Validators.pattern(/^\d{11}$/)]]
  })

  articles: ArticleType[] = []
  serviceModal: boolean = false
  serviceModalComplete: boolean = false

  constructor(private articleService: ArticleService, private fb: FormBuilder, private requestService: RequestService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.articleService.getPopularArticle().subscribe((data: ArticleType[]) => {
      this.articles = data
    })
  }

  openModal(serviceTitle: string){
    this.serviceModal = true
    this.serviceForm.get("service")?.setValue(serviceTitle)
    this.serviceForm.get("service")?.disable()
  }

  serviceModalClose(){
    this.serviceModal = false
    this.serviceModalComplete = false
    this.serviceForm.patchValue({
      name: "",
      phone: "",
      service: ""
    })
    this.serviceForm.get('phone')?.markAsPristine()
    this.serviceForm.get('phone')?.markAsUntouched()
  }

  proccessRequest(){
    console.log("valid", this.serviceForm.valid)
    const formData = this.serviceForm.getRawValue()
    if(this.serviceForm.valid && formData.name && formData.phone && formData.service){
      this.requestService.addRequest(formData.name, formData.phone, formData.service, "order").subscribe({
        next: (res) =>{
          if((res as DefaultResponseType).error !== true){
            this.serviceModalComplete = true
            this.snackBar.open(res.message)
          }
        },
        error: (res: HttpErrorResponse) =>{
          if(res.error && res.error.message){
            this.snackBar.open(res.error.message)
          }
        }
      })
    }
  }
}
