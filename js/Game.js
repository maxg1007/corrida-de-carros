class Game {
  constructor() {

    this.resetTitle=createElement('h2');
    this.reset = createButton('');
    this.liderTitle = createElement('h2')
    this.lider1 = createElement('h2')
    this.lider2 = createElement('h2')
    this.isMoving = false
    this.keyActive = false
    this.blast = false

  }

  resetar(){

    this.reset.mousePressed(()=>{
     database.ref('/').set({
       playerCount:0,
       gameState:0,
       players:{},
       carsEnd:0
     }) 
     location.reload()
    })

  }
  showElement(){

    this.resetTitle.html('Resetar jogadores')
    this.resetTitle.position(width/2+200,40)
    this.resetTitle.class('resetText')
    this.reset.position(width/2+230,100)
    this.reset.class('resetButton')
    form.titleImg.position(40,50)
    form.titleImg.class('gameTitleAfterEffect')

    this.liderTitle.html('Placar')
    this.liderTitle.position(width/3-60,40)
    this.liderTitle.class('resetText')

    this.lider1.position(width/3-50,80)
    this.lider1.class('liderText')

    this.lider2.position(width/3-50,120)
    this.lider2.class('liderText')

  } 

  start() {
    form = new Form();
    form.display();
    player = new Player();
    player.getCount() 
    carro1 = createSprite(width/2 - 50,height-100)
    carro1.addImage('carro1',carro1_img)
    carro1.addImage('blast',blast)
    carro1.scale = 0.08; 
    carro2 = createSprite(width/2 + 50,height-100)
    carro2.addImage('carro2',carro2_img)
    carro2.addImage('blast',blast)
    carro2.scale = 0.08; 
    carros=[carro1,carro2]
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    obstacles= new Group();
    fuels = new Group();
    coins = new Group();
    this.addSprites(fuels,10,fuel_img,0.02)
    this.addSprites(coins,10,coin_img,0.09)
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions)
    this.addSprites(obstacles,obstaclesPositions.length,obstacle2Image,0.04,obstaclesPositions)

  }
 getState(){
   var gameStateRef = database.ref('gameState')
   gameStateRef.on('value',function(data){
     gameState = data.val()
   })
 }
 update(state){

  database.ref('/').update({
    gameState:state
  })

 }
 play(){

  form.hide()
  this.showElement()
  Player.GetPlayersInfo()
  player.getCarsEnd()
  if(allPlayer!==undefined){
  
    image(pista,0,-height*5,width,height*6)
    var index = 0
    this.resetar()
    this.showLiders()
    this.showFuel()
    this.showLife()
    for(var plr in allPlayer){

      index = index + 1
      var x = allPlayer[plr].positionX
      var y = height-allPlayer[plr].positionY 
      var life = allPlayer[plr].life
      if(life<=0){
        carros[index-1].changeImage('blast')
        carros[index-1].scale = 0.3
        this.blast = true
        player.positionY = 0
        setTimeout(()=>{
          //player.fuel = 0
          this.showGameOver()
        },2000)
        player.update()
      }

      carros[ index-1].position.x = x
      carros[ index-1].position.y = y
      if(index===player.index){
        camera.position.x = carros[ index-1].position.x
        camera.position.y = carros[ index-1].position.y
        this.addCoin(index)
        this.addFuel(index)
        this.carCollision(index)
        this.collision(index)
      }
 
    }
    this.playerControl()
    const FinishLine = height*6-100
    if(player.positionY>FinishLine){

      gameState = 2
      player.rank +=1
      Player.updateCarsEnd(player.rank)
      player.update()
      this.showRank()

    }

    if(this.isMoving){

      player.positionY +=5;
      player.update();

    }

    drawSprites()
    
  }

 }
 playerControl(){
   if(!this.blast){
    if(keyIsDown(UP_ARROW)){
      player.positionY +=15
      player.update()
      player.fuel -= 0.5
      this.isMoving = true
    }
    if(keyIsDown(DOWN_ARROW)){
     player.positionY -=15
     player.update()
     
   }
   if(keyIsDown(LEFT_ARROW)){
     player.positionX -=10
     player.update()
     this.keyActive = true
   }
   if(keyIsDown(RIGHT_ARROW)){
     player.positionX +=10
     player.update()
     this.keyActive = false
   }
   }
 }
 showLiders(){

  var lider1,lider2;
  var players = Object.values(allPlayer)
  if((players[0].rank===0 && players[1].rank===0)||(players[0].rank===1)){

    lider1 = players[0].name + '&emsp;'+ players[0].rank +'&emsp;'+players[0].score
    lider2 = players[1].name + '&emsp;'+ players[1].rank +'&emsp;'+players[1].score
    this.lider1.html(lider1)
    this.lider2.html(lider2)


  }
  if(players[1].rank===1){
    lider1 = players[1].name + '&emsp;'+ players[1].rank +'&emsp;'+players[1].score
    lider2 = players[0].name + '&emsp;'+ players[0].rank +'&emsp;'+players[0].score
    
    this.lider1.html(lider1)
    this.lider2.html(lider2)

  }

 }
 addSprites(spriteGroup,numberOfSprites,spriteImage,scale,positions = []){

  for(var i=0;i < numberOfSprites;i++){
    var x,y;
    if(positions.length >0){
      x = positions[i].x
      y = positions[i].y
      spriteImage = positions[i].image
    }else{
    x = random(width/2 +150,width/2 - 150);
    y = random(-height*4.5,height - 400);
    }
    var sprite = createSprite(x,y)
    sprite.addImage(spriteImage)
    sprite.scale=scale
    spriteGroup.add(sprite)
  }
  
 }
 addFuel(index){

  carros[index-1].overlap(fuels,function(collector,collected){

    player.fuel = 200
    collected.remove()

    

  })

  if(player.fuel>0 && this.isMoving){

    player.fuel -= 0.2

  }
  
  if(player.fuel<=0){

    gameState = 2
    this.showGameOver()

  }

 }

 addCoin(index){

  carros[index-1].overlap(coins,function(collector,collected){

    player.score = player.score + 10
    player.update()
    collected.remove()

  })

 }
 showRank(){

  swal({
    title:'PARABENS '+player.name,
    text:'Você chegou em '+ player.rank +'º lugar!',
    imageUrl:'https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png',
    imageSize:'100x100',
    confirmBottonText:'OK'

  })

 }
 showLife(){
   push()
   image(life_img,player.positionX+20,height-player.positionY-150,20,20)
   fill('black')
   rect(player.positionX+50,height-player.positionY-150,200,20)
   fill('red')
   rect(player.positionX+50,height-player.positionY-150,player.life,20)
   pop()
 }
 showFuel(){
  push()
  image(fuel_img,player.positionX+20,height-player.positionY-100,20,20)
  fill('black')
  rect(player.positionX+50,height-player.positionY-100,200,20)
  fill('yellow')
  rect(player.positionX+50,height-player.positionY-100,player.fuel,20)
  pop()
}
showGameOver(){
  swal({
    title: `Fim de Jogo`,
    text: "Oops, você perdeu a corrida!",
    imageUrl:
    "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100",
    confirmButtonText: "Obrigado por jogar"
    });
}
collision(index){

  if(carros[index-1].collide(obstacles)){
    if(this.keyActive){
      player.positionX +=100
    }else{
      player.positionX -=100
    }
    if(player.life>0){
      player.life -= 50
    }
    player.update()
  }

}
carCollision(index){

  if(index===1){
    if(carros[index-1].collide(carros[1])){
      if(this.keyActive){
        player.positionX +=100
      }else{
        player.positionX -=100
      }
      if(player.life>0){
        player.life -= 50
      }
      player.update()
    }
    
  }
  if(index===2){
    if(carros[index-1].collide(carros[0])){
      if(this.keyActive){
        player.positionX +=100
      }else{
        player.positionX -=100
      }
      if(player.life>0){
        player.life -= 50
      }
      player.update()
    }
  }
}
}
