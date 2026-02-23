import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class PointGateway implements OnGatewayConnection, OnGatewayDisconnect, OnApplicationBootstrap {

    private readonly logger = new Logger(PointGateway.name);

    @WebSocketServer() server: any;

    constructor() { };

    handleConnection(client: any) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    onApplicationBootstrap() { };

    /**
     * Emite un nuevo punto GPS a todos los clientes conectados.
     * Llamado desde el service después de persistir en BD.
     */
    sendGpsPoint(point: any): void {
        this.server.emit('newgpsdata', point);
    }
}