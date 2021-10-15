var aPieceIsSelected = false

$(function(){
    document.querySelectorAll(".board").forEach(board => {
        board.addEventListener('contextmenu', e => {
            e.preventDefault()
            colorSquare(e)
        }),
        board.addEventListener("click", e=> {
            const clientX = e.clientX
            const clientY = e.clientY
            const elementsUnderCursor = document.elementsFromPoint(clientX,clientY)
            var pieceUnderCursor = elementsUnderCursor.find(element => element.localName == "piece")
            if(pieceUnderCursor === undefined){
                var selectedPiece = Array.prototype.find.call(board.children, child => child.localName == "piece" && child.getAttribute("currentPieceSelected"))
                if(selectedPiece !== undefined){
                    selectedPiece.removeAttribute("currentPieceSelected")
                }   
                removeHilightedSquare(board)
            }
        }),
        board.querySelectorAll("piece").forEach(piece=> {
            handlerMovePiece(piece,board)          
        })
    })
})

