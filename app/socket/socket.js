import io from 'socket.io-client';
import { newMessage, missedMessages } from '../actions/messages';
import { updateUsers } from '../actions/users';
import store from '../store/configureStore';
import { REMOTE_URL } from '../../config.json';
import { addMessage } from '../actions/unread';
import { Alert } from 'react-native';

class Socket {
	constructor() {
		this.connect = this.connect.bind(this);
		this.disconnect = this.disconnect.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.handleConnection = this.handleConnection.bind(this);
		this.socket = null;
	}

	connect(token) {
		this.socket = io.connect(REMOTE_URL, { jsonp: false, secure: true, query: { token } });
		this.handleConnection();
	}

    status = () => this.socket.connected;
    disconnect = () => this.socket.disconnect();
    sendMessage = (message, cb) => this.socket.emit('message', message, res => cb(res))
    userSearch = (queryString, _id, cb) => this.socket.emit('userSearch', queryString, _id, cb)
    getRoomData = (room, cb) => this.socket.emit('getRoomData', room, data => cb(data))

    handleConnection() {
    	this.socket.on('error', message => Alert.alert('SOCKET ERROR:', message));
    	this.socket.on('ONLINE_USERS', users => store.dispatch(updateUsers(users)));
    	this.socket.on('connect', () => console.log('socket connected', this.socket.id));
    	this.socket.on('disconnect', () => console.log('disconnected'));
    	this.socket.on('sendMessageToClients', async message => {
    		await Promise.all([
    			store.dispatch(addMessage(message)),
    			store.dispatch(newMessage(message))
    		]);
    	});

    	this.socket.on('clientMissedMessages', messages => {
    		console.log('missed messages', messages);
    		store.dispatch(missedMessages(messages));
    	});
    }
}

const socket = new Socket();

export default socket;