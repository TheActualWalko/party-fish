class FishSet{
  fishMap : any;
  constructor( fishMap ){
    this.fishMap = fishMap;
  }
  addKeyedFish( key, fish ){
    this.fishMap[ key ] = fish;
  }
  removeFish( key ){
    delete this.fishMap[ key ];
  }
  forEachFish( callback ){
    Object.keys( this.fishMap ).forEach(( key )=>{
      callback( this.fishMap[ key ], key );
    });
  }
}
export = FishSet