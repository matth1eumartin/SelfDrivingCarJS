const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road=new Road(carCanvas.width/2,carCanvas.width*0.9);


/*fully auto brain - bestBrain: "{\"levels\":[{\"inputs\":[0,0,0,0.05187947192859421,0.48688086773920214],\"outputs\":[1,1,0,0,0,1],\"biases\":
[-0.6557555313187754,-0.0673260837721323,0.031115568254061268,0.44253137858103,-0.13748279018909304,-0.5991094640377388],
"weights\":[[0.04291496680732415,-0.4519641635189934,0.07436122839883633,0.11797870609254382,0.3922753926319567,0.2434958764935374],[-0.003173267704037603,
-0.23429100732621982,-0.078860320368965,-0.5094238848145836,-0.07792299793791292,0.5661398593679451],
[-0.6007651710035398,0.1157264034027923,-0.12049350351989416,-0.08251572804819425,-0.2611873993978812,0.013361710810026087],
[-0.4332955934462855,0.1234258685485159,0.4159787737207994,0.027419878304659362,-0.2870310931871308,-0.4234864626138212],[0.03398748937534875,0.26879571650535594,
-0.03295938000180389,-0.30936595987047033,-0.4936242064925807,-0.2908758237904383]]},{\"inputs\":[1,1,0,0,0,1],\"outputs\":[1,0,0,0],\
"biases\":[-0.04714849053255121,0.15360631594077082,-0.32162722816397515,0.38126104027407104],\"weights\":[[0.3745981469063016,0.009251851237489218,-0.21284871822564744,
0.2855728934078722],[-0.16591541414365515,-0.030639654342975883,-0.22396113734215606,-0.20101063736186311],[-0.012570450661901947,0.21936817620879007,-0.17403305193298488,
-0.03367394193961183],[-0.6247778030263363,0.07849502425198462,-0.3666344616362335,0.35198497506535886],[0.36411611072340655,0.13062022455356745,0.47238201142452235,
-0.10694080656693675],[0.20647983240634277,-0.009429818069549342,-0.13082603416878544,-0.35195466827790517]]}]}"
length: 1*/


const N = 2;
const cars= generateCars(N)
let bestCar = cars[0]; 
if(localStorage.getItem("bestBrain")){
    for(let i = 0; i < cars.length; i++) {
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0) {
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(0),-100,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1),-300,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-300,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-500,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(0),-500,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1),-700,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-700,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1),-900,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(0),-900,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-1100,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(0),-1100,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1),-1300,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1),-1300,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-1500,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(1),-1700,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(0),-1900,30,50, "DUMMY", 2),
    new Car(road.getLaneCenter(2),-1900,30,50, "DUMMY", 2)
];


animate();

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain")
}

function generateCars(N){
    const cars = [];
    for(let i = 1; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars
}

function animate(time){
    for(let i=0; i<traffic.length;i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0; i<cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue",true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}