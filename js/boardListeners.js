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
                        //shift between position of the mouse and uper left corner of the piece
                        const shiftX = e.clientX - piece.getBoundingClientRect().left;
                        const shiftY = e.clientY - piece.getBoundingClientRect().top;
                        const height = piece.clientHeight
                        const width = piece.clientWidth

                        var classNameInitialPosition
                        var translateX = 0
                        var translateY = 0
                        if(board.classList.contains("rotated")){
                            classNameInitialPosition = getClassNamePosition(getNormalizedSquarePosition(e))
                        }                        

                        piece.style.position = "fixed"

                        if(board.classList.contains("rotated")){
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
                            piece.style.left = e.pageX - shiftX + "px"
                            piece.style.top = e.pageY - shiftY + "px"
                            piece.style.height = height + "px"
                            piece.style.width = width + "px"
                            classNameInitialPosition = getClassNamePosition(getNormalizedBoardPosition(e))
                        }

                        var previousSquareOvered
                        var currentSquareOvered
                        function movePiece(e){
                            
                            piece.style.position = "fixed"

                            if(board.classList.contains("rotated")){
                                piece.style.left = board.getBoundingClientRect().left + board.clientWidth - e.clientX - (-shiftX + width) - translateX + "px"
                                piece.style.top = -(e.clientY - board.getBoundingClientRect().top - shiftY) + translateY + "px"
                            }
                            else{
                                piece.style.left = e.pageX - shiftX + "px"
                                piece.style.top = e.pageY - shiftY + "px"
                            }

                            piece.style.height = height + "px"
                            piece.style.width = width + "px"

                            var currentClassNameSquare
                            if(!board.classList.contains("rotated")){
                                currentClassNameSquare = getClassNamePosition(getNormalizedBoardPosition(e))
                            }
                            else{
                                currentClassNameSquare = getClassNamePosition(getNormalizedSquarePosition(e))
                            }
                            
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
                            var classNameFinalPosition
                            if(!board.classList.contains("rotated")){
                                classNameFinalPosition = getClassNamePosition(getNormalizedBoardPosition(e))
                            }
                            else{
                                classNameFinalPosition = getClassNamePosition(getNormalizedSquarePosition(e))
                            }
                            
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
        })
    })
})