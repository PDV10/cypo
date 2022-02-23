let buttonMenu = document.querySelector("#button-menu");

let buttonComponentes = document.querySelector("#button-componentes");

let menuComponentes = document.querySelector(".contenido-menu-componentes");

let menuHamburguesa = document.querySelector(".Lista-menu");

   
if(buttonMenu != null){
    buttonMenu.addEventListener('click', mostrarMenu);
}    

function mostrarMenu(){
    menuHamburguesa.classList.toggle('mostrar');
    if(menuComponentes != null){
        if(menuComponentes.classList.contains('mostrar')){ 
            menuComponentes.classList.remove('mostrar');
        }
        if (contenedorTabla.classList.contains('mostrar')){
            contenedorTabla.classList.remove('mostrar');
        }
    }
}





