const addItemInput = document.querySelector('.add >.input')
const addItemBtn = document
  .querySelector('.button')

const todoList = document
  .querySelector('.todos')

// const id  = crypto.randomUUID()

const createTodoItem = (text, id) => {
  const item = document
    .createElement('div')
  item.classList.add('item');

  item
    .setAttribute('todo-item-id', id)

  // <input type="checkbox">
  const checkbox = document
    .createElement('input')
  checkbox.type = 'checkbox'
  // <div class="item">
  //   <input type="checkbox">
  // </div>  
  item.appendChild(checkbox)

  // <div class="title">${todoText}</div>
  const title = document
    .createElement('div')
  title.classList.add('title')
  title.textContent = text

  // <div class="item">
  //   <input type="checkbox">
  //   <div class="title">${todoText}</div>
  // </div>  
  item.appendChild(title)

  // <div class="trash-icon"></div>
  const trash = document
    .createElement('div')
  trash.classList.add('trash-icon')

  // <img src="./trash.png" />
  const icon = document
    .createElement('img')
  icon.src = './trash.png'

  // <div class="trash-icon">
  //   <img src="./trash.png" />
  // </div>
  trash.appendChild(icon)

  trash.addEventListener('click', () => {
    item.remove()
    const storageDataStr = localStorage
      .getItem('todo-storage')
    const storageData = JSON
      .parse(storageDataStr)

    const newStorageData = storageData.filter(
      el => el.id !== id
    )

    localStorage
      .setItem(
        'todo-storage',
        JSON.stringify(newStorageData)
      )
  })

  // <div class="item">
  //   <input type="checkbox">
  //   <div class="title">${todoText}</div>
  //   <div class="trash-icon">
  //     <img src="./trash.png" />
  //   </div>
  // </div> 
  item.appendChild(trash)

  todoList.appendChild(item)
}

addItemBtn.addEventListener(
  'click',
  () => {
    const todoText = addItemInput.value.trim();
    if (todoText.length == 0) {
      return;
    }

    // const todoItemStr =
    //   `<div class="item">
    //     <input type="checkbox">
    //     <div class="title">${todoText}</div>
    //     <div class="trash-icon">
    //       <img src="./trash.png" />
    //     </div>
    //   </div>`
    // todoList.innerHTML += todoItemStr;

    // <div class="item"></div>

    const todoItemId = crypto.randomUUID()
    createTodoItem(todoText, todoItemId)
    const todoListStr = localStorage
      .getItem('todo-storage')
    // let todoList
    // if(todoListStr) {
    //   todoList = JSON.parse(todoListStr)
    // } else {
    //   todoList = []
    // }

    const todoListData = JSON.parse(
      todoListStr ?? "[]"
    )

    todoListData.push({
      id: todoItemId,
      text: todoText,
      isChecked: false,
    })

    localStorage.setItem(
      'todo-storage',
      JSON.stringify(todoListData)
    )

    // localStorage
    //   .setItem(
    //     'todoItems',
    //     JSON.stringify({
    //       id: todoItemId,
    //       text: todoText,
    //       isChecked: false,
    //     })
    //   )

    addItemInput.value = ''
  }
)

const searchInput = document
  .querySelector('header > input')

searchInput.addEventListener('keyup', (event) => {
  const searchText = event.target.value
  console.log(`searchText: ${searchText}`)
  if (searchText.length === 0) {
    document.querySelectorAll('.hide').forEach(elem => {
      elem.classList.remove('hide')
    })
    return
  }

  const itemList = document
    .querySelectorAll('.item')

  for (let i = 0; i < itemList.length; i += 1) {
    const item = itemList[i]
    const text = item
      .querySelector('.title')
      .textContent

    const regExp = new RegExp(searchText)
    if (!regExp.test(text)) {
      item.classList.add('hide')
    } else {
      item.classList.remove('hide')
    }
  }
})


const storageDataStr = localStorage
  .getItem('todo-storage')

if (storageDataStr) {
  const storageData = JSON.parse(
    storageDataStr
  )

  storageData.forEach(elem => {
    createTodoItem(elem.text, elem.id)
  })

  let totalCount = storageData.length
  setInterval(() => {
    const storageDataStr = localStorage
      .getItem('todo-storage')
    if (!storageDataStr) {
      return;
    }
    const storageData = JSON.parse(
      storageDataStr
    )

    if (storageData.length !== totalCount) {
      const currentTodoItems = document.querySelectorAll(
        '.item'
      )

      currentTodoItems.forEach(el => {
        el.remove()
      })

      storageData.forEach(el => {
        createTodoItem(el.text, el.id)
      })
    }

  }, 2 * 1000)

  // for (const elem of storageData) { }
  // for (let i = 0; i < storageData.length; i += 1) { }
}