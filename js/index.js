var socket = io('https://gps-250305.appspot.com/');
var config = {
  apiKey: "AIzaSyBlfFaGBx7B_nBnlR29yhJAr6kPjqAdLfo",
  authDomain: "test-84ae7.firebaseapp.com",
  databaseURL: "https://test-84ae7.firebaseio.com",
  projectId: "test-84ae7",
  storageBucket: "test-84ae7.appspot.com",
  messagingSenderId: "762464277938"
};

firebase.initializeApp(config);
var database = firebase.database();
var earthLocationRefs = firebase.database().ref('earthlocations');
earthLocationRefs.on('value', function(snapshot) {
  allLocations=snapshot.val()
  // console.log(allLocations)
});
var myId
var lastId = localStorage.getItem('generative_geo_id')
var lastIdTime = localStorage.getItem('generative_geo_id_time')
if (lastId && (Date.now()-lastIdTime<60*1000)){
  console.log("Old Id Detected! use " + lastId)
  myId = lastId
  localStorage.setItem('generative_geo_id_time',Date.now())
}else{
  myId = earthLocationRefs.push().key;
  
  console.log("Generate new id " + myId)
  localStorage.setItem('generative_geo_id',myId)
  localStorage.setItem('generative_geo_id_time',Date.now())
}

//tone/js

window.addEventListener("click",function(){
  Tone.context.resume()
})


var allLocations = {};

var gp={}
var mWidth,mHeight

var osc, envelope, fft;
var oscs = [];
var mymap 
mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbms4OTA0MTciLCJhIjoiY2pxbGlpbGR3MDloNDQycDV5ZHhvaG15OCJ9.NP8xhblzl_SGO9wYcYcp4A';

var lightUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
var darkUrl = "https://maps.tilehosting.com/styles/darkmatter/{z}/{x}/{y}.png?key=H1rAD56hrb351PF4KpAV"
var onlineStart = Date.now()
function setup(){

  frameRate(30)
  createCanvas(windowWidth,windowHeight)
  mWidth = windowWidth-50
  mHeight = windowHeight-100
  textAlign(CENTER)
	// mymap = L.map('mapid').setView([40.64, -74], 2);
	// L.tileLayer(lightUrl, {
	// 	maxZoom: 18,
	// 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
	// 		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
	// 		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	// 	id: 'mapbox.streets'
	// }).addTo(mymap);
  
  // var synth = new Tone.MonoSynth({
  //   "oscillator" : {
  //     "type" : "square"
  //  },
  //  "envelope" : {
  //   "attack" : 0.1
  //  }
  // }).toMaster();
  // synth.triggerAttackRelease("C4", "8n");
//  var CanvasLayer = L.GridLayer.extend({
//     createTile: function(coords){
//         // create a <canvas> element for drawing
//         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
//         // setup tile width and height according to the options
//         var size = this.getTileSize();
//         tile.width = size.x;
//         tile.height = size.y;
//         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
//         var ctx = tile.getContext('2d');
//         // return the tile so it can be rendered on screen
//         return tile;
//     }
// }).addTo(mymap);
//   osc = new p5.SinOsc();

//   // Instantiate the envelope
//   envelope = new p5.Env();

//   // set attackTime, decayTime, sustainRatio, releaseTime
//   envelope.setADSR(0.001, 0.5, 0.1, 0.5);

//   // set attackLevel, releaseLevel
//   envelope.setRange(1, 0);

//   osc.start();
  
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight)
  mWidth = windowWidth-50
  mHeight = windowHeight-100
  
}
function getPos(a,b){
  return {
    x: map(a/1.02-10,-180,180,0,mWidth)+25,
    y: map(b/0.96-1,-90,90,0,mHeight)+50
  }
}
var beep = new Audio("https://monoame.com/2019/gps/beep.mp3")

let counter = 0
socket.on("osc",function(data){
  // console.log(JSON.parse(data.args[0].value).id)
  if (data.address=="/gps/trigger"){
    let scanId = JSON.parse(data.args[0].value).id
    // console.log(scanId)
    if (scanId==myId){
      // background(255)
      counter=0
      beep.currentTime=0
      beep.play()
    }
  }
})

