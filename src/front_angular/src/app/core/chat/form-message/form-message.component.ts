import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from '../../../service/messages.service/messages.service';
import { Router } from '@angular/router';
import { ChannelPartageService } from '../../../service/servicePartage/channel-partage.service';
import { ChannelServiceComponent } from '../../../service/channel.service/channel.service.component';
import { Channel } from '../../models/channel';
import { UserPartageService } from '../../../service/userPartage/user.partage.service';
import { User } from '../../models/user';
import { UsersService } from '../../../service/users.service/users.service';
import { MessagesStoreService } from '../../../service/messages-store/messages-store.service';

@Component({
  selector: 'app-form-message',
  templateUrl: './form-message.component.html',
  styleUrl: './form-message.component.css',
})
export class FormMessageComponent implements OnInit {
  formMessage!: FormGroup;
  idChannel!: number;
  channel!: Channel;
  idUser!: number;
  user!: User;

  constructor(
    private fb: FormBuilder,
    private channelService: ChannelServiceComponent,
    private channelPartageService: ChannelPartageService,
    private messageService: MessagesService,
    private router: Router,
    private userPartageService: UserPartageService,
    private userService: UsersService,
    private messageStoreService: MessagesStoreService,
  ) {}

  ngOnInit() {
    //On récupère le channel
    this.channelPartageService.currentIdChannel.subscribe((id) => {
      this.idChannel = id;
      //console.log(this.idChannel);

      this.channelService
        .getChannelById(this.idChannel)
        .subscribe((channel) => {
          //console.log(channel);

          this.channel = channel;
          // this.initializeForm();
        });
    });

    //console.log(this.channel);

    //On initialise le formulaire
    this.formMessage = this.fb.group({
      content: ['', [Validators.maxLength(200), Validators.minLength(2)]],
      channel: [this.channel],
    });

    //On va chercher le User
    this.userPartageService.currentIdUser.subscribe((idUser) => {
      this.idUser = idUser;
      this.userService
        .getUserById(idUser)
        .subscribe((user) => (this.user = user));
    });
  }

  save() {
    const newMessage = {
      content: this.formMessage.get('content')?.value,
      channel: this.channel,
      user: this.user,
    };

    console.log('newMessage -- ' + newMessage);
    this.messageStoreService.addMessage(newMessage);

    this.messageService.addMessage(newMessage).subscribe((v) => {
      // this.router.navigate(['/chat/', this.idChannel]);

      console.log(v);
    });
    this.formMessage.reset();
  }
}
