import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelComponent } from './core/sidebar/channel/channel.component';
import { FormMessageComponent } from './core/chat/form-message/form-message.component';


const routes: Routes = [
  { path: 'channels', component: ChannelComponent },
  { path: 'messageForm', component: FormMessageComponent }, //A supprimer plus tard
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
