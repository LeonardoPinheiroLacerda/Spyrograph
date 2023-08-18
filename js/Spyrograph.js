class Spyrograph {

    constructor(canvas) {
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.context = canvas.getContext("2d");
    }

    style = {
        backgroundColor: "rgb(0, 0, 0)",
    }

    mathUtils = new MathUtils();
    
    startTime = new Date().getTime();
    time = 0;

    pencilWidth = 1;

    points = [
        // {velocity: .1, radius: 400, direction: true, drawLine: true, color: 'white', lineWithParent: true, history: []},
        // {velocity: .2, radius: 200, direction: false, drawLine: true, color: 'white', lineWithParent: true, history: []},
    ]

    drawBackground = () => {
        const {width, height} = this.canvas;   

        this.context.fillStyle = this.style.backgroundColor;
        this.context.fillRect(0, 0, width, height);
        this.context.fill();        
    }    

    drawPencil = (x, y, color = 'black') => {
        
        this.context.beginPath();
        this.context.arc(x, y, this.pencilWidth, 0, 2 * Math.PI);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.closePath();
    }

    drawPoint = (actualPoint, previousPoint) => {
        let velocity = actualPoint.velocity;
        if(actualPoint.direction) {
            velocity = actualPoint.velocity * -1;
        }

        const distance = this.mathUtils.getDistance(velocity, this.time);

        let radius = actualPoint.radius;

        const {x, y} = this.mathUtils.calcPointPosition(
            radius, //Distancia do ponto pai
            distance, //Distancia percorrida durante o execução
            previousPoint.x, //Cordenada X do ponto pai
            previousPoint.y  //Cordenada Y do ponto pai
        );

        actualPoint.x = x;
        actualPoint.y = y;

        actualPoint.history.push({x, y});

        this.drawPencil(x, y,  actualPoint.color);
    }

    drawLine = (actualPoint) => {
        this.context.strokeStyle = actualPoint.color;
        if(actualPoint.drawLine){
            this.context.beginPath();
            actualPoint.history.forEach(({x, y}) => {
                this.context.lineTo(x, y);
            })
            this.context.stroke();
            this.context.closePath();
        }
    }

    drawConectLines = (actualPoint, previousPoint) => {
        if(actualPoint.lineWithParent && previousPoint.history){
            for(let i = 0; i < actualPoint.history.length; i ++) {
                this.context.beginPath();

                this.context.lineTo(previousPoint.history[i].x, previousPoint.history[i].y)
                this.context.lineTo(actualPoint.history[i].x, actualPoint.history[i].y)

                this.context.stroke();
                this.context.closePath();
            }
        }
    }

    drawFrame = () => {
        requestAnimationFrame((delta) => {
            //Determina o tamanho do frame
            this.canvas.width = canvas.clientWidth;
            this.canvas.height = canvas.clientHeight;

            //Determina tempo de execução em segundos
            this.time = (new Date().getTime() - this.startTime) / 1000;
    
            //Desenha frame
            this.drawBackground();

            const centerPoint = this.mathUtils.calcCenterPoint(canvas);
            this.drawPencil(centerPoint.x, centerPoint.y);

            for(let i = 0; i < this.points.length; i ++) {
                const actualPoint = this.points[i];
                const previousPoint = this.points[i - 1] 
                    ? this.points[i - 1] 
                    : centerPoint;

                this.drawPoint(actualPoint, previousPoint);
                this.drawLine(actualPoint);
                this.drawConectLines(actualPoint, previousPoint)
            }

            //Recalcula novo frame
            this.drawFrame();
        });
    }

    run = this.drawFrame;



}