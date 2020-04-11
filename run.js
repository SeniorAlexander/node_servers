exit = (log='Server exit') => { console.log(log); process.exit(1) }
if(!process.argv[2]){ exit('########## NO ARGUMENTS ##########');  }
const server = process.argv[2]

const fastify   = 'fastify' // ~ 1106k requests in 30.07s, 180 MB read
const koa       = 'koa'     // ~ 817k requests in 30.06s, 130 MB read
const restify   = 'restify' // ~ 724k requests in 30.06s, 125 MB read
const express   = 'express' // ~ 612k requests in 30.06s, 140 MB read
const hapi      = 'hapi'    // ~ 471k requests in 30.05s, 86.7 MB read
const port      = 4999
let connections = { get:0, post:0 }

if (![fastify, restify, express, koa, hapi].includes(server)){ exit('Not valid server name!') }

setInterval(function () {console.info(`| GET - ${connections['get']} | POST - ${connections['post']} |`)}, 5000)

// #=================================# EXPRESS #=================================#
if(server === express) {
  const express = require('./express').express
  const app = express()
  app.get('/', function (req, res)  {connections.get++; return res.send('Express Request | GET') })
  app.post('/', function (req, res) {connections.post++; return res.send('Express Request | POST') })
  try { console.log('============== Express working =============='); app.listen(port); }
  catch (err) { exit('Express error') }
}

// #=================================# FASTIFY #=================================#
if(server === fastify) {
  const fastify = require('./fastify').fastify
  fastify.get('/', (req, reply) => { connections.get++; return reply.send('Fastify Request | GET') })
  fastify.post('/', (req, reply) => { connections.post++; return reply.send('Fastify Request | POST') })
  fastify.listen(port, (err, address) => { if (err){ exit(err); } console.log(`============== Fastify working ==============`)})
}

// #=================================# RESTIFY #=================================#
if(server === restify) {
  const restify = require('./restify').restify
  const server = restify.createServer({ name: 'restify', version: '1.0.0' });
  server.get('/', function (req, res, next) {connections.get++; res.send('Restify Request | GET') })
  server.post('/', function (req, res, next) {connections.post++; res.send('Restify Request | POST') })
  server.listen(port, function () { console.log('============== Restify working =============='); });
}
// #=================================# KOA #=================================#
if(server === koa) {
  const Koa = require('./koa').koa
  const route = require('./koa').koaRoute
  const app = new Koa();
  app.use(route.get('/', function (req) { connections.get++; this.body =  'Koa Request | GET' }));
  app.use(route.post('/', function (req) { connections.post++; this.body =  'Koa Request | POST' }));
  app.listen(port);
  console.log('============== Koa working ==============');
}
// #=================================# HAPI #=================================#
if(server === hapi){
  const Hapi = require('./hapi').hapi
  const init = async () => {
    const server = Hapi.server({
      port: port,
      host: 'localhost'
    });
    server.route({ method: 'GET', path: '/', handler: (request, h) => {connections.get++; return 'Hapi Request | GET'; } });
    server.route({ method: 'POST', path: '/', handler: (request, h) => {connections.post++; return 'Hapi Request | POST'; } });
    await server.start();
    console.log('============== Hapi working ==============');
  };
  init();

}