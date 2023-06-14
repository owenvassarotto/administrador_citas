//Variables
//Inputs
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//UI
const formulario = document.querySelector('#form-nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

//Clases
class Citas{
    constructor(){
        this.citas = [];
    }

    registrarCita(cita){
        this.citas.push(cita);
        sincronizarStorage(this.citas);
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);//me devolverá todos los objetos que sean diferentes al id pasado por parámetro 😎
        sincronizarStorage(this.citas);
    }

    editarCita(citaEdit){
        this.citas = this.citas.map(cita => {
            if(cita.id === citaEdit.id){
                return citaEdit;
            }else{
                return cita;
            }
        })
        sincronizarStorage(this.citas);
    }

    citasLocalStorage(){
        //obtenemos el item citas del LS y lo asignamos al arr this.citas
        this.citas = JSON.parse(localStorage.getItem("citas")) || [];
    }
}

function sincronizarStorage(citas){
    localStorage.setItem("citas", JSON.stringify(citas));
}

class UI{
    mostrarAlerta(mensaje, tipoAlerta){
        const alerta = document.createElement("div");
        alerta.classList.add("text-center", "alert", "d-block", "col-12");
        alerta.textContent = mensaje;
        if(tipoAlerta === 'error'){
            alerta.classList.add("alert-danger");
        }else{
            alerta.classList.add("alert-success");
        }
        document.querySelector("#contenido").insertBefore(alerta, document.querySelector('.agregar-cita'));
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

    //{citas} hace un destructuring al objeto que pasamos como argumento para obtener el array citas
    mostrarCitas({citas}){

        this.limpiarHTML();

        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const mascotaTexto = document.createElement('h2');
            mascotaTexto.classList.add('card-title', 'font-weight-bolder');
            mascotaTexto.textContent = mascota;

            const propietarioTexto = document.createElement('p');
            propietarioTexto.innerHTML = `
            <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoTexto = document.createElement('p');
            telefonoTexto.innerHTML = `
            <span class="font-weight-bolder">Teléfono: </span> ${telefono}
            `;

            const fechaTexto = document.createElement('p');
            fechaTexto.innerHTML = `
            <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaTexto = document.createElement('p');
            horaTexto.innerHTML = `
            <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const sintomasTexto = document.createElement('p');
            sintomasTexto.innerHTML = `
            <span class="font-weight-bolder">Síntomas: </span>${sintomas}
            `;

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2')
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
          </svg>
          `;
            btnEliminar.onclick = () =>{
                eliminarCita(id);
            }

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          `;
            btnEditar.onclick = () => {
                editarCita(cita);
            }

            const divCita = document.createElement('div');
            divCita.classList.add("cita", "p-3");
            divCita.dataset.id = id;
            divCita.appendChild(mascotaTexto);
            divCita.appendChild(propietarioTexto);
            divCita.appendChild(telefonoTexto);
            divCita.appendChild(fechaTexto);
            divCita.appendChild(horaTexto);
            divCita.appendChild(sintomasTexto);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            contenedorCitas.appendChild(divCita);
        })
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

//Instancias
const ui = new UI();
const adminCitas = new Citas();

//Events
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', registrarValorInput);
    propietarioInput.addEventListener('input', registrarValorInput);
    telefonoInput.addEventListener('input', registrarValorInput);
    fechaInput.addEventListener('input', registrarValorInput);
    horaInput.addEventListener('input', registrarValorInput);
    sintomasInput.addEventListener('input', registrarValorInput);

    formulario.addEventListener('submit', crearCita);
    document.addEventListener('DOMContentLoaded', () =>{
        adminCitas.citasLocalStorage();
        ui.mostrarCitas(adminCitas);
    })
}

//Objeto para guardar los datos de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

function registrarValorInput(e){
    //asignamos el valor de los input a las propiedades del objeto citaObj
    citaObj[e.target.name] = e.target.value;
}

//se ejecuta con el evento SUBMIT del form
function crearCita(e){
    e.preventDefault();

    //destructuring del obj
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    //validamos que todos los campos estén llenos
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.mostrarAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if(editando){
        //edito la cita en el event submit
        adminCitas.editarCita({...citaObj});

        //mostrar alerta
        ui.mostrarAlerta('Cita editada correctamente');

        document.querySelector('#btnCrearCita').textContent = 'Crear Cita';
        document.querySelector('#btnCrearCita').classList.remove('btn-warning');
        document.querySelector('#btnCrearCita').classList.add('btn-success');

        editando = false;
    }else{
        //agregamos propiedad id al
        citaObj.id = Date.now();    

        //guardar cita en el array de clase Citas
        adminCitas.registrarCita({...citaObj});//{...citaObj} -> pasa la copia (...) de citaObj como obj individual ({})

        //mostrar alerta de exito
        ui.mostrarAlerta('Cita añadida correctamente');
    }

    reiniciarObjeto();

    //función para mostrar en el HTML
    ui.mostrarCitas(adminCitas);

    //resetear formulario
    formulario.reset();
}

function reiniciarObjeto(){
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
    citaObj.id = "";
}

function eliminarCita(id){
    adminCitas.eliminarCita(id);
    ui.mostrarAlerta('Cita eliminada correctamente');
    ui.mostrarCitas(adminCitas);
}

//esto se ejecuta cuando doy click en el btnEditar
function editarCita(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //asignamos los valores de las prop del citaObj con los valores de la cita pasados por parámetro
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    document.querySelector('#btnCrearCita').textContent = 'Editar Cita';
    document.querySelector('#btnCrearCita').classList.remove('btn-success');
    document.querySelector('#btnCrearCita').classList.add('btn-warning');

    editando = true;
}