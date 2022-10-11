// Variables
// Campos del formulario

const mascotaInput = document.querySelector("#mascota")
const propietarioInput = document.querySelector("#propietario")
const telefonoInput = document.querySelector("#telefono")
const fechaInput = document.querySelector("#fecha")
const horaInput = document.querySelector("#hora")
const sintomasInput = document.querySelector("#sintomas")

// UI
const formulario = document.querySelector("#nueva-cita")
const contenedorCitas = document.querySelector("#citas")

let editando;

class Citas {
    constructor(){
        this.citas= []
    }

    agregarCitas(cita){
        this.citas = [...this.citas, cita]

        console.log(this.citas)
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id)

        console.log(this.citas)
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id  ? citaActualizada : cita)
    }

} 

class UI {

    imprimirAlerta(mensaje, tipo){
        // crear el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

        // Agregar clase en base al tipo de error
        if (tipo === "error") {
            divMensaje.classList.add("alert-danger")
        } else {
            divMensaje.classList.add("alert-success")
        }

        divMensaje.textContent = mensaje;

        document.querySelector("#contenido").insertBefore(divMensaje,document.querySelector(".agregar-cita"))

        setTimeout(() => {
            divMensaje.remove()
        }, 5000);
    }

    imprimirCitas({citas}) {
        
        this.limpiarHTML()

        citas.forEach( cita => {

            const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement("div");
            divCita.classList.add("cita", "p-3")
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita

            const mascotaParrafo = document.createElement("h2")
            mascotaParrafo.classList.add("card-title", "font-weigth-bolder")
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement("p")
            propietarioParrafo.innerHTML = `
            <span class="font-weigth-bolder" >Propietario: </span> ${propietario}
            `
            const telefonoParrafo = document.createElement("p")
            telefonoParrafo.innerHTML = `
            <span class="font-weigth-bolder" >Teléfono: </span> ${telefono}
            `
            const fechaParrafo = document.createElement("p")
            fechaParrafo.innerHTML = `
            <span class="font-weigth-bolder" >Fecha: </span> ${fecha}
            `
            const horaParrafo = document.createElement("p")
            horaParrafo.innerHTML = `
            <span class="font-weigth-bolder" >Hora: </span> ${hora}
            `
            const sintomasParrafo = document.createElement("p")
            sintomasParrafo.innerHTML = `
            <span class="font-weigth-bolder" >Sintomas: </span> ${sintomas}
            `

            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger" , "mr-2")
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>`

            btnEliminar.onclick = () => eliminarCita(id)

            const btnEditar = document.createElement("button")
            btnEditar.classList.add("btn","btn-info")
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>`
          
            btnEditar.onclick = ()=> cargarEdicion(cita)

            divCita.appendChild(mascotaParrafo)
            divCita.appendChild(propietarioParrafo)
            divCita.appendChild(telefonoParrafo)
            divCita.appendChild(fechaParrafo)
            divCita.appendChild(horaParrafo)
            divCita.appendChild(sintomasParrafo)
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)

            contenedorCitas.appendChild(divCita)
        })
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }

}

const ui = new UI();
const administrarCitas = new Citas()

// Registrar Eventos
eventListeners();
function eventListeners() {
    
    mascotaInput.addEventListener("input", datosCita)
    propietarioInput.addEventListener("input", datosCita)
    telefonoInput.addEventListener("input", datosCita)
    fechaInput.addEventListener("input", datosCita)
    horaInput.addEventListener("input", datosCita)
    sintomasInput.addEventListener("input", datosCita)

    formulario.addEventListener("submit", nuevaCita)

}

// Objeto con la informacion de la cita
const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: "",
}


// Agrega datos al objeto de la cita
function datosCita(e) {

    citaObj[e.target.name] = e.target.value

}

// Valida y agrega una nueva cita a la base de citas

function nuevaCita(e) {
    e.preventDefault();



    // Extraer la informacion del objeto de la cita
    const { mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    // Validar
    if ([mascota, propietario, telefono, fecha, hora, sintomas].includes("")) {
        ui.imprimirAlerta("Todos los campos son obligatorios", "error")

        return;
    }

    if (editando) {
        ui.imprimirAlerta("Editado Correctamente")

        administrarCitas.editarCita({...citaObj})

        formulario.querySelector('button[type="submit"]').textContent = "Crear Cita"

        // Quitar Modo Edicion
        editando = false;


    } else {
    // Generar un id único

    citaObj.id = Date.now();

    // Creando una nueva cita
    administrarCitas.agregarCitas({...citaObj})

    // Mensaje de cita agregada
    ui.imprimirAlerta("Se agrego correctamente")
    }



    //Reiniciar objeto


    reiniciarObjeto();

    //Reiniciar formulario
    formulario.reset();

    // Mostrar el HtML de las citas
    ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto() {
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

function eliminarCita(id) {
    // Eliminar cita
    administrarCitas.eliminarCita(id)

    // Muestre un mensaje
    ui.imprimirAlerta("La cita se elimino correctamente")

    // Refrescar las citas
    ui.imprimirCitas(administrarCitas);
}

function cargarEdicion(cita) {

    const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    // Llenar los inputs
    mascotaInput.value = mascota
    propietarioInput.value = propietario
    telefonoInput.value = telefono
    fechaInput.value = fecha
    horaInput.value = hora
    sintomasInput.value = sintomas

    citaObj.mascota = mascota
    citaObj.propietario = propietario
    citaObj.telefono = telefono
    citaObj.fecha = fecha
    citaObj.hora = hora
    citaObj.sintomas = sintomas
    citaObj.id = id

    // Cambiar el texto del boton

    formulario.querySelector('button[type="submit"]').textContent = "Guardar Cambios"

    editando = true;
    
}