
    //floor units number
    var flourWidth = 100;
    var flourHeight = 100;

    //one unit size
    var unitWidth  = 20;
    var unitHeight = 20;

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
            document.getElementById("x"+j+"y"+i).setAttribute("name","empty");
         }
     }

     //will contain all of the rooms== one floor
    var roomsData = [];
    var room = {
        id:"247",
        //entance- relative to the top-left of the Map section and not the top-left of the room
        entrance:[
            {
                x:2,
                y:1,
                direction:"up"
            },{
                x:1,
                y:4,
                direction:"down"
            }
        ],
        //eache of the zones, represents rectangle that consist from canvaces
        zones:[{
            topLeftX:1,
            topLeftY:1,
            widthUnit:3,
            heightUnit:2
        }, {
            topLeftX:1,
            topLeftY:3,
            widthUnit:1,
            heightUnit:2
        }]
    };
    var room2 = {
        id:"2000",
        entrance:[
            {
                x:5,
                y:3,
                direction:"left"
            }
        ],
        zones:[{
            topLeftX:5,
            topLeftY:3,
            widthUnit:4,
            heightUnit:2
        }]
    };

    //roomsData==1 floor
    roomsData.push(room);
    roomsData.push(room2);

    //create room whithout a room border
    function createRooms(roomsData){
        console.log(roomsData);
        roomsData.forEach(function (room) {
            console.log(room);
            room.zones.forEach(function (zone) {
                for(var i = zone.topLeftY; i < zone.topLeftY + zone.heightUnit;i++){
                    for(var j = zone.topLeftX; j < zone.topLeftX + zone.widthUnit;j++){
                        document.getElementById("x"+j+"y"+i).style.background = "yellow";
                        document.getElementById("x"+j+"y"+i).setAttribute("name",room.id);
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

                        //this fucking magic!!!
                        //up
                        if(document.getElementById("x"+j+"y"+(i-1)).getAttribute("name") !== room.id){
                            //writeLine(context,0,0,unitWidth,0);
                            //borderTop = "thick solid #0000FF";
                            
                            //unit.style.background="red";
                            unit.style.borderTop = "2px solid #0000FF";
                        }
                        //left
                        if(document.getElementById("x"+(j-1)+"y"+i).getAttribute("name") !== room.id){
                           // writeLine(context,0,0,0,unitWidth*4);
                           unit.style.borderLeft = "2px solid #0000FF";
                        }
                        //down
                        if(document.getElementById("x"+j+"y"+(i+1)).getAttribute("name") !== room.id){
                           // writeLine(context,0,unitHeight*2 - 10,unitWidth*4,unitHeight*2 - 10);
                            unit.style.borderBottom="2px solid #0000FF";
                        }
                        //right
                        if(document.getElementById("x"+(j+1)+"y"+i).getAttribute("name") !== room.id){
                            //writeLine(context,unitWidth*4 - 20,0,unitWidth*4- 20,unitHeight*4 - 20);
                              unit.style.borderRight = "2px solid #0000FF";
                        }
                    }
                }
            });

            //drawing the room entrance
            room.entrance.forEach(function (entrance) {
                var unit =  document.getElementById("x"+entrance.x+"y"+entrance.y);
                var context  = unit.getContext('2d');
                //writeLine(context,0,0,unitWidth*4,0,"yellow");
                switch(entrance.direction) {
                    case "left":
                        //writeLine(context,0,0,0,unitWidth*4,"yellow");
                        unit.style.borderLeft ="none";
                        break;
                    case "right":
                        //writeLine(context,unitWidth*4 - 20,0,unitWidth*4- 20,unitHeight*4 - 20,"yellow");
                        unit.style.borderRight="none";
                        break;
                    case "up":
                        //writeLine(context,0,0,unitWidth*4,0,"yellow");
                        unit.style.borderTop = "none";
                        break;
                    case "down":
                        //writeLine(context,0,unitHeight*2 - 10,unitWidth*4,unitHeight*2 - 10,"yellow");
                        unit.style.borderBottom="none";
                        break;
                    default:

                }

            })
        })
    }

    function writeLine(context,startX,startY,finishX,finishY,lineColor) {
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(startX,startY);
        context.lineTo(finishX,finishY);
        if(lineColor !== undefined){
            context.strokeStyle = lineColor;
        }
        context.stroke();
    }


    createRooms(roomsData);
    createBorder(roomsData);