for (let i = 1; i <= 10; i += 1) {
    // debugger;
    console.log(`step ${i} execute`)
    console.log('"step"', i, 'execute')
    // debugger;
    console.log("'step'", i, 'execute')
}


document.addEventListener('DOMContentLoaded', () => {
    const helloWorldNode = document.getElementById('hello-world')
    if (helloWorldNode) {
        console.log("Hello world was found")
    } else {
        console.log("Hello world was not found")
        return;
    }

    helloWorldNode.textContent = helloWorldNode.textContent + " new line"
    helloWorldNode.style.color = "grey"
    const helloWorldNodetext = helloWorldNode.textContent
    const btn = document.querySelector('#button')
    btn.addEventListener('mouseenter', () => {
        helloWorldNode.textContent = "BUTTON"
    })
    btn.addEventListener('mouseleave', () => {
        helloWorldNode.textContent = helloWorldNodetext
    })

    btn.addEventListener('dblclick', () => {
        console.log("db click was executed")
        const div = document.createElement('div')
        div.textContent = helloWorldNodetext
        // div.classList.add('item', 'margin-top-bottom')
        div.classList.add('item')
        div.classList.add('margin-top-bottom')
        document.body.appendChild(div)
    })
    btn.addEventListener('click', () => {
        helloWorldNode.textContent = helloWorldNodetext + helloWorldNodetext
    })
})



document.addEventListener('DOMContentLoaded', () => {
    const inputNode = document.getElementById('todo-input')
    const buttonNode = document.getElementById('todo-add')

    buttonNode.addEventListener('click', () => {
        const todoText = inputNode.value

        if (todoText.length == 0) {
            return;
        }

        const div = document.createElement('div')
        div.classList.add('todo-item')

        // const totoItemNodesLength = document.querySelectorAll('.container > .todo-item').length
        const todoItemNodes = document.querySelectorAll('.container > .todo-item')
        const totoItemNodesLength = todoItemNodes.length

        // div.textContent = totoItemNodesLength + 1 + ' ' + todoText
        div.innerHTML = `<span>${totoItemNodesLength + 1}</span> ${todoText}`

        document.querySelector('.container').appendChild(div)
        inputNode.value = ''
    })

})
