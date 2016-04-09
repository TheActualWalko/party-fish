import Coords = require("./coords");

export = ( coords1 : Coords, coords2 : Coords )=>{
  return Math.sqrt( Math.pow( coords1.x - coords2.x, 2 ) + Math.pow( coords1.y - coords2.y, 2 ) );
}