export class EventDispatcher {
    subscribers = [];
    subscribe(callback) {
        this.subscribers.push(callback);
    }
    dispatch(event) {
        for (const subscriber of this.subscribers) {
            subscriber(event);
        }
    }
}
