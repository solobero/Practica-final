$("#SetFen").click(function () {
	var fenStr = $("#fenIn").val();	
	NewGame(fenStr);		
});


function NewGame(fenStr){
	ParseFen(fenStr);
	PrintBoard();
	SetInitialBoardPieces();
}

//Limpiar las piezas
function ClearPieces() {
	$(".Piece").remove();
}

$("#SetNewGame").click(function(){
	NewGame(INICIO_FEN);
});


//Nos pone las fichas en sus posiciones iniciales del tablero
function SetInitialBoardPieces(){
	var sq;
	var sq120;
	var file,rank;
	var rankName;
	var fileName;
	var imageString;
	var pieceFileName;
	var pce;

	ClearPieces();

	for(sq = 0;sq<64;++sq){
		sq120=SQ120(sq);
		pce=GameBoard.pieces[sq120];
		file=FilasTab[sq120];
		rank=RangoTab[sq120];

		if(pce>=PIEZAS.wP&&pce<=PIEZAS.bK){
			rankName="rank"+(rank+1);
			fileName="file"+(file+1);
			pieceFileName="images/"+LadoChar[PieceCol[pce]]+PceChar[pce].toUpperCase()+".png";
			imageString="<image src=\""+pieceFileName+"\" class=\"Piece "+rankName+" "+fileName+"\"/>";
			$("#board").append(imageString);
		}
	}
}