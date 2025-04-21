import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { LongTextPipe } from './pipes/long-text.pipe';
import { LongTextTitlePipe } from './pipes/long-text-title.pipe';



@NgModule({
  declarations: [
    ArticleCardComponent,
    LongTextPipe,
    LongTextTitlePipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ArticleCardComponent,
    LongTextPipe,
    LongTextTitlePipe
  ]
})
export class SharedModule { }
