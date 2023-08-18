class MathUtils {

    cycleDistance = 2 * Math.PI;

    // Unidade de velocidade é igual a voltas por segundo
    // Unidade de distancia é uma volta completa em torno do ponto pai
    // Unidade de tempo é segundos

    getDistance = (velocity, time) => {
        return velocity * time;
    }

    getVelocity = (distance, time) => {
        return (this.cycleDistance * distance) / time;
    }

    getTime = (distance, velocity) => {
        return (this.cycleDistance * distance) / velocity;
    }

    calcPencilPosition = (radius, distance, centerX, centerY) => {
        const x = radius * Math.cos((this.cycleDistance * distance)) + centerX;
        const y = radius * Math.sin((this.cycleDistance * distance)) + centerY;
        return { x, y };
    }

    calcCenterPoint = (canvas) => {
        return {
            x: canvas.width / 2,
            y: canvas.height / 2
        }
    }

}