function getShowId(){
  return "A" + (myId.split("").map(ch=>ch.charCodeAt(0)).reduce((a,b)=>(a*b),1) % 1000)
}
function draw(){
  counter++
  textSize(10)
  fill(255)
  background(255/counter,50)
  stroke(255,5)
  
  let span = 30
  
  for(var i=0;i<height;i+=span){
      line(0,i,width,i)
  }
  for(var i=0;i<width;i+=span){
    line(i,0,i,height)
  }
  
  push()
    stroke(255)
    strokeWeight(15)
    noFill()
    rect(0,0,width,height)
  pop()
  
  textAlign(CENTER)
  
  
  translate(width/2,height/2)
    
  
  textSize(16)
  fill(255,255)
  text("You are",0,10)
  fill(255,100)
  textSize(25)
  let showId = getShowId()
  text(showId,0,50)
  
  push()
    let useR = 6
    translate(0,-100)
    scale(5)
    fill(255,0,0)
    // text(myId,0,30)
    useR=5+ sin(frameCount/(10+gp.lon/100))*2
    push()
      
      stroke(255,200)
      rectMode(CENTER)
      rotate(frameCount/10)
      noFill()
      rect(0,0,16,16)
  
    pop()
    textSize(3)
    noStroke()
    text("// ACTIVE "+(frameCount % 10 <5?".":"")+"\nID: "+myId.slice(-10),10,-20) 
    ellipse(0,0,useR,useR)
  pop()
//   for(var i=-180;i<=180;i+=10){
//     let p1 = getPos(i,-90)
//     let p2 = getPos(i,90)
//     stroke(i==0?'white':60)
//     line(p1.x,p1.y,p2.x,p2.y)
//     fill(255)
//     text(i,p2.x,p2.y+20)
    
//   }
//    for(var o=-180;o<=180;o+=10){
//     let p1 = getPos(-180,o)
//     let p2 = getPos(180,o)
//     stroke(o==0?'white':60)
//     line(p1.x,p1.y,p2.x,p2.y)
//     fill(255)
//     text(o,p2.x,p2.y+20)
    
//   }
  if (gp){
    textSize(14)
    let onlineFor = parseInt((Date.now() - onlineStart)/1000)
    text(`經度 lon: ${gp.lon} \n 緯度 lat: ${gp.lat}\n\nOnline For: ${onlineFor} s`,0,100)
  }
//   if (gp){
//     push()
//       textAlign(LEFT)
//       text(JSON.stringify(gp),25,25)
//     pop()
//     let gpLoc = getPos(gp.lon,-gp.lat)
//     fill(255,0,0)
    
//     ellipse(gpLoc.x,gpLoc.y,sin(frameCount/10)*1+5)
//   }
  if (frameCount % 100==0){
    gp.timeStamp=Date.now()
    localStorage.setItem('generative_geo_id_time',Date.now())
    gp.date = Date(Date.now())
    gp.leave = false
    gp.showId = getShowId()
    earthLocationRefs.child(myId).set(gp)
  }
}

var x = document.getElementById("demo");
var watchID = navigator.geolocation.watchPosition(showPosition);
navigator.permissions.query({
    name: 'geolocation'
  }).then(function(result) {
  alert('hello?');
  if (result.state == 'granted') {
      //report(result.state);
      //geoBtn.style.display = 'none';
      alert('granted!');
      watchID = navigator.geolocation.watchPosition(showPosition);
  } else if (result.state == 'prompt') {
      //report(result.state);
      //geoBtn.style.display = 'none';
      alert('prompt!');
      //watchID = navigator.geolocation.watchPosition(showPosition);
      //navigator.geolocation.getCurrentPosition(revealPosition, positionDenied, geoSettings);
  } else if (result.state == 'denied') {
      //report(result.state);
      //geoBtn.style.display = 'inline';
      alert('denied!');
  }
  result.onchange = function() {
      alert(result.state);
  }
});
var initPos = false
function showPosition(position) {
  gp=  {
    key: myId,
    showId: getShowId(),
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    timeStamp: Date.now(),
    date: Date(Date.now())
  }
  earthLocationRefs.child(myId).set(gp)
  if (!initPos ){
    if (gp.lat){

      mymap.setView([gp.lat,gp.lon],3)
      initPos=true
    }
  }
}
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//      showPosition(position)
//     }, function() {
//     });
//   } else {
//     // Browser doesn't support Geolocation
//   }


window.onbeforeunload = function (e) {
  earthLocationRefs.child(myId).child("leave").set(true)
}