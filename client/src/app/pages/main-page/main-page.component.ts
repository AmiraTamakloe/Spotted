import { Component, OnInit } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    constructor(private socketClientService: SocketClientService) {}

    ngOnInit(): void {
        if (this.socketClientService.isSocketAlive()) {
            this.socketClientService.disconnect();
            this.socketClientService.connect();
        } else {
            this.socketClientService.connect();
        }
    }
}
