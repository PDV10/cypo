"use strict"

let urlPrincipal = "principal.html"
partial(urlPrincipal);

async function partial(url) {

    try {
        let response = await fetch(url);
        if (response.ok) {

            let contenido = await response.text()
            let partial = document.querySelector("#partial");
            partial.innerHTML = contenido;
            cargarLinks();
            if (url.search("componentes.html") != -1) {
                cargarLinksComponentes();
            }
            if (url.search("registro.html") != -1) {
                cargarCaptcha();
            }
        }
        else {
            console.log("error");
        }
    } catch (error) {
        console.log(error);
    }
}

function cargarLinks() {
    let links = document.querySelectorAll('a.partial');
    console.log(links)
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', (e) => {
            e.preventDefault();
            console.log(links[i].href);
            partial(links[i].href);

        })
    }
}

async function partialComponentes(url) {

    try {
        let response = await fetch(url);
        if (response.ok) {

            let contenido = await response.text()
            let partial = document.querySelector("#partialComponentes");
            partial.innerHTML = contenido;
        }
        else {
            console.log("error");
        }
    } catch (error) {
        console.log(error);
    }
}

const url = "https://60ca92fd772a760017206357.mockapi.io/tpe";
let mensaje;
let buttonMostrarTabla;
let buttonAgregar;
let producto;
let precio;
let tablaTbody;
let tfoot;
let contenedorTabla;
let buttonAgregoAutomatico;
let buttonVaciar;
let inpFiltrar;
let contador;
let contadorAuxiliar;
let num = 1;
let buttonAnterior;
let buttonSiguiente;
let cantPaginas;

cantPag();

async function cantPag() {
    cantPaginas = await obtenerTamanoJson()
}

function cargarLinksComponentes() {
    let urlPrincipalComponentes = "componentesPrincipal.html"
    partialComponentes(urlPrincipalComponentes);

    let links = document.querySelectorAll('a.componentes');

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', (e) => {
            e.preventDefault();

            partialComponentes(links[i].href);

        })
    }
    buttonAgregar = document.querySelector("#button-agregar").addEventListener('click', agregarContenido);
    buttonMostrarTabla = document.querySelector("#button-mostrar").addEventListener('click', mostrarTabla);

    buttonComponentes = document.querySelector("#button-componentes").addEventListener('click', mostrarMenuComponentes);
    menuHamburguesa = document.querySelector(".Lista-menu")
    menuComponentes = document.querySelector(".contenido-menu-componentes")

    buttonAnterior = document.querySelector("#btn-anterior");
    buttonSiguiente = document.querySelector("#btn-siguiente");

    buttonAnterior.addEventListener("click", () => {
        obtenerContenido(num--)
        buttonSiguiente.classList.add("mostrarBoton")
        buttonSiguiente.classList.remove("esconder")

        cantPag()
        if (num <= 1) {

            buttonAnterior.classList.add("esconder")
            buttonAnterior.classList.remove("mostrarBoton")
        }
    })

    buttonSiguiente.addEventListener("click", () => {
        obtenerContenido(num++)
        buttonAnterior.classList.add("mostrarBoton")
        buttonAnterior.classList.remove("esconder")

        cantPag()
        if (num > cantPaginas - 1) {
            buttonSiguiente.classList.add("esconder")
            buttonSiguiente.classList.remove("mostrarBoton")
        }
    })
    
    mensaje = document.querySelector("#mensaje");
    producto = document.querySelector("#producto");
    precio = document.querySelector("#precio");
    tablaTbody = document.querySelector("#tabla-tbody");
    tfoot = document.querySelector("#tfoot");
    contenedorTabla = document.querySelector(".contenedor-tabla");
    buttonAgregoAutomatico = document.querySelector("#agrego-automatico");
    buttonAgregoAutomatico.addEventListener('click', automatico);
    buttonVaciar = document.querySelector("#button-vaciar");
    buttonVaciar.addEventListener('click', vaciar);
    inpFiltrar = document.querySelector("#filtrar");
    inpFiltrar.addEventListener("keyup", filtrar);
    contador = 0;
    contadorAuxiliar = 0;
}
/*-------------------------------------------------------------TABLA-----------------------------------------------------------------*/

async function filtrar() {
    let productosFiltrados = [];
    let filtrado = inpFiltrar.value.toLowerCase();
    let promesa;
    let tabla;
    try {
        if (!(filtrado == "")) {

            promesa = await fetch(url);
            if (promesa.ok) {
                tabla = await promesa.json()
            }

        } else {
            promesa = await fetch(`${url}?p=${num}&l=${5}`);
            if (promesa.ok) {
                tabla = await promesa.json()
            }
        }

        for (let i = 0; i < tabla.length; i++) {

            if (tabla[i].producto.toLowerCase().includes(filtrado)) {
                productosFiltrados.push(tabla[i]);
            }
        }
        mostrarContenido(productosFiltrados);
    }
    catch (error) {
        console.log(error);
    }
}

