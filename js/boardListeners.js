$(function(){
    
    document.querySelectorAll(".board").forEach(board => {
        board.addEventListener('contextmenu', e => {
            e.preventDefault()
            colorSquare(e)
        })
        board.querySelectorAll("piece").forEach(piece=> {
            piece.addEventListener("mousedown", e=> {
                switch (e.which){
                    case 1: //leftclick
                        const shiftX = e.clientX - piece.getBoundingClientRect().left;
                        const shiftY = e.clientY - piece.getBoundingClientRect().top;
                        const height = piece.clientHeight
                        const width = piece.clientWidth

                        piece.style.position = "fixed"
                        piece.style.left = e.pageX - shiftX + "px"
                        piece.style.top = e.pageY - shiftY + "px"
                        piece.style.height = height + "px"
                        piece.style.width = width + "px"
                        var classNameInitialPosition = getClassNamePosition(getNormalizedBoardPosition(e))
                        

                        var previousSquareOvered
                        var currentSquareOvered
                        function movePiece(e){
                            
                            piece.style.position = "fixed"
                            piece.style.left = e.pageX - shiftX + "px"
                            piece.style.top = e.pageY - shiftY + "px"
                            piece.style.height = height + "px"
                            piece.style.width = width + "px"
                            var currentClassNameSquare = getClassNamePosition(getNormalizedBoardPosition(e))
                            currentSquareOvered = getSquareFromBoard(board,currentClassNameSquare)
                            if (currentSquareOvered === undefined){
                                currentSquareOvered = setSquareOnBoard(board,currentClassNameSquare)
                            }
                            currentSquareOvered.style.border = "solid 0.1px yellow"
                            if (previousSquareOvered !== undefined && previousSquareOvered != currentSquareOvered){
                                previousSquareOvered.remove()
                            }
                            previousSquareOvered = currentSquareOvered
                        }

                        function replacePiece(e){
                            console.log("mouseup")
                            var classNameFinalPosition = getClassNamePosition(getNormalizedBoardPosition(e))
                            piece.style.position = ""
                            piece.style.left = ""
                            piece.style.top = ""
                            piece.style.height = ""
                            piece.style.width = ""
                            piece.style.transition = "transform 700ms ease" 
                            piece.classList.remove(classNameInitialPosition)
                            piece.classList.add(classNameFinalPosition)
                            currentSquareOvered.remove()
                            document.removeEventListener("mousemove",movePiece)
                            piece.removeEventListener("mouseup", replacePiece)
                        }

                        document.addEventListener("mousemove", movePiece)
                        piece.addEventListener("mouseup", replacePiece)
                        break;
                    default:
                }
            })
            // piece.addEventListener("dragstart", () => {return false})
            
        })
    })
})