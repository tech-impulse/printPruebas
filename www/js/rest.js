// request.abort(); // Esto aborta la conexión al webservice (Por si se necesitara)

//WS de login en la app
function getLogin(usario, contraseña) {

    // Datos que se van a enviar
    var dataSend = {
        user: usario,
        password: contraseña
    };

    var request = $.ajax({
        data: dataSend,
        url: urlServices + 'login.php',
        dataType: 'json',
        type: 'POST',
        timeout: 10000, //10 seg
        success: function (response) {

            if (response.result == 1) {

                console.log("Todo ok");
                console.log(response);
                LOGGED = true;
                //console.log(response.info);
                INFO_USU = response.info;
                $('#popupLogin').popup('close');
                $("#login").text("Bienvenido/a " + response.info.name + ","); // + usario + "
                $('#login').attr('onclick', "logout()");
                $("#login").append('<img src="http://partyfiesta.youtter.com/webservices/img/nodos/salir.jpg" style="width: 15px;margin-top: 0px;">');
                if (REDIRECT) {
                    console.log("Redirigeme");
                    REDIRECT = false;
                    checkOut();
                }

            } else if (response.result == 0) {

                console.log("No exite");
                $("#texto_popup").text("Usuario o contraseña incorrectos");
                $('#popupAlert').popup('open');

            } else if (response.result == -1) {

                $("#texto_popup").text("Error login...");
                $('#popupAlert').popup('open');

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });
}


//WS para realizar el registro del usuario
function getRegistro(usario, contraseña, cod_pos) {

    // Datos que se van a enviar
    var dataSend = {
        user: usario,
        password: contraseña,
        codigo: cod_pos
    };

    var request = $.ajax({
        data: dataSend,
        url: urlServices + 'signup.php',
        dataType: 'json',
        type: 'POST',
        timeout: 10000, //10 seg
        success: function (response) {

            if (response.result == 1) {

                console.log(response);
                displayLogin();
                $("#usrnm").val(usario);


            } else if (response.result == -2) {

                //console.log("No hay productos para este nodo");
                $("#texto_popup").text("El usuario ya existe");
                $('#popupAlert').popup('open');

            } else if (response.result == -1) {

                $("#texto_popup").text("Error registro...");
                $('#popupAlert').popup('open');

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });

}

function getFlags() {

    console.log("Pedimos los idiomas");


    var request = $.ajax({
        url: urlServices + 'getFlags.php',
        dataType: 'json',
        type: 'GET',
        timeout: 10000, //10 seg
        success: function (response) {

            console.log("Los paises nos han llegado, cargamos el popup");
            //console.log("La respuesta es ");
            console.log(response);

            displayFlags(response);

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                console.log("Timeout");
                $("#texto_popup").text('Error de TimeOut... compruebe su conexion de internet');
                $('#popupAlert').popup('open');


            } else {

                restError(jqXHR, "tiendas");
                console.log("Sin conexion.........");
                //$("#texto_popup").text('Sin conexion a internet...');
                //$('#popupAlert').popup('open');

            }
        },
    });

}




/* Función que solicita la información al webservice de Nodos
    - idNode: id del nodo que se esta solicitando
    - nodeName: el nombre del nodo al que estamos accediento (Necesario para pintar en el botón de atrás el titulo);
    -isAlgo: variable para saber si es el asis de fiestas o disfraces
    */
function getNodes(idNode, nodeName, isAlgo, aux, backPage) {

    if (idNode != 0) {
        $("#banderas").hide();
    }

    if (aux == 1) {
        nodeIds = [];
        nodeNames = [];
        openMenu();
    }

    language = 1;
    // Datos que se van a enviar
    var dataSend = {
        lang: parseInt(language),
        origin: origin,
        id: idNode,
        store: STORE.id
    };

    if (isAlgo != undefined && isAlgo > 0) { //estamos en el asistente de disfraces o fiestas?????
        ISFIESTA = isAlgo;

    }

    console.log("Is algo es " + isAlgo);

    var request = $.ajax({
        data: dataSend,
        url: urlServices + 'getNodes.php',
        dataType: 'json',
        type: 'POST',
        timeout: 10000, //10 seg
        success: function (response) {

            if (response.result == 1) {

                //console.log("Respuesta del nodo");
                //console.log(response);

                if (idNode == 0) {
                    node_cero = response;
                    $("#banderas").show();
                    pantallaActual = "menu principal";

                }

                pantallaActual = "nodos";
                //console.log("Tenemos nuevos nodos");
                restOk(response, "nodes", idNode, nodeName, aux, backPage);


            } else if (response.result == 0) { //ya no tenemos mas nodos que mostrar, ahora se mostratan los productos

                //console.log("Resultado del nodo es cero");
                //console.log(response);

                //console.log("Pedimos los productos. Id " + idNode + " nombre " + nodeName);
                //console("¿Estamos en el asistente de fiestas? " + ISFIESTA);

                updateBackButton(idNode, nodeName, aux);

                if (ISFIESTA == 4) { // si estamos en algun asistente, ya sea de fistas o disfraces, hay que mostrar una pantalla intermadia

                    console.log("Asistentes de disfraces");
                    var info = getInfoNode(idNode);

                    if (info != "undefined") {
                        //console.log("DisplayPantalla intermadia");
                        pantallaActual = "Asistente disfraces";
                        $("#divHeader_catalogo").show();
                        displayPantallaIntermediaAsistDisfra(info);
                    } else {
                        $("#texto_popup").text("Ocurrio un problema. Contacte con el administrador de la app");
                        $('#popupAlert').popup('open');
                    }

                } else if (ISFIESTA == 3) { //3 asist. fiestas

                    console.log("Asistentes de fiestas. Pedimos info del nodo");
                    var info = getInfoNode(idNode);

                    //console.log("Enviar info es 4");
                    //console.log(info);

                    if (info != undefined) {

                        //console.log("DisplayPantalla intermadia");
                        pantallaActual = "Asistente fiestas";
                        displayPantallaIntermediaAsistFiestas(info.node);

                    } else {

                        //console.log("Dame productos de " + nodeName);
                        getProducts(idNode, nodeName);

                    }

                } else if (ISFIESTA == 1) { //1 catalogo


                    getNodesProducts(idNode, nodeName);


                } else {

                    console.log("Error nodes en getNodes...");

                }

            } else if (response.result == -1) {

                console.log("Error en el envio de parametros");

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });

}

/* Función que controla que la petición Ajax ha ido bien
    - res: Respuesta del webservice
    - typ: tipo de solicitud del webservice
    - param: parametro extra que queramos pasar
    - param2: idem
    */
function restOk(res, typ, param, param2, aux, backPage) {

    console.log("Cargamos nuevos nodos " + typ);
    //console.log("La respuesta es ");
    //console.log(res);

    switch (typ) {
    case "lang":

        displayFlags(res);
        break;

    case "nodes":
        console.log("El aux " + aux);
        displayNode(res, param, param2, aux, backPage);
        break;

    default:

        console.log(res);
        break;

    }


}

function getAlternativeProducts(idnode, idproduct) { //esta funcion nos devuelve la info de un nodo pasandole como parametro el id_nodo

    // Datos que se van a enviar
    var dataSend = {
        lang: language,
        origin: origin,
        product: idproduct,
        store: STORE.id,
        id: idnode
    };

    request = $.ajax({
        data: dataSend,
        url: urlServices + 'getAlternativeProducts.php',
        dataType: 'json',
        async: false,
        type: 'POST',
        timeout: 10000, //10 seg
        success: function (response) {

            //console.log("Datos ");
            //console.log(response);
            PRODUCTS_ALTER = response;

            displayAlternativeProducts(idnode, idproduct);

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {

                //console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                //console.log("Sin conexion");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });

}

function getNodesProducts(idNode) { //esta funcion nos devuelve la info de un nodo pasandole como parametro el id_nodo


    language = 1;
    // Datos que se van a enviar
    var dataSend = {
        lang: parseInt(language),
        origin: origin,
        id: idNode,
        store: STORE.id
    };

    request = $.ajax({
        data: dataSend,
        url: urlServices + 'getNodeProducts.php',
        dataType: 'json',
        type: 'POST',
        timeout: 1000, //10 seg
        success: function (response) {

            displayProducts(response, param, param2, param3);

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {

                //console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                //console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });


}

function getInfoNode(idNode) { //esta funcion nos devuelve la info de un nodo pasandole como parametro el id_nodo

    // Datos que se van a enviar
    var dataSend = {
        lang: language,
        origin: origin,
        id: idNode
    };

    var enviarInfo = new Array();

    request = $.ajax({
        data: dataSend,
        url: urlServices + 'getInfoNode.php',
        dataType: 'json',
        async: false,
        type: 'POST',
        timeout: 1000, //10 seg
        success: function (response) {
            enviarInfo = response;

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {

                //console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                //console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });


    return enviarInfo;

}

//WS que devuelve el listado de productos para un nodo
function getProducts(idNode, nodeName, info_aux) {

    $("#popupCargando").popup("open");

    if (info_aux != undefined) { // asist. de disfraces

        console.log("Venimos del asist. de disfraces");
        pantallaActual = "Asistente disfraces";
        var dataSend = {
            lang: language,
            origin: origin,
            store: STORE.id,
            //gender: info_aux.sexo,// no se utiliza filtramos nosotros
            //size: info_aux.talla,// no se utiliza filtramos nosotros
            id: idNode
        };


    } else {

        console.log("Estamos en el asist. de fiestas");
        //pantallaActual = "Asistente fiestas";
        // Datos que se van a enviar
        var dataSend = {
            lang: language,
            origin: origin,
            store: STORE.id,
            id: idNode
        };
        console.log("Datos para enviar");
        console.log(dataSend);

    }

    //console.log("Enviamos el ajax");

    request = $.ajax({
        data: dataSend,
        url: urlServices + 'getProducts.php',
        dataType: 'json',
        type: 'POST',
        //async:false,
        timeout: 25000, //10 seg
        success: function (response) {
            console.log("Respuesta: ");
            console.log(response);

            if (response.result == 1) {

                //console.log(response);
                restOk_products(response, "nodes", idNode, nodeName, info_aux);

            } else if (response.result == 0) {

                //console.log("No hay productos para este nodo");
                $("#texto_popup").text("No hay productos...");
                $('#popupAlert').popup('open');

            } else if (response.result == -1) {

                $("#texto_popup").text("Error...");
                $('#popupAlert').popup('open');

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                //console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                //console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });
}

function restOk_products(res, typ, param, param2, param3) {
    //console.log("Todo bien desde " + typ);
    //console.log("La respuesta es ");
    //console.log(res);

    switch (typ) {
    case "lang":

        displayFlags(res);
        break;

    case "nodes":

        displayProducts(res, param, param2, param3);
        break;

    default:
        console.log(res);
        break;
    }


}

//Nos devuelve el listados de tiendas disponibles antes de cargar la ventana principal
function getTiendas() {

    console.log("Pedimos las tiendas");

    var request = $.ajax({
        url: urlServices + 'getShops.php',
        dataType: 'json',
        type: 'GET',
        timeout: 10000, //10 seg
        success: function (response) {

            restOk_tiendas(response, "tiendas");

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                //console.log("Timeout");
                $("#texto_popup").text('Error de TimeOut... compruebe su conexion de internet');
                $('#popupAlert').popup('open');


            } else {

                restError(jqXHR, "tiendas");
                //console.log("Sin conexion");
                //console.log(response);
                $("#texto_popup").text("Error..." + response.result);
                $('#popupAlert').popup('open');

            }

        },
    });
}


function restOk_tiendas(res, typ, param, param2) {

    //console.log("Las tiendas nos han llegado, cargamos el select" + typ);
    //console.log("La respuesta es ");
    //console.log(res);

    var count = res.stores.length;

    TIENDAS = res; //array con todas las tiendas

    var html = '<div class="ui-nodisc-icon"><select data-corners="false" id="select_tienda" data-native-menu="false" data-theme="b" style="border: 0px;">';

    for (var i = 0; i < count; i++) {

        var val = res.stores[i].id;
        var text = res.stores[i].name;

        html = html + '<option value=' + val + ' style="font-size: 20px;"><label style="color:white;text-transform: uppercase;font-size: 20px;">' + text + '</label></option>';

    }

    html = html + '</select><div>';


    $("#div_select_tienda").html(html);

    $("#div_select_tienda").trigger('create');
    $("#div_select_tienda").css('font-size', '20px');

    var select = $('#select_tienda');

    select.selectmenu({
        icon: "ui-icon-carat-d"
    });
    select.selectmenu({
        iconshadow: "false"
    });
    $('#select_tienda-button').css({
        border: "0px"
    });


}


/* Función que controla que la petición Ajax ha ido mal
    - res: Respuesta del webservice
    - typ: tipo de solicitud del webservice
    */
function restError(res, typ) {

    console.log("fallo de ws, tipo " + typ);
    console.log(res);
    /*
    switch (tipo) {
    case "comprarCreditos":
        {
            notificacion("Compruebe su conexión");
            //abrirPopupAviso("Compruebe su conexión");
            $('#submitPaypal').prop('disabled', false);
            break;
        };
    default:
        notificacion("Intentelo de nuevo");
        break;
    }
    */
}


function sendSugerencias(info) {


    //sugerencias@partyfiesta.com


    var request = $.ajax({
        data: info,
        url: urlServices + '.php',
        dataType: 'json',
        type: 'POST',
        timeout: 10000, //10 seg
        success: function (response) {
            //console.log("Respuesta: ");
            //console.log(response);

            if (response.result == 1) {

                //console.log(response);
                getNodes(0);


            } else if (response.result == 0) {

                //console.log("No hay productos para este nodo");
                $("#texto_popup").text("No hay productos...");
                $('#popupAlert').popup('open');

            } else if (response.result == -1) {

                $("#texto_popup").text("Error...");
                $('#popupAlert').popup('open');

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                //console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                //console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });
}

function sendContra(usuario) {

    //console.log("Funcion enviar contra");

    var dataSend = {
        user: usuario
    };

    var request = $.ajax({
        data: dataSend,
        url: urlServices + 'email.php',
        dataType: 'json',
        type: 'POST',
        timeout: 10000, //10 seg
        success: function (response) {
            //console.log("Respuesta: ");
            //console.log(response);

            if (response.result == 1) {

                console.log(response.password);


            } else if (response.result == 0) {

                //console.log("No hay productos para este nodo");
                $("#texto_popup").text("No hay productos...");
                $('#popupAlert').popup('open');

            } else if (response.result == -1) {

                $("#texto_popup").text("Error...");
                $('#popupAlert').popup('open');

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });
}

//WS que devuelve el listado de sexo mas-feme
function getGender() {

    var request = $.ajax({
        url: urlServices + 'getGender.php',
        dataType: 'json',
        type: 'GET',
        timeout: 10000, //10 seg
        success: function (response) {
            //console.log("Respuesta: ");
            console.log(response);

            if (response.result == 1) {

                //console.log(response);

                var count = response.genders.length;
                var select = $('#select_sexo');

                select.append($('<option>', {
                    value: 0,
                    text: jsonIdiomas.asistente_disfraces.select_sexo_button
                }));

                for (var i = 0; i < count; i++) {

                    var val = response.genders[i].nombre;

                    //console.log("Val es " + val);

                    select.append($('<option>', {
                        value: val,
                        text: val
                    }));

                    select.selectmenu('refresh', true);

                }


                //var option1 = $($("option", select).get(1));
                //option1.attr('selected', 'selected');
                select.selectmenu();

            } else if (response.result == 0) {

                //console.log("No hay productos para este nodo");
                $("#texto_popup").text("No hay productos...");
                $('#popupAlert').popup('open');

            } else if (response.result == -1) {

                $("#texto_popup").text("Error...");
                $('#popupAlert').popup('open');

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });
}

//WS que devuelve el listado de tallas      
function getSize(gender) {

    var dataSend = {
        sex: gender
    };

    console.log("EL gender es " + gender);

    var request = $.ajax({
        data: dataSend,
        url: urlServices + 'getSize.php',
        dataType: 'json',
        type: 'POST',
        timeout: 10000, //10 seg
        success: function (response) {
            //console.log("Respuesta: ");
            //console.log(response);

            if (response.result == 1) {

                console.log(response);

                $('#select_talla  option').remove();

                var count = response.sizes.length;
                var select = $('#select_talla');

                select.append($('<option>', {
                    value: 0,
                    text: jsonIdiomas.asistente_disfraces.talla
                }));


                for (var i = 0; i < count; i++) {

                    var val = response.sizes[i].nombre;

                    //console.log("Val es " + val);

                    select.append($('<option>', {
                        value: val,
                        text: val
                    }));

                    select.selectmenu('refresh', true);

                }


                //var option1 = $($("option", select).get(1));
                //option1.attr('selected', 'selected');
                select.selectmenu();

            } else if (response.result == 0) {

                //console.log("No hay productos para este nodo");
                $("#texto_popup").text("No tenemos tallas...");
                $('#popupAlert').popup('open');
                console.log(response);

            } else if (response.result == -1) {

                $("#texto_popup").text("Error...");
                $('#popupAlert').popup('open');
                console.log(response);

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });
}

//WS que devuelve el listado edades
function getAge() {

    var request = $.ajax({
        url: urlServices + 'getAge.php',
        dataType: 'json',
        type: 'GET',
        timeout: 10000, //10 seg
        success: function (response) {
            //console.log("Respuesta: ");
            console.log(response);

            if (response.result == 1) {

                //console.log(response);

                var count = response.age.length;
                var select = $('#select_edad');

                for (var i = 0; i < count; i++) {

                    if (i == 0) {

                        select.append($('<option>', {
                            value: 0,
                            text: "¿Que edad tiene?"
                        }));


                    } else {

                        var val = response.age[i].nombre;

                        console.log("Val es " + val);

                        select.append($('<option>', {
                            value: val,
                            text: val
                        }));

                        select.selectmenu('refresh', true);

                    }

                }

                select.selectmenu();

            } else if (response.result == 0) {

                //console.log("No hay productos para este nodo");
                $("#texto_popup").text("No hay productos...");
                $('#popupAlert').popup('open');

            } else if (response.result == -1) {

                $("#texto_popup").text("Error...");
                $('#popupAlert').popup('open');

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {
                //do something on timeout
                console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });
}

function getTraduccion(idioma) { //esta funcion nos devuelve la info de un nodo pasandole como parametro el id_nodo

    var aux = {};

    // Datos que se van a enviar
    for (var i = 0; i < CART.length; i++) {
        aux[i] = {
            id: CART[i].id
        };
    }

    console.log("Datos del carrito");
    console.log(aux);

    var dataSend = {
        language: idiomStore,
        products: aux
    };

    console.log("Datos del carrito2");
    console.log(dataSend);


    var request = $.ajax({
        data: dataSend,
        async: false,
        url: urlServices + 'getProductLanguage.php',
        dataType: 'json',
        type: 'POST',
        success: function (response) {
            console.log("Respuesta: ");
            console.log(response);

            for (var i = 0; i < CART.length; i++) {
                if (response[i].id == CART[i].id) {
                    CART[i].definition = response[i].definition;
                    CART[i].name = response[i].name;
                    CART[i].short_name = response[i].short_name;
                    CART[i].suggestions = response[i].suggestions;
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {

            if (textStatus === "timeout") {

                console.log("Timeout");
                alert("Error de TimeOut... compruebe su conexion de internet");

            } else {

                restError(jqXHR, "tiendas");
                console.log("Sin conexion");
                //alert("Sin conexion a internet...");
                $("#texto_popup").text("Sin conexion a internet");
                $('#popupAlert').popup('open');

            }
        },
    });


}

/**************************************************************************
  WS para enviar el correo con el listado de articulos del carrito
***************************************************************************/
function sendEmail() {

    if (EMAIL_USER = "" || INFO_USU == null) {

        setTimeout(function () {
            $("#popupEmail").popup("close");
        }, popupTimeout);

    } else {

        var dataSend = {
            usuario: INFO_USU,
            email: EMAIL_USER,
            carrito: CART //JSON.stringify(CART)
        };

        var request = $.ajax({
            data: dataSend,
            //async: false,
            url: urlServices + 'sendEmail.php',
            dataType: 'json',
            type: 'POST',
            success: function (response) {

                console.log("Respuesta es:");
                console.log(response);

                if (parseInt(response.result) == parseInt(1)) {

                    $("#texto_popup").text("Correo enviado a " + EMAIL_USER);
                    $('#popupAlert').popup('open');

                } else if (parseInt(response.result) == parseInt(0)) {

                    $("#texto_popup").text("No se ha podido enviar el correo a " + EMAIL_USER);
                    $('#popupAlert').popup('open');

                } else if (parseInt(response.result) == parseInt(2)) {

                    $("#texto_popup").text("Problemas al generar el correo");
                    $('#popupAlert').popup('open');

                } else if (parseInt(response.result) == parseInt(0)) {

                    $("#texto_popup").text("Faltan datos para poder enviar el correo");
                    $('#popupAlert').popup('open');

                }



            },
            error: function (jqXHR, textStatus, errorThrown) {

                if (textStatus === "timeout") {

                    console.log("Timeout");
                    alert("Error de TimeOut... compruebe su conexion de internet");

                } else {

                    restError(jqXHR, "tiendas");
                    console.log("Sin conexion");
                    //alert("Sin conexion a internet...");
                    $("#texto_popup").text("Sin conexion a internet");
                    $('#popupAlert').popup('open');

                }
            },
        });

    }


}