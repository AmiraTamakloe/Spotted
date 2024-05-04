import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeletedGamePopupComponent } from '@app/components/deleted-game-popup/deleted-game-popup.component';
import { DialogNamePopupComponent } from '@app/components/dialog-name-popup/dialog-name-popup.component';
import { EndgameModalComponent } from '@app/components/endgame-modal/endgame-modal.component';
import { GameCreationAreaComponent } from '@app/components/game-creation-area/game-creation-area.component';
import { GameComponent } from '@app/components/game/game.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { HintsComponent } from '@app/components/hints/hints.component';
import { PlayAreaLtComponent } from '@app/components/play-area-lt/play-area-lt.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { StopwatchLtComponent } from '@app/components/stopwatch-lt/stopwatch-lt.component';
import { StopwatchComponent } from '@app/components/stopwatch/stopwatch.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppComponent } from '@app/pages/app/app.component';
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
import { WaitingRoomPageComponent } from '@app/pages/waiting-room-page/waiting-room-page.component';
import { DifferencesMatrixService } from '@app/services/differences-matrix/differences-matrix.service';
import { EnlargementSliderService } from '@app/services/enlargement-slider/enlargement-slider.service';
import { GamesService } from '@app/services/games/games.service';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { AppMaterialModule } from './modules/material.module';
import { ConfigurationPageComponent } from './pages/configuration-page/configuration-page.component';
import { SelectionPageComponent } from './pages/selection-page/selection-page.component';
import { ConstantInitialiserService } from './services/constantInitialiser/constant-initialiser.service';
/* Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        GameCreationPageComponent,
        PlayAreaComponent,
        SelectionPageComponent,
        ConfigurationPageComponent,
        StopwatchComponent,
        GameCreationPageComponent,
        ConfigurationPageComponent,
        GameCreationAreaComponent,
        GameComponent,
        HeaderComponent,
        ChatBoxComponent,
        HintsComponent,
        DialogNamePopupComponent,
        EndgameModalComponent,
        MultiplayerGamePageComponent,
        WaitingRoomPageComponent,
        DeletedGamePopupComponent,
        ReplayPageComponent,
        GameHistoryComponent,
        LimitedTimeMenuComponent,
        LimitedTimeSoloGameComponent,
        LimitedTimeWaitlistComponent,
        LimitedTimeMultiplayerGameComponent,
        PlayAreaLtComponent,
        StopwatchLtComponent,
        ConfirmationPopupComponent,
        HintsComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        HttpClientModule,
    ],
    providers: [GamesService, EnlargementSliderService, DifferencesMatrixService, ConstantInitialiserService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
