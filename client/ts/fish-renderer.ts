import Fish = require("./fish");
import FishBit = require("./fish-bit");
import Coords = require("./coords");
import Velocity = require("./velocity");
import circle = require("./circle");

class FishRenderer{
  context : CanvasRenderingContext2D
  constructor( context : CanvasRenderingContext2D ){
    this.context = context;
  }
  renderBit( bit : FishBit, center : Coords ){
    this.context.lineWidth = bit.lineWidth;
    this.context.beginPath();
    circle( this.context, center.x, center.y, bit.radius );
    this.context.stroke();
  }
  render( fish : Fish ){
    fish.bits.forEach(( bit, index )=>{
      this.renderBit( 
        bit, 
        fish.coords.move( 
          new Velocity( 
            bit.radius * index, 
            fish.velocity.angleRadians
          )
        ) 
      );
    });
  }
}
export = FishRenderer;