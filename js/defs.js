//Definimos la forma en como están representadas las fichas (blancas con Mayus y negras con Min)
//Le agregamos a cada pieza un atributo entero que la representa en el tablero

var PIEZAS =  { VACIO : 0, wP : 1, wN : 2, wB : 3,wR : 4, wQ : 5, wK : 6, 
              bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12  };
              
var TABLERO_SQ_NUM = 120;

var FILAS =  { FILA_A:0, FILA_B:1, FILA_C:2, FILA_D:3, 
	FILA_E:4, FILA_F:5, FILA_G:6, FILA_H:7, FILA_NONE:8 };
	
var RANGOS =  { RANGO_1:0, RANGO_2:1, RANGO_3:2, RANGO_4:3, 
	RANGO_5:4, RANGO_6:5, RANGO_7:6, RANGO_8:7, RANGO_NONE:8 };
	
var COLORES = { WHITE:0, BLACK:1, BOTH:2 };

var CASTLEBIT = { WKCA : 1, WQCA : 2, BKCA : 4, BQCA : 8 };

var CUADRADOS = {
  A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,  
  A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98, 
  NO_SQ:99, FUERADE:100
};

var BOOL = { FALSE:0, TRUE:1 };

//Vamos a definir un array que nos permita representar el tablero
var FilasTab = new Array(TABLERO_SQ_NUM);
var RangoTab = new Array(TABLERO_SQ_NUM);

//Posiciones iniciales con el FEN, y rangos y filas iniciales
var INICIO_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var PceChar = ".PNBRQKpnbrqk";
var LadoChar = "wb-";
var RangoChar = "12345678";
var FilaChar = "abcdefgh";

//una función dónde cada numero entre 120 nos retorna una casilla
function FR2SQ(f,r) {
 	return ( (21 + (f) ) + ( (r) * 10 ) );
}

//Definimos la estructura de datos que nos permitirá representar las piezas
var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
var PieceCol = [ COLORES.BOTH, COLORES.WHITE, COLORES.WHITE, COLORES.WHITE, COLORES.WHITE, COLORES.WHITE, COLORES.WHITE,
	COLORES.BLACK, COLORES.BLACK, COLORES.BLACK, COLORES.BLACK, COLORES.BLACK, COLORES.BLACK ];
	
//Representación de 0's y 1's de cada pieza en el tablero y los movimientos de estos
var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];	
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
var PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
var PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];

//Definimos de nuevo números aleatorios para cada pieza
var PieceKeys = new Array(14 * 120);
var CastleKeys = new Array(16);

//Variables que, dado "fuerade" o "dentrode" nos permite convertirlo al otro
var Sq120ToSq64 = new Array(TABLERO_SQ_NUM);
var Sq64ToSq120 = new Array(64);

//Vamos a crear una función que nos llena 32bits, dando 4 numeros aleatorios que llenan 8bits
//cada número va a representar la posición de una ficha luego en "poskey", al ser aleatorios se asegura que sea único
function RAND_32() {

	return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16)
		 | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);

}

//Retorno de la casilla en 64
function SQ64(sq120) { 
	return Sq120ToSq64[(sq120)];
}

//Retorno de la casilla en 120
function SQ120(sq64) {
	return Sq64ToSq120[(sq64)];
}