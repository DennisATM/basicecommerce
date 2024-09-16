
//Prototipo Producto, se modificó la estructura con respecto a los requerimientos para poder agregar una imagen del producto
function Producto(nombre,precio,urlImg){
    let _nombre=nombre;
    let _precio=precio;
    let _urlImg = urlImg;

    this.getNombre=function(){
        return _nombre;
    };

    this.getPrecio=function(){
        return _precio;
    };

    this.getUrlImg=function(){
        return _urlImg;
    }
}

//Prototipo Carrito con propiedades privadas, getters y setters
function Carrito(productos){
    let _productos=[];
    
    this.getCarrito = function(){
        return _productos;
    };

    this.agregarProductos = function(nuevoProducto){
        _productos.push(nuevoProducto);
    };

    this.calcularTotalFila =function(index){
        return _productos[index][1]*_productos[index][2];
    };

    this.editarCantidad = function(id, cantidad){
        _productos[id][2]+=cantidad;
    };

    this.cantidadDeProductosAgregados = function(){
        return _productos.length;
    };

    this.calcularTotalCantidadProductos = function () {
        let acumulador=0;
        _productos.forEach((producto)=>{
            acumulador+= producto[2];
        });
        return acumulador;
    };

    this.calcularTotalVenta = function(){
        let acumulador=0;
        _productos.forEach(producto=>{
            acumulador+=(producto[1]*producto[2]);
        })
        return acumulador;
    }
    this.vaciarCarrito=function(){
        _productos=[];
    }
}

//funcion externa para formato de divisa.
const formatearDivisa = (number, region, divisa) => {
    const formatoDivisa = new Intl.NumberFormat(region, {
      style: 'currency',
      currency: divisa,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  
    return formatoDivisa.format(number)
  }

//función que define el template de las cards para los productos, se invoca al pintar las cards en le DOM.
const insertarCards = (template,producto,id) => {
    template.innerHTML+=
    `<div class="card col-6 col-md-3 col-lg-2" id="card${id}">
        <div>
            <img class="card-img" id="img-card${id}" src="${producto.getUrlImg()}" alt="">
        </div>
        <div class="card-body">
            <h4 class="card-title" id="title-card${id}">${producto.getNombre()}</h4>
            <p class="card-text" id="price-card${id}">${formatearDivisa(producto.getPrecio(), REGION, DIVISA)}</p>
        </div>
        <div>
            <button class="card-btn" id="btn-card${id}">Agregar</button>
        </div>
    </div>`
}

//función externa que evita que el producto se agregue dos veces, en caso se encuentre, sólo modifica la cantidad.
//se invoca al método agregarProductos del prototipo Carrito si no existe o al método editarCantidad si ya existe.
const agregarProducto = (producto)=>{
    let encontrado= carritoActual.getCarrito().findIndex(x=> x[0] === producto.getNombre());
    if(encontrado===-1){
        carritoActual.agregarProductos([producto.getNombre(),producto.getPrecio(),1])
    }else{
        carritoActual.editarCantidad(encontrado,1);
    }
    cartCounter.textContent = carritoActual.calcularTotalCantidadProductos();

}

//Declaración de constantes y variables
const cardContainer = document.querySelector('#cards-container');
const cartContent = document.querySelector('#cart-content');
const btnCart = document.querySelector('#cart');
const btnProducto = document.getElementsByClassName('card-btn');
const cartTotales = document.getElementById('cart-totales');
const cerrarCompra = document.getElementById('cerrar-compra'); 

const REGION = "es-CL";
const DIVISA = 'CLP'

let cartCounter = document.getElementById('cart-counter');


//instanciando el listado de productos y el carrito vacío.
let producto1 = new Producto('Zanahoria x Kg.',1400,'./assets/img/zanahorias.webp');
let producto2 = new Producto('Tomate x Kg.',1200,'./assets/img/tomates.webp');
let producto3 = new Producto('Lechuga Carola x Und.',500,'./assets/img/carola.webp');
let producto4 = new Producto('Cebolla x Und.',200,'./assets/img/cebolla.webp');
let producto5 = new Producto('Papa x Kg.',1400,'./assets/img/papa.webp');
let producto6 = new Producto('Pepino x Und.',500,'./assets/img/pepino.webp');
let producto7 = new Producto('Pimiento Rojo x Und.',600,'./assets/img/pimiento.webp');
let carritoActual = new Carrito();

//pintando la cantidad de productos agregados al carrito en el contador.
cartCounter.textContent= carritoActual.calcularTotalCantidadProductos();

//pintando las cards en el template.
insertarCards(cardContainer,producto1,1);
insertarCards(cardContainer,producto2,2);
insertarCards(cardContainer,producto3,3);
insertarCards(cardContainer,producto4,4);
insertarCards(cardContainer,producto5,5);
insertarCards(cardContainer,producto6,6);
insertarCards(cardContainer,producto7,7);

//Rutina para cargar datos del carrito en el modal.
btnCart.addEventListener('click',function(){
    cartContent.innerHTML="";
    if(carritoActual.cantidadDeProductosAgregados() == 0){
        cartContent.innerHTML='<p class="text-danger">No existen productos en carrito !!</p>';
    }else{
        for(let i=0; i<carritoActual.cantidadDeProductosAgregados();i++){
            
            cartContent.innerHTML+=`<tr>
                                    <td>${carritoActual.getCarrito()[i][0]}</td>
                                    <td class="text-end">${formatearDivisa(carritoActual.getCarrito()[i][1],REGION,DIVISA)}</td>
                                    <td class="text-center">${carritoActual.getCarrito()[i][2]}</td>
                                    <td class="text-end">${formatearDivisa(carritoActual.calcularTotalFila(i),REGION,DIVISA)}</td>
                                </tr>`                 
        }
        cartTotales.innerHTML=`<p class="text-primary fw-bold">Total de Compra: ${formatearDivisa(carritoActual.calcularTotalVenta(),REGION, DIVISA)}</p>`;
    }
})   

//esperando click en botones para agregar productos al carrito
btnProducto[0].addEventListener('click',function() { agregarProducto(producto1) });
btnProducto[1].addEventListener('click',function() { agregarProducto(producto2) });
btnProducto[2].addEventListener('click',function() { agregarProducto(producto3) });
btnProducto[3].addEventListener('click',function() { agregarProducto(producto4) });
btnProducto[4].addEventListener('click',function() { agregarProducto(producto5) });
btnProducto[5].addEventListener('click',function() { agregarProducto(producto6) });
btnProducto[6].addEventListener('click',function() { agregarProducto(producto7) });

//cierre de venta se valida si existen productos agregados al carrito.
cerrarCompra.addEventListener('click',function(){
    if(carritoActual.cantidadDeProductosAgregados() > 0){
        carritoActual.vaciarCarrito();
        carritoActual.calcularTotalVenta();
        cartContent.innerHTML='<p class="text-danger">No existen productos en carrito !!</p>';
        cartCounter.innerHTML=0;
        cartTotales.innerHTML="";
    
        alert('Su pedido ha sido enviado para despacho, gracias por comprar en Verdulivery!!');
    }else{
        alert('No se puede cerrar venta, el carrito está vacío!!')
    }
})