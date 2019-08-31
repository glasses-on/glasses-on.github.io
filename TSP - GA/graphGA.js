
function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}


function Graph(total, order) {

  // Start assuming it's distance is infinity and fitness is zero
  this.dist = Infinity;
  this.fitness = 0;

  // Is this being made from another Graph object?
  if (order instanceof Array) {
    // Just copy the order
    this.order = order.slice();
    // Mutation
    // 50% of the time shuffle one spot to see if it improves
    if (random(1) < 0.05) {
      this.shuffle();
    }
  } else {

    // Create a random order
    this.order = [];
    for (var i = 0; i < total; i++) {
      this.order[i] = i;
    }

    for (var n = 0; n < 100; n++) {
      this.shuffle();
    }
  }
}

// Shuffle array one time
Graph.prototype.shuffle = function() {
  var i = floor(random(this.order.length));
  var j = floor(random(this.order.length));
  swap(this.order, i, j);
}

// How long is this particular path?
Graph.prototype.calcDistance = function() {
  var sum = 0;
  for (var i = 0; i < this.order.length - 1; i++) {
    var cityAIndex = this.order[i];
    var cityA = cities[cityAIndex];
    var cityBIndex = this.order[i + 1];
    var cityB = cities[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  this.dist = sum;
  return this.dist;
}

// Map the fitess where shortest is best, longest is worst
Graph.prototype.mapFitness = function(minD, maxD) {
  this.fitness = map(this.dist, minD, maxD, 1, 0);
  return this.fitness;
}

// Normalize against total fitness
Graph.prototype.normalizeFitness = function(total) {
  this.fitness /= total;
}

// Draw the path
Graph.prototype.show = function() {

  // Lines
  stroke(0);
  strokeWeight(1);
  noFill();
  beginShape();
  for (var i = 0; i < this.order.length; i++) {
    var n = this.order[i];
    vertex(cities[n].x, cities[n].y);
  }
  endShape();

  // Cities
  fill(0);
  for (var i = 0; i < this.order.length; i++) {
    var n = this.order[i];
    ellipse(cities[n].x, cities[n].y, 8, 8);
  }
}

// This is one way to crossover two paths
Graph.prototype.crossover = function(other) {

  // Grab two orders
  var order1 = this.order;
  var order2 = other.order;

  // random start and endpoint
  var start = floor(random(order1.length));
  var end = floor(random(start + 1, order1.length + 1));

  // Grab part of the the first order
  var neworder = order1.slice(start, end);

  //remaining vertices
  var leftover = order1.length - neworder.length;


  var count = 0;
  var i = 0;

  while (count < leftover) {
    var vertex = order2[i];
    if (!neworder.includes(vertex)) {
      neworder.push(vertex);
      count++;
    }
    i++;
  }
  return neworder;
}
