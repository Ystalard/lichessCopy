// uci protocol: http://wbec-ridderkerk.nl/html/UCIProtocol.html
function switchBoardOrientation(board){
    board.classList.toggle('rotated')
    Array.prototype.slice.call(board.children).forEach(element => element.localName == "piece" && element.classList.toggle('rotated'))
}

function islegalMove(board,classNameInitialPosition,classNameFinalPosition){
    return true
}

function removeHilightedSquare(board){
    var allSquareElement = Array.prototype.filter.call(board.children, child => child.localName == "square")
    allSquareElement.forEach(square => square.remove())
}

function setPositionOnBoard(fenstring,board){
    const fieldArray = fenstring.split(' ')
    const rows = fieldArray[0].split('/')
    const boardChildren = Array.prototype.slice.call(board.children)
    boardChildren.forEach(element => element.remove())
    var rowCount = 8
    rows.forEach(row => {
        for (let index = 0; index < row.length; index++) {
            const character = row.charAt(index)
            if (!isNaN(character * 1)){
            }else{
                if (character == character.toUpperCase() || character == character.toLowerCase()) {
                    var type
                    switch(character){
                        case "P": type = "whitePawn"
                        break;
                        case "N": type = "whiteKnight"
                        break;
                        case "B": type = "whiteBishop"
                        break;
                        case "Q": type = "whiteQueen"
                        break;
                        case "K": type = "whiteKing"
                        break;
                        case "R": type = "whiteRook"
                        break;
                        case "p": type = "blackPawn"
                        break;
                        case "n": type = "blackKnight"
                        break;
                        case "b": type = "blackBishop"
                        break;
                        case "q": type = "blackQueen"
                        break;
                        case "k": type = "blackKing"
                        break;
                        case "r": type = "blackRook"
                        break;
                    }
                    const list = [type,String.fromCharCode(97 + index) + rowCount]
                    setElementOfBoardWithClassNames(board,"piece",list)
                }
            }
        }
        --rowCount
    });
    
}

function getFENFromBoard(board){
    var fenList = ""
    var count_emptySquare = 0
    const boardChildren = Array.prototype.slice.call(board.children)

    for (let row = 8; row > 0; row--) {        
        for (let column = 'a'; column < 'i'; column=String.fromCharCode(column.charCodeAt(0)+1)) {
            var piece = boardChildren.find(piece => piece.localName == "piece" && piece.classList.contains(column+row))
            if(piece !== undefined){
                if(count_emptySquare != 0){
                    fenList = fenList + count_emptySquare
                    count_emptySquare = 0
                }
                var pieceValue = ""
                if(piece.classList.value.includes("Pawn")){
                    pieceValue = "p"
                }
                else if(piece.classList.value.includes("Rook")){
                    pieceValue = "r"
                }
                else if(piece.classList.value.includes("Knight")){
                    pieceValue = "n"
                }
                else if(piece.classList.value.includes("Bishop")){
                    pieceValue = "b"
                }
                else if(piece.classList.value.includes("Queen")){
                    pieceValue = "q"
                }
                else if(piece.classList.value.includes("King")){
                    pieceValue = "k"
                }

                if(piece.classList.value.includes("white")){
                    pieceValue = pieceValue.toUpperCase()
                }
                
                fenList = fenList + pieceValue
            }
            else if(piece === undefined) {
                count_emptySquare++
            }
        }
        if (count_emptySquare != 0){
            fenList = fenList + count_emptySquare
        }
        count_emptySquare = 0
        fenList = fenList + "/"
    }
    fenList = fenList.slice(0,fenList.length-1)
    fenList = fenList + " " + getPlayerToPlay()
    fenList = fenList + " " + getWhiteRockAllowed()
    fenList = fenList + getBlackRockAllowed()
    fenList = fenList + " " + getEnPassantSquare()
    fenList = fenList + " " + getHalfMoveCountSinceLastCaptureOrPawnMove()
    fenList = fenList + " " + getMoveCount()
    alert("FEN = " + fenList)
}

function getMoveCount(){
    return "1"
}

function getHalfMoveCountSinceLastCaptureOrPawnMove(){
    //50 moves rule
    return "0"
}

function getEnPassantSquare(){
    return "-"
}

function getBlackRockAllowed(){
    return "kq"
}

function getWhiteRockAllowed(){
    return "KQ"
}

function getPlayerToPlay(){
    return "w"
}

function isOutsideBoard(classNamePosition){
    var isOutsideBoard = true
    switch(classNamePosition.charAt(0)){
        case "a": isOutsideBoard = false
        break;
        case "b": isOutsideBoard = false
        break;
        case "c": isOutsideBoard = false
        break;
        case "d": isOutsideBoard = false
        break;
        case "e": isOutsideBoard = false
        break;
        case "f": isOutsideBoard = false
        break;
        case "g": isOutsideBoard = false
        break;
        case "h": isOutsideBoard = false
        break;
        default: isOutsideBoard = true
        break;
    }
    if(!isOutsideBoard){
        switch(classNamePosition.charAt(1)){
            case "1": isOutsideBoard = false
            break;
            case "2": isOutsideBoard = false
            break;
            case "3": isOutsideBoard = false
            break;
            case "4": isOutsideBoard = false
            break;
            case "5": isOutsideBoard = false
            break;
            case "6": isOutsideBoard = false
            break;
            case "7": isOutsideBoard = false
            break;
            case "8": isOutsideBoard = false
            break;
            default: isOutsideBoard = true
            break;
        }
    }
    return classNamePosition.length = 2 && isOutsideBoard
}

function getNormalizedSquarePosition(event){
    const board = event.path.find(element => element.classList !== undefined && element.classList.contains("board"))
    var normalizedX = undefined 
    var normalizedY = undefined
    var clientX = event.clientX
    var clientY = event.clientY

    if(board !== undefined){
        const height = board.clientHeight
        const width =  board.clientWidth
        var rect = board.getBoundingClientRect()
        var x = clientX - rect.x
        var y = clientY - rect.y

        normalizedX = Math.trunc((x*8)/width)
        normalizedY = Math.trunc((y*8)/height)
        if(board.classList.contains("rotated")){
            normalizedX = 7 - normalizedX
            normalizedY = 7 - normalizedY
        }
    }

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

function setElementOfBoardWithClassNames(board,elementName,classNames){
    element = document.createElement(elementName)
    element.classList.add(...classNames)
    board.appendChild(element)
    if(elementName == "piece"){
        handlerMovePiece(element,board)
    }
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

function colorSquare(e,color){
    const board = e.path.find(element => element.classList.contains("board"))
    
    var position = getClassNamePosition(getNormalizedSquarePosition(e))
    var coloredSquare = getSquareFromBoard(board,position)
    if (coloredSquare === undefined){
        coloredSquare = setSquareOnBoard(board,position)
    }      
    
    if(color !== undefined){
        coloredSquare.classList.toggle(color)
        coloredSquare.classList.remove("blueBackground","redBackground","greenBackground","yellowBackground")
    }
    else{
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
    
}