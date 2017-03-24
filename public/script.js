

    //floor units number
    var domain = "http://localhost:3000";
    var flourWidth;
    var flourHeight;
    var floorUnitId;
     var dataMap;
    //one unit size
    const unitWidth  = 60;
    const unitHeight = 60;
    //css variables
    const borderStyle = "2px solid #D8D3C3";
    //define the section thats hold the map
    const mapSection  = document.getElementById("mapSection");

    //create net of canvases units, give each one of theme id, and add them to the MapSection.
    function createFloor() {
        mapSection.style.width = flourWidth * unitWidth +"px";
        mapSection.style.height = flourHeight * unitHeight+"px";
        for(let i = 0;i<flourWidth;i++){
            for(let j = 0;j<flourHeight;j++){
                var newUnit = document.createElement("canvas");
                newUnit.className = "mapUnit";
                newUnit.id = "x"+j+"y"+i;
                mapSection.appendChild(newUnit);
                document.getElementById("x"+j+"y"+i).setAttribute("type","corridor");
            }
        }
    }

    //create room without a room border
    function createRooms(roomsData){
        roomsData.forEach(function (room) {
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

    function createBorder(i,j,room,unit,borderDirection) {
        var neighborCell = document.getElementById("x"+j+"y"+i);
        if(null !== neighborCell){
            if(neighborCell.getAttribute("name") !== room.id){
                unit.style[borderDirection] = borderStyle;
            }
        }
        else{
            unit.style[borderDirection] = borderStyle;
        }
    }

    //create room borders and create entrance border
    function  createBorders(roomsData) {
        roomsData.forEach(function (room) {
            room.zones.forEach(function (zone) {
                for(let i = zone.topLeftY; i < zone.topLeftY + zone.heightUnit;i++){
                    for(let j = zone.topLeftX; j < zone.topLeftX + zone.widthUnit;j++){
                        var unit =  document.getElementById("x"+j+"y"+i);
                        //up
                        createBorder((i-1),j,room,unit,"borderTop");
                        //left
                        createBorder(i,(j-1),room,unit,"borderLeft");
                        //down
                        createBorder((i+1),j,room,unit,"borderBottom");
                        //right
                        createBorder(i,(j+1),room,unit,"borderRight");
                    }
                }
            });

            //drawing the room entrance
            if(room.entrance !== undefined){
                room.entrance.forEach(function (entrance) {
                    var unit =  document.getElementById("x"+entrance.xExitPosition+"y"+entrance.yExitPosition);
                    switch(entrance.direction) {
                        case "left":
                            unit.style.borderLeft = "none";
                            unit.setAttribute("roomEntranceDirection","left"); //for connect the room to corridor at "generateCorridor" function
                            break;
                        case "right":
                            unit.style.borderRight ="none";
                            unit.setAttribute("roomEntranceDirection","right"); //for connect the room to corridor at "generateCorridor" function
                            break;
                        case "up":
                            unit.style.borderTop = "none";
                            unit.setAttribute("roomEntranceDirection","up"); //for connect the room to corridor at "generateCorridor" function
                            break;
                        case "down":
                            unit.style.borderBottom = "none";
                            unit.setAttribute("roomEntranceDirection","down"); //for connect the room to corridor at "generateCorridor" function
                            break;
                        default:
                     }
                })
            }

        })
    }

    //this function will add to each room in dataMap his neighbor list.
    //and in addition will create a corridor object with his neighbors details and add him to dataMap list of object.
    function updateMapObject() {
         //scanning the map and marking the corridor space units as unique name
        generateCorridorIds();

        for(let i = 0;i<flourWidth;i++){
            for(let j = 0;j<flourHeight;j++){
                let cell =  document.getElementById("x"+j+"y"+i);
                let type = cell.getAttribute('type');
                //creating a corridor object and adding his  neighbor to the him
                if(type === 'corridor'){
                    //wil scan the corridor 4 sids and add his neighbors to him and add him to dataMap object.
                    createCorridorObjects(i,j,cell);
                }
                else {
                    //the current cell is spaceUnit entrance
                    //will scan the spaceUnit entrance and connect the room entrance neighbor to the roomData in dataMap
                    updateSpaceUnitNeighbors(i,j,cell);
                }
            }
        }
    }

    //this function will mark the corridor elements on the map with a special attribute- "name: floorId+x,x",
    function generateCorridorIds() {
        for(let i = 0;i<flourWidth;i++){
            for(let j = 0;j<flourHeight;j++){
                let cell =  document.getElementById("x"+j+"y"+i);
                let type = cell.getAttribute('type');
                if(type === 'corridor'){
                    cell.setAttribute("name",floorUnitId+"x"+j+"y"+i);
                }
            }
        }
    }

    function createCorridorEntrance(i,j,entranceArray,borderDirection){
        let neighborCell = document.getElementById("x"+j+"y"+i);
        if(null !== neighborCell){
            if(neighborCell.getAttribute('type') === 'corridor'){
                entranceArray.push({
                    neighborId:neighborCell.getAttribute('name'),
                    approachable:1
                });
            }
            else{
                //checking if the neighbor cell is room entrance
                if(neighborCell.style[borderDirection] === 'none'){
                    entranceArray.push({
                        neighborId:neighborCell.getAttribute('name'),
                        approachable:1
                    });
                }
            }
        }
    }

    function createCorridorObjects(i, j, cell) {
        let type = cell.getAttribute('type');
        let cellUnitId = cell.getAttribute('name');
        let entranceArray = [];
        //up
        createCorridorEntrance(i-1,j,entranceArray,"borderBottom");
        //left
        createCorridorEntrance(i,j-1,entranceArray,"borderRight");
        //down
        createCorridorEntrance(i+1,j,entranceArray,"borderTop");
        //right
        createCorridorEntrance(i,j+1,entranceArray,"borderLeft");
        //creating the corridor object and add it to dataMap.
        let corridor = {
            id:cellUnitId,
            zones:[{
                widthUnit:1,
                heightUnit:1,
                topLeftX:j,
                topLeftY:i,
            }],
            accessibility:1,
            parentId:floorUnitId,
            type:'corridor',
            entrance:entranceArray
        };
        dataMap.push(corridor);
    }

    function updateSpaceUnitNeighbors(i,j,cell) {
        let cellUnitId = cell.getAttribute('name');
        let entrance = [];
        let roomEntranceDirection = cell.getAttribute('roomEntranceDirection');
        let neighborCell;
        switch (roomEntranceDirection){
            case "left":
                neighborCell = document.getElementById("x"+(j-1)+"y"+i);
                break;
            case "right":
                neighborCell = document.getElementById("x"+(j+1)+"y"+i);
                break;
            case "up":
                neighborCell = document.getElementById("x"+j+"y"+(i-1));
                break;
            case "down":
                neighborCell = document.getElementById("x"+j+"y"+(i+1));
                break;
            default:
        }
        if(neighborCell!==null && neighborCell!==undefined){
            entrance.push({
                neighborId:neighborCell.getAttribute('name'),
                approachable:1
            });

            //find the current room at the dataMap
            var spaceUnit = dataMap.find(function (spaceUnitObject) {
                return spaceUnitObject.id === cellUnitId
            });

            //connecting the room neighbor filed to the corridor object at dataMap
            if(spaceUnit !== null && spaceUnit !== undefined){
                let targetEntrance = spaceUnit.entrance.find(function (entry) { //find the entrance in dataMap
                    return entry.xExitPosition === j && entry.yExitPosition === i;
                });
                if(targetEntrance !== null && targetEntrance !== undefined){//successful result
                    targetEntrance.neighborId = entrance[0].neighborId;//todo change array entrance to object
                }
            }
        }
    }

    function getJson() {
     var myXMLhttpReq = new XMLHttpRequest(),
         method = "GET",
         url = "data.json";
     myXMLhttpReq.open(method, url, true);
     myXMLhttpReq.setRequestHeader("Content-type", "application/json");
     myXMLhttpReq.onreadystatechange = function() {
         if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
             var data = JSON.parse(myXMLhttpReq.responseText);
             var floorObject = data.floorObject;
             console.log(floorObject);
             dataMap = data.map;
             flourWidth = floorObject.zones[0].widthUnit;
             flourHeight = floorObject.zones[0].heightUnit;
             floorUnitId = floorObject.id;
             createFloor();
             createRooms(dataMap);
             createBorders(dataMap);
             updateMapObject();
             var dataToSend = {};
             dataToSend.floorObject = floorObject;
             dataToSend.floorSpaceUnits = dataMap;
            httpCall(domain,"/api/v1/mapProducer/floor",dataToSend,"POST");
         }
     };
     myXMLhttpReq.send();
    }

    function httpCall(domain,apiCall,data,type){
        console.log('send data:');
        console.log(data);
        console.log(typeof data);
        data = JSON.stringify(data);
        console.log(data);
        console.log(typeof data);
        $.ajax({
            url: domain+apiCall + "?floorData="+data,
            crossDomain:true,
            type: type,
            contentType: 'application/json; charset=utf-8',
            dataType: 'string',
            async: true,
            success: function(msg) {},
            error:function (error) {}
        });
    }

    getJson();
