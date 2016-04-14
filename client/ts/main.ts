import io = require("socket.io-client");
import jQuery = require("jquery");
import Pond = require("./pond");
import Fish = require("./fish");
import Coords = require("./coords");
import Velocity = require("./velocity");
import FishRenderer = require("./fish-renderer");

(()=>{

  /*
  var socket = io("http://sam-watkinson.com:3000");

  socket.on("addFish", function( userID ){
    console.log("Adding a fish");
    pond = pond.addFish( makeFish() );
  });

  socket.on("removeFish", function( userID ){
    console.log("Removing a fish");
    pond = pond.removeFish( userID );
  });

  socket.on("setFishes", function( userIDs ){
    console.log("Setting fishes");
    pond = new Pond( userIDs.map( makeFish ) );
  });

  socket.emit("host");
  */

  const NUM_FISH = 160;
  const NUM_PSEUDOFISH = 2;
  const FISH_MAX_V = 0.25;
  const FISH_MIN_V = 0.025;
  const FISH_BIT_MAX_R = 8;
  const FISH_BIT_MIN_R = 3;
  const PULSE_SECONDS = 5;
  const FRAME_MS = 1000/60;
  const TICK_MS = FRAME_MS;
  let CANVAS_WIDTH  = 800;
  let CANVAS_HEIGHT = 800;

  let pond;
  let fishRenderer;
  let lastFrameTime;

  function draw( ctx ){
    requestAnimationFrame( ()=>{
      draw( ctx );
    });
    let frameTime = new Date().getTime();
    ctx.fillStyle = "#000";
    ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    ctx.strokeStyle = "#fff";
    let numTicks = 4; // (frameTime - lastFrameTime) / TICK_MS
    pond.updateAllFish( numTicks );
    pond.fishes.forEach((fish)=>{
      fishRenderer.render( fish, ctx )
    });
    lastFrameTime = frameTime;
  }

  function makeFish(){
    return new Fish({
      coords : new Coords( 
        Math.random() * CANVAS_WIDTH, 
        Math.random() * CANVAS_HEIGHT 
      ),
      velocity : new Velocity( 
        FISH_MIN_V + ( Math.random() * ( FISH_MAX_V - FISH_MIN_V )), 
        Math.random() * 2 * Math.PI 
      ),
      bits : [ 
        { radius : 1 + Math.random() * 8, lineWidth : 0.5 + Math.random() * 3 },
        { radius : 1 + Math.random() * 8, lineWidth : 0.5 + Math.random() * 3 },
        { radius : 1 + Math.random() * 8, lineWidth : 0.5 + Math.random() * 3 },
        { radius : 1 + Math.random() * 8, lineWidth : 0.5 + Math.random() * 3 },
        { radius : 1 + Math.random() * 8, lineWidth : 0.5 + Math.random() * 3 },
      ]
    });
  }

  jQuery(function(){

    CANVAS_WIDTH  = jQuery(window).width();
    CANVAS_HEIGHT = jQuery(window).height();

    let fishes = [];
    for( var i = 0; i < NUM_FISH; i ++ ){
      fishes.push( makeFish() );
    }

    pond = new Pond( fishes, CANVAS_WIDTH, CANVAS_HEIGHT );

    let cnv : any = jQuery("#canvas")[0];
    cnv.width = CANVAS_WIDTH;
    cnv.height= CANVAS_HEIGHT;
    let ctx = cnv.getContext("2d");
    ctx.translate( CANVAS_WIDTH/2, CANVAS_HEIGHT/2 );
    ctx.scale(1.1, 1.1);
    ctx.translate( -CANVAS_WIDTH/2, -CANVAS_HEIGHT/2 );
    fishRenderer = new FishRenderer( ctx );
    draw( ctx );
  });
})();