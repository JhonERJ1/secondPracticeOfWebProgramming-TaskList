const btn = document.querySelector('.btnTask')
const taskName = document.querySelector('#TaskName')
const taskDescription = document.querySelector('#TaskDescription')
const taskList = document.querySelector('.TaskList')
const tareasSet = new Set()

function limpiarFormulario(){
  taskName.value = ''
  taskDescription.value = ''
}

function normalizarTexto(texto){
  return texto.trim().replace(/\s+/g, ' ').toLowerCase()
}

function agregarTarea(){
  const nombre = taskName.value.trim()
  const descripcion = taskDescription.value.trim()
  const error = document.querySelector('#TaskError')

  if (!nombre){
    error.textContent = 'El nombre de la tarea es obligatorio'
    return
  }

  if (/^\d/.test(nombre) || /^\d+$/.test(nombre)){
    error.textContent = 'El nombre de la tarea debe comenzar con una letra y no puede ser numérico'
    return
  }

  if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ]\d$/.test(nombre)){
    error.textContent = 'Si usas números al final, deben ir separados por un espacio'
    return
  }

  //Convertir el nombre en minus
  const nombreMinus = normalizarTexto(nombre)

  //Verificar que no hayan nombres de tareas repetidas
  if (tareasSet.has(nombreMinus)){
    error.textContent = 'No deben haber dos tareas con el mismo nombre'
    return
  }

  //Vacear el error si hay
  error.textContent = ''

  const li = document.createElement('li')

  const span = document.createElement('span')
  span.textContent = normalizarTexto(nombre)

  li.append(span)

  //Verificar si hay alguna descripcion para la tarea
  if (descripcion){
    const p = document.createElement('p')
    p.textContent = descripcion
    li.appendChild(p)
  }

  taskList.appendChild(li)

  //Agregar el nombre al conjunto
  tareasSet.add(nombreMinus)

  limpiarFormulario()
}

function eliminarTarea(){

}

function editarTarea(){

}

btn.addEventListener('click', (e) =>{
  e.preventDefault()
  agregarTarea()
})


