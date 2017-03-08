 //floor units number
    var flourWidth = 10;
    var flourHeight = 10;

    //one unit size
    var unitWidth  = 20;
    var unitHeight = 20;
    //css variables
    var roomColor =  "#FFFFDD";
    var borderStyle = "2px solid #D8D3C3";
    //define the section thats hold the map
    document.getElementById("mapSection").style.width = flourWidth * unitWidth +"px";
    document.getElementById("mapSection").style.height = flourHeight * unitHeight+"px";

    //create net of canvases units, give each one of theme id, and add them to the MapSection.
    for(var i = 0;i<flourWidth;i++){
        for(var j = 0;j<flourHeight;j++){
            var newUnit= document.createElement("canvas");
            newUnit.className = "mapUnit";
            newUnit.id = "x"+j+"y"+i;
            document.getElementById("mapSection").appendChild(newUnit);
            document.getElementById("x"+j+"y"+i).setAttribute("type","corridor");
         }
     }



    //create room whithout a room border
    function createRooms(roomsData){
        console.log(roomsData);
        roomsData.forEach(function (room) {
            console.log(room);
            room.zones.forEach(function (zone) {
                for(var i = zone.topLeftY; i < zone.topLeftY + zone.heightUnit;i++){
                    for(var j = zone.topLeftX; j < zone.topLeftX + zone.widthUnit;j++){
                        if(room.type==="room"){
                            document.getElementById("x"+j+"y"+i).style.background = roomColor;
                        }
                        else if(room.type==="empty"){
                            document.getElementById("x"+j+"y"+i).style.background ="black";
                        }
                        document.getElementById("x"+j+"y"+i).setAttribute("name",room.id);
                        document.getElementById("x"+j+"y"+i).setAttribute("type",room.type);
                    }
                }
            })
        });
    }

    function  createBorder(roomsData) {
        roomsData.forEach(function (room) {
            room.zones.forEach(function (zone) {
                for(var i = zone.topLeftY; i < zone.topLeftY + zone.heightUnit;i++){
                    for(var j = zone.topLeftX; j < zone.topLeftX + zone.widthUnit;j++){
                        var unit =  document.getElementById("x"+j+"y"+i);
                        var unitName = unit.getAttribute("name");
                        var context  = unit.getContext('2d');
                        //up
                        if(document.getElementById("x"+j+"y"+(i-1)).getAttribute("name") !== room.id){
                            unit.style.borderTop = borderStyle;
                        }
                        //left
                        if(document.getElementById("x"+(j-1)+"y"+i).getAttribute("name") !== room.id){
                           unit.style.borderLeft = borderStyle;
                        }
                        //down
                        if(document.getElementById("x"+j+"y"+(i+1)).getAttribute("name") !== room.id){
                            unit.style.borderBottom = borderStyle;
                        }
                        //right
                        if(document.getElementById("x"+(j+1)+"y"+i).getAttribute("name") !== room.id){
                              unit.style.borderRight = borderStyle;
                        }
                    }
                }
            });

            //drawing the room entrance
            room.entrance.forEach(function (entrance) {
                var unit =  document.getElementById("x"+entrance.x+"y"+entrance.y);
                var context  = unit.getContext('2d');
                switch(entrance.direction) {
                    case "left":
                        unit.style.borderLeft ="none";
                        break;
                    case "right":
                        unit.style.borderRight="none";
                        break;
                    case "up":
                        unit.style.borderTop = "none";
                        break;
                    case "down":
                        unit.style.borderBottom="none";
                        break;
                    default:
                }
            })
        })
    }



 function getJson() {
     var myXMLhttpReq = new XMLHttpRequest(),
         method = "GET",
         url = "data.json";
     myXMLhttpReq.open(method, url, true);
     myXMLhttpReq.onreadystatechange = function() {
         if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
             var dataMap = JSON.parse(myXMLhttpReq.responseText);
             dataMap = dataMap.map;
             createRooms(dataMap);
             createBorder(dataMap);
         }
     };
     myXMLhttpReq.send();
 }
 getJson();
// console.log(dataMap);
