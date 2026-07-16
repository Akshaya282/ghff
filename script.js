// ===========================
// GAME VARIABLES
// ===========================

let difficulty = "";
let score = 0;
let health = 100;
let packetsRouted = 0;
let targetPackets = 0;
let stackSize = 0;

let currentPacket = null;
let packetQueue = [];

let firewallActive = false;
let dynamicRoutingActive = false;
let trafficFreezeActive = false;

let stackOverflowCount = 0;
let gameRunning = false;

let serverList = [];
let packetTypes = [];


// ===========================
// PACKET DESTINATIONS
// ===========================

let routingPolicy = {};


// ===========================
// BUTTONS
// ===========================

const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");

const instructionBtn = document.getElementById("instruction-btn");
const backBtn = document.getElementById("back-btn");


// ===========================
// MAIN MENU BUTTONS
// ===========================

easyBtn.onclick = () => startGame("Easy");
mediumBtn.onclick = () => startGame("Medium");
hardBtn.onclick = () => startGame("Hard");

instructionBtn.onclick = () => {

    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("instructions-page").classList.remove("hidden");

};

backBtn.onclick = () => {

    document.getElementById("instructions-page").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");

};


// ===========================
// START GAME
// ===========================

function startGame(level){

    difficulty = level;

    if(level === "Easy"){

        stackSize = 10;
        targetPackets = 50;

        serverList = ["Server A","Server B","Server C"];

        packetTypes = ["HTTP","DNS","VoIP","HTTPS","MALWARE"];

    }

    else if(level === "Medium"){

        stackSize = 6;
        targetPackets = 100;

        serverList = ["Server A","Server B","Server C","Server D"];

        packetTypes = [
            "HTTP","DNS","VoIP",
            "HTTPS","FTP",
            "SMTP","MALWARE"
        ];

    }

    else{

        stackSize = 3;
        targetPackets = 150;

        serverList = [
            "Server A",
            "Server B",
            "Server C",
            "Server D",
            "Server E"
        ];

        packetTypes = [

            "HTTP",
            "HTTPS",
            "DNS",
            "VoIP",
            "FTP",
            "SMTP",
            "DHCP",
            "SSH",
            "DATABASE",
            "VIDEO",
            "MALWARE"

        ];

    }

    createRoutingTable();

    createServers();

    fillQueue();

    updateUI();

    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");

    gameRunning = true;

    startRandomEvents();

}


// ===========================
// ROUTING TABLE
// ===========================

function createRoutingTable(){

    routingPolicy = {

        HTTP:"Server A",
        HTTPS:"Server A",

        VoIP:"Server B",
        VIDEO:"Server B",

        DNS:"Server C",

        FTP:"Server D",
        SMTP:"Server D",

        DATABASE:"Server E",

        DHCP:"Server E",
        SSH:"Server E",

        MALWARE:"DROP BOX"

    };

    let table = document.getElementById("routing-table");

    table.innerHTML = "";

    for(let packet in routingPolicy){

        let row = document.createElement("tr");

        row.innerHTML =

        `<td>${packet}</td>
        <td>${routingPolicy[packet]}</td>`;

        table.appendChild(row);

    }

}


// ===========================
// SERVERS
// ===========================

function createServers(){

    let serverDiv = document.getElementById("servers");

    serverDiv.innerHTML = "";

    serverList.forEach((server,index)=>{

        let box = document.createElement("div");

        box.className = "server";

        box.innerHTML =

        `<h3>${index+1}. ${server}</h3>
        <p class="online">ONLINE</p>`;

        serverDiv.appendChild(box);

    });

}


// ===========================
// PACKETS
// ===========================

function generatePacket(){

    return packetTypes[Math.floor(Math.random()*packetTypes.length)];

}


function fillQueue(){

    while(packetQueue.length < stackSize){

        packetQueue.push(generatePacket());

    }

    currentPacket = packetQueue[0];

}


// ===========================
// UI UPDATE
// ===========================

function updateUI(){

    document.getElementById("difficulty").textContent =
    "Difficulty : " + difficulty;

    document.getElementById("score").textContent =
    "Score : " + score;

    document.getElementById("health").textContent =
    "Health : " + health + "%";

    document.getElementById("routed").textContent =
    "Packets Routed : " + packetsRouted;

    document.getElementById("target").textContent =
    "Target : " + targetPackets;

    document.getElementById("stack").textContent =
    "Stack : " + packetQueue.length + "/" + stackSize;


    document.getElementById("current-packet").textContent =
    currentPacket;


    let destination =
    routingPolicy[currentPacket];

    document.getElementById("current-destination").textContent =
    "Destination : " + destination;



    let list = document.getElementById("packet-stack");

    list.innerHTML = "";

    packetQueue.forEach(packet=>{

        let item = document.createElement("li");

        item.textContent = packet;

        list.appendChild(item);

    });

}


// ===========================
// ROUTE PACKET
// ===========================

function routePacket(choice){

    if(!gameRunning) return;


    let destination = routingPolicy[currentPacket];


    if(currentPacket === "MALWARE"){

        if(choice === 0){

            score += 15;

        }

        else{

            health -= 15;

        }

    }

    else{

        let correctServer =
        serverList.indexOf(destination) + 1;


        if(choice === correctServer){

            score += 10;
            packetsRouted++;

        }

        else{

            health -= 10;

        }

    }


    packetQueue.shift();

    packetQueue.push(generatePacket());

    currentPacket = packetQueue[0];


    checkGameStatus();

    updateUI();

}


// ===========================
// KEYBOARD CONTROLS
// ===========================

document.addEventListener("keydown",(event)=>{


    if(!gameRunning) return;


    if(event.key === "1") routePacket(1);
    if(event.key === "2") routePacket(2);
    if(event.key === "3") routePacket(3);
    if(event.key === "4") routePacket(4);
    if(event.key === "5") routePacket(5);

    if(event.key === "0") routePacket(0);


    // Firewall

    if(event.key.toLowerCase() === "f"){

        activateFirewall();

    }

    // Dynamic Routing

    if(event.key.toLowerCase() === "r"){

        activateDynamicRouting();

    }

    // Traffic Freeze

    if(event.key.toLowerCase() === "t"){

        activateTrafficFreeze();

    }


});


// ===========================
// ABILITIES
// ===========================

function activateFirewall(){

    firewallActive = true;

    document.getElementById("network-event").textContent =
    "Firewall Activated!";

}


function activateDynamicRouting(){

    dynamicRoutingActive = true;

    document.getElementById("network-event").textContent =
    "Dynamic Routing Activated!";

}


function activateTrafficFreeze(){

    trafficFreezeActive = true;

    document.getElementById("network-event").textContent =
    "Traffic Freeze Activated!";

}


// ===========================
// RANDOM EVENTS
// ===========================

const events = [

    "Congestion",

    "DDoS Attack",

    "Bandwidth Reduction",

    "Packet Loss",

    "No Active Events"

];


function startRandomEvents(){

    setInterval(()=>{

        if(!gameRunning) return;

        let randomEvent =
        events[Math.floor(Math.random()*events.length)];


        document.getElementById("network-event").textContent =
        randomEvent;


        if(randomEvent === "Congestion"){

            health -= 5;

        }

        else if(randomEvent === "DDoS Attack"){

            health -= 8;

        }

        else if(randomEvent === "Bandwidth Reduction"){

            health -= 3;

        }

        else if(randomEvent === "Packet Loss"){

            health -= 2;

        }


        checkGameStatus();
        updateUI();


    },10000);

}



// ===========================
// GAME STATUS
// ===========================

function checkGameStatus(){


    if(health <= 0){

        loseGame();

    }


    if(packetsRouted >= targetPackets){

        winGame();

    }

}



function winGame(){

    gameRunning = false;

    document.getElementById("game-container").classList.add("hidden");

    document.getElementById("game-over").classList.remove("hidden");

    document.getElementById("game-result").textContent =
    "MISSION SUCCESS";

    document.getElementById("final-score").textContent =
    "Final Score : " + score;

}



function loseGame(){

    gameRunning = false;

    document.getElementById("game-container").classList.add("hidden");

    document.getElementById("game-over").classList.remove("hidden");

    document.getElementById("game-result").textContent =
    "NETWORK FAILURE";

    document.getElementById("final-score").textContent =
    "Final Score : " + score;

}
