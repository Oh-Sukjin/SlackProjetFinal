import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../../core/models/message';
import { HttpClient } from '@angular/common/http';
import { MessagesService } from '../messages.service/messages.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesStoreService {
  constructor(){}

  

  private readonly _messages: BehaviorSubject<Message[]> = new BehaviorSubject<
    Message[]
  >([]);

  readonly messages$: Observable<Message[]> = this._messages.asObservable();

  get messages(): Message[] {
    return this._messages.getValue();
  }

  set messages(val: Message[]) {
    this._messages.next(val);
  }

  getMessages(): Message[] {
    return this._messages.getValue();
  }

  setMessage(val: Message[]) {
    this._messages.next(val);
  }
  updateMessage(updateMessage: Message) {
    const currentMessages = [...this.messages];
    const index = currentMessages.findIndex(
      (message) => message.id === updateMessage.id
    );
    currentMessages[index] = updateMessage;
    this.messages = currentMessages;
  }

  addMessage(newClient: Message) {
    this.messages = [...this.messages, newClient];
  }
  deleteMessageById(id: number) {
    this.messages = this.messages.filter((message) => message.id !== id);
  }
}
