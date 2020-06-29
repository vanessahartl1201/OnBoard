const http = require("http")
const fs = require("fs")

let index = fs.readFileSync(__dirname+"/index.html")

var app = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

io.on('connection', function(socket) {
  socket.emit('welcome', { message: 'Potentiometerwerte:', id: socket.id });
  socket.on('i am client', console.log);
  
});

app.listen(3000);

const { Board, Sensor } = require("johnny-five");
    const board = new Board();
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://localhost:27017/";
    let dbo;
    //Mit mongodb verbinden
    MongoClient.connect(url, function(err, db) {
      if (err) {
        throw err;
      } else {
        console.log("Connected");
      }
      dbo = db.db("Schiffe");
    });
    //Mit Arduino verbinden
    board.on("ready", () => {
      const potentiometer1 = new Sensor("A2");
      const potentiometer2 = new Sensor("A3");
    
      potentiometer1.on("change", () => {
        const {value, raw} = potentiometer1;
        const lastIndex = Math.round(potentiometer1.scaleTo([0, 1023]));

        io.emit('pot1', value);
        
        console.log("Sensor1: ");
        console.log("  value  : ", value);
        console.log("  raw    : ", raw);
        console.log("-----------------");
        var dataobj = { potNr: 1, potValue: value, timestamp: Date.now() };
        dbo.collection("Schiffsdaten").insertOne(dataobj, function(err, res) {
          if (err) {cd
              console.log(err);
          } else {
              console.log(" ");
          }
            

          sleep(2000);

        });

        potentiometer2.on("change", () => {
          const {value2, raw2} = potentiometer2;
          const lastIndex2 = Math.round(potentiometer2.scaleTo([0, 1023]));
  
          io.emit('pot2', value2);
         
          console.log("Sensor: ");
         console.log("  value  : ", value2);
          console.log("  raw    : ", raw2);
          console.log("-----------------");
          var dataobj = { potNr: 2, potValue2: value2, timestamp: Date.now() };
          dbo.collection("Schiffsdaten").insertOne(dataobj, function(err, res) {
            if (err) {cd
                console.log(err);
            } else {
                console.log(" ");
            }
            sleep(2000);
            
          });
         
        if (lastIndex > 500) {
          console.log("Schiff 1");
          sleep(2000);

        } else {
          console.log("nothing");
            }

       if (lastIndex2 > 500) {
              console.log("Schiff 2");
              sleep(2000);
  
        } else {
          console.log("nothing");
                }

        
      });
     });
    });
  
    function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }