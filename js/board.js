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
    else if(event.path[0].localName == "piece" && event.path[0].style.position == "fixed" ){
        if (!board.classList.contains("rotated")){
            offsetXFromBoard = event.path[0].offsetLeft - board.offsetLeft + event.path[0].clientWidth/2
            offsetYFromBoard = event.path[0].offsetTop - board.offsetTop + event.path[0].clientHeight/2
        }     
        else if(board.classList.contains("rotated")){
            offsetXFromBoard =  event.path[0].offsetLeft - board.offsetLeft + event.path[0].clientWidth/2
            offsetYFromBoard = event.path[0].offsetTop - 7*height/8 - board.offsetTop + event.path[0].clientHeight/2
        } 
    }
    else {
        offsetXFromBoard = event.offsetX + event.path[0].offsetLeft
        offsetYFromBoard = event.offsetY + event.path[0].offsetTop         
    }
    
    var normalizedX = Math.trunc((offsetXFromBoard*8)/width)
    var normalizedY = Math.trunc((offsetYFromBoard*8)/height)

    return {normalizedX,normalizedY}
}

function getNormalizedVectorTranslation(initialVector,finalVector){
    var x = finalVector.finalPositionX - initialVector.initialPositionX
    var y = finalVector.finalPositionY- initialVector.initialPositionY
    return {x,y}
}

function getClassNamePosition({normalizedX,normalizedY}){
    return String.fromCharCode((normalizedX + 1 + 64)).toLowerCase() + ((normalizedY - 7)*(-1) + 1)
}

function getElementOfBoardFromClassName(board,elementName,className){
    var childNodesArray = Array.prototype.slice.call(board.childNodes)
    return childNodesArray.find(element => element.localName == elementName && element.classList.contains(className))
}

function setElementOfBoardWithClassName(board,elementName,className){
    element = document.createElement(elementName)
    element.classList.add(className)
    board.appendChild(element)
    return element
}

function getPieceFromBoard(board,position){
    return getElementOfBoardFromClassName(board,"piece",position)
}

function setPieceOnBoard(board,classNamePosition){
    return setElementOfBoardWithClassName(board,"piece",classNamePosition)
}

function getSquareFromBoard(board,classNamePosition){
    return getElementOfBoardFromClassName(board,"square",classNamePosition)
}

function setSquareOnBoard(board,position){
    return setElementOfBoardWithClassName(board,"square",position)
}

function animateBoard(board,duration,initial_position,final_position) {
    var pieceInitialPosition = getPieceFromBoard(board,initial_position)
    if (pieceInitialPosition !== undefined){
        var pieceFinalPosition = getPieceFromBoard(board,final_position)
    
        if (pieceFinalPosition === undefined){
            pieceFinalPosition = setPieceOnBoard(board,final_position)
        }

        var NormalizedVectorTranslation = getNormalizedVectorTranslation({
            initialPositionX : pieceInitialPosition.offsetLeft,
            initialPositionY : pieceInitialPosition.offsetTop
        },{
            finalPositionX : pieceFinalPosition.offsetLeft,
            finalPositionY : pieceFinalPosition.offsetTop
        })
        pieceInitialPosition.style.transition = "transform " + duration +"ms ease" 
        pieceInitialPosition.style.transform = "translate(" + NormalizedVectorTranslation.x + "px," + NormalizedVectorTranslation.y + "px)"

        setTimeout(() => {
            pieceInitialPosition.remove()
            pieceFinalPosition.classList = pieceInitialPosition.classList
            pieceFinalPosition.classList.remove(initial_position)
            pieceFinalPosition.classList.add(final_position)
        }, duration)
        return
    }
}

function colorSquare(e){
    const board = e.path.find(element => element.classList.contains("board"))
    
    var position = getClassNamePosition(getNormalizedBoardPosition(e))
    var coloredSquare = getSquareFromBoard(board,position)
    if (coloredSquare === undefined){
        coloredSquare = setSquareOnBoard(board,position)
    }      
    
    if (e.altKey && e.ctrlKey){
        coloredSquare.classList.toggle("yellowBackground")
        coloredSquare.classList.remove("blueBackground","redBackground","greenBackground")
    }
    else if (e.altKey){
        coloredSquare.classList.toggle("blueBackground")
        coloredSquare.classList.remove("yellowBackground","redBackground","greenBackground")
    }
    else if (e.ctrlKey){
        coloredSquare.classList.toggle("redBackground")
        coloredSquare.classList.remove("blueBackground","yellowBackground","greenBackground")
    }
    else {
        coloredSquare.classList.toggle("greenBackground")
        coloredSquare.classList.remove("blueBackground","redBackground","yellowBackground")
    }
}