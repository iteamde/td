var express = require('express');
var app = express()

app.get('/', function (req, res) {
    res.send('This is demo testing !')
})


/* REQUIRED FOR ALL PROJECTS -- BEGIN */
var NODE_ENV_NAME='demo'; /* <---- CHANGE THIS TO PROJECT NAME */
var NODE_ENV_SOCKET='/var/www/'+NODE_ENV_NAME+'/run/node.socket';
var server = app.listen( NODE_ENV_SOCKET, function () {
        var exec = require( "child_process").exec;
            exec("chown .www-data "+NODE_ENV_SOCKET);
                exec("chmod 770 "+NODE_ENV_SOCKET);
})
var gracefulShutdown = function() {
      console.log("Received kill signal, shutting down gracefully.");
        
      server.close(function() {
      
          console.log("Closed out remaining connections.");
          
          process.exit()
          // if after 
      setTimeout(function() {
          console.error("Could not close connections in time, forcefully shutting down");
          process.exit()
      }, 10000);
});
}
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
/* REQUIRED FOR ALL PROJECTS -- END */
