import { Injectable } from '@angular/core';
import { Question } from './question.model';
import { Answer } from '../answer/answer.model';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import * as urljoin from 'url-join';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class QuestionsService {

  private questionsUrl: string;

  constructor(private http: Http) {
    this.questionsUrl = urljoin(environment.apiUrl, 'questions');
  }

  getQuestions(sort = '-createdAt'): Promise<void | Question[]> {
    return this.http.get(`${this.questionsUrl}?sort=${sort}`)
            .toPromise()
            .then(response => response.json() as Question[])
            .catch(this.handleError);
  }

  getQuestion(id): Promise<void | Question> {
    const url = urljoin(this.questionsUrl, id);
    return this.http.get(url)
            .toPromise()
            .then(response => response.json() as Question)
            .catch(this.handleError);
  }

  addQuestion(question: Question) {
    const body = JSON.stringify(question);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = this.getToken();

    return this.http.post(this.questionsUrl + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  addAnswer(answer: Answer) {
    const a = {
      description: answer.description,
      question: {
        _id: answer.question._id
      }
    };
    const body = JSON.stringify(a);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const questionId = answer.question._id.toString();
    const url = urljoin(this.questionsUrl, questionId, 'answers')
    const token = this.getToken();

    return this.http.post(url + token, body, { headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getToken() {
    const token = localStorage.getItem('token');
    return `?token=${token}`;
  }

  handleError(error: any) {
    const errMsg = error.message ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    console.log(errMsg);
  }
}