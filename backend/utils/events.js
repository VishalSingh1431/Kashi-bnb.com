import { EventEmitter } from 'events';

export const appEvents = new EventEmitter();

export function publishUserUpdate(user) {
	if (!user) return;
	appEvents.emit('user:update', { id: user.id, user });
}


