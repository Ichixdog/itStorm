import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { ActionType } from 'src/types/action.type';
import { ArticleType } from 'src/types/article.type';
import { CommentActionType } from 'src/types/comment-action.type';
import { CommentsType } from 'src/types/comments.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { OneArticle } from 'src/types/oneArticle.type';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailComponent implements OnInit {
  articleUrl: string | null = null;
  article!: OneArticle;
  relatedArticle: ArticleType[] = [];
  comments: CommentsType | null = null;
  offset: number = 2;
  commentActions: { [commentId: string]: CommentActionType } = {};
  isLogged: boolean = false;
  commentForm = this.fb.group({
    comment: ['', Validators.required],
  });

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private commentsService: CommentsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.articleUrl = this.route.snapshot.paramMap.get('url') || '';

    this.articleService.getArticle(this.articleUrl).subscribe((data) => {
      this.article = data;
      console.log(this.article);

      this.loadComments(this.article.id, this.offset);
    });

    this.articleService
      .getRelatedArticles(this.articleUrl)
      .subscribe((data) => {
        this.relatedArticle = data;
      });

    this.isLogged = this.authService.getIsLogged();
  }

  loadComments(articleId: string, offset: number) {
    this.commentsService.getComments(articleId, offset).subscribe((data) => {
      if (data.allCount < 3 && offset !== 0) {
        offset = 0;
        this.loadComments(articleId, offset);
      }
      this.comments = data;
      console.log(this.comments);

      for (let comment of data.comments) {
        this.commentsService.getActions(comment.id).subscribe((action) => {
          this.commentActions[comment.id] = action[0];
          if(action[0] === undefined){
            this.commentActions[comment.id] = {comment: comment.id ,action: "null"}
          }
        });
      }
      console.log(this.commentActions);

    });
  }

  loadMoreComments() {
    if (this.offset !== 0) {
      if (this.offset >= 2) {
        this.offset -= 2;
      } else {
        this.offset = 0;
      }
      this.loadComments(this.article.id, this.offset);
    }
  }

  addComment() {
    this.commentsService
      .addComment(this.commentForm.get('comment')!.value!, this.article.id)
      .subscribe({
        next: (res) => {
          if ((res as DefaultResponseType).error !== true) {
            this.snackBar.open('Комментарий оставлен');
            this.commentForm.get('comment')?.setValue('');
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка при добавлении комментария');
        },
      });
    this.loadComments(this.article.id, this.offset);
  }

  applyAction(commentUrl: string, action: string) {
    if (this.isLogged) {
      this.commentsService.applyAction(commentUrl, action).subscribe({
        next: (res) => {
          if ((res as DefaultResponseType).error !== true) {
            this.snackBar.open('Лайк');
            this.loadComments(this.article.id, this.offset);
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка');
        },
      });
    } else {
      this.snackBar.open(
        'Действие доступно только для зарегестрированных пользователей'
      );
    }
  }
}
