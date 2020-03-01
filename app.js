//Uppsetningin á canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

var allShapes = [];   //Geymir alla bolta og kassa
var spawnedBalls = 0; //Telur hversu marga bolta notandinn hefur búið til

//Nær í random tölu á milli tveggja talna
function random(min,max) {
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

//Býr til bolta á staðsetningunni þar sem músin var smellt
function MousePos(event) {
  let obj = new Ball(
      event.clientX,
      event.clientY,
      random(-7,7),
      random(-7,7),
      'rgb(0,0,255)',
      random(10,20));
  allShapes.push(obj); //Setur boltann í array
  spawnedBalls += 1;   //Bætir við 1 í stigatöfluna
}
document.addEventListener("click", MousePos); //Ef notandinn smellir á músina þá býr hann til bolta

//Býr til kassa á staðsetningunni þar sem tveir boltar klessast
function addObjectOnCollission(x, y){
  let obj = new Box(
      x,
      y,
      random(-7,7),
      random(-7,7),
      'rgb(0,0,255)',
      random(10,20));
  allShapes.push(obj); //Setur kassan í array
}

//Ball klassinn
class Ball {
  constructor(x, y, velX, velY, color, size, shape){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.shape = "ball";
    this.hit = false;
    this.oneBox = true;
  }
  draw() { //Teiknar bolta
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
  update(){
    if(this.hit) { //Lætur hlutina detta af skjánum og verða fjólubláir ef þeir eru jafnstórir og klessast
      this.velY += 0.2;
      this.color = 'rgb(255,0,255)';
    } 
    else { //Ef hluturinn klessist í enda skjáss þá skoppar hann í öfuga átt
      if((this.x + this.size) >= width) this.velX = -(this.velX);
      if((this.x - this.size) <= 0) this.velX = -(this.velX);
      if((this.y + this.size) >= height) this.velY = -(this.velY);
      if((this.y - this.size) <= 0) this.velY = -(this.velY);
    }
    //Færir staðsetningu boltans eftir velocity
    this.x += this.velX;
    this.y += this.velY;
  }
  //Prófar hvort hlutinir klessast saman
  collisionDetect(){
    if(!this.hit){ //Ef þeir hafa ekki klesst saman
      //Fer í gegnum alla hlutina
      for(let j = 0; j < allShapes.length; j++) {
        if(!(this === allShapes[j])) {
          //Reiknar staðsetninguna á milli allra hlutana
          const dx = this.x - allShapes[j].x;
          const dy = this.y - allShapes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
    
          if (distance < this.size + allShapes[j].size) //Ef hlutinir snertast
          {
            if (this.size < allShapes[j].size) this.color = 'rgb(' + 255 + ',' + 0 + ',' + 0 +')'; //Ef boltinn er minni þá verður hann rauður

            //Ef hlutirninr eru jafnstórir
            else if (this.size === allShapes[j].size) {
              if (this.shape === "ball" && allShapes[j].shape === "ball"){ //Ef þeir eru báðir boltar
                this.hit = true;
                if(this.oneBox) { //Boltanir detta og búa til 2 nýja kassa í stað þeirra
                  addObjectOnCollission(this.x, this.y);
                  this.oneBox = false;
                }
              }
              else if (this.shape === allShapes[j].shape) this.hit = true; //Ef kassar klessast þá verða þeir fjólubláir og detta þeir niður
              else this.color = 'rgb(255,255,0)'; //Ef bolti og kassi klessast þá verða þeir gulir
            }
            else this.color = 'rgb(' + 0 + ',' + 255 + ',' + 0 +')'; //Ef hann er stærri þá verður hann grænn
          }
        }
      }
    }
  }
}

//Box klassinn (búinn til úr Ball klassanum)
class Box extends Ball{
   constructor(x, y, velX, velY, color, size, shape){
    super(x, y, velX, velY, color, size)
    this.shape = "box";
    this.hit = false;
    this.oneBox = true;
  }
  draw() { //Teiknar kassa
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.size*2, this.size*2);
    ctx.fill();
  }
}

//Lukkja sem teiknar scene-ið aftur og aftur
function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  //Texti sem er í efri vinstra horni sem segir notandanum hversu marga bolta hann hefur búið til
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Balls spawned: " + spawnedBalls, 10, 50);

  //Lykkja sem fer í gegnum all a hlutina og teiknar þá, færir þá og prófar hvort einhverjir eru að klessast, aftur og aftur
  for(let i = 0; i < allShapes.length; i++) {
    allShapes[i].draw();
    allShapes[i].update();
    allShapes[i].collisionDetect();
  }
  requestAnimationFrame(loop); //Lætur vafran vita að það séi verið að gera animation 
}
loop(); //keyrir lykkjuna aftur og aftur
