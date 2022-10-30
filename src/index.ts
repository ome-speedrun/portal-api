import app from './app';
import http from 'http';
import { debug } from 'console';

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
  * Listen on provided port, on all network interfaces.
  */

const port = process.env.PORT || 3000;

server.listen(port);

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr?.port || 'null'}`;

  debug('Listening on ' + bind);
});
