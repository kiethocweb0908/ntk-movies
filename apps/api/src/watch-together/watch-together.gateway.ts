import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { AuthenticatedUser, type CustomSocket } from '../types/auth.type';

const origins = process.env.FRONTEND_URLS?.split(',') || [];
@WebSocketGateway({
  cors: { origin: origins, methods: ['GET', 'POST'], credentials: true },
  transports: ['websocket'],
  namespace: 'watch-together',
})
export class WatchTogetherGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    try {
      // const cookieHeader = client.handshake.headers?.cookie;
      // console.log('headers: ', client.handshake.headers);
      // if (!cookieHeader) throw new Error('Unauthorized');

      // const cookies = require('cookie').parse(cookieHeader);
      // const token = cookies['accessToken'] || client.handshake.auth?.token;
      // console.log('token: ', token);
      // console.log(
      //   'client.handshake.auth?.token;: ',
      //   client.handshake.auth?.token,
      // );
      // if (!token) throw new Error('Unauthorized');

      // const payload = await this.authService.verifyAsync(token);
      // console.log('payload: ', payload);
      // const user = await this.authService.getMe(payload.sub);

      const userData: AuthenticatedUser = client.handshake.auth?.user;

      if (!userData || !userData.id) {
        throw new Error(
          'Không tìm thấy thông tin user hợp lệ từ client gửi lên',
        );
      }

      client.data.user = userData;
      console.log(`⚡ User ${userData.email} Đã kết nối Socket`);
      client.emit('authenticated');
    } catch (e: any) {
      console.log('❌ Không tìm thấy user, Kết nối thất bại: ', e?.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: CustomSocket) {
    console.log(`❌ Đã ngắt kết nối: ${client.data.user.email}`);
  }

  //=====================================================
  // LOBBY
  //=====================================================
  // vào lobby
  @SubscribeMessage('join-lobby')
  handleJoinLobby(@ConnectedSocket() client: CustomSocket) {
    client.join('lobby');
    console.log(`User "${client.data.user.email}" đã vào Lobby`);
  }
  // Rời lobby
  @SubscribeMessage('leave-lobby')
  handleLeaveLobby(@ConnectedSocket() client: Socket) {
    client.leave('lobby');
    console.log(`User "${client.data.user.email}" đã rời Lobby`);
  }

  //=====================================================
  // Phòng xem chung
  //=====================================================

  // Vào phòng
  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: { roomCode: string },
  ) {
    const user = client.data.user;

    client.join(data.roomCode);
    client.emit('joined-success', { roomCode: data.roomCode });
    client.to(data.roomCode).emit('user-joined', { user });

    // Fix #5: ask host to send current video state to the new member
    client
      .to(data.roomCode)
      .emit('request-video-state', { targetSocketId: client.id });
  }

  // 2. Lắng nghe lệnh điều khiển video từ Host và phát lại cho mọi người
  @SubscribeMessage('sync-video')
  handleSyncVideo(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody()
    data: {
      roomCode: string;
      action: 'play' | 'pause' | 'seek';
      currentTime: number;
    },
  ) {
    // .to(roomCode).emit(...) gửi cho mọi người TRONG PHÒNG đó
    // .except(client.id) để không gửi ngược lại cho chính người vừa bấm nút (tránh bị lặp lệnh)
    client.to(data.roomCode).emit('on-sync-video', data);
  }

  @SubscribeMessage('send-message')
  handleSendMessage(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: { roomCode: string; content: string },
  ) {
    const user = client.data.user;
    this.server.to(data.roomCode).emit('on-message', {
      userId: user.id,
      userEmail: user.email,
      userName: user.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : user.email,
      content: data.content,
      type: 'user',
    });
  }

  // Fix #5: Host sends back current video state to a specific new member
  @SubscribeMessage('send-video-state')
  handleSendVideoState(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody()
    data: { targetSocketId: string; currentTime: number; isPlaying: boolean },
  ) {
    // Send directly to the new member's socket
    this.server.to(data.targetSocketId).emit('on-sync-video', {
      action: data.isPlaying ? 'play' : 'pause',
      currentTime: data.currentTime,
    });
    // Also send an explicit seek so time is correct
    this.server.to(data.targetSocketId).emit('on-sync-video', {
      action: 'seek',
      currentTime: data.currentTime,
    });
  }

  // Fix #2: broadcast new room to lobby so watchers see it in real-time
  @SubscribeMessage('announce-room-created')
  handleAnnounceRoomCreated(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: { room: any },
  ) {
    // Broadcast to everyone in lobby except the creator
    client.to('lobby').emit('room-created', data.room);
  }
}
