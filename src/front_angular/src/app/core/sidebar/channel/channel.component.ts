import { Component, OnInit } from '@angular/core';
import { Channel } from '../../models/channel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChannelServiceComponent } from '../../../service/channel.service/channel.service.component';
import { ChannelPartageService } from '../../../service/servicePartage/channel-partage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css',
})
export class ChannelComponent implements OnInit {
  formChannel!: FormGroup;
  listChannels: Channel[] = [];
  longeurChannels!: number;
  idChannel!: number;

  // Variables liées au HTML dynamique
  showForm: boolean = false;
  showInput: boolean = false;
  buttonsOpen: boolean[] = [];
  openForm: boolean[] = [];
  openDelete: boolean[] = [];

  constructor(
    private router: Router,
    private channelService: ChannelServiceComponent,
    private channelPartageService: ChannelPartageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.channelService.getAllChannels().subscribe((channels) => {
      this.listChannels = channels;
      this.listChannels.forEach(() => this.buttonsOpen.push(false));
    });
  }

  openButtons(index: number) {
    this.buttonsOpen[index] = !this.buttonsOpen[index];
  }

  createChannel(channelName: string) {
    const newChannel: Channel = { id: this.longeurChannels + 1, channelName };
    this.channelService.addChannel(newChannel).subscribe((channel) => {
      this.ngOnInit();
    });
  }

  openDeleteChannel(id: number, index: number) {
    this.openDelete[index] = !this.openDelete[index];
  }

  getChannel(id: number) {
    this.channelService.getChannelById(id).subscribe((v) => {
      this.channelService
        .getAllChannels()
        .subscribe((channels) => (this.listChannels = channels));
    });
  }

  updateChannel(id: number | undefined, index: number) {
    if (id) {
      this.idChannel = id;
      this.channelService
        .getChannelById(this.idChannel)
        .subscribe((channel) => {

          this.formChannel = this.fb.group({
            channelName: [
              channel.channelName || '',
              [Validators.maxLength(10)],
            ],
          });
        });
    }
    this.openForm[index] = !this.openForm[index];
  }

  cancelForm(index: number) {
    this.openForm[index] = !this.openForm[index];
  }
  cancelDelete(index: number) {
    this.openDelete[index] = !this.openDelete[index];
  }

  save(index: number) {
    const newChannel: Channel = {
      ...this.formChannel.value,
      id: this.idChannel,
    };

    this.channelService.updateChannel(newChannel).subscribe(() => {
      this.channelPartageService.updateChannel(newChannel);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/']);
      });
    });

    this.formChannel.reset();
    this.openForm[index] = !this.openForm[index];
  }

  delete(id: number) {
    this.channelService.deleteChannel(id).subscribe((v) => {
      this.channelService
        .getAllChannels()
        .subscribe((channels) => (this.listChannels = channels));
    });
  }

  changeIdChannel(id: number) {
    this.channelPartageService.changeIdChannel(id);
  }
}
