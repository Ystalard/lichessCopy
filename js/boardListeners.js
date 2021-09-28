var aPieceIsSelected = false

$(function(){
    document.querySelectorAll(".board").forEach(board => {
        board.addEventListener('contextmenu', e => {
            e.preventDefault()
            colorSquare(e)
        })
        board.querySelectorAll("piece").forEach(piece=> {
            handlerMovePiece(piece,board)          
        })
    })
})

