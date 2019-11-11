// Learn more or give us feedback
'use strict';

const Q = require('./client');

const network = new Q('network');

network.subscribe('attack', (payload) => {
  console.log('Shields Up!', payload);
});