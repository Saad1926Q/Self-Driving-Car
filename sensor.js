class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5; //The sensor will cast rays in different directions
        this.rayLength=150; //Usually sensors have a range after which they dont work
        this.raySpread=Math.PI/2; // 90 degrees
        this.rays=[]
        this.readings=[]//is there is a border there or not and how far is it
    }

    update(roadBorders,traffic){
        this.#castRays();
        this.readings=[];
        for (let i = 0; i <this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i],roadBorders,traffic)
            )
            
        }
    }

    #getReading(ray,roadBorders,traffic){
        let touches=[];

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0], 
                roadBorders[i][1]
            )
            if(touch){
                touches.push(touch)
            }
            
        }

        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon
            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j], 
                    poly[(j+1)%poly.length]
                )
                if(value){
                    touches.push(value)
                }
                
            }
            
        }

        if(touches.length===0){
            return null;
        }else{
            //offset means how far the point is from the ray[0] ie centre of car
            const offsets = touches.map(element=>element.offset)

            //from these offsets we need the minimum one

            const minOffset=Math.min(...offsets);
            return touches.find(element=>element.offset===minOffset)

        }
    }

    #castRays(){
        this.rays=[]
        for (let i = 0; i < this.rayCount; i++) {
            const rayAngle=lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount===1?0.5:i/(this.rayCount-1)
            )+this.car.angle

            const start ={x:this.car.x,y:this.car.y}
            const end ={
                x:this.car.x-Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-Math.cos(rayAngle)*this.rayLength
            }

            this.rays.push([start,end])

        }
    }

    draw(ctx){

        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1]
            if(this.readings[i]){
                end=this.readings[i]
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle='yellow';
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            
            ctx.stroke()

            //To visualize where the line would have continued

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle='black';
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            
            ctx.stroke()
        }
    }
}