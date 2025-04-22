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
  article: OneArticle;
  relatedArticle: ArticleType[] = [];
  comments: CommentsType | null = null;
  offset: number = 0;
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
  ) {
    this.article = {
      text: "",
      comments: [""],
      commentsCount: 0,
      id: "",
      title: "",
      description: "",
      image: "",
      date: new Date(),
      category: "",
      url: ""
  }
  }

  ngOnInit(): void {
    this.articleUrl = this.route.snapshot.paramMap.get('url') || '';

    this.articleService.getArticle(this.articleUrl).subscribe((data) => {
      this.article = data;
      this.loadComments(this.article.id, this.offset);
      console.log(data)


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
        return
      }

      if (this.comments) {
        const updatedCommentsMap = new Map(data.comments.map(c => [c.id, c]));
        this.comments.comments = this.comments.comments.map(c =>
          updatedCommentsMap.get(c.id) || c
        );
      
        
        const existingIds = new Set(this.comments.comments.map(c => c.id));
        const newComments = data.comments.filter(c => !existingIds.has(c.id));
        this.comments.comments.push(...newComments);
      } else {
        this.comments = data;
      }

      this.comments.comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      for (let comment of data.comments) {
        this.commentsService.getActions(comment.id).subscribe((action) => {
          this.commentActions[comment.id] = action[0];
          if(action[0] === undefined){
            this.commentActions[comment.id] = {comment: comment.id ,action: "null"}
          }
        });
      }

    });
  }

  loadMoreComments() {
    console.log(this.offset)
    if (this.offset !== this.comments?.allCount && this.offset < this.comments!.allCount) {
      this.offset += 3
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
            this.loadComments(this.article.id, 0);
          }
        },
        error: (error) => {
          this.snackBar.open('Ошибка при добавлении комментария');
        },
      });
  }

  applyAction(commentUrl: string, action: string) {
    if (this.isLogged) {
      this.commentsService.applyAction(commentUrl, action).subscribe({
        next: (res) => {
          if ((res as DefaultResponseType).error !== true) {
            if(action === "violate"){
              this.snackBar.open("Жалоба отправлена")
              this.loadComments(this.article.id, this.offset);
            } else{
              this.snackBar.open(action)
              this.loadComments(this.article.id, this.offset);
            }
          }
        },
        error: (error) => {
          this.snackBar.open(error.error.message);
        },
      });
    } else {
      this.snackBar.open(
        'Действие доступно только для зарегестрированных пользователей'
      );
    }
  }
}
