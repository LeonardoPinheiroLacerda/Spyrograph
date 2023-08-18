class Spyrograph {

    constructor(canvas) {
        this.canvas = canvas;

        /** @type {CanvasRenderingContext2D} */
        this.context = canvas.getContext("2d");
    }

    debugOption = {
        enabled: false,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        fontColor: 'black',
        fontFamily: 'Monospace',
        fontSize: 20,


        box: {
            x: 20,
            y: 20,
            margin: 10,
            lineSpacing: 5
        }
    }

    mathUtils = new MathUtils();

    backgroundColor = "rgb(0, 0, 0)";

    startTime = new Date().getTime();
    time = 0;
    pencilWidth = 1;

    points = [];

    isRunning;

    // Render functions

    drawBackground = () => {
        const { width, height } = this.canvas;

        this.context.fillStyle = this.backgroundColor;
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
        if (actualPoint.direction) {
            velocity = actualPoint.velocity * -1;
        }

        const distance = this.mathUtils.getDistance(velocity, this.time);

        let radius = actualPoint.radius;

        const { x, y } = this.mathUtils.calcPencilPosition(
            radius,             //Distancia do ponto pai
            distance,           //Distancia percorrida durante o execução
            previousPoint.x,    //Cordenada X do ponto pai
            previousPoint.y     //Cordenada Y do ponto pai
        );

        actualPoint.x = x;
        actualPoint.y = y;

        actualPoint.history.push({ x, y });

        this.drawPencil(x, y, actualPoint.color);
    }

    drawLine = (actualPoint) => {
        this.context.strokeStyle = actualPoint.color;
        if (actualPoint.drawLine) {
            this.context.beginPath();
            actualPoint.history.forEach(({ x, y }) => {
                this.context.lineTo(x, y);
            })
            this.context.stroke();
            this.context.closePath();
        }
    }

    drawConectLines = (actualPoint, previousPoint) => {

        //A partir do segundo ponto, pois o anterior tem um historico de percurso
        if (actualPoint.drawConectLine && previousPoint.history) {
            this.context.beginPath();

            for (let i = 0; i < actualPoint.history.length; i++) {
                this.context.lineTo(previousPoint.history[i].x, previousPoint.history[i].y)
                this.context.lineTo(actualPoint.history[i].x, actualPoint.history[i].y)
            }

            this.context.stroke();
            this.context.closePath();

        //Primeiro ponto da lista, pois o ponto pai é fixo
        }else if(actualPoint.drawConectLine){
            const {x, y} = this.mathUtils.calcCenterPoint(canvas);

            this.context.beginPath();

            for (let i = 0; i < actualPoint.history.length; i++) {
                this.context.lineTo(x, y)
                this.context.lineTo(actualPoint.history[i].x, actualPoint.history[i].y)
            }
            
            this.context.stroke();
            this.context.closePath();

        }


    }

    drawDebug = () => {

        if(this.debugOption.enabled) {

            const Ycoord = (line) => {
                return (this.debugOption.box.y + this.debugOption.fontSize + this.debugOption.box.margin) + (this.debugOption.fontSize + this.debugOption.box.lineSpacing) * line;
            }
            const Xcoord = (tab = false) => {
                return this.debugOption.box.x + this.debugOption.box.margin + (tab ? 10 : 0);
            } 

            this.context.beginPath();

            this.context.fillStyle = this.debugOption.backgroundColor;
            this.context.fillRect(this.debugOption.box.x, this.debugOption.box.y, 1200, (this.debugOption.box.margin * 2) + (this.debugOption.fontSize + this.debugOption.box.lineSpacing) * (this.points.length + 1));
            this.context.fill();

            this.context.font = `${this.debugOption.fontSize}px ${this.debugOption.fontFamily}`;
            this.context.fillStyle = this.debugOption.fontColor;
            this.context.fillText("Points:", Xcoord(false), Ycoord(0));
            for(let i = 0; i < this.points.length; i ++) {
                let point = this.points[i];
                this.context.fillText(`Velocity: ${point.velocity} | Radius: ${point.radius} | Direction: ${point.direction} | Color: ${point.color} | DrawLine: ${point.drawLine} | DrawConectLine: ${point.drawConectLine}`, Xcoord(true), Ycoord(1 + i));
            }

            


            this.context.closePath()

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

            for (let i = 0; i < this.points.length; i++) {
                const actualPoint = this.points[i];
                const previousPoint = this.points[i - 1]
                    ? this.points[i - 1]
                    : centerPoint;

                this.drawPoint(actualPoint, previousPoint);
                this.drawLine(actualPoint);
                this.drawConectLines(actualPoint, previousPoint)
            }

            this.drawDebug();

            //Recalcula novo frame
            if (this.isRunning) this.drawFrame();
        });
    }

    // Point manager function

    setPoints = (points) => {
        this.points = points;
        this.restart();
    }

    addPoint = ({ velocity, radius, direction, color, drawLine, drawConectLine }) => {
        this.points.push(
            {
                velocity,
                radius,
                direction,
                color,
                drawLine,
                drawConectLine
            }
        )
        this.restart();
    }

    editPoint = (index, { velocity, radius, direction, color, drawLine, drawConectLine }) => {
        this.points[index] = {
            velocity,
            radius,
            direction,
            color,
            drawLine,
            drawConectLine
        }

        this.restart();
    }

    removePoint = (index) => {
        const temp = [];

        this.points.forEach((p, i) => {
            if (i != index) {
                temp.push(p);
            }
        });

        this.points = temp;

        this.restart();
    }

    movePoint = (oldIndex, newIndex) => {
        const temp = [];

        this.points.forEach((p, i) => {
            if (i == oldIndex) {
                temp[newIndex] = p;
            } else if (i == newIndex) {
                temp[oldIndex] = p;
            } else {
                temp[i] = p;
            }
        });

        this.points = temp;

        this.restart();
    }

    // Play stop restart functions

    restart = () => {
        this.isRunning = true;
        this.startTime = new Date().getTime();
        this.points.forEach(p => p.history = []);
    }

    play = () => {
        this.restart();
        this.drawFrame();
    }

    stop = () => {
        this.isRunning = false;
    }

}