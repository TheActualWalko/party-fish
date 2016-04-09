class Velocity{
  unitsPerTick : number;
  angleRadians   : number;
  constructor( unitsPerTick : number, angleRadians : number ){
    this.unitsPerTick   = unitsPerTick;
    this.angleRadians   = angleRadians;
  }
}
export = Velocity;