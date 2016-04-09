import { union, without } from "lodash";
import Fish = require("./fish");

class Pond{
  fishes : Fish[];
  constructor( fishes ){
    this.fishes = fishes;
  }
  addFish( fish ){
    return new Pond( union( this.fishes, [ fish ] ) );
  }
  removeFish( fish ){
    return new Pond( without( this.fishes, fish ) );
  }
  updateAllFish( ticks ){
    this.fishes.forEach(( fish )=>{
      this.fishes.forEach(( otherFish )=>{
        if( fish !== otherFish ){
          fish.respond( otherFish );
        }
      });
      fish.updatePosition( ticks );
    });
  }
}

export = Pond;