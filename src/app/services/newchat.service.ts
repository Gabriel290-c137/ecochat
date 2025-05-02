import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewChatService {
  conversation: any[] = [];

  resetConversation() {
    this.conversation = [];
  }

  getConversation() {
    return this.conversation;
  }

  addMessage(message: any) {
    this.conversation.push(message);
  }
}