function agregarContenido() {
    let datos = {
        "producto": producto.value,
        "precio": precio.value,
        "descuento": "false",
    }
    if (!(producto.value == "" || precio.value == "")) {
        mensaje.innerHTML = "";
        agregar(datos);
    } else {
        mensaje.innerHTML = "no se puede agregar si algun input se encuentra vacios";
        setTimeout(() => {
            mensaje.innerHTML = "";
        }, 3000);
    }

    producto.value = "";
    precio.value = "";
}

async function agregar(datos) {
    tablaTbody.innerHTML = "";
    tablaTbody.innerHTML = `<h1>cargando..</h1>`
    try {
        let resp = await fetch(url, {
            "method": "POST",
            "headers": { "Content-type": "application/json" },
            "body": JSON.stringify(datos)
        });
        if (resp.ok) {
            console.log("se agrego");
            await obtenerContenido();
        }
    } catch (error) {
        console.log("error catch");
    }
}

function mostrarContenido(productos) {
    tablaTbody.innerHTML = "";
    for (let i = 0; i < productos.length; i++) {
        if (!(isNaN(parseInt(productos[i].precio, 10)))) {

            if (productos[i].descuento === "false") {
                if (productos[i].precio >= 8000) {
                    tablaTbody.innerHTML += `<tr id = "${productos[i].id}"> 
                                                 <td>${productos[i].producto}</td>
                                                 <td> $${productos[i].precio}</td>
                                                 <td class="borrarEditar">
                                                 <button class="btnBorrar">
                                                    <img src="ico/cancelar.png" alt="boton borrar">
                                                 </button>
                                                 <button class="btnEditar">
                                                    <img src="ico/editar.png" alt="boton editar">
                                                 </button>
                                             </td>
                                             </tr>`;
                    contador += parseInt(productos[i].precio);
                }
                else {
                    let descuento = productos[i].precio * 10 / 100;
                    tablaTbody.innerHTML += `   <tr id = "${productos[i].id}"> 
                                                    <td class = "precios-Bajos">${productos[i].producto}</td>
                                                    <td class = "precios-Bajos"> $${productos[i].precio - descuento}</td>
                                                    <td class="borrarEditar">
                                                        <button class="btnBorrar">
                                                            <img src="ico/cancelar.png" alt="boton borrar">
                                                        </button>
                                                        <button class="btnEditar">
                                                            <img src="ico/editar.png" alt="boton editar">
                                                        </button>
                                                    </td>
                                                </tr>`;
                    contador += parseInt(productos[i].precio - descuento);
                }

            } else {
                tablaTbody.innerHTML += `<tr id = "${productos[i].id}"> 
                                            <td class = "descuentos">${productos[i].producto}</td>
                                            <td class = "descuentos"> $${productos[i].precio}</td>
                                            <td class="borrarEditar">
                                                <button class="btnBorrar">
                                                    <img src="ico/cancelar.png" alt="boton borrar">
                                                </button>
                                                <button class="btnEditar">
                                                    <img src="ico/editar.png" alt="boton editar">
                                                </button>
                                            </td>
                                        </tr>`;
                contador += parseInt(productos[i].precio);
            }

        }
        let buttonBorrar = document.querySelectorAll(".btnBorrar");

        for (let i = 0; i < buttonBorrar.length; i++) {
            buttonBorrar[i].addEventListener('click', () => { borrar(productos[i].id) });
        }

        let buttonEditar = document.querySelectorAll(".btnEditar");
        for (let i = 0; i < buttonEditar.length; i++) {
            buttonEditar[i].addEventListener('click', () => { inputsEditar(productos[i].id) });
        }
    }
    contadorAuxiliar = contador;
    total(contadorAuxiliar);
    contador = 0;
}

async function obtenerContenido() {

    try {
        let promesa = await fetch(`${url}?p=${num}&l=${5}`);
        if (promesa.ok) {
            let productos = await promesa.json();
            mostrarContenido(productos)
        }
    } catch (error) {
        console.log(error);
    }
}

async function obtenerTamanoJson() {
    try {
        let promesa = await fetch(url);
        if (promesa.ok) {
            let productos = await promesa.json();
            let cantPaginas = 0;
            if (productos.length / 5 == 1) {
                cantPaginas = 1
                return cantPaginas;
            } else {
                let tamano = productos.length / 5;
                cantPaginas = tamano + 1;
                return cantPaginas;
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function automatico() {

    let agregoAutomatico = [{
        "producto": "Auriculares Logitech g332",
        "precio": "6000",
        "descuento": "true",
    },
    {
        "producto": "Microfono Sf66",
        "precio": "2300",
        "descuento": "true",
    },
    {
        "producto": "Teclado thermaltake tt sports",
        "precio": "3500",
        "descuento": "true",
    },
    {
        "producto": "Mouse logitech G series hero G403 ",
        "precio": "3000",
        "descuento": "true",
    },
    {
        "producto": "Mouse pad thermaltake tt sports",
        "precio": "2600",
        "descuento": "true",
    }];

    for (let i = 0; i < agregoAutomatico.length; i++) {
        await agregar(agregoAutomatico[i]);
    }

}

async function borrar(id) {
    try {
        let resp = await fetch(`${url}/${id}`, {
            "method": "DELETE"
        });
        if (resp.ok) {
            console.log("ELIMINADO CON EXITO");
            await obtenerContenido();
        }
    } catch (error) {
        console.log(error);
    }
}

async function inputsEditar(id) {

    let tr = document.getElementById(id);

    tr.innerHTML = ` 
                    <td><input type="text" id="editarProducto" placeholder="Producto"></td>
                    <td><input type="number" id="editarPrecio" placeholder="Precio"></td>
                    <td class="borrarEditar"> 
                        <button class ="btnAceptar" > <img src="ico/aceptar.png" alt="boton aceptar"> </button> 
                        <button class="btnCancelar"> <img src="ico/cancelar.png" alt="boton borrar"> </button> 
                    </td>`;

    let buttonAceptar = document.querySelector(".btnAceptar");
    buttonAceptar.addEventListener('click', () => { editar(id) });

    let buttonCancelar = document.querySelector(".btnCancelar");
    buttonCancelar.addEventListener('click', () => { obtenerContenido() })

}

async function editar(id) {
    let editarProducto = document.querySelector("#editarProducto");
    let editarPrecio = document.querySelector("#editarPrecio");

    let datosAModificar = {
        "producto": editarProducto.value,
        "precio": editarPrecio.value,
        "descuento": "false",
    }

    if (datosAModificar.producto != "" && datosAModificar.precio != "") {
        try {
            let resp = await fetch(`${url}/${id}`, {
                "method": "PUT",
                "headers": { "Content-type": "application/json" },
                "body": JSON.stringify(datosAModificar)
            });
            if (resp.ok) {
                await obtenerContenido();
                console.log("modificado");

            }
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("no se puede dejar inputs vacios")
        obtenerContenido();
    }
}

async function vaciar() {
    let promesa = await fetch(url);
    if (promesa.ok) {
        let productos = await promesa.json();
        tablaTbody.innerHTML = "";

        for (let i = 0; i < productos.length; i++) {
            await borrar(productos[i].id);
        }
    }
}

function total(contador) {
    tfoot.innerHTML = "";
    tfoot.innerHTML += `<tr> 
                            <td> Total </td>
                            <td> $${contador}</td>
                         </tr>`;
}


/*------------------------------------------------------BOTON MOSTRAR TABLA-------------------------------------------------- */

function mostrarTabla() {

    tablaTbody.innerHTML = "";

    obtenerContenido();
    contenedorTabla.classList.toggle("mostrar");

    if (menuHamburguesa.classList.contains('mostrar')) {
        menuHamburguesa.classList.remove('mostrar');
    }

    if (menuComponentes.classList.contains('mostrar')) {
        menuComponentes.classList.remove('mostrar');
    }
}

/*------------------------------------------------------MOSTRAR MENU COMPONENTES---------------------------------------------*/

function mostrarMenuComponentes() {

    menuComponentes.classList.toggle('mostrar');
    if (menuHamburguesa.classList.contains('mostrar')) {
        menuHamburguesa.classList.remove('mostrar');
    }
}

/*------------------------------------------------------------CAPTCHA------------------------------------------------------*/

let correcto;
let buttonVerificar;

function cargarCaptcha() {
    correcto = 'ge5h';
    Crearcaptcha();
    buttonVerificar = document.getElementById("button");
    buttonVerificar.addEventListener("click", Captcha);
}


function Captcha(e) {
    e.preventDefault();

    let ingresarResultado = document.getElementById("resultado");
    let verificarResultado = document.getElementById("verificar");

    if ((ingresarResultado.value.toUpperCase() === correcto.toUpperCase())) {
        verificarResultado.innerHTML = "El captcha ingresado es: correcto"
        verificarResultado.classList.add("correcto");
        verificarResultado.classList.remove("incorrecto");
    } else {
        verificarResultado.innerHTML = "El captcha ingresado es: incorrecto"
        verificarResultado.classList.remove("correcto");
        verificarResultado.classList.add("incorrecto");
        Crearcaptcha();
    }

    ingresarResultado.value = "";
}


function Crearcaptcha() {
    let Captcha = Math.floor((Math.random() * 7) + 1);
    let url = 'img/Captcha/captcha' + Captcha + '.jpg';
    document.getElementById('img').src = url;
    if (url === 'img/Captcha/captcha1.jpg') {
        correcto = 'y8b4';
    }
    else if (url === 'img/Captcha/captcha2.jpg') {
        correcto = '2hpy';
    }
    else if (url === 'img/Captcha/captcha3.jpg') {
        correcto = '5tz7';
    }
    else if (url === 'img/Captcha/captcha4.jpg') {
        correcto = 'y577';
    }
    else if (url === 'img/Captcha/captcha5.jpg') {
        correcto = 'l5bh';
    }
    else if (url === 'img/Captcha/captcha6.jpg') {
        correcto = '3cwu';
    }
    else if (url === 'img/Captcha/captcha7.jpg') {
        correcto = 'ge5h';
    }
}
