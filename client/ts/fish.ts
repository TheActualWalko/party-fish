import Coords = require("./coords");
import Velocity = require("./velocity");
import mod = require("./mod");
import getDistance = require("./distance");
import Angles = require("./angles");
import FishBit = require("./fish-bit");
import { reverse } from "lodash";

interface FishProps {
  bits     : FishBit[],
  coords   : Coords,
  velocity : Velocity
}

class Fish{

  static AVOID_THRESHOLD   = 50;
  static FOLLOW_THRESHOLD  = 150;
  static AVOID_SCALE  = 0.01;
  static FOLLOW_SCALE = 0.01;
  static ANGLE_FRICTION = 0.8;
  static SPEED_FRICTION = 0.1;
  
  bits       : FishBit[];
  coords     : Coords;
  velocity   : Velocity;
  angleDelta : number = 0;
  speedDelta : number = 0;

  constructor( props : FishProps ){
    this.bits     = reverse( props.bits );
    this.coords   = props.coords;
    this.velocity = props.velocity;
  }

  respond( fish : Fish ){
    var distance = getDistance( this.coords, fish.coords );
    if( distance < Fish.AVOID_THRESHOLD ){
      this.avoid( fish );
    }
    if( distance < Fish.FOLLOW_THRESHOLD ){
      this.follow( fish );
    }
  }

  avoid( fish : Fish ){
    let scale = this.getAvoidScale( fish );
    if( scale > 0 ){
      let targetAngle = Angles.betweenPoints( fish.coords, this.coords );
      this.angleDelta += scale * Angles.delta( this.velocity.angleRadians, targetAngle );
    }
  }
  
  follow( fish : Fish ){
    let scale = this.getFollowScale( fish );
    if( scale > 0 ){
      this.angleDelta += scale * Angles.delta( this.velocity.angleRadians, fish.velocity.angleRadians );
      this.speedDelta += scale * ( fish.velocity.unitsPerTick - this.velocity.unitsPerTick );
    }
  }

  private getAvoidScale( fish ){
    let distance = getDistance( fish.coords, this.coords );
    return Fish.AVOID_SCALE * ( Math.max( 0, Fish.AVOID_THRESHOLD - distance ) / Fish.AVOID_THRESHOLD ); 
  }

  private getFollowScale( fish ){
    let distance = getDistance( fish.coords, this.coords );
    return Fish.FOLLOW_SCALE * ( Math.max( 0, Fish.FOLLOW_THRESHOLD - distance ) / Fish.FOLLOW_THRESHOLD ); 
  }

  updatePosition( ticks : number, maxX : number, maxY : number ){
    this.applyFriction();
    this.updateVelocity();
    this.move( ticks, maxX, maxY );
  }

  private applyFriction(){
    this.angleDelta *= ( 1 - Fish.ANGLE_FRICTION );
    this.speedDelta *= ( 1 - Fish.SPEED_FRICTION );
  }
  
  private updateVelocity(){
    this.velocity = new Velocity( 
      this.velocity.unitsPerTick + ( this.speedDelta ),
      this.velocity.angleRadians + ( this.angleDelta )
    );
  }
  
  private move( ticks, maxX, maxY ){
    var moved = this.coords.move( this.velocity, ticks );
    this.coords = new Coords(
      mod( moved.x, maxX ),
      mod( moved.y, maxY )
    );
  }

}

export = Fish;