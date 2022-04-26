class Player {
  constructor() {

    this.name = null
    this.index = null
    this.positionX = 0
    this.positionY = 0
    this.rank = 0
    this.score = 0
    this.fuel = 200
    this.life = 200

  }
  getCount(){
    var playerCountRef = database.ref('playerCount')
   playerCountRef.on('value',function(data){
    playerCount = data.val()
   })
  }
  updateCount(count){

  database.ref('/').update({
    playerCount:count
  })

 }
 addPlayer(){
   var playerIndex = 'players/player'+this.index
   if (this.index === 1){
     this.positionX = width / 2 - 100
   }else{
    this.positionX = width / 2 + 100
   }
   database.ref(playerIndex).set({
     name : this.name,
     positionX : this.positionX,
     positionY : this.positionY,
    rank:this.rank,
    score:this.score
    })


 }
 static GetPlayersInfo(){
   var playerInfoRef= database.ref('players')
   playerInfoRef.on('value',(data)=>(
     allPlayer=data.val()
   ))
 }
 getDistance(){
   var distanceRef = database.ref('players/player'+this.index)
   distanceRef.on('value',(data)=>{
     var data = data.val()
     this.positionX = data.positionX
     this.positionY = data.positionY
   })
 }
 update(){
   var playerIndex = 'players/player'+this.index
   database.ref(playerIndex).update({
     positionX : this.positionX,
     positionY : this.positionY,
     rank : this.rank,
     score : this.score,
     life : this.life
   })
 }
 getCarsEnd(){

  database.ref('carsEnd').on('value',(data)=>{
    this.rank = data.val()
  })
 
 }
 static updateCarsEnd(rank){

  database.ref('/').update({
    carsEnd:rank
  })

 }
}
