const scoreEl= document.querySelector("#scoreL")
const bigScore= document.querySelector("#bigScore")
const canvas= document.querySelector("canvas")
const model= document.querySelector("#modal") 
const c=canvas.getContext('2d')
canvas.width=innerWidth
canvas.height=innerHeight
class Player{
    constructor(x,y,radius,color){
     this.x =x
     this.y = y
     this.radius=radius
     this.color=color 
    } 
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle=this.color
        c.fill()
    } 
 }
 class Projectile{
     constructor(x,y,radius,color,velocity){
      this.x=x
      this.y=y
      this.radius=radius
      this.color=color
      this.velocity=velocity
     }
     draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle=this.color
        c.fill()
    } 
    update(){
        this.draw()
        this.x=this.x+this.velocity.x
        this.y=this.y+this.velocity.y
    }
 }

 class Enemy{
    constructor(x,y,radius,color,velocity){
     this.x=x
     this.y=y
     this.radius=radius
     this.color=color
     this.velocity=velocity
    }
    draw(){
       c.beginPath()
       c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
       c.fillStyle=this.color
       c.fill()
   } 
   update(){
       this.draw()
       this.x=this.x+this.velocity.x
       this.y=this.y+this.velocity.y
   }
}
const friction=0.98
class Partical{
    constructor(x,y,radius,color,velocity){
     this.x=x
     this.y=y
     this.radius=radius
     this.color=color
     this.velocity=velocity
     this.alpha =1
    }
    draw(){
        c.save()
        c.globalAlpha=this.alpha
       c.beginPath()
       c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
       c.fillStyle=this.color
       c.fill()
       c.restore()
   } 
   update(){
       this.draw()
       this.velocity.x *=friction
       this.x=this.x+this.velocity.x
       this.y=this.y+this.velocity.y
       this.alpha-=0.01
   }
}

 const x=canvas.width/2
 const y=canvas.height/2
 
 let player= new Player(x,y,10,'white')
    let projectiles =[]
    let enemies=[]
    let particals=[]
    let animationId
    let score =0

   function init(){
     player= new Player(x,y,10,'white')
     projectiles =[]
     enemies=[]
     particals=[]
     score =0
     scoreEl.innerHTML= score
     bigScore.innerHTML=score
   }


 
 function animate(){
    animationId=requestAnimationFrame(animate)
    c.fillStyle='rgba(0,0,0,0.1)'
     c.fillRect(0,0,canvas.width,canvas.height)
     player.draw()
     particals.forEach((partical,index) =>{
         if(partical.alpha<=0) particals.splice(index,1)
         else partical.update()
     })
      projectiles.forEach( function (projectile,index) {
              projectile.update()
              if(projectile.x+projectile.radius<0||projectile.x-projectile.radius>canvas.width||projectile.y+projectile.radius<0||projectile.y-projectile.radius>canvas.height){
                setTimeout(()=>{
                    projectiles.splice(index,1)
                },0)
              }
          })
               enemies.forEach((enemy,index) => { 
              enemy.update()
             const dist=Math.hypot(player.x-enemy.x,player.y-enemy.y)
             if(dist-enemy.radius-player.radius<1){
             cancelAnimationFrame(animationId)
             bigScore.innerHTML=score
             model.style.display = "flex"

             }
          projectiles.forEach((projectile,projectileIndex) =>{
            const dist=Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y)
            if(dist-enemy.radius-projectile.radius<1){ 
                  
                 for(let i=0;i<enemy.radius*2;i++){
                  particals.push(new Partical(projectile.x,projectile.y,Math.random()*3,enemy.color,{x:(Math.random()-0.5)*(6*Math.random()),y:(Math.random()-0.5)*(6*Math.random())}))
                 
                 }
               
                    if(enemy.radius-10>5){
                        score+=100 
                        scoreEl.innerHTML= score
                        gsap.to(enemy,{
                            radius:enemy.radius-10
                        })
                        setTimeout(()=>{ 
                            projectiles.splice(projectileIndex,1)},0)

                    }
                    else{  score+=250 
                        scoreEl.innerHTML= score
                        setTimeout(()=>{ 
                        enemies.splice(index,1)
                        projectiles.splice(projectileIndex,1)},0)
                    }
               
            }
          })

 })}
function spawnEnemy(){
    setInterval(()=>{
                      let x 
                      let y
        const radius=Math.random()*(26)+4;
                      if(Math.random()<0.5){
                        x=Math.random()<0.5 ?-radius:canvas.width+radius
                        y=Math.random()*canvas.height
                      }else{
                        y=Math.random()<0.5 ?-radius:canvas.height+radius
                        x=Math.random()*canvas.width
                      }
                       
                      const color='hsl('+Math.random()*360+',50%,50%)'
const angle =Math.atan2(canvas.height/2-y,canvas.width/2-x)

        enemies.push(new Enemy(x,y,radius,color,{x:Math.cos(angle),y:Math.sin(angle)})) 
    },1000)
}

 window.addEventListener("click",function(event){
    const angle =Math.atan2(event.clientY-canvas.width/2,event.clientX-canvas.height/2)
     projectiles.push(new Projectile(x,y,5,'white',{x:Math.cos(angle)*5,y:Math.sin(angle)*5}))
     
    
 })
document.querySelector("#start").addEventListener("click",function(){
    init()
    animate() 
    spawnEnemy()
   model.style.display = "none"
})
