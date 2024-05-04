/* eslint-disable no-console */
/* eslint-disable no-restricted-imports */
import { Application } from '@app/app';
import { TEN } from '@common/global-constants';
import * as http from 'http';
import { AddressInfo } from 'net';
import { Service } from 'typedi';
import { SocketManager } from './services/socket-manager/socket-manager.service';

@Service()
export class Server {
    private static readonly appPort: string | number | boolean = Server.normalizePort(process.env.PORT || '3000');
    private static readonly baseDix: number = TEN;
    private server: http.Server;
    private socketManager: SocketManager;

    constructor(private readonly application: Application) {}

    private static normalizePort(val: number | string): number | string | boolean {
        const port: number = typeof val === 'string' ? parseInt(val, this.baseDix) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }
    async init(): Promise<void> {
        this.application.app.set('port', Server.appPort);

        this.server = http.createServer(this.application.app);
        this.socketManager = new SocketManager(this.server);
        this.socketManager.handleSockets();
        this.server.listen(Server.appPort);
        this.server.on('error', (error: NodeJS.ErrnoException) => this.onError(error));
        this.server.on('listening', () => this.onListening());
        try {
            console.log('Database connection successful !');
        } catch {
            console.error('Database connection failed !');
            process.exit(1);
        }
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            throw error;
        }
        switch (error.code) {
            case 'EACCES':
                process.exit(1);
                break;
            case 'EADDRINUSE':
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Se produit lorsque le serveur se met à écouter sur le port.
     */
    private onListening(): void {
        const addr = this.server.address() as AddressInfo;
        const bind: string = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening on ${bind}`);
    }
}
