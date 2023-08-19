const canvas = document.querySelector("#canvas");
const spyrograph = new Spyrograph(canvas);
spyrograph.play();

let pointIdIncrement = 1;
const points = [];

function getPoint(id) {
    return points.filter(p => p.id === id)[0];
}

function getPointData(id) {
    return {
        velocity: document.querySelector(`#point-speed-${id}`).value,
        radius: document.querySelector(`#point-distance-${id}`).value,
        direction: document.querySelector(`#point-direction-${id}`).checked,
        drawLine: document.querySelector(`#point-line-${id}`).checked,
        drawConectLine: document.querySelector(`#point-connection-${id}`).checked,
        color: document.querySelector(`#point-color-${id}`).value
    };
}

function removePoint(id) {
    const { index } = getPoint(id);
    spyrograph.removePoint(index);
    document.querySelector(`#point-container-${id}`).parentElement.removeChild(document.querySelector(`#point-container-${id}`))
}

function editPoint(id) {
    const { index } = getPoint(id);

    const pointData = getPointData(id);

    spyrograph.editPoint(index, pointData);
}

function addPoint() {

    const id = pointIdIncrement;
    pointIdIncrement += 1;

    const container = document.createElement("div");
    container.classList.add('w-100');
    container.classList.add('d-flex')
    container.classList.add('flex-column')
    container.classList.add('p-3')
    container.classList.add('mb-3')
    container.classList.add('border-secondary')
    container.classList.add('border')
    container.classList.add('rounded')
    
    container.id = `point-container-${id}`;

    container.innerHTML = `
        <label for="point-speed-${id}" class="form-label">Velocidade</label>
        <input type="range" class="form-range" min="0" max="1" step="0.01" id="point-speed-${id}" onchange="editPoint(${id})">

        <label for="point-distance-${id}" class="form-label">Distância</label>
        <input type="range" class="form-range" min="0" max="50" step="1" id="point-distance-${id}" onchange="editPoint(${id})">

        <div class="d-flex flex-row" style="width:15rem">

            <div class="w-75">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="point-direction-${id}" onchange="editPoint(${id})">
                    <label class="form-check-label" for="point-direction-${id}">
                        Sentido horário
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" checked="true" type="checkbox" id="point-line-${id}" onchange="editPoint(${id})">
                    <label class="form-check-label" for="point-line-${id}">
                        Desenha rastro
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="point-connection-${id}" onchange="editPoint(${id})">
                    <label class="form-check-label" for="point-connection-${id}">
                        Desenha conexões
                    </label>
                </div>
            </div>

            <div class="w-25">
                <label for="point-color-${id}" class="form-label">Cor</label>
                <input type="color" class="form-control form-control-color" id="point-color-${id}" onchange="editPoint(${id})"
                    value="#ffffff" title="Escolha a cor do ponto">
            </div>

        </div>



        <div class="d-flex flex-row mt-3">

            <div class="me-auto">
                <button class="btn btn-success ${(id === 1 ? 'disabled' : '')}" id="point-arrow-up-${id}" >
                    <i class="fa fa-arrow-up"></i>
                </button>    
            
                <button class="btn btn-success" id="point-arrow-down-${id}">
                    <i class="fa fa-arrow-down"></i>
                </button>
            </div>

            <button class="btn btn-danger ms-auto" id="point-delele-${id}" onclick="removePoint(${id})">
                <i class="fa fa-trash"></i>
            </button>
        
        </div>`;

    document.querySelector("#modal-body").appendChild(container);

    const point = getPointData(id);
    const index = spyrograph.addPoint(point);
    points.push({ index, id });

}