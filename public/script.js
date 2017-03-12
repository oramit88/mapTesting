

//floor units number
    var domain = "http://localhost:3000";
    var flourWidth = 10;
    var flourHeight = 10;
    var floorUnitId = 54665;
     var dataMap;
    //one unit size
    const unitWidth  = 20;
    const unitHeight = 20;
    //css variables
    const borderStyle = "2px solid #D8D3C3";
    //define the section thats hold the map
    const mapSection  = document.getElementById("mapSection");
    mapSection.style.width = flourWidth * unitWidth +"px";
    mapSection.style.height = flourHeight * unitHeight+"px";

    //create net of canvases units, give each one of theme id, and add them to the MapSection.
    for(let i = 0;i<flourWidth;i++){
        for(let j = 0;j<flourHeight;j++){
            var newUnit = document.createElement("canvas");
            newUnit.className = "mapUnit";
            newUnit.id = "x"+j+"y"+i;
            mapSection.appendChild(newUnit);
            document.getElementById("x"+j+"y"+i).setAttribute("type","corridor");
         }
     }



    //create room whithout a room border
    function createRooms(roomsData){
      //  console.log(roomsData);
        roomsData.forEach(function (room) {
   //         console.log(room);
            room.zones.forEach(function (zone) {
                for(let i = zone.topLeftY; i < zone.topLeftY + zone.heightUnit;i++){
                    for(let j = zone.topLeftX; j < zone.topLeftX + zone.widthUnit;j++){
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
                for(let i = zone.topLeftY; i < zone.topLeftY + zone.heightUnit;i++){
                    for(let j = zone.topLeftX; j < zone.topLeftX + zone.widthUnit;j++){
                        var unit =  document.getElementById("x"+j+"y"+i);
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

 function generateCorridor() {
        for(let i = 0;i<flourWidth;i++){
            for(let j = 0;j<flourHeight;j++){
               let cell =  document.getElementById("x"+j+"y"+i);
               let type = cell.getAttribute('type');
               if(type === 'corridor'){
                   cell.setAttribute("name",floorUnitId+"x"+j+"y"+i);
               }
            }
        }

        for(let i = 0;i<flourWidth;i++){
            for(let j = 0;j<flourHeight;j++){
                let cell =  document.getElementById("x"+j+"y"+i);
                let type = cell.getAttribute('type');
                let unit;
                let cellUnitId = cell.getAttribute('name');
                if(type === 'corridor'){
                    unit =  document.getElementById("x"+j+"y"+i);
                    let entrance = [];
                    //up
                    let neighborCell = document.getElementById("x"+j+"y"+(i-1));
                    if(null !== neighborCell){
                        if(neighborCell.getAttribute('type') === 'corridor'){
                            entrance.push({
                                neighborId:neighborCell.getAttribute('name'),
                                approachable:1
                            });
                        }
                        else{
                            //checking if the neighbor cell is room entrance
                            if(neighborCell.style.borderBottom === 'none'){
                                entrance.push({
                                    neighborId:neighborCell.getAttribute('name'),
                                    approachable:1
                                });
                            }
                        }
                    }
                    //left
                    neighborCell = document.getElementById("x"+(j-1)+"y"+i);
                    if(null !== neighborCell){
                        if(neighborCell.getAttribute('type') === 'corridor'){
                            entrance.push({
                                neighborId:neighborCell.getAttribute('name'),
                                approachable:1
                            });
                        }
                        else{
                            if(neighborCell.style.borderRight === 'none'){
                                entrance.push({
                                    neighborId:neighborCell.getAttribute('name'),
                                    approachable:1
                                });
                            }
                        }
                    }
                    //down
                    neighborCell = document.getElementById("x"+j+"y"+(i+1));
                    if(null !== neighborCell){
                        if(neighborCell.getAttribute('type') === 'corridor'){
                            entrance.push({
                                neighborId:neighborCell.getAttribute('name'),
                                approachable:1
                            });
                        }
                        else{
                            if(neighborCell.style.borderTop === 'none'){
                                entrance.push({
                                    neighborId:neighborCell.getAttribute('name'),
                                    approachable:1
                                });
                            }
                        }
                    }
                    //right
                    neighborCell = document.getElementById("x"+(j+1)+"y"+i);
                    if(null !== neighborCell){
                        if(neighborCell.getAttribute('type') === 'corridor'){
                            entrance.push({
                                neighborId:neighborCell.getAttribute('name'),
                                approachable:1
                            });
                        }
                        else{
                            if(neighborCell.style.borderLeft === 'none'){
                                entrance.push({
                                    neighborId:neighborCell.getAttribute('name'),
                                    approachable:1
                                });
                            }
                        }
                    }

                    let corridor = {
                        spaceUnitId:cellUnitId,
                        width:1,
                        height:1,
                        coordX:j,
                        coordY:i,
                        accessibility:1,
                        parentId:floorUnitId,
                        type:'corridor',
                        entrance:entrance
                    };
                    dataMap.push(corridor);
                }

            }
        }
     console.log(typeof dataMap);
     console.log(dataMap);
    }

    function getJson() {
     var myXMLhttpReq = new XMLHttpRequest(),
         method = "GET",
         url = "data.json";
     myXMLhttpReq.open(method, url, true);
     myXMLhttpReq.setRequestHeader("Content-type", "application/json");
     myXMLhttpReq.onreadystatechange = function() {
         if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
             dataMap = JSON.parse(myXMLhttpReq.responseText);
             dataMap = dataMap.map;
             console.log(typeof dataMap);
             console.log(dataMap);
             createRooms(dataMap);
             createBorder(dataMap);
             generateCorridor();
             var from = "a";
             var to = "b";
            var mapData = {
                mapData:dataMap
            };
             httpCall(domain,"/api/v1/mapConsumer/getPatch/54665x1y5/54665x2y0/1",mapData);
         }
     };
     myXMLhttpReq.send();
 }


function httpCall(domain,apiCall,data){
    console.log(data);
    console.log(typeof data);
    $.ajax({
        url: domain+apiCall,
        crossDomain:true,
        type: 'GET',
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function(msg) {
         //   console.log(msg);
        },
        error:function (error) {
        //    console.log(error);
        }
    });
}

 getJson();
