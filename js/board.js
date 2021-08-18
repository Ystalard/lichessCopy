function switchBoardOrientation(board){
    board.classList.toggle('rotated')
}

function getPosition(event){
    const board = event.path.find(element => element.classList.contains("board"))
    const height = board.clientHeight
    const width =  board.clientWidth
    var offsetXFromBoard
    var offsetYFromBoard

    if (event.path[0].classList.contains("board")){
        offsetXFromBoard = event.offsetX
        offsetYFromBoard = event.offsetY
    }
    else {
        offsetXFromBoard = event.offsetX + event.path[0].offsetLeft - board.offsetLeft
        offsetYFromBoard = event.offsetY + event.path[0].offsetTop - board.offsetTop
    }
    var normalizedX = Math.trunc((offsetXFromBoard*8)/width)
    var normalizedY = Math.trunc((offsetYFromBoard*8)/height)

    console.log("selected position = " + String.fromCharCode((normalizedX + 1 + 64)).toLowerCase() + ((normalizedY - 7)*(-1) + 1))

    return String.fromCharCode((normalizedX + 1 + 64)).toLowerCase() + ((normalizedY - 7)*(-1) + 1)
}