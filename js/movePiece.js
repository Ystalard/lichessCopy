

// function dragover_handler(ev) {
//     ev.preventDefault();
    
// }

// function dataToDrag(ev) {
//     ev.dataTransfer.setData("draggedObject", ev.target.id)
//     ev.target.style.cursor = 'default';
//     var canvas = document.createElement('canvas');
//     canvas.id     = "canvas";
//     canvas.width  = 37;
//     canvas.height = 37;
//     let img = new Image();
//     canvas.getContext('2d').drawImage(img,0,0);
    
//     ev.target.classList.forEach(function(value){
//         let stop = true;
//         switch(value){
//             case 'whitePawn':
//                 img.src='./img/black_pawn.svg';
//                 ev.dataTransfer.setDragImage(img,37/2,37/2);
//                 stop = true
//             break;
//             default: 
//             stop = false;
//         }
//         if(stop){
//             return;
//         }
//     })
// }

$(function() {
    $("#movePiece").click(function(){
        const board = document.querySelector("#thisBoard")
        animateBoard(board,700,'a1','b7')
    })   
})

