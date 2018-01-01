var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'mini_game'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");    
} else {
    console.log("Error connecting database ... nn");    
}
});
app.use(express.static(__dirname + '/node_modules'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/save-data/:giai/:ketqua', function(req, res,next) {
    var sqlInsert = 'INSERT INTO start (name, value) VALUES( "'+req.params.giai+'", "'+req.params.ketqua+'")';
	connection.query(sqlInsert, function(err, rows, fields) {
		res.json([err,rows,fields]);
	});
});
io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function (data) {
        console.log(data);
    });
    client.on('messages', function(data) {
        client.emit('broad', data);
        client.broadcast.emit('broad',data);
    });
});
server.listen(4300);