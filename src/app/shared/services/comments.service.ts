import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentActionType } from 'src/types/comment-action.type';
import { CommentsType } from 'src/types/comments.type';
import { DefaultResponseType } from 'src/types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  getComments(article: string, offset: number): Observable<CommentsType>{
    return this.http.get<CommentsType>(environment.api + "comments", {
      params: {
        offset: offset,
        article: article
      }
    })
  }

  addComment(text: string, article: string): Observable<DefaultResponseType>{
    const body = {
      text: text,
      article: article
    }
    return this.http.post<DefaultResponseType>(environment.api + "comments", body)
  }

  applyAction(commentUrl: string, action: string): Observable<DefaultResponseType>{
    const body = {
      action: action
    }
    return this.http.post<DefaultResponseType>(environment.api + "comments/" + commentUrl + "/apply-action", body)
  }

  getActions(commentUrl: string): Observable<CommentActionType[]>{
    return this.http.get<CommentActionType[]>(environment.api + "comments/" + commentUrl + "/actions")
  }
}
