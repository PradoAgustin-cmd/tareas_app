const lista = document.getElementById('lista-tareas');
const form = document.getElementById('form-tarea');
const input = document.getElementById('texto');
const template = document.getElementById('template-tarea');
let tareas = [];
let filtroActual = 'todas';

function cargarTareas() {
    fetch('/api/tareas')
        .then(res => res.json())
        .then(data => {
            tareas = data;
            renderizarTareas();
        });
}

function renderizarTareas() {
    lista.innerHTML = '';
    tareas.filter(filtrarPorEstado).forEach(tarea => {
        const clone = template.content.cloneNode(true);
        const li = clone.querySelector('li');
        const texto = clone.querySelector('.texto');
        const fecha = clone.querySelector('.fecha');
        const toggleBtn = clone.querySelector('.toggle');
        const editarBtn = clone.querySelector('.editar');
        const eliminarBtn = clone.querySelector('.eliminar');

        li.dataset.id = tarea.id;
        texto.textContent = tarea.texto;
        fecha.textContent = new Date(tarea.fechaCreacion).toLocaleDateString();
        if (tarea.completada) li.classList.add('completed');

        toggleBtn.onclick = () => toggleTarea(tarea.id, !tarea.completada);
        editarBtn.onclick = () => editarTarea(tarea);
        eliminarBtn.onclick = () => eliminarTarea(tarea.id);

        lista.appendChild(clone);
    });
}

function agregarTarea(texto) {
    fetch('/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, completada: false })
    }).then(() => {
        input.value = '';
        cargarTareas();
    });
}

function toggleTarea(id, completada) {
    fetch(`/api/tareas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completada })
    }).then(() => cargarTareas());
}

function eliminarTarea(id) {
    fetch(`/api/tareas/${id}`, { method: 'DELETE' })
        .then(() => cargarTareas());
}

function editarTarea(tarea) {
    const nuevoTexto = prompt('Editar tarea:', tarea.texto);
    if (nuevoTexto && nuevoTexto.trim() !== '') {
        fetch(`/api/tareas/${tarea.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: nuevoTexto })
        }).then(() => cargarTareas());
    }
}

function filtrar(estado) {
    filtroActual = estado;
    renderizarTareas();
}

function filtrarPorEstado(tarea) {
    if (filtroActual === 'completadas') return tarea.completada;
    if (filtroActual === 'pendientes') return !tarea.completada;
    return true;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const texto = input.value.trim();
    if (texto) agregarTarea(texto);
});


cargarTareas();

