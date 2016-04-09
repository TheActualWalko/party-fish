import Coords = require("./coords");
class Angles{
  static betweenPoints( coords1 : Coords, coords2 : Coords ){
    return Math.atan2( coords2.y - coords1.y, coords2.x - coords1.x );
  }
  
  static delta( angle1 : number, angle2 : number ){
    let angle = Math.min(
        angle2 - angle1,
      ( angle2 - 2 * Math.PI ) - angle1,
        angle2 - ( angle1 - 2 * Math.PI )
      )
    while( angle < -Math.PI ){
      angle += 2 * Math.PI;
    }
    while( angle > Math.PI ){
      angle -= 2 * Math.PI;
    }
    return angle;
  }
}
export = Angles;