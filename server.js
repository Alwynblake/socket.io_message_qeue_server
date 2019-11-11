'use strict';

const Server = require('socket.io');

class Queue {
  constructor(name) {
    // our list of events, stored as a set to ensure that they are unique.
    this.events = new Set();
    this.name = name;
    this.q = Queue.io.of(`/${name}`);
    this.q.on('connection', this.connect.bind(this)); // we bind this on connection, so that the class instance gets the reference with 'this'instead of the socket.
  }

  // connects to the
  connect(socket) {
    socket.on('subscribe', (event, callback) => {
      if (this.events.has(event)) {
        socket.join(event);
        const message = `Subscribed to ${event} in ${this.name}  ... ${socket.id}`;
        console.log(message);
        if (callback) callback(undefined, message);
        console.log('All Subscribers...', event, this.connections(event));
      } else {
        const message = `Invalid Event ${event}`;
        console.log(message);
        if (callback) callback(message);
      }
    });
  }

  monitorEvent(event) {
    this.events.add(event);
  }

  connections(event) {
    // returns a list of socket connections using the socket.io rooms API.
    return Object.keys(this.q.adapter.rooms[event].sockets);
  }


  // lets non-connected clients push events to the Queue
  // Publishers can simply put info in the Queue, and the queue must emit the payload to things subscribed to the namespace and room;
  static publish(message, callback) {
    let {queue, event, payload} = message;
    console.log(message);
    Queue.io.of(queue).to(event).emit('trigger', payload);
    if (callback) callback();
  }

  static start() {
    const PORT = process.env.PORT || 3333;

    // leveraging Socket.io server object.
    Queue.io = new Server(PORT);
    // Users the connection event bound to our contructor.
    Queue.io.on('connection', socket => {
      console.log('connected', socket.id);
      socket.on('publish', Queue.publish);
    });
    console.log(`Queue server up on ${PORT}`);
  }
}

module.exports = Queue;