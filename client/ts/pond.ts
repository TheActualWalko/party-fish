import { union, without } from "lodash";
import Fish = require("./fish");

class Pond{
  fishes : Fish[];
  width : number;
  height : number;
  constructor( fishes : Fish[], width : number, height : number ){
    this.fishes = fishes;
    this.width = width;
    this.height = height;
  }
  addFish( fish ){
    return new Pond( union( this.fishes, [ fish ] ), this.width, this.height );
  }
  removeFish( fish ){
    return new Pond( without( this.fishes, fish ), this.width, this.height );
  }
  updateAllFish( ticks ){
    this.fishes.forEach(( fish )=>{
      this.fishes.forEach(( otherFish )=>{
        if( fish !== otherFish ){
          fish.respond( otherFish );
        }
      });
      fish.updatePosition( ticks, this.width, this.height );
    });
  }
}

export = Pond;