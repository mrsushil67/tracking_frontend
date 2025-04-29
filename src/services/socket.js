import {io} from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
//   autoConnect: false,
  withCredentials: true,
});
// socket.on('connect', () => {
//   console.log('Connected to socket server');
// });

// socket.on('disconnect', () => {
//   console.log('Disconnected from socket server');
// });

export default socket;