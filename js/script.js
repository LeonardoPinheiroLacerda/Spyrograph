const canvas = document.querySelector("#canvas");
const spyrograph = new Spyrograph(canvas);
spyrograph.play();
spyrograph.setPoints(
    [
        { velocity: .1, radius: 400, direction: true, drawLine: true, color: 'white', drawConectLine: true },
        { velocity: .2, radius: 200, direction: false, drawLine: true, color: 'white', drawConectLine: true },
    ]
);