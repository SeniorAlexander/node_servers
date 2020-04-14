# Test Node Servers

## Installation and usage

1.  Install all dependencies `npm install`
2.  Config port in `run.js` file
3.  Run one of these servers `node run.js express`
4.  Run test `autocannon -c 50 -d 30 -m POST http://localhost:4999`

## Shoot results for (Windows 10, 32 Gb RAM, i7-9700f, NodeJs v13.05.0)

`autocannon -c 50 -d 30 -m POST http://localhost:4999`

1  NODE     ~ 1338k requests in 30.07s, 189 MB read
2. FASTIFY  ~ 1106k requests in 30.07s, 180 MB read
3. KOA      ~ 817k requests in 30.06s, 130 MB read
4. EXPRESS  ~ 612k requests in 30.06s, 140 MB read
5. RESTIFY  ~ 601k requests in 30.05s, 104 MB read
6. HAPI     ~ 471k requests in 30.05s, 86.7 MB read