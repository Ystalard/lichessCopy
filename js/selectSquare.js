$(function(){
    document.querySelectorAll(".board").forEach(e => {
        e.addEventListener('contextmenu', e => {
            e.preventDefault()
            console.log(e.button)
            const board = e.path.find(element => element.classList.contains("board"))
            const height = board.clientHeight
            const width =  board.clientWidth
            var offsetXFromBoard
            var offsetYFromBoard

            if (e.path[0].classList.contains("board")){
                offsetXFromBoard = e.offsetX
                offsetYFromBoard = e.offsetY
            }
            else {
                offsetXFromBoard = e.offsetX + e.path[0].offsetLeft - board.offsetLeft
                offsetYFromBoard = e.offsetY + e.path[0].offsetTop - board.offsetTop
            }
            var normalizedX = Math.trunc((offsetXFromBoard*8)/width)
            var normalizedY = Math.trunc((offsetYFromBoard*8)/height)

            console.log("selected position = " + String.fromCharCode((normalizedX + 1 + 64)).toLowerCase() + ((normalizedY - 7)*(-1) + 1))
            var position = String.fromCharCode((normalizedX + 1 + 64)).toLowerCase() + ((normalizedY - 7)*(-1) + 1)
            var coloredSquare
            var childNodesArray = Array.prototype.slice.call(board.childNodes)

            if (childNodesArray.find(element => element.localName == "square" && element.classList.contains(position))){
                coloredSquare = childNodesArray.find(element => element.localName == "square" && element.classList.contains(position))
            } else {
                coloredSquare = document.createElement("square")
                coloredSquare.classList.add(position)
            }       
            
            if (e.altKey && e.ctrlKey){
                coloredSquare.classList.toggle("yellowBackground")
                coloredSquare.classList.remove("blueBackground")
                coloredSquare.classList.remove("redBackground")
                coloredSquare.classList.remove("greenBackground")
            }
            else if (e.altKey){
                coloredSquare.classList.toggle("blueBackground")
                coloredSquare.classList.remove("yellowBackground")
                coloredSquare.classList.remove("redBackground")
                coloredSquare.classList.remove("greenBackground")
            }
            else if (e.ctrlKey){
                coloredSquare.classList.toggle("redBackground")
                coloredSquare.classList.remove("blueBackground")
                coloredSquare.classList.remove("yellowBackground")
                coloredSquare.classList.remove("greenBackground")
            }
            else {
                coloredSquare.classList.toggle("greenBackground")
                coloredSquare.classList.remove("blueBackground")
                coloredSquare.classList.remove("redBackground")
                coloredSquare.classList.remove("yellowBackground")
            }

            board.appendChild(coloredSquare)
        })
    })
})