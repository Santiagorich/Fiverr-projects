/**
 * フリーレイアウト用JS
 */
$(document).bind("BOOT", function(){

});

//メニューデータロード完了
$(document).bind("LOAD_MENU ALTERNATE-CHANGE", function(){

	//大カテゴリーボタン’をフィットさせる
	var fwidth = $("#fcategory").width();
	var fleng = $("#fcategory button").length;
	var fbtn = $("#fcategory button").first();
	var fmax = parseInt(fbtn.css("max-width"));
	var fmin = parseInt(fbtn.css("min-width"));

	var mr = parseInt(fbtn.css("margin-right")) * fleng;
	var ml = parseInt(fbtn.css("margin-left")) * fleng;
	var fw = (fwidth-mr-ml) / fleng; //Math.floor( (fwidth-mr-ml) / fleng );

	if( fmin > fw ) {
		fw = fmin;
	} else if( fmax < fw ) {
		fw = fmax;
	}

	$("#fcategory button").each(function(){
		$(this).css( "width", fw );
	});
});

//チェックアウトのときは初期化
$(document).bind("CHECKOUT",function() {
	$("#info").addClass("viewtop").removeClass("viewmenu");
	$(".table-setup-btn").addClass("viewtop").removeClass("viewmenu");
});


//ロード完了後の処理
$(document).ready( function(){

	//Top表示イベント
	//cssでの制御だと処理が重いので、jsで表示制御を行う
	$("#fcategory-top").bind("SHOW",function() {
		$("#billboard-banner").addClass("viewtop").removeClass("viewmenu");
		$("#cart-timeup-alert, #smallcart").removeClass("viewmenu");
		$("#normalcart").addClass("viewtop").removeClass("viewmenu");
		$("#info").addClass("viewtop").removeClass("viewmenu");
		$(".menu-navi").hide();
		$("#navigation, #staff-call, #ordercheck-btn").addClass("viewtop").removeClass("viewmenu");
		$(".table-setup-btn").addClass("viewtop").removeClass("viewmenu");
		$("#stat").addClass("viewtop").removeClass("viewmenu");
	});
	//Top非表示イベント
	$("#fcategory-top").bind("HIDE",function() {
		$("#billboard-banner").removeClass("viewtop").addClass("viewmenu");
		$("#cart-timeup-alert, #smallcart").addClass("viewmenu");
		$("#normalcart").removeClass("viewtop").addClass("viewmenu");
		$("#info").removeClass("viewtop").addClass("viewmenu");
		$(".menu-navi").show();
		$("#navigation, #staff-call, #ordercheck-btn").removeClass("viewtop").addClass("viewmenu");
		$(".table-setup-btn").removeClass("viewtop").addClass("viewmenu");
		$("#stat").removeClass("viewtop").addClass("viewmenu");
	});

	//中カテゴリーの表示イベント
	$(document).bind("SCATEGORY_TOP",function() {
		$(".menu-navi").hide();
	});
	$(document).bind("SCATEGORY_TOP_HIDE",function() {
		$(".menu-navi").show();
	});

	//カート変更イベント
	$(document).bind("CART_UPDATE",function() {
		if( $emenu.cart.cartAry.length ) {
			$("#stat").addClass("incart");
			$("#billboard-banner").addClass("incart");
		} else {
			$("#stat").removeClass("incart");
			$("#billboard-banner").removeClass("incart");
			$("#normalcart").hide();
		}
		
	});
	//音を再生しない
	//$.fn.soundPlay = function() { return false; };


	//android4.4対応
	//pointer-events:noneが利かない
	$('#menu-navi').on('touchstart touchmove touchcancel', function(e){
		console.log("hoge")
		e.preventDefault();
	});
});
