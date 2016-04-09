import Coords = require("./coords");
import Velocity = require("./velocity");
import mod = require("./mod");
import getDistance = require("./distance");
import Angles = require("./angles");
import FishBit = require("./fish-bit");

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
  static ANGLE_FRICTION_PER_TICK = 0.8;
  static SPEED_FRICTION_PER_TICK = 0;
  
  bits       : FishBit[];
  coords     : Coords;
  velocity   : Velocity;
  angleDeltaPerTick : number = 0;
  speedDeltaPerTick : number = 0;

  constructor( props : FishProps ){
    this.bits     = props.bits;
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
      this.angleDeltaPerTick += scale * Angles.delta( this.velocity.angleRadians, targetAngle );
    }
  }
  
  follow( fish : Fish ){
    let scale = this.getFollowScale( fish );
    if( scale > 0 ){
      this.angleDeltaPerTick += scale * Angles.delta( this.velocity.angleRadians, fish.velocity.angleRadians );
      this.speedDeltaPerTick += scale * ( fish.velocity.unitsPerTick - this.velocity.unitsPerTick );
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

  updatePosition( ticks ){
    this.applyFriction( ticks );
    this.updateVelocity( ticks );
    this.move( ticks );
  }

  private applyFriction( ticks ){
    this.angleDeltaPerTick *= ( 1 - Fish.ANGLE_FRICTION_PER_TICK ) * ticks;
    this.speedDeltaPerTick *= ( 1 - Fish.SPEED_FRICTION_PER_TICK ) * ticks;
  }
  
  private updateVelocity( ticks ){
    this.velocity = new Velocity( 
      this.velocity.unitsPerTick + ( this.speedDeltaPerTick * ticks ),
      this.velocity.angleRadians + ( this.angleDeltaPerTick * ticks )
    );
  }
  
  private move( ticks ){
    this.coords = this.coords.move( this.velocity, ticks );
  }

}

export = Fish;