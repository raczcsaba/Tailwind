//data variables
const baseUrl = 'http://localhost:3000/';
const cont = document.querySelector("#cardCont")
articles = []
window.addEventListener('DOMContentLoaded', getAllposts)
let commentId = 0;

//style & screenresize
const mySidenav = document.getElementById("mySidenav")
const body = document.getElementById("main")
let width = cont.offsetWidth
let pos = 0
toastCont = document.querySelector('#toast-container')

//modal
const modal = document.getElementById("myModal");
let modalContent = document.getElementById("article");
let modalTitle = document.querySelector('#modalTitle')
const closeBtn = document.querySelector('#closeModal')
const commentDiv = document.querySelector('#commentSection')
let commentMessage = document.querySelector('#message')

//default User
const User = "Jack2"

//events
window.onclick = function(event) {
    if (event.target == modal) {
        modalClose()
    }
}
closeBtn.addEventListener('click', () => {
    modalClose()
})
window.addEventListener("resize", () => {
    width = cont.offsetWidth
    renderItems(articles)
});

function hideToast(){
    toast.classList.add('invisible')
}

function messageService(type,message) {
    let toast = cpe(toastCont,'div','')
    toast.classList = 'flex z-50 items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow'

    let iconCont = cpe(toast,'div','')
    iconCont.classList = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg'

    let icon = cpe(iconCont,'svg','')
    icon.classList = 'w-5 h-5'
    icon.viewBox = '0 0 20 20'
    if (type === "danger"){
        iconCont.classList.add('text-red-500','bg-red-100')
        icon.innerHTML = '<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>'
    }
    else if (type === "warning"){
        iconCont.classList.add('text-orange-500','bg-orange-100')
        icon.innerHTML = '<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>'
    }else {
        iconCont.classList.add('text-green-500','bg-green-100')
        icon.innerHTML = '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>'
    }

    let messageDiv = cpe(toast,'div',message)
    messageDiv.classList = 'ml-3 text-sm font-normal'

}

function openNav() {
    pos = window.innerWidth<1000 ? window.innerWidth : 500
    width -= pos
    mySidenav.style.width = pos + 'px';
    body.style.marginLeft = pos + 'px';
    renderItems(articles)
}

function closeNav() {
    width += pos
    mySidenav.style.width = "0";
    body.style.marginLeft = "0";
    renderItems(articles)
}

function filterSearch() {
    let input = document.getElementById("mySearch");
    let menu = document.getElementById("myMenu");
    menu.innerHTML = ''
    if (!input.value){
        return
    }
    for (let i = 0; i < articles.length; i++) {
        let a = articles[i]
        if (a.title.toUpperCase().indexOf(input.value.toUpperCase()) > -1) {
            let li = cpe(menu,'li', '')
            let a = cpe(li,'a',articles[i].title)
            a.classList.add('p-3','text-slate-100','hover:bg-slate-400','no-underline','block')
            li.addEventListener('click', (e) => {
                showModal(articles[i])
            })
        }
    }
}

function modalClose(){
    modal.style.display = "none";
}

function getAllposts(){
    let url = baseUrl + 'posts'
    fetch(url).then(res => res.json()).then(data => pageContent(data))
}

function getPostComments(id){
    commentId = id
    let url = baseUrl + 'comments?key=' + id
    fetch(url).then(res => res.json()).then(data => showComments(data))
}

function pageContent(data){
    articles = [];
    width = cont.offsetWidth
    data.forEach(element => {
        articles.push(element)
    })
    renderItems(data)
}

function renderItems(dat){
    cont.innerHTML = ''
    dat.forEach(element => {
        makeCardItem(element)
    })
    console.log("Rerendered")
}

function makeCardItem(dat){
    const card = cpe(cont, 'a', '')
    card.classList.add('flex','flex-col','justify-between','max-w-sm','w-full','p-6','bg-white','border','border-gray-200','rounded-lg','shadow-md','hover:bg-gray-100')

    let title = cpe(card,'h5',dat.title)
    title.classList.add('mb-2','text-2xl','font-bold','tracking-tight','text-gray-900')

    let article = cpe(card,'p',dotSlice(width/6,dat.article))
    article.classList.add('font-normal','text-gray-700')

    let author = cpe(card,'h5',dat.author)
    author.classList.add('mb-2','mt-8','text-xl','tracking-tight','text-gray-700','ml-auto')

    card.addEventListener('click', () => {
        showModal(dat)
    })
}

function cpe(parent, ele, html) {
    const el = document.createElement(ele)
    parent.append(el)
    el.innerText = html;
    return el
}

function dotSlice (length, string){
    if (string.length>length){
        string = string.slice(0,length) + '...'
    }
    return string.slice(0,string.length/2) + "n" + (string[string.length/2]===" " ? string.slice((string.length/2)+1,string.length) : string.slice(string.length/2,string.length))

}

function showModal(dat) {
    modalTitle.innerText = dat.title
    modal.style.display = "block";
    modalContent.innerText = ""

    let article = cpe(modalContent,'p',dat.article)
    article.classList.add('p5','mb-3','font-light','text-slate-800','border-b','rounded-t')

    let author = cpe(modalContent,'h4',dat.author)
    author.classList.add('ml-0','text-slate-600')

    getPostComments(dat.id)
}

function updateComment(commentData) {
    const url = baseUrl + 'comments/'+commentData.id
    const opt = {
        method: 'PUT',
        body: JSON.stringify(commentData),
        headers: {
            'content-type' : 'application/json; charset=UTF-8'
        }
    }
    fetch(url, opt)
        .then(() => {
            messageService('succes','Comment edited!')
        })
        .catch(() => {
            messageService('alert','Server error!')
        })
}

function newComment() {
    if (commentMessage.value){
        const url = baseUrl + 'comments'
        const body = {
            key: commentId,
            author: User,
            comment: commentMessage.value
        }

        const  opt = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-type' : 'application/json; charset=UTF-8'
            }
        }

        fetch(url, opt)
            .then(() => {
                getPostComments(commentId);
                commentMessage.value = ''
                messageService('succes','Comment added!')
            })
            .catch(() => {
                messageService('alert','Server error!')
            })
    }
}

function editShowButton(editable, input, commentData,shown) {
    let edit = cpe(editable, 'button', 'Edit')
    edit.type = "button"
    edit.classList.add('text-white', 'bg-blue-700', 'hover:bg-blue-800', 'focus:outline-none', 'focus:ring-4', 'focus:ring-blue-300', 'font-medium', 'rounded-full', 'text-sm', 'px-2', 'py-0.5','mt-3', 'text-center', 'mr-1', 'mb-1')

    edit.addEventListener('click', () => {
        commentData.comment = input.value + ' [edited]'
        updateComment(commentData)
        editable.removeChild(edit);
        shown = false;
        input.value = '';
        input.placeholder = commentData.comment
    })
}

function deleteComment(commentData) {
    const url = baseUrl+ 'comments/' + commentData.id;

    const opt = {
        method: 'DELETE',
    }

    fetch(url,opt).then(() => getPostComments(commentData.key))
    toastMessage.innerText = 'Removed'
    toast.classList.remove('invisible')
}

function editableCommentField(commentData, div) {
    let editable = cpe(div,'div','')
    editable.classList.add('relative','w-8/12')

    let input = cpe(editable,'input','')
    input.type = 'text'
    input.classList.add('bg-gray-50','border','border-gray-300','text-gray-900','text-sm','rounded-lg','focus:ring-blue-500','focus:border-blue-500','block','w-full','p-2.5','mr-4')
    input.placeholder = commentData.comment

    let remove = cpe(editable, 'button', 'Remove')
    remove.type = "button"
    remove.classList.add('text-white', 'bg-blue-700', 'hover:bg-blue-800', 'focus:outline-none', 'focus:ring-4', 'focus:ring-blue-300', 'font-medium', 'rounded-full', 'text-sm', 'px-2', 'py-0.5','mt-3', 'text-center', 'mr-1', 'mb-1')

    remove.addEventListener('click', () => {
        deleteComment(commentData)
    })

    let shown = false
    editable.addEventListener('keyup', () => {
        if (!shown) {
            shown=true
            editShowButton(editable,input,commentData,shown)
        }
    })
}

function showComments(dat){
    commentDiv.innerHTML = ''
    const commentSection = cpe(commentDiv,'div','')
    commentSection.classList.add('max-h-52','overflow-auto','max-w-fit','w-auto')
    dat.forEach( commentData => {
        let div = cpe(commentSection,'div','')
        div.classList.add('flex','m-5','flex-wrap')

        let img = cpe(div,'img','')
        img.src = 'img/avatar.png'
        img.classList.add('w-9','h-9','mr-5')


        if (commentData.author === User){
            editableCommentField(commentData,div)
        }else {
            let comment = cpe(div,'h3',commentData.comment)
            comment.classList.add('self-center','mr-6')
        }

        let author = cpe(div,'h5',commentData.author)
        author.classList.add('self-end','ml-auto')
    })

}