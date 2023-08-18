class Spyrograph {

    constructor(canvas) {
        this.canvas = canvas;

        /** @type {CanvasRenderingContext2D} */
        this.context = canvas.getContext("2d");
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
        if (actualPoint.drawConectLine && previousPoint.history) {
            for (let i = 0; i < actualPoint.history.length; i++) {
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

            for (let i = 0; i < this.points.length; i++) {
                const actualPoint = this.points[i];
                const previousPoint = this.points[i - 1]
                    ? this.points[i - 1]
                    : centerPoint;

                this.drawPoint(actualPoint, previousPoint);
                this.drawLine(actualPoint);
                this.drawConectLines(actualPoint, previousPoint)
            }

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
                drawConectLine,
                history: []
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
            drawConectLine,
            history: []
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