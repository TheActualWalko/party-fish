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
  let CANVAS_WIDTH  = 800;
  let CANVAS_HEIGHT = 800;

  let pond;
  let fishRenderer;

  function draw( ctx, frameTime ){
    ctx.fillStyle = "#000";
    ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    ctx.strokeStyle = "#fff";
    let numTicks = frameTime / FRAME_MS;
    pond.updateAllFish( numTicks );
    pond.fishes.forEach((fish)=>{
      fishRenderer.render( fish, ctx )
    })
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
        { radius : 4, lineWidth : 1 },
        { radius : 1, lineWidth : 1 },
        { radius : 4, lineWidth : 1 },
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
    let cyclePseudofishCount = 0;
    let drawCount = 0;
    let lastFrameTime = new Date().getTime();
    console.log( pond );
    setInterval(function(){
      let currentFrameTime = new Date().getTime();
      draw( ctx, currentFrameTime - lastFrameTime );
      lastFrameTime = currentFrameTime;
    }, FRAME_MS);
  });
})();