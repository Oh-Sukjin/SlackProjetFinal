import { Component, OnInit } from '@angular/core';
import { Message } from '../../models/message';
import { MessagesService } from '../../../service/messages.service/messages.service';
import { ChannelPartageService } from '../../../service/servicePartage/channel-partage.service';
import { Channel } from '../../models/channel';
import { ChannelServiceComponent } from '../../../service/channel.service/channel.service.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessagesStoreService } from '../../../service/messages-store/messages-store.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserPartageService } from '../../../service/userPartage/user.partage.service';
import { UsersService } from '../../../service/users.service/users.service';

@Component({
  selector: 'app-list-messages',
  templateUrl: './list-messages.component.html',
  styleUrl: './list-messages.component.css',
})
export class ListMessagesComponent implements OnInit {
  messagesList: Message[] = [];
  messages: Message[] = [];
  channel!: Channel;
  idChannel!: number;
  idMessage!: number;
  messagesChannel!: Message[];
  buttonsOpen: boolean[] = [];
  openUpdateMessage = 'form-message-hidden';

  // Sur la même page: modifier le message
  formMessage!: FormGroup;
  lengthMessages!: number;
  user!: User;

  constructor(
    private router: Router,
    private messagesService: MessagesService,
    private messagesStoreService: MessagesStoreService,
    private channelPartageService: ChannelPartageService,
    private channelService: ChannelServiceComponent,
    private fb: FormBuilder,
    private userPartageService: UserPartageService,
    
  ) {}

  //Partie Channel
  ngOnInit() {
    // Partie Channel - on récupère le channel
    this.channelPartageService.currentIdChannel.subscribe((id) => {
      this.messagesChannel = []; //j'initialise les messages du channel vide

      this.idChannel = id;
      console.log(this.idChannel);

      this.channelService
        .getChannelById(this.idChannel)
        .subscribe((channel) => {
          console.log(channel);

          this.channel = channel;
          // this.initializeForm();
        });

      //Cela souscrit à des changements dans l'observable messages$ fourni par messagesStoreService.
      //Chaque fois qu'il y a un changement dans les messages,
      //la fonction de rappel (ms) => (this.messagesList = ms) est appelée, mettant à jour this.messagesList avec les nouveaux messages.
      this.messagesStoreService.messages$.subscribe((ms) =>
      this.messagesService.getAllMessages().subscribe(messages=> {
        this.messagesChannel=[];
         messages.forEach((message) => {
          
          
          //this.allMessages = this.messagesStoreService.getMessages();
          if (message.channel?.id == this.idChannel) {
            //Je rajoute les éléments dans un nouveau tableau
            this.messagesChannel.push(message);
          }
        })
      })


        //ms.forEach((message) => {
          
          //this.allMessages = this.messagesStoreService.getMessages();
         // if (message.channel?.id == this.idChannel) {
            //Je rajoute les éléments dans un nouveau tableau
            //this.messagesChannel.push(message);
         // }
       // })
      );
    });
    


   

    //this.messagesService.getAllMessages().subscribe({...}): Cela souscrit à l'observable renvoyé par la méthode getAllMessages()
    // dans messagesService. Lorsque de nouveaux messages sont reçus, la fonction de rappel next est exécutée.
    //this.messagesService.getAllMessages().subscribe({
     // next: (messages: Message[]) => {
        //Cette fonction gère les nouveaux messages reçus.
        //this.messagesStoreService.messages = messages; //Cela met à jour la propriété messages dans messagesStoreService avec les messages reçus.
       // messages.forEach((element) => {
          //je trie les éléments du channel
         // if (element.channel?.id == this.idChannel) {
            //console.log(element);

            //Je rajoute les éléments dans un nouveau tableau
          //  this.messagesChannel.push(element);
        //  }
      //  });

       // this.messagesList = messages;
       // this.messagesList.forEach(() => this.buttonsOpen.push(false));
     // },
  //  });
  }

  openButtons(index: number) {
    this.buttonsOpen[index] = !this.buttonsOpen[index];
  }

  delete(id: number | undefined) {
    console.log("fonction delete");
    
    if (id){
      this.messagesService.deleteMessage(id).subscribe((message) => {
        console.log("Message de l'ID : suprimer", id);
        console.log(message);
        this.messagesService
          .getAllMessages()
          .subscribe((messages) => (this.messagesList = messages));
      });
      this.messagesStoreService.deleteMessageById(id);
  }}

  update(id: number | undefined) {
    if (id) {
      this.idMessage = id;
      this.messagesService
        .getMessagesById(this.idMessage)
        .subscribe((message) => {

          this.formMessage = this.fb.group({
            content: [message.content || ''],
          });
        });
    }

    if (this.openUpdateMessage == 'form-message-hidden') {
      this.openUpdateMessage = 'form-message-open';
    } else {
      this.openUpdateMessage = 'form-message-hidden';
    }
  }

  save(message: any) {
    const newMessage: Message = {
      ...this.formMessage.value,
      id: this.idMessage,
      date: message.date,
      hour: message.hour,
      user: message.user,
      channel: message.channel,
    };

    this.messagesService.updateMessage(newMessage).subscribe(() => {
      this.messagesStoreService.updateMessage(newMessage);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/']);
      });
    });

    this.formMessage.reset();
    this.ngOnInit();
  }
}
