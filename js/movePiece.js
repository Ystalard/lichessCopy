
$(function() {
    $("#movePiece").click(function(){
        const board = document.querySelector("#thisBoard")
        animateBoard(board,700,'a1','b7')
    }) 
    $("#addPawn").click(function(){
        const board = document.querySelector("#thisBoard")
        setPositionOnBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",board)
    })
})

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
            handlerMovePiece(pieceFinalPosition,board)
        }, duration)
        return
    }
}

function handlerMovePiece(piece,board){
    piece.addEventListener("mousedown", e=> {
        switch (e.which){
            case 1: //leftclick
                if (!aPieceIsSelected) {
                    console.log('mouse down')
                    aPieceIsSelected = true
                    board.setAttribute("boardParent",true)
                    
                    //remove highlighted square
                    var allSquareElement = Array.prototype.filter.call(board.children, child => child.localName == "square")
                    allSquareElement.forEach(square => square.remove())
                    
                    //shift between position of the mouse and uper left corner of the piece
                    const shiftX = e.clientX - piece.getBoundingClientRect().left;
                    const shiftY = e.clientY - piece.getBoundingClientRect().top;
                    const height = piece.clientHeight
                    const width = piece.clientWidth

                    var classNameInitialPosition = getClassNamePosition(getNormalizedSquarePosition(e))
                    var translateX = 0
                    var translateY = 0
                                   
                    piece.style.position = "fixed"
                    piece.style.zIndex = 1000

                    if(board.classList.contains("rotated")){
                        // correct position coord when board is rotated as left and top depends on last transformed elements instead of viewport
                        switch(classNameInitialPosition.charAt(0)){
                            case "a": translateX = 0*37
                            break;
                            case "b": translateX = 1*37
                            break;
                            case "c": translateX = 2*37
                            break;
                            case "d": translateX = 3*37
                            break;
                            case "e": translateX = 4*37
                            break;
                            case "f": translateX = 5*37
                            break;
                            case "g": translateX = 6*37
                            break;
                            case "h": translateX = 7*37
                            break;
                        }
                        switch(classNameInitialPosition.charAt(1)){
                            case "1": translateY = 0*37
                            break;
                            case "2": translateY = 1*37
                            break;
                            case "3": translateY = 2*37
                            break;
                            case "4": translateY = 3*37
                            break;
                            case "5": translateY = 4*37
                            break;
                            case "6": translateY = 5*37
                            break;
                            case "7": translateY = 6*37
                            break;
                            case "8": translateY = 7*37
                            break;
                        }

                        piece.style.left = board.getBoundingClientRect().left + board.clientWidth - e.clientX - (-shiftX + width) - translateX + "px"
                        piece.style.top = -(e.clientY - board.getBoundingClientRect().top - shiftY) + translateY + "px"
                        piece.style.height = height + "px"
                        piece.style.width = width + "px"
                    }
                    else{
                        piece.style.left = e.clientX - shiftX + "px"
                        piece.style.top = e.clientY - shiftY + "px"
                        piece.style.height = height + "px"
                        piece.style.width = width + "px"
                    }

                    var previousSquareOvered
                    var currentSquareOvered
                    
                    function movePiece(e){
                        if(aPieceIsSelected){
                            console.log('moving')
                            piece.style.position = "fixed"

                            if(board.classList.contains("rotated")){
                                piece.style.left = board.getBoundingClientRect().left + board.clientWidth - e.clientX - (-shiftX + width) - translateX + "px"
                                piece.style.top = -(e.clientY - board.getBoundingClientRect().top - shiftY) + translateY + "px"
                            }
                            else{
                                piece.style.left = e.clientX - shiftX + "px"
                                piece.style.top = e.clientY - shiftY + "px"
                            }

                            piece.style.height = height + "px"
                            piece.style.width = width + "px"

                            var currentClassNameSquare
                            currentClassNameSquare = getClassNamePosition(getNormalizedSquarePosition(e))
                            
                            var outsideBoard = isOutsideBoard(currentClassNameSquare)
                            
                            var boardHovered = document.elementsFromPoint(e.clientX, e.clientY).find(element => element.classList !== undefined && element.classList.contains("board"))

                            if(!outsideBoard && (boardHovered !== undefined && boardHovered.getAttribute("boardParent"))){
                                currentSquareOvered = getSquareFromBoard(board,currentClassNameSquare)
                                
                                if (currentSquareOvered === undefined){
                                    currentSquareOvered = setSquareOnBoard(board,currentClassNameSquare)
                                }
                                
                                currentSquareOvered.style.opacity = "0.2"
                                currentSquareOvered.style.backgroundColor = "blue"
                                
                                if (previousSquareOvered !== undefined && previousSquareOvered != currentSquareOvered){
                                    previousSquareOvered.remove()
                                }
                                previousSquareOvered = currentSquareOvered
                            }
                            else if (previousSquareOvered !== undefined){
                                previousSquareOvered.remove()
                            }                            
                        }
                    }

                    function replacePiece(e){
                        if(aPieceIsSelected){
                            console.log("mouseup")
                            var classNameFinalPosition
                            classNameFinalPosition = getClassNamePosition(getNormalizedSquarePosition(e))
                            var boardHovered = document.elementsFromPoint(e.clientX, e.clientY).find(element => element.classList !== undefined && element.classList.contains("board"))

                            if(isOutsideBoard(classNameFinalPosition) || !(boardHovered !== undefined && boardHovered.getAttribute("boardParent"))) {
                                classNameFinalPosition = classNameInitialPosition
                            }
                           
                            var currentPieceHovered = getPieceFromBoard(board,classNameFinalPosition)
                            if(currentPieceHovered !== undefined){
                                currentPieceHovered.remove()
                            }

                            piece.style.position = ""
                            piece.style.left = ""
                            piece.style.top = ""
                            piece.style.height = ""
                            piece.style.width = ""
                            piece.style.transition = "transform 700ms ease" 
                            piece.classList.remove(classNameInitialPosition)
                            piece.classList.add(classNameFinalPosition)
                            piece.style.zIndex = 1

                            currentSquareOvered = getSquareFromBoard(board,classNameFinalPosition)
                            if(currentSquareOvered !== undefined) {
                                currentSquareOvered.remove()
                            }

                            board.removeAttribute("boardParent")
                            document.removeEventListener("mousemove",movePiece)
                            piece.removeEventListener("mouseup", replacePiece)
                            aPieceIsSelected = false
                        }
                    }

                    document.addEventListener("mousemove", movePiece)
                    piece.addEventListener("mouseup", replacePiece)
                    }
                
                break;
            default:
        }
    })  
}

