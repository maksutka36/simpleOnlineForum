import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { host } from "../hostModel/hostModel"

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  
  getPosts( pageSize: number, currentPage: number){
    const queryParams = `?pagesize=${pageSize}&page=${currentPage}`;
    this.http.get<{message: string,posts: any, maxPosts: number}>(`${host}/post/get` + queryParams)
    .pipe(
      map(postDate => {
        return {
          posts: postDate.posts.map(
            (post: { 
              title: string;
              content: string;
              _id: string;
              imagePath: string;
              creator: string
            }) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
        }),
        maxPosts: postDate.maxPosts
      }
      })
    )
      .subscribe(transformedPostData =>{
        this.posts = transformedPostData.posts
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts})
      })
  }

  getPost(postId: string){
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string, creator: string}>(
      `${host}/post/` + postId
    );
  }

  addPost(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content); 
    postData.append("image", image, title); 
    this.http.post<{ message: string; post: Post }>(`${host}/post/create`, postData)
      .subscribe( res => {
        this.router.navigate([''])
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string){
    let postData: Post | FormData;
    if( typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put(`${host}/post/update/` + id, postData).subscribe( res =>{
      this.router.navigate(["/"]);
    })
  }

  deletePost(postId: string){
    return this.http.delete(`${host}/post/` + postId);
  }
}
