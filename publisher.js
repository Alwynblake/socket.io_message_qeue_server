'use strict';

const Q = require('./client');

Q.publish('database', 'delete', {id:77});
Q.publish('database', 'create', {id:99,name:'John'});
Q.publish('network', 'attack', {type: 'DDOS',source:'Russia'});