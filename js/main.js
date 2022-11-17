//Funcion que me permite saber si el JQuery esta listo
$(function() {
	init();
	NewGame(INICIO_FEN);
});

//Función que nos permitirá darle valores iniciales al tablero de ajedrez
function InitFilesRangoTab() {
	
	var index = 0;
	var file = FILAS.FILA_A;
	var rank = RANGOS.RANGO_1;
	var sq = CUADRADOS.A1;
	
	//Delimita el tablero, estableciendo posiciones fuera del mismo
	for(index = 0; index < TABLERO_SQ_NUM; ++index) {
		FilasTab[index] = CUADRADOS.FUERADE;
		RangoTab[index] = CUADRADOS.FUERADE;
	}
	
	//Pintamos los 64 cuadrados del tablero
	for(rank = RANGOS.RANGO_1; rank <= RANGOS.RANGO_8; ++rank) {
		for(file = FILAS.FILA_A; file <= FILAS.FILA_H; ++file) {
			sq = FR2SQ(file,rank);
			FilasTab[sq] = file;
			RangoTab[sq] = rank;
		}
	}
}

//Función que inicializa las claves de hash o llaves únicas (números aleatorios)
function InitHashKeys() {
    var index = 0;
	
	for(index = 0; index < 14 * 120; ++index) {				
		PieceKeys[index] = RAND_32();
	}
	
	
	for(index = 0; index < 16; ++index) {
		CastleKeys[index] = RAND_32();
	}
}

//Función que convierte de 120 a 64 y de 64 a 120
function InitSq120To64() {

	var index = 0;
	var file = FILAS.FILA_A;
	var rank = RANGOS.RANGO_1;
	var sq = CUADRADOS.A1;
	var sq64 = 0;

	for(index = 0; index < TABLERO_SQ_NUM; ++index) {
		Sq120ToSq64[index] = 65;
	}
	
	for(index = 0; index < 64; ++index) {
		Sq64ToSq120[index] = 120;
	}
	
	for(rank = RANGOS.RANGO_1; rank <= RANGOS.RANGO_8; ++rank) {
		for(file = FILAS.FILA_A; file <= FILAS.FILA_H; ++file) {
			sq = FR2SQ(file,rank);
			/* 
			Si tenemos index=0, sq64=0 y sq=21, entonces Sq120ToSq64[21]=0
			*/
			Sq64ToSq120[sq64] = sq; 
			Sq120ToSq64[sq] = sq64;
			sq64++;
		}
	}

}

//Vamos a definir los cuadrados del tablero, como brillantes y oscuro para formar el efecto
function InitBoardSquares() {
	var light=1;
	var rankName;
	var fileName;
	var divString;
	var rankIter;
	var fileIter;
	var lightString;

	for(rankIter = RANGOS.RANGO_8; rankIter >= RANGOS.RANGO_1; rankIter--) {
		light ^= 1;
		rankName = "rank" + (rankIter+1);
		for(fileIter = FILAS.FILA_A; fileIter <= FILAS.FILA_H; fileIter++) {
			fileName="file"+(fileIter+1);
			if(light==0) lightString="Light";
			else lightString="Dark";
			light^=1;
			divString = "<div class=\"Square " + rankName + " " + fileName + " " + lightString + "\"/>";
			$("#board").append(divString);
		}
	}
}

//Proceso de inicio del programa correcto
function init() {
	InitFilesRangoTab();
	InitHashKeys();
	InitSq120To64();
	InitBoardSquares();
}