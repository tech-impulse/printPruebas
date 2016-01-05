// AQUI VAN DEFINIDAS LAS VARIABLES QUE SE USARÁN MAS DE UNA VEZ EN MÁS DE UN FICHERO

//var urlServices = "http://partyfiesta.youtter.com:8990/webservices/"; // URL del servidor de Webservices fuera de creapolis
var urlServices = "http://partyfiesta.youtter.com/webservices/"; // URL del servidor de Webservices
var request;
var language; // El idioma de la aplicación por defecto de momento CATALAN
var origin = 2; // Dispositivo desde el que se solicita la información al service: 1 Web, 2 App
var nodeNames = [];
var nodeIds = [];
var nodeImg = [];
var TIENDAS = [];
var W_WIDTH = "";
var W_HEIGTH = "";
var STORE = "";
var SHOPDELIVERY = "";
var ISFIESTA = "";
var INFO_USU = [];
var PRODUCTS = [];
var PRODUCTS_ALTER = [];
var CART = [];
var CARRITO = [];
var node_cero = [];
var LOGGED = false;
var REDIRECT = false;
var popupTimeout = 150;
var idleTime = 180000; /// tiempo de inactividad
var idleTimeActive = false;
var idiomStore;
var protector;
var jsonIdiomas;
var pantallaActual;
var AUX="";
var LINKINT="";
var EMAIL_USER ="";
var COLUMS ="";
var ID_NODE ="";
var num_personas_fiesta="";