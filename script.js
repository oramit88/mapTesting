 //floor units number
    var flourWidth = 10;
    var flourHeight = 10;

    //one unit size
    var unitWidth  = 20;
    var unitHeight = 20;
    //css variables
    var borderStyle = "2px solid #D8D3C3";
    //define the section thats hold the map
    var mapSection =   document.getElementById("mapSection");
    mapSection.style.width = flourWidth * unitWidth +"px";
    mapSection.style.height = flourHeight * unitHeight+"px";

    //create net of canvases units, give each one of theme id, and add them to the MapSection.
    for(var i = 0;i<flourWidth;i++){
        for(var j = 0;j<flourHeight;j++){
            var newUnit = document.createElement("canvas");
            newUnit.className = "mapUnit";
            newUnit.id = "x"+j+"y"+i;
            mapSection.appendChild(newUnit);
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
                        var cell =  document.getElementById("x"+j+"y"+i);
                        cell.className = cell.className+" "+room.type;
                        cell.setAttribute("name",room.id);
                        cell.setAttribute("type",room.type);
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
                        var neighborCell = document.getElementById("x"+j+"y"+(i-1));
                        if(null !== neighborCell){
                            if(neighborCell.getAttribute("name") !== room.id){
                                unit.style.borderTop = borderStyle;
                            }
                        }
                        else{
                            unit.style.borderTop = borderStyle;
                        }

                        //left
                        neighborCell = document.getElementById("x"+(j-1)+"y"+i);
                        if(null !== neighborCell){
                            if(neighborCell.getAttribute("name") !== room.id){
                                unit.style.borderLeft = borderStyle;
                            }
                        }
                        else{
                            unit.style.borderLeft = borderStyle;
                        }

                        //down
                        neighborCell = document.getElementById("x"+j+"y"+(i+1));
                        if(null !== neighborCell){
                            if(neighborCell.getAttribute("name") !== room.id){
                                unit.style.borderBottom = borderStyle;
                            }
                        }
                        else{
                            unit.style.borderBottom = borderStyle;
                        }

                        //right
                        neighborCell = document.getElementById("x"+(j+1)+"y"+i);
                        if(null !== neighborCell){
                            if(neighborCell.getAttribute("name") !== room.id){
                                unit.style.borderRight = borderStyle;
                            }
                        }
                        else{
                            unit.style.borderRight = borderStyle;
                        }
                    }
                }
            });

            //drawing the room entrance
            if(room.entrance !== undefined){
                room.entrance.forEach(function (entrance) {
                    var unit =  document.getElementById("x"+entrance.x+"y"+entrance.y);
                    var context  = unit.getContext('2d');
                    switch(entrance.direction) {
                        case "left":
                            unit.style.borderLeft = "none";
                            break;
                        case "right":
                            unit.style.borderRight ="none";
                            break;
                        case "up":
                            unit.style.borderTop = "none";
                            break;
                        case "down":
                            unit.style.borderBottom = "none";
                            break;
                        default:
                    }
                })
            }

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
