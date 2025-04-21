import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ArticleType } from 'src/types/article.type';
import { ArticlesType } from 'src/types/articles.type';
import { CategoryType } from 'src/types/category.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  articles: ArticlesType | null = null;
  categories: CategoryType[] = [];
  categoriesIsOpen: boolean = false;
  selectedCategories: string[] = [];
  filters: {name: string, url: string}[] = [];
  pages: number[] = []
  currentPage: number = 1
  private routeSub: Subscription | undefined;
  page: string | null = null

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      this.selectedCategories = params.getAll('category');
      this.page = params.get("page");
      console.log(this.page);
      
      // Если страница указана, обновляем currentPage и загружаем статьи
      if (this.page) {
        this.currentPage = +this.page;
      }
      this.loadArticles(this.currentPage, this.selectedCategories); // Загружаем статьи с новыми параметрами
    });
  
    // Получаем категории
    this.categoryService.getCategories().subscribe((data: CategoryType[]) => {
      this.categories = data;
      this.filters = this.categories
        .filter((category) => this.selectedCategories.includes(category.url))
        .map((category) => ({
          name: category.name,
          url: category.url
        }));
    });

    this.categoryService.getCategories().subscribe((data: CategoryType[]) => {
      this.categories = data;
      this.filters = this.categories
        .filter((category) => this.selectedCategories.includes(category.url))
        .map((category) => ({
          name: category.name,
          url: category.url
        }));
    });
    
  }

  loadArticles(page: number, categories?: string[]) {
    this.articleService.getArticles(page, categories).subscribe((data: ArticlesType) => {
      this.articles = data;
      this.pages = [];
      for (let i = 0; i < data.pages; i++) {
        this.pages.push(i + 1);
      }
    });
  }

  updateFilters(){
    this.filters = this.categories
        .filter((category) => this.selectedCategories.includes(category.url))
        .map((category) => ({
          name: category.name,
          url: category.url
        }));
      
  }

  toggleCategory(category: string) {
    let newSelectedCategories: string[];

    if (this.selectedCategories.includes(category)) {
      newSelectedCategories = this.selectedCategories.filter(
        (c) => c !== category
      );
    } else {
      newSelectedCategories = [...this.selectedCategories, category];
    }

    this.selectedCategories = newSelectedCategories;

    this.router.navigate([], {
      queryParams: {
        category: newSelectedCategories.length ? newSelectedCategories : null,
        page: 1
      },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    });

    this.updateFilters()
  }

  removeCategory(category: string) {
    this.selectedCategories = this.selectedCategories.filter(
      (item) => item !== category
    );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategories.length
          ? this.selectedCategories
          : null,
      },
      queryParamsHandling: 'merge',
    });
    this.updateFilters()
  }

  openNextPage(){
    if(this.currentPage < this.pages.length){
      this.currentPage++
      this.updatePageInUrl(this.currentPage)
      if(this.selectedCategories){
        this.loadArticles(this.currentPage, this.selectedCategories)
      }
    }
  }

  openPrevPage(){
    if(this.currentPage > 1){
      this.currentPage--
      this.updatePageInUrl(this.currentPage)
      if(this.selectedCategories){
        this.loadArticles(this.currentPage, this.selectedCategories)
      } 
    }
  }

  updatePageInUrl(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge',
    });
  }

  openPage(page: number){
    if(this.currentPage !== page){
      this.updatePageInUrl(page)
    if(this.selectedCategories){
      this.loadArticles(this.currentPage, this.selectedCategories)
    } 
    }
  }
}
