function switchBoardOrientation(board){
    board.classList.toggle('rotated')
}

function getNormalizedBoardPosition(event){
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
        offsetXFromBoard = event.offsetX + event.path[0].offsetLeft
        offsetYFromBoard = event.offsetY + event.path[0].offsetTop         
    }
    var normalizedX = Math.trunc((offsetXFromBoard*8)/width)
    var normalizedY = Math.trunc((offsetYFromBoard*8)/height)
    console.log("normalizedX = " +normalizedX)
    console.log("normalizedY = " +normalizedY)
    return {normalizedX,normalizedY}
}

function getNormalizedVectorTranslation(initialVector,finalVector){
    var x = finalVector.finalPositionX - initialVector.initialPositionX
    var y = finalVector.finalPositionY- initialVector.initialPositionY
    return {x,y}
}

function getClassNamePosition({normalizedX,normalizedY}){
    console.log("selected position = " + String.fromCharCode((normalizedX + 1 + 64)).toLowerCase() + ((normalizedY - 7)*(-1) + 1))
    return String.fromCharCode((normalizedX + 1 + 64)).toLowerCase() + ((normalizedY - 7)*(-1) + 1)
}

function animateBoard(board,duration,initial_position,final_position) {
    var childNodesArray = Array.prototype.slice.call(board.childNodes)
    const pieceInitialPosition = childNodesArray.find(element => element.localName == "piece" && element.classList.contains(initial_position))
    var pieceFinalPosition
    if (!childNodesArray.find(element => element.localName == "piece" && element.classList.contains(final_position))){
        pieceFinalPosition = document.createElement("piece")
        pieceFinalPosition.classList.add(final_position)
        board.appendChild(pieceFinalPosition)}
    else{
        pieceFinalPosition = childNodesArray.find(element => element.localName == "piece" && element.classList.contains(final_position))
    }

    var initialVector = {
        initialPositionX : pieceInitialPosition.offsetLeft,
        initialPositionY : pieceInitialPosition.offsetTop
    }
    var finalVector = {
        finalPositionX : pieceFinalPosition.offsetLeft,
        finalPositionY : pieceFinalPosition.offsetTop
    }
    var NormalizedVectorTranslation = getNormalizedVectorTranslation(initialVector,finalVector)
    pieceInitialPosition.style.transition = "transform " + duration +"ms ease" 
    
    setTimeout(() => {
        pieceInitialPosition.remove()
        var position = pieceInitialPosition.classList.find(e => e.match(regex))
        pieceFinalPosition.classList.add
    }, duration)

    
}