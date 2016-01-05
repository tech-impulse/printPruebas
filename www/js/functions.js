/*************************************************************
  Esta funcion muestra la pantalla de pago cuando se clica en 
  el boton de checkout
**************************************************************/
function checkOut() {

    //if (LOGGED == true) {
    if (CART.length > 0) {
        console.log("Actualizar div");
        $('.ui-popup').popup('close');

        if (SHOPDELIVERY == 0) {
            var html = '<div>' +
                '<center>' +
                '<h3> ¿Que deseas hacer con el pedido?</h3>' +
                '<br>' +
                '<a  data-corners="false" style="width:300px" onclick="sendEmail();" data-role="button" data-icon="bullets" data-iconpos="right" data-theme="b">' + jsonIdiomas.pagina_pago.envio_email + '</a>' +
                '<br>' +
                '<a  data-corners="false" style="width:300px" onclick="displaySummary(\'home\');" data-role="button" data-icon="home" data-iconpos="right" data-theme="b">Enviar a Casa</a>' +
                '</center>' +
                '</div>';
            $("#divContent").html(html);
            $("#divContent").trigger('create');
            var n = nodeIds.length + 1;
            updateBackButton(nodeIds[n], nodeNames[n]);

        } else {
            var html = '<div>' +
                '<center>' +
                '<h3> ¿Que deseas hacer con el pedido?</h3>' +
                '<br>' +
                '<a data-corners="false" style="width:300px" onclick="sendEmail();" data-role="button" data-icon="bullets" data-iconpos="right" data-theme="b" >' + jsonIdiomas.pagina_pago.envio_email + '</a>' +
                '<br>' +
                '<a data-corners="false" style="width:300px" onclick="displaySummary(\'home\');" data-role="button" data-icon="home" data-iconpos="right" data-theme="b" >Enviar a Casa</a>' +
                '<br>' +
                '<a data-corners="false" style="width:300px" onclick="displaySummary(\'store\');" data-role="button" data-icon="shop" data-iconpos="right" data-theme="b" >Recoger en Mi Tienda</a>' +
                '</center>' +
                '</div>';
            $("#divContent").html(html);
            $("#divContent").trigger('create');
            var n = nodeIds.length + 1;
            updateBackButton(nodeIds[n], nodeNames[n]);
        }
    } else {
        alert("No hay productos");
    }
    /*} else {
        $('.ui-popup').popup('close');
        setTimeout(function () {
            REDIRECT = true;
            $("#popupLogin").popup("open");
        }, popupTimeout);
        console.log("No estás logado");
    }*/

    $("#page_count").hide();

}

/*********************************************************************
  Esta funcion sirve para actualizar el boton de atras de la pantalla
  Parametros:
  originNode: el node de donde venimos
  originName: nombre del nodo del que venimos
  Variables:
  nodeIds:lista de nodos por los que hemos pasado
  nodeNames: lista de los nombres de los nodos por los que hemos pasado
*********************************************************************/
function updateBackButton(originNode, originName, linkImg) {

    //console.log("Imagen es " + linkImg + " lonjutud es " + nodeIds.length);

    if (nodeIds.length == 0) {
        //console.log("Iniciamos Imagen es " + linkImg + " lonjutud es " + nodeIds.length);
        //añadimos volver al menú
        nodeIds.push(0);
        nodeNames.push(jsonIdiomas.header.menu);
        nodeImg.push(linkImg);
        //añadimos volver a la opcion elegida del menú 
        nodeIds.push(originNode);
        nodeNames.push(originName);
        nodeImg.push(linkImg);
    } else {

        //console.log("Añadimos Imagen es " + linkImg + " lonjutud es " + nodeIds.length);
        nodeIds.push(originNode);
        nodeNames.push(originName);
        nodeImg.push(linkImg);
    }
    // ponemos menos 2 porque añadimos uno de mas al inicio
    $("#divBack").html('<div onclick="backPage(' + nodeIds[nodeIds.length - 2] + ', \'' + nodeNames[nodeNames.length - 2] + '\', \'' + nodeImg[nodeImg.length - 2] + '\')"> <span  class="flaticon-leftarrow" style="font-size:8px; margin-right:10px"></span>' + nodeNames[nodeNames.length - 2] + '</div>');


}


/******************************************
 Esta funcion enseña el pop up de idiomas
******************************************/
function changeIdiomPopUp() {

    console.log("PopUp idiomas");

    setTimeout(function () {
        $("#popupIdiomas").popup("open");
    }, popupTimeout);

}


/**************************************************************************
  Esta funcion se utiliza para cambiar el idioma de la app
  Parametros:
  idioma:el nuevo idioma que queremos ( es el nombre corto, ej: es de españa)
  idiomaId: el id del idioma nuevo
**************************************************************************/
function changeIdiom(idioma, idiomaId) {

    console.log("Cambiamos el idioma " + idioma);

    idiomStore = idioma;
    language = idiomaId;

    if (CART.length > 0) {
        getTraduccion(idioma);
    }

    translateButtons(idiomStore);

}

/************************************************************************************************
  Esta funcion se utiliza en la pantalla intermedia antes de entrar al asist. fiesta o disfraces
  para añadir o quitar personas del input
  Parametros:  
  oparation:sumar o restar personas
*************************************************************************************************/
function addPeople(oparation) {

    var valor = $("#personas_fiesta").val();
    //console.log("Valor de personas es " + valor);

    if (valor == "") valor = 0;

    if (oparation == 0 && valor > 2) { //para que el minimo de personsa sea 2
        if (valor != 0 || valor != "") {
            valor = parseInt(valor) - 1;
            $("#personas_fiesta").val(valor);
            //console.log("Sumamos " + valor);
        } else {
            //console.log("No hacemos nada ya que es cero");
        }
    } else if (oparation == 1) {
        valor = parseInt(valor) + 1;
        //console.log("Sumamos " + valor);
        $("#personas_fiesta").val(valor);
    }



}

/**************************************************************************
  Esta funcion para dormir la app durante el tiempo que le digamos en milisegundos
***************************************************************************/
function sleep(millisegundos) {
    var inicio = new Date().getTime();
    while ((new Date().getTime() - inicio) < millisegundos) {}
}

function volver(id_product, idnodo) {

    $("#popupListItems").popup("close");
    /*setTimeout(function () {
            $("#popupListItems").popup("open");
        }, popupTimeout);*/
    displayPopupItemDetail(idnodo, 'PRODUCTOS', id_product);

}



function guardarInfo(accion) {

    console.log("Pop para guardar carrito o no" + accion);

    if (accion == "si") {

        var position = (nodeIds.length);

        position = nodeIds.length;
        console.log("Antes de borrar " + nodeIds[position]);
        nodeIds.splice(position - 2);
        nodeNames.splice(position - 2);
        nodeImg.splice(position - 2);
        console.log(nodeIds);

        setTimeout(function () {
            $("#popupPregunta").popup("close");
        }, popupTimeout);
        //getNodes(idNode, nodeName, 0, linkint, "back");
        getNodes(nodeIds[nodeIds.length - 1], nodeNames[nodeNames.length - 1], 0, nodeImg[nodeImg.length - 1], "back");


    } else {

        for (var i = CART.length - 1; i >= 0; i--) {
            if (CART[i].dedonde == "Asistente fiestas") {
                //console.log("Borramos el item " + CART[i].id);

                CART.ammount = CART.ammount - (CART[i].price_x_region[0].totalPrice * CART[i].quantity)
                deleteItemCart(i);
            }

        }

        var total = 0;
        for (var i = 0; i < CART.length; i++) {
            total = total + CART[i].quantity;
        }
        $("#spBtnPopupCartProducts").text(total);
        $("#spBtnPopupCartAmmount").text(formatoNumero(CART.ammount, 2, ",", ".", "€"));
        $("#spPopupCartCount").text(total);
        $("#spPopupTotalAmmount").text(formatoNumero(CART.ammount, 2, ",", ".", "€"));

        var position = (nodeIds.length);


        position = nodeIds.length;
        console.log("Antes de borrar " + nodeIds[position]);
        nodeIds.splice(position - 2);
        nodeNames.splice(position - 2);
        nodeImg.splice(position - 2);
        console.log(nodeIds);
        setTimeout(function () {
            $("#popupPregunta").popup("close");
        }, popupTimeout);
        getNodes(nodeIds[nodeIds.length - 1], nodeNames[nodeNames.length - 1], 0, nodeImg[nodeImg.length - 1], "back");


    }

}


function cerrar_popup() {

    $("#popupIdiomas").popup("close");

}