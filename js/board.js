function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

var GameBoard = {};

GameBoard.pieces = new Array(TABLERO_SQ_NUM);
GameBoard.side = COLORES.WHITE;
GameBoard.enPas = 0;
GameBoard.castlePerm = 0;
GameBoard.material = new Array(2); // Definir un arreglo de blancas y negras
GameBoard.pceNum = new Array(13); //Definir arreglo de enteros que representan las 13 piezas, siendo la 13 vacio
GameBoard.pList = new Array(14 * 10); // Arreglo de piezas
GameBoard.posKey = 0;

//Nos ayudará a manejar las piezas o imagenes de las mismas
function PrintBoard() {
	
	var sq,file,rank,piece;
	for(rank = RANGOS.RANGO_8; rank >= RANGOS.RANGO_1; rank--) {
		var line =(RangoChar[rank] + "  ");
		for(file = FILAS.FILA_A; file <= FILAS.FILA_H; file++) {
			sq = FR2SQ(file,rank);
			piece = GameBoard.pieces[sq];
			line += (" " + PceChar[piece] + " ");
		}
	}
	
	var line = "   ";
	for(file = FILAS.FILA_A; file <= FILAS.FILA_H; file++) {
		line += (' ' + FilaChar[file] + ' ');	
	}
	
	if(GameBoard.castlePerm & CASTLEBIT.WKCA) line += 'K';
	if(GameBoard.castlePerm & CASTLEBIT.WQCA) line += 'Q';
	if(GameBoard.castlePerm & CASTLEBIT.BKCA) line += 'k';
	if(GameBoard.castlePerm & CASTLEBIT.BQCA) line += 'q';
}


function GeneratePosKey() {

	var sq = 0;
	var finalKey = 0;
	var piece = PIEZAS.VACIO;

	for(sq = 0; sq < TABLERO_SQ_NUM; ++sq) {
		piece = GameBoard.pieces[sq];
		if(piece != PIEZAS.VACIO && piece != CUADRADOS.FUERADE) {			
			finalKey ^= PieceKeys[(piece * 120) + sq];
		}		
	}

	if(GameBoard.side == COLORES.WHITE) {
		finalKey ^= SideKey;
	}
	
	if(GameBoard.enPas != CUADRADOS.NO_SQ) {		
		finalKey ^= PieceKeys[GameBoard.enPas];
	}
	
	finalKey ^= CastleKeys[GameBoard.castlePerm];
	
	return finalKey;

}

//Limpiar el tablero
function ResetBoard() {
	
	var index = 0;
	
	for(index = 0; index < TABLERO_SQ_NUM; ++index) {
		GameBoard.pieces[index] = CUADRADOS.FUERADE;
	}
	
	for(index = 0; index < 64; ++index) {
		GameBoard.pieces[SQ120(index)] = PIEZAS.VACIO;
	}
	
	for(index = 0; index < 14 * 120; ++index) {
		GameBoard.pList[index] = PIEZAS.VACIO;
	}
	
	for(index = 0; index < 2; ++index) {		
		GameBoard.material[index] = 0;		
	}	
	
	for(index = 0; index < 13; ++index) {
		GameBoard.pceNum[index] = 0;
	}

	//Borramos reiniciando todo lo que pudo haberse pintado en el tablero
	GameBoard.side = COLORES.BOTH;
	GameBoard.enPas = CUADRADOS.NO_SQ;
	GameBoard.ply = 0;
	GameBoard.castlePerm = 0;	
	GameBoard.posKey = 0;
	
}

//Inicializar el tablero- FUNCIÓN FEN
function ParseFen(fen) {

	ResetBoard();
	
	//Obtenemos el array de piezas
	var rank = RANGOS.RANGO_8;
    var file = FILAS.FILA_A;
    var piece = 0;
    var count = 0;
    var i = 0;  
	var sq120 = 0;
	var fenCnt = 0; // fen[fenCnt]
	
	//Recorremos el array de piezas y definimos el tipo de cadena a recibir, tomando en cuenta los errores
	while ((rank >= RANGOS.RANGO_1) && fenCnt < fen.length) {
	    count = 1;
		switch (fen[fenCnt]) {
			case 'p': piece = PIEZAS.bP; break;
            case 'r': piece = PIEZAS.bR; break;
            case 'n': piece = PIEZAS.bN; break;
            case 'b': piece = PIEZAS.bB; break;
            case 'k': piece = PIEZAS.bK; break;
            case 'q': piece = PIEZAS.bQ; break;
            case 'P': piece = PIEZAS.wP; break;
            case 'R': piece = PIEZAS.wR; break;
            case 'N': piece = PIEZAS.wN; break;
            case 'B': piece = PIEZAS.wB; break;
            case 'K': piece = PIEZAS.wK; break;
            case 'Q': piece = PIEZAS.wQ; break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = PIEZAS.VACIO;
                count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                break;
            
            case '/':
            case ' ':
                rank--;
                file = FILAS.FILA_A;
                fenCnt++;
                continue;  
            default:
                console.log("FEN error");
                return;

		}
		
		for (i = 0; i < count; i++) {	
			sq120 = FR2SQ(file,rank);            
            GameBoard.pieces[sq120] = piece;
			file++;
        }
		fenCnt++;
	} // while loop end
	
	//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
	GameBoard.side = (fen[fenCnt] == 'w') ? COLORES.WHITE : COLORES.BLACK;
	fenCnt += 2;
	
	for (i = 0; i < 4; i++) {
        if (fen[fenCnt] == ' ') {
            break;
        }		
		switch(fen[fenCnt]) {
			case 'K': GameBoard.castlePerm |= CASTLEBIT.WKCA; break;
			case 'Q': GameBoard.castlePerm |= CASTLEBIT.WQCA; break;
			case 'k': GameBoard.castlePerm |= CASTLEBIT.BKCA; break;
			case 'q': GameBoard.castlePerm |= CASTLEBIT.BQCA; break;
			default:	     break;
        }
		fenCnt++;
	}
	fenCnt++;	
	
	if (fen[fenCnt] != '-') {        
		file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
		rank = fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt();	
		console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);	
		GameBoard.enPas = FR2SQ(file,rank);		
    }
	
	GameBoard.posKey = GeneratePosKey();
	
	
}