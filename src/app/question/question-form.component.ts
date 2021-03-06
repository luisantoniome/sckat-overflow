import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Question } from './question.model';
import icons from './icons';
import { QuestionsService } from './questions.service';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styles: [`
    i {
      font-size: 48px;
    }

    small {
      display: block;
    }
  `],
  providers: [QuestionsService]
})
export class QuestionFormComponent implements OnInit {
  icons: Object[] = icons;

  constructor(
    private questionsService: QuestionsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/signin');
    }
  }

  getIconVersion(icon: any) {
    let version;
    if (icon.versions.font.includes('plain-wordmark')) {
      version = 'plain-wordmark';
    } else {
      version = icon.versions.font[0];
    }
    return version;
  }

  onSubmit(form: NgForm) {
    const q = new Question(
      form.value.title,
      form.value.description,
      new Date(),
      form.value.icon
    );

    this.questionsService.addQuestion(q)
      .subscribe(
        ({ _id }) => this.router.navigate(['/questions', _id]),
        this.authService.handleError
      );

    form.resetForm();
  }
}