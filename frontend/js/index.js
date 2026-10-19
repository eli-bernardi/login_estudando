const verificarLog = document.getElementById('verificarLog')
const token = localStorage.getItem('token')
const nome = localStorage.getItem('nome')

if (token) {
    verificarLog.innerHTML = `<a href="#" id="btn_logout">Logout</a> &emsp;`
    verificarLog.innerHTML += `<span class="titulo_menu">${nome}</span>`

    const btn_logout = document.getElementById('btn_logout')

    btn_logout.addEventListener('click', () => {
        localStorage.clear()
        location.reload()
    })
} else {
    verificar_log.innerHTML = `<a href="./html/login.html">Login</a>`
}