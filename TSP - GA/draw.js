// Cities
var cities = [];
var N = 10;

// Best path overall
var recordDistance = Infinity;
var bestEver;

// Population of possible orders
var population = [];
var popTotal = 50;

var CoCount=0;
var XHis; var YHis;

function setup() {
  createCanvas(800,800);
  colorMode(RGB,255, 255, 255, 20);

  info = createDiv('');
  info.position(600,150);
  graphInfo0 = createDiv('');
}

function draw() {
  background(255,255,255);

  if(CoCount<N){
    info.html("Click " + (N-CoCount)+" times inside the box for vertices; To change count of vertex, in console define N = new number ");
    fill(250,250,210);
    rect(0,0,400,400);
    noFill();
  }

  //--Take Points from user-----------//
  if(mouseIsPressed && CoCount<N){

    var randX = mouseX;
    var randY = mouseY;

    if(randX != XHis && randY != YHis){

      ellipse(randX,randY, 4, 4);

      var v = createVector(randX, randY);
      cities[CoCount] = v;

      XHis=randX;YHis=randY;

      CoCount += 1;

      if(CoCount==N) {

        for (var i = 0; i < popTotal; i++) {
          population[i] = new Graph(N);
        }

        console.log("Finished taking vertices");

      }

    }
  }
  else if(CoCount>=N) {

      var minDist = Infinity;
      var maxDist = 0;

      // Best distance search in this population and till now
      var bestNow;
      for (var i = 0; i < population.length; i++) {
        var d = population[i].calcDistance();

        if (d < recordDistance) {
          recordDistance = d;
          bestEver = population[i];
        }

        if (d < minDist) {
          minDist = d;
          bestNow = population[i];
        }

        if (d > maxDist) {
          maxDist = d;
        }
      }

      // Show best graph till now
      bestNow.show();
      translate(0, height / 2);
      line(0, 0, width, 0);

      bestEver.show();
      info.html("Optimal cost right now: " + bestEver.calcDistance())

      // Map all the fitness values between 0 and 1
      var sum = 0;
      for (var i = 0; i < population.length; i++) {
        sum += population[i].mapFitness(minDist, maxDist);
      }

      // Normalize them to a probability between 0 and 1
      for (var i = 0; i < population.length; i++) {
        population[i].normalizeFitness(sum);
      }


      var newPop = [];

      // cretae new population pool with randomly selecting two genes and crossovering it
      for (var i = 0; i < population.length; i++) {

        // Pick two
        var a = pickOne(population);
        var b = pickOne(population);

        // Crossover!
        var order = a.crossover(b);
        newPop[i] = new Graph(N, order);
      }

      // New population!
      population = newPop;
  }
}


function pickOne() {
  // Start at 0
  var index = 0;

  // Pick a random number between 0 and 1
  var r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= population[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  return population[index];
}
