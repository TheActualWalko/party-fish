import $ = require("jquery");

let baseEnergy = 100;

let fromBase256 = ( nums : number[] )=>{
  let result = 0;
  nums.forEach(( num, index )=>{
    result += num * Math.pow( 256, ( nums.length - ( index + 1 ) ) );
  });
  return result;
}

let seedFromString = ( str : String )=>{
  let charCodes = str.split("").map(x=>x.charCodeAt(0));
  let num = fromBase256( charCodes );
  return {
    numCells : Math.round( ( num % Math.PI ) ) + 4,
    numBranches  : Math.round( ( num % Math.E ) ) + 1,
    cycle1       : num * 3 * Math.sqrt(3),
    cycle2       : num * 2 * Math.sqrt(2)
  };
}

let sum = ( list : number[] )=>{
  return list.reduce(( acc, curr )=>acc+curr, 0);
}

let maxIndex = ( list : number[] )=>{
  if( list.length === 0 ){
    throw new Error("Cannot calculate max index of empty list");
  }
  return list.reduce(( acc, curr, index )=>{
    if( curr > list[ acc ] ){
      return index;
    }else{
      return acc;
    }
  }, 0);
}

let minEnergy = 2;

interface Seed{
  numCells : number,
  numBranches  : number,
  cycle1    : number,
  cycle2    : number
}

let getEnergies = ( seed : Seed, energyToDistribute = baseEnergy ) : number|number[]=>{
  let scale = Math.sqrt( energyToDistribute/baseEnergy );
  let { numCells, numBranches, cycle1, cycle2 } = seed;
  numCells = Math.floor( numCells * scale );
  numBranches = Math.floor( numBranches * scale );
  if( numCells <= 1 ){
    return energyToDistribute;
  }
  let energies = [];
  let targetAverageEnergy = energyToDistribute / numCells;
  for( let i = 0; i < numCells; i ++ ){
    energies.push( targetAverageEnergy + ( Math.sin( i * ( cycle1 - cycle2 ) ) ) * ( targetAverageEnergy - minEnergy ) );
  }
  let unAdjustedAverageEnergy = sum(energies)/energies.length;
  energies = energies.map(x=>x-(unAdjustedAverageEnergy-targetAverageEnergy));
  let branchIndices = [];
  if( numBranches > 0 ){
    branchIndices.push( maxIndex( energies ) );
  }
  for( let i = 1; i < numBranches; i ++ ){
    let energiesWithBranchedDropped = energies.map((x, index)=>{
      if( branchIndices.indexOf( index ) >= 0 ){
        return -Infinity;
      }else if(
        branchIndices.indexOf( index - 1 ) >= 0
        ||
        branchIndices.indexOf( index + 1 ) >= 0
      ){
        return x - energyToDistribute;
      }else{
        return x;
      }
    });
    branchIndices.push( maxIndex( energiesWithBranchedDropped ) );
  }
  if( branchIndices.length > 0 ){
    branchIndices.forEach(index=>{
      energies[ index ] = getEnergies( seed, energies[ index ] );
    })
  }
  return energies;
};

let partSpacing = 10;

let renderBranch = ( ctx : CanvasRenderingContext2D, branch : any, x : number, y : number, angle : number, skipFirstMove = false )=>{
  let currentX = x;
  let currentY = y;
  branch.forEach(( part, index )=>{
    if( typeof part === "number" ){
      if( !skipFirstMove || skipFirstMove && index > 0 ){
        ctx.beginPath();
        ctx.moveTo( currentX, currentY );
        currentX += Math.cos( angle ) * partSpacing;
        currentY += Math.sin( angle ) * partSpacing;
        ctx.lineTo( currentX, currentY );
        ctx.stroke();
        currentX += Math.cos( angle ) * part;
        currentY += Math.sin( angle ) * part;
      }
      ctx.beginPath();
      ctx.arc( currentX, currentY, part + 1, 0, Math.PI * 2 );
      ctx.stroke();
      currentX += Math.cos( angle ) * part;
      currentY += Math.sin( angle ) * part;
    }else{
      renderBranch( ctx, part, currentX, currentY, angle + (( Math.PI * 0.5 ) * ( 1.2 - ( 0.4 * ( index/branch.length )))));
      renderBranch( ctx, part, currentX, currentY, angle - (( Math.PI * 0.5 ) * ( 1.2 - ( 0.4 * ( index/branch.length )))));
    }
  })
}

let renderFish = ( ctx : CanvasRenderingContext2D, energies, x, y )=>{
  renderBranch( ctx, energies, x, y, -Math.PI * 0.5, true );
};

let montreal = [ 
  "sam", 
  "amiani", 
  "karina", 
  "megan", 
  "josh", 
  "pavel", 
  "silka", 
  "katarina", 
  "evan", 
  "avital", 
  "martin", 
  "may", 
  "monica", 
  "victor", 
  "vincent", 
  "adrien", 
  "jerome", 
  "sarah", 
  "mark", 
  "connor", 
  "kayla", 
  "randeep", 
  "marc", 
  "miklos" 
];

let fam = [
  "sam",
  "andrew",
  "anne",
  "colleen",
  "penelope",
  "eric",
  "tanja",
  "george",
  "david",
  "vicky",
  "ben",
  "tom",
  "ruth",
  "karen",
  "blythe",
  "niko",
  "stella",
  "tess",
  "murray",
  "dana",
  "pat",
  "robin",
  "gary",
  "perry"
];


$(()=>{
  let cnv : any = $("#canvas")[0];
  let w = cnv.width;
  let h = cnv.height;
  let ctx : CanvasRenderingContext2D = cnv.getContext("2d");
  ctx.fillRect( 0,0,w,h );
  let startX = 150;
  let startY = 250;
  let currentX = startX;
  let currentY = startY;
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.font = "20px Helvetica Neue";
  ctx.textAlign = "center";
  //["your name here"].forEach((name)=>{
  montreal.forEach(( name )=>{
  //fam.forEach(( name )=>{
    //if( name === "josh" ){
      console.log( name, seedFromString( name ) );
    //}
    renderFish( ctx, getEnergies( seedFromString( name ) ), currentX, currentY );
    ctx.fillText( name, currentX, currentY + 90 );
    currentX += 180;
    if( currentX > w - 80 ){
      currentX = startX;
      currentY += 325;
    }
  });
  /*[ 
    { numCells : 5, numBranches : 2, cycle1 : 0, cycle2 : 0 },
    { numCells : 7, numBranches : 4, cycle1 : 0.5, cycle2 : 0.5 },
    { numCells : 5, numBranches : 2, cycle1 : 1.2, cycle2 : 1 },
    { numCells : 7, numBranches : 2, cycle1 : 0.1, cycle2 : 0.6 },
  ].forEach(( seed )=>{
    renderFish( ctx, getEnergies( seed ), currentX, currentY );
    currentX += 180;
    if( currentX > w - 80 ){
      currentX = startX;
      currentY += 325;
    }
  });*/
});