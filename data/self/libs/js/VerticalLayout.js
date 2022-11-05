/**
 * フリーレイアウト用JS
 */
$(document).bind("BOOT", function(){

});

//メニューデータロード完了
$(document).bind("LOAD_MENU ALTERNATE-CHANGE", function(){

	//$.timer( function() {
		//this.stop();

		//サイズをセット
		var w = window.innerWidth;
		var h = window.innerHeight;
		if( Config.islocal ) {
			w = 1080;//( w > 1024 ) ? 768 : w;
			h = 1920;//( h > 1024 ) ? 1024 : h;
		}
		h -= $("#vertical #menu-page-layout").offset().top;
		var ph = h; // - $("#navigation").height();

		//$("#page #menu-page-layout .page").css("min-height", php);
		$("#vertical #menu-page-layout").height( ph );

		// var mw = 0;
		// $("#menu-bodys .page").each(function(){
		// 	mw += $(this).outerWidth();		
		// });
		// $("#menu-bodys").width( mw );

		$emenu.menubody.page_width = w;
		if( !empty( $emenu.flipsnap ) ) { 
			$emenu.flipsnap.distance = w;
			$emenu.flipsnap.refresh();
		}

		//大カテゴリーボタン’をフィットさせる
		// var fwidth = $("#fcategory").width();
		// var fleng = $("#fcategory button").length;
		// var fbtn = $("#fcategory button").first();
		// var fmax = parseInt(fbtn.css("max-width"));
		// var fmin = parseInt(fbtn.css("min-width"));

		// var mr = parseInt(fbtn.css("margin-right")) * fleng;
		// var ml = parseInt(fbtn.css("margin-left")) * fleng;
		// var fw = Math.floor( (fwidth-mr-ml) / fleng );

		// if( fmin > fw ) {
		// 	fw = fmin;
		// } else if( fmax < fw ) {
		// 	fw = fmax;
		// }
		// var fmax = 0;
		// $("#fcategory button").each(function(){
		// 	$(this).css( "width", fw );
		// 	fmax += $(this).outerWidth(true);
		// });
		// //カテゴリーボタンのスクロール設定
		// $("#fcategory,#scategory").width( w );
		// $("#fcategory div:eq(0)").width( fmax );


		//カテゴリー変更のリスナー
		$(document).unbind("CATEGORY");
		$(document).bind("CATEGORY", function() {
			//大カテ
			/*
			var ff = $("#fcategory button.selected");
			var offset = ff.offset();
			var fw = w;
			var bfw = $("#fcategory button").first().width();
			var ol = offset.left + bfw/2;
			$("#fcategory").scrollLeft( offset.left - fw/2 + bfw/2 );
			*/
			
			//中カテ
			var smax = 0;
			$("#scategory button").each(function() {
				if( $(this).isVisible() ) {
					smax += $(this).outerWidth(true);
				}
			});
			$("#scategory div:eq(0)").width( smax );
			var ss = $("#scategory button.selected");
			var offset = ss.offset();
			var sw = $("#scategory").width();
			var bsw = $("#scategory button").first().width();
			var ol = offset.left + $("#scategory").scrollLeft();

			$("#scategory").scrollLeft( ol - sw/2 + bsw/2 );
			
			//メニューのスクロールをトップに変更
			//$("#menu-page-layout").scrollTop(0);
			//スクロールバグ対応　縦スクロールで横に動いてしまうため
			// if( Config.flick.enable ) {
			// 	$("#menu-page-layout").scrollLeft(0);
			// }
			
			//スクロール矢印
			$("#menu-page-layout").find( "#scroll-arrow" ).remove();

			//フォーカスページの高さをチェック
			/*
			var h_focus = $("#menu-page-layout .page").eq( $emenu.category.cate_index ).height();
			if( h_focus <= ph ) {
				$("#menu-page-layout").css( "overflow-y", "hidden" );
			} else {
				$("#menu-page-layout").css( "overflow-y", "auto" );
				$("#menu-page-layout #menu-bodys").height( h_focus +90 ); //page-padding分を付与

				//スクロール矢印を表示
				$("#menu-page-layout").append( '<i id="scroll-arrow"></i>' );
				$.timer(function(){
					var scroll_arrow_remove = function() {
						$("#menu-page-layout").find( "#scroll-arrow" ).remove();
						$("#menu-page-layout").unbind( "scroll", scroll_arrow_remove );
					}
					$("#menu-page-layout").scroll( scroll_arrow_remove );
					this.stop();
				}, 10, 1);
			}
			*/
		});

	//}, 2000 , 1);
});


//チェックアウトのときは初期化
$(document).bind("CHECKOUT",function() {
	$("#info").addClass("viewtop").removeClass("viewmenu");
	$("#table-setup-btn").addClass("viewtop").removeClass("viewmenu");
});


//ロード完了後の処理
$(document).ready( function(){

	//画面サイズのセット
	var w = window.innerWidth;
	var h = window.innerHeight;
	if( Config.islocal ) {
		w = 1080; //( w > 1024 ) ? 768 : w;
		h = 1920; //( h > 1024 ) ? 1024 : h;
	}
	$("#page, .container").width(w).height(h);

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

	//カート変更イベント
	$(document).bind("CART_UPDATE",function() {
		if( $emenu.cart.cartAry.length ) {
			$("#stat").addClass("incart");
			$("#billboard-banner").addClass("incart");
		} else {
			$("#stat").removeClass("incart");
			$("#billboard-banner").removeClass("incart");
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

	//スクロールバグ対応　縦スクロールで横に動いてしまうため
	if( Config.flick.enable ) {
		$("#menu-page-layout").scroll(function() {
			$("#menu-page-layout").scrollLeft(0);
		});
	}

	//中カテゴリートップ使用時に次へ前への押下で中カテトップを非表示
	if(Config.scategory.top_enable) {
		$(document).bind('SCATEGORY_TOP', function() {
			$(".menu-navi.navi-right, .menu-navi.navi-left").hide();
		});
		$(document).bind('SCATEGORY_TOP_HIDE', function() {
			$(".menu-navi.navi-right, .menu-navi.navi-left").show();
		});
	}
	
});
