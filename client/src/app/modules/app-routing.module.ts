import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationPageComponent } from '@app/pages/configuration-page/configuration-page.component';
import { GameCreationPageComponent } from '@app/pages/game-creation-page/game-creation-page.component';
import { GameHistoryComponent } from '@app/pages/game-history/game-history.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { LimitedTimeMenuComponent } from '@app/pages/limited-time-menu/limited-time-menu.component';
import { LimitedTimeMultiplayerGameComponent } from '@app/pages/limited-time-multiplayer-game/limited-time-multiplayer-game.component';
import { LimitedTimeSoloGameComponent } from '@app/pages/limited-time-solo-game/limited-time-solo-game.component';
import { LimitedTimeWaitlistComponent } from '@app/pages/limited-time-waitlist/limited-time-waitlist.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MultiplayerGamePageComponent } from '@app/pages/multiplayer-game-page/multiplayer-game-page.component';
import { ReplayPageComponent } from '@app/pages/replay-page/replay-page.component';
import { SelectionPageComponent } from '@app/pages/selection-page/selection-page.component';
import { WaitingRoomPageComponent } from '@app/pages/waiting-room-page/waiting-room-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'game/:id', component: GamePageComponent },
    { path: 'multiplayerGame/:hostId/:id', component: MultiplayerGamePageComponent },
    { path: 'waitingRoom/:id', component: WaitingRoomPageComponent },
    { path: 'waitingRoom/:id', component: WaitingRoomPageComponent },
    { path: 'gameCreation', component: GameCreationPageComponent },
    { path: 'selection', component: SelectionPageComponent },
    { path: 'config', component: ConfigurationPageComponent },
    { path: 'replay', component: ReplayPageComponent },
    { path: 'history', component: GameHistoryComponent },
    { path: 'limitedTimeMenu', component: LimitedTimeMenuComponent },
    { path: 'limitedTimeSoloGame/:id', component: LimitedTimeSoloGameComponent },
    { path: 'limitedTimeWaitingRoom', component: LimitedTimeWaitlistComponent },
    { path: 'LimitedTimeMultiplayerGame/:hostId/LTGame', component: LimitedTimeMultiplayerGameComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
