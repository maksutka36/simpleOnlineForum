import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/authorization/authorization.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  postForm!: FormGroup;
  enteredTitle = "";
  enteredContent = "";
  post?: Post;
  imagePreview!: string;
  isLoading = false;
  private authStatusSub!: Subscription;
  private mode = "create";
  private postId: any

  constructor(
    private postService: PostsService,
    private authService: AuthorizationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId") ;
        this.isLoading = true;
        this.postService.getPost(this.postId)
          .subscribe((postData) => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath,
              creator : postData.creator
            };
            this.postForm.setValue({
            title: this.post?.title,
            content: this.post?.content,
            image: this.post?.imagePath
            })
        });
      } else {
        this.mode = "create";
        this.postId =  null as any;
      }
    });
    
    this.postForm = new FormGroup({
              
      title: new FormControl("", [Validators.required, Validators.minLength(4)]),
      content: new FormControl("", Validators.required),
      image: new FormControl("",[ Validators.required])
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files![0]
    this.postForm.patchValue({image: file});
    this.postForm.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    };
    reader.readAsDataURL(file);
  }

  onAddPost() {
    if (this.mode === "create") {
      console.log(this.postForm)
      if(!this.postForm.invalid){
      this.postService.addPost(this.postForm.value.title, this.postForm.value.content, this.postForm.value.image);
      this.postForm.reset()
    }
    } else {
      this.postService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
      this.postForm.reset()
    }
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe()
  }

}
