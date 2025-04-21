import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/types/article.type';
import { ArticlesType } from 'src/types/articles.type';
import { OneArticle } from 'src/types/oneArticle.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getPopularArticle(): Observable<ArticleType[]>{
    return this.http.get<ArticleType[]>(environment.api + "articles/top")
  }

  getArticles(page: number, categories?: string[]): Observable<ArticlesType>{
    const params: {[key: string]: string | number | string[]} = {}
    params["page"] = page
    if(categories){
      params["categories"] = categories
    }
    return this.http.get<ArticlesType>(environment.api + "articles", {
      params
    })
  }

  getArticle(articleUrl: string): Observable<OneArticle>{
    return this.http.get<OneArticle>(environment.api + "articles/" + articleUrl)
  }

  getRelatedArticles(articleUrl: string): Observable<ArticleType[]>{
    return this.http.get<ArticleType[]>(environment.api + "articles/related/" + articleUrl)
  }
}
