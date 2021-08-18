

function dragover_handler(ev) {
    ev.preventDefault();
    
}

function dataToDrag(ev) {
    ev.dataTransfer.setData("draggedObject", ev.target.id)
    ev.target.style.cursor = 'default';
    var canvas = document.createElement('canvas');
    canvas.id     = "canvas";
    canvas.width  = 37;
    canvas.height = 37;
    let img = new Image();
    canvas.getContext('2d').drawImage(img,0,0);
    
    ev.target.classList.forEach(function(value){
        let stop = true;
        switch(value){
            case 'whitePawn':
                img.src='./img/black_pawn.svg';
                ev.dataTransfer.setDragImage(img,37/2,37/2);
                stop = true
            break;
            default: 
            stop = false;
        }
        if(stop){
            return;
        }
    })
}

function translatePiece(initPosition,finalPosition,timerange){
    const grid = document.querySelector(".board");
    const piece = document.querySelector("." + CSS.escape(initPosition));
    if(timerange === undefined || !Number.isInteger(timerange)) {
        animateCSSGrid.wrapGrid(grid);
    }
    else{
        animateCSSGrid.wrapGrid(grid,{duration: timerange});
    }    
    
    $("button").click(function(){
        piece.classList.remove(CSS.escape(initPosition));
        piece.classList.add(CSS.escape(finalPosition));
    })
}

$(function() {
    translatePiece('a1','b7',600);    
})
