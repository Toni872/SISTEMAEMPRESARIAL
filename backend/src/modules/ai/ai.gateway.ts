import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class AIGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;
  private prisma = new PrismaClient();

  afterInit() {
    // Emitir métricas simuladas cada 5s
    setInterval(() => {
      const now = new Date().toISOString();
      const payload = {
        ts: now,
        accuracy: 0.85 + Math.random() * 0.05,
        latencyMsP95: 180 + Math.random() * 30,
        latencyMsP99: 220 + Math.random() * 30,
        throughputRps: 40 + Math.floor(Math.random() * 15),
        errorRate: 0.004 + Math.random() * 0.004,
      };
      this.server.emit('ai:metrics', payload);
      // Persistir métrica
      this.prisma.aIMetric
        .create({
          data: {
            ts: new Date(payload.ts),
            accuracy: payload.accuracy,
            latencyMsP95: payload.latencyMsP95,
            latencyMsP99: payload.latencyMsP99,
            throughputRps: payload.throughputRps,
            errorRate: payload.errorRate,
          },
        })
        .catch(() => {});
      if (Math.random() < 0.25) {
        const alert = {
          level: 'info',
          title: 'Nuevo modelo listo',
          message: 'Se ha publicado un modelo candidato para ventas',
          ts: now,
        };
        this.server.emit('ai:alert', alert);
        this.prisma.aIAlert
          .create({
            data: {
              level: alert.level,
              title: alert.title,
              message: alert.message,
              ts: new Date(alert.ts),
            },
          })
          .catch(() => {});
      }
    }, 5000);
  }
}
