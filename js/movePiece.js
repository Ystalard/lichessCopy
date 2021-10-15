$(function() {
    $("#movePiece").click(function(){
        const board = document.querySelector("#thisBoard")
        animateBoard(board,700,'a1','b7')
    }) 
    $("#addPawn").click(function(){
        const board = document.querySelector("#thisBoard")
        const regex = new RegExp('^(([pnbrqkPNBRQK1-8]{1,8}){1}|([pnbrqkPNBRQK1-8]{1,8}\/){7}([pnbrqkPNBRQK1-8]{1,8}){1})\\s+(b|w)\\s+(-|K?Q?k?q?)\\s+(-|[a-h][3|6])\\s+(\\d+)\\s+(\\d+)\\s*$')
        //rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
        const value = $("#fenValue")[0].value
        if (regex.test(value)) {
            setPositionOnBoard($("#fenValue")[0].value,board)
            if (board.classList.contains('rotated')){
                Array.prototype.slice.call(board.children).forEach(element => element.localName == "piece" && element.classList.toggle('rotated'))
            }
        }
        else{
            alert("FEN is not valid")
        }
    })
    $("#getFen").click(function(){
        const board = document.querySelector("#thisBoard")
        getFENFromBoard(board)
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
    function handleClick(click){
        console.log("clicked")
        colorSquare(click,"softBlue")
        const clientX = click.clientX
        const clientY = click.clientY
        const elementsUnderCursor = document.elementsFromPoint(clientX,clientY)
        var piece = elementsUnderCursor.find(element => element.localName !== undefined && element.localName === "piece")
        var board = elementsUnderCursor.find(element => element.classList != undefined && element.classList.contains("board"))
        if(board !== undefined) {
            Array.prototype.forEach.call(board.children,element => element.localName === "piece" ? element.removeAttribute("currentPieceSelected"):undefined)
        }

        piece.setAttribute("currentPieceSelected",true)
        var allBoards = document.querySelectorAll(".board")
        allBoards.forEach(currentBoard => currentBoard.removeAttribute("boardParent"))
        board.setAttribute("boardParent",true)
    }
    piece.addEventListener("click", handleClick),
    piece.addEventListener("mousedown", e=> {
        switch (e.which){
            case 1: //leftclick
                if (!aPieceIsSelected) {
                    console.log('mouse down')
                    piece.addEventListener("click",handleClick)
                    aPieceIsSelected = true
                    board.setAttribute("boardParent",true)
                    piece.setAttribute("currentPieceSelected",true)
                    
                    removeHilightedSquare(board)
                    
                    //shift between position of the mouse and uper left corner of the piece
                    const shiftX = e.clientX - piece.getBoundingClientRect().left;
                    const shiftY = e.clientY - piece.getBoundingClientRect().top;
                    const height = piece.clientHeight
                    const width = piece.clientWidth

                    var classNameInitialPosition = getClassNamePosition(getNormalizedSquarePosition(e))
                    var translateX = 0
                    var translateY = 0
                    const clientX_initial = e.clientX
                    const clientY_initial = e.clientY     
                    piece.style.position = "fixed"
                    piece.style.zIndex = 1000

                    if(board.classList.contains("rotated")){
                        // correct position coord when board is rotated as left and top depends on last transformed elements instead of viewport
                        translateX = (classNameInitialPosition.charAt(0).charCodeAt(0) - 97)*width;
                        translateY = (classNameInitialPosition.charAt(1) - 1)*height;

                        piece.style.left = board.getBoundingClientRect().left + board.clientWidth - clientX_initial - (-shiftX + width) - translateX + "px"
                        piece.style.top = -(clientY_initial - board.getBoundingClientRect().top - shiftY) + translateY + "px"
                        piece.style.height = height + "px"
                        piece.style.width = width + "px"
                    }
                    else{
                        piece.style.left = clientX_initial - shiftX + "px"
                        piece.style.top = clientY_initial - shiftY + "px"
                        piece.style.height = height + "px"
                        piece.style.width = width + "px"
                    }

                    var previousSquareOvered
                    var currentSquareOvered
                    
                    function movePiece(e){
                        if(aPieceIsSelected){
                            console.log('moving')
                            piece.style.position = "fixed"
                            var clientX = e.clientX
                            var clientY = e.clientY
                            if(board.classList.contains("rotated")){
                                piece.style.left = board.getBoundingClientRect().left + board.clientWidth - clientX - (-shiftX + width) - translateX + "px"
                                piece.style.top = -(clientY - board.getBoundingClientRect().top - shiftY) + translateY + "px"
                            }
                            else{
                                piece.style.left = clientX - shiftX + "px"
                                piece.style.top = clientY - shiftY + "px"
                            }

                            piece.style.height = height + "px"
                            piece.style.width = width + "px"

                            var currentClassNameSquare
                            currentClassNameSquare = getClassNamePosition(getNormalizedSquarePosition(e))
                            
                            var outsideBoard = isOutsideBoard(currentClassNameSquare)
                            
                            var boardHovered = document.elementsFromPoint(clientX, clientY).find(element => element.classList !== undefined && element.classList.contains("board"))

                            if(!outsideBoard && (boardHovered !== undefined && boardHovered.getAttribute("boardParent"))){
                                currentSquareOvered = getSquareFromBoard(board,currentClassNameSquare)
                                
                                if (currentSquareOvered === undefined){
                                    currentSquareOvered = setSquareOnBoard(board,currentClassNameSquare)
                                }
                                
                                currentSquareOvered.classList.add("softBlue")
                                
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
                            if(clientX_initial != e.clientX || clientY_initial != e.clientY){
                                piece.removeEventListener("click",handleClick)
                            }
                            const clientX_final = e.clientX
                            const clientY_final = e.clientY
                            var classNameFinalPosition
                            classNameFinalPosition = getClassNamePosition(getNormalizedSquarePosition(e))
                            var boardHovered = document.elementsFromPoint(clientX_final, clientY_final).find(element => element.classList !== undefined && element.classList.contains("board"))

                            if(isOutsideBoard(classNameFinalPosition) || !(boardHovered !== undefined && boardHovered.getAttribute("boardParent")) || !islegalMove(board,classNameInitialPosition,classNameFinalPosition)) {
                                var illegalSquareSelected = getSquareFromBoard(board,classNameFinalPosition)
                                classNameFinalPosition = classNameInitialPosition
                                var initialSquareSelected = getSquareFromBoard(board,classNameInitialPosition)

                                if(illegalSquareSelected !== undefined && illegalSquareSelected != initialSquareSelected){
                                    illegalSquareSelected.remove()
                                }                                

                                if(initialSquareSelected === undefined){
                                    initialSquareSelected = setSquareOnBoard(board,classNameInitialPosition)
                                }

                                if(!initialSquareSelected.classList.contains("softBlue")){
                                    initialSquareSelected.classList.add("softBlue")
                                }
                            }
                           
                            var currentPieceHovered = getPieceFromBoard(board,classNameFinalPosition)
                            if(currentPieceHovered !== undefined && !currentPieceHovered.getAttribute("currentPieceSelected")){
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
                            
                            board.removeAttribute("boardParent")
                            piece.removeAttribute("currentPieceSelected")
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

