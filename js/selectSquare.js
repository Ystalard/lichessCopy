$(function(){
    document.querySelectorAll(".board").forEach(e => {
        e.addEventListener('contextmenu', e => {
            e.preventDefault()
            console.log(e.button)
            const board = e.path.find(element => element.classList.contains("board"))

            var coloredSquare
            var childNodesArray = Array.prototype.slice.call(board.childNodes)
            var position = getPosition(e)
            
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