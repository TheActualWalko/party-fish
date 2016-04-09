import Velocity = require("./velocity");
import mod = require("./mod");
class Coords{
  x : number;
  y : number;
  constructor( x, y ){
    this.x = x;
    this.y = y;
  }
  move( velocity : Velocity, ticks = 1 ){
    return new Coords(
      this.x + ( velocity.unitsPerTick * ticks * Math.cos( velocity.angleRadians ) ),
      this.y + ( velocity.unitsPerTick * ticks * Math.sin( velocity.angleRadians ) )
    );
  }
}
export = Coords;