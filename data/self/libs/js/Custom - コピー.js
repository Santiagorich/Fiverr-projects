/**
 * Custom
 */

$takeoutmode = "01"; //テイクアウト　メニューモード
$takeout = false;
$count = 1;
$count_max = 20;
$table = ""; //table識別
$takeout_table_no = "";
$org_table_no = "";
$table_no_indent = 10;
$retry = 0; //リトライ回数
$retry_max = 20; //リトライ最大数
$unbind_retry = 0; //未収取得リトライ


$(document).ready( function() {
});


$(document).bind("BOOT", function() {
	//サブメニュー用の画像のPreload
	$emenu.preload.product_size.push("setmenu");

	
	/* 商品選択後にカートを開く */
	$(document).bind( "CART_UPDATE", function() {
		if( $emenu.cart.cartAry.length && !$("#largecart").isVisible() ) {
			$emenu.cart_list.setOrder();
		}

		//カウンターの処理
		$.timer( function() {
			this.stop();

			var data = $emenu.cart.getCartAryWithoutSelect();
			if( data.length ) {

				var d_ids = [];

				$.each( data, function( i, item ) {

					var pdata;
					var num = item.num;
					var name_1s;

					//関連商品のIDを取得
					//関連商品の場合、カウンターが出ない
					//親商品の検索
					if( empty( item.item.alt_name_1 ) ) {
						$.each( $emenu.menudata.menumst, function( h, val ) {
							if( !empty(val.alt_name_1) ) {
								var name_1 = val.alt_name_1.split(",");
								$.each( name_1, function( j, ss ) {
									if( ss == item.item.code ) {
										pdata = val;
										return false;
									}
								});
							}
						});
					}

					//カート内の関連商品チェック
					if( !empty( item.item.alt_name_1 ) ) {

						if( d_ids.indexOf( item.item.id ) > -1 ) return true;
						
						var name_1 = item.item.alt_name_1.split(",");
						$.each( data, function( k, item2 ) {	
							$.each( name_1, function( l, nn ) {
								if( item2.item.code == nn ) {
									num += item2.num;
								}
							});
						});
						$("#menu-bodys #product-" + item.item.id + " .counter em").text( num );
						$("#menu-bodys #product-" + item.item.id + " .counter").css( "pointer-events", "none");
						$("#menu-bodys #product-" + item.item.id).addClass("has_select");

						d_ids.push(id);

						return true;

					} else if( !empty(pdata) ) {


						//カート内に親がある場合return
						var hit = false;
						$.each( data, function( k, item2 ) {
							if( item2.item.id == pdata.id ) {
								hit = true;
								return false;
							}
						});
						if( hit ) return true;


						//カート内には親はいない
						var name_1 = pdata.alt_name_1.split(",");
						$.each( name_1, function( p, group ) {
							$.each( data, function( q, item3 ) {
								if( item3.item.code == group && item.item.code != group ) {
									num += item3.num;
								}
							});
						});

						//関連されている場合はメニューにないので、関連側にカウンターをつける
						var id = pdata.id;
						if( d_ids.indexOf( id ) > -1 ) return true;

						$("#menu-bodys #product-" + id + " .counter").remove();

						var html = '<span class="counter">';
						html += '<button class="decrement">-</button>';
						html += '<span class="count"><em>' + num + '</em></span>';
						html += '<button class="increment">+</button>';
						html += '</span>';
						$("#menu-bodys #product-" + id).append(html);
						$("#menu-bodys #product-" + id).addClass("has_select");

						//カウンターのクリックを無効化
						$("#menu-bodys #product-" + id + " .counter").css( "pointer-events", "none");

						d_ids.push(id);

					}
				});
			}
		}, 10, 1);
	});
	/* largecartのクローズボタンを複製 */
	$("#largecart .close").clone(false).insertAfter("#largecart .close").addClass("close2");
	$("#largecart .close2")._click(function() {
		$("#largecart").hide();
		$emenu.cart_list.largecart_bol = false;
		//ノーマルカートをアップデート
		$emenu.cart_list.setCart( true );
		if( Config.cart.timeup_alert.enable ) {
			$emenu.cart_list.alert_timer.play(true);
		}
		$("#largecart").trigger("HIDE");
		$emenu.viewTop();
	});
});



/**
 * takeout
 */
$(document).bind("CHECKOUT", setTakeout );


function setTakeout() {

	console.log("setTakeout");
	$(document).unbind("CHECKOUT", setTakeout );

	$takeoutmode = ExternalInterface.checkin.menu;
	
	$org_table_no = $emenu.tableNo;
	$table = String( $org_table_no ).trim();

	if( $table != "88" && $table != "89" ) {
		console.log("通常起動");
		return;
	}

	//チェックイン通知を破棄
	window.doCheckin = function(){
		if( arguments.length ) {
			ExternalInterface.checkin = {
				tableNo:arguments[0],
				slipNo:arguments[1],
				headCount:Number(arguments[2]),
				checkinStatus:arguments[3],
				menuLockFlag:arguments[4],
				menu:arguments[5],
				menuEnd:arguments[6],
				menuEndAction:arguments[7],
				discountFlag:arguments[8],
				tableFlag:arguments[9],
			}
		}

		$takeoutmode = ExternalInterface.checkin.menu;

		if( ExternalInterface.checkin.menu != $emenu.menu_mode ) {
			//再起動
			ExternalInterface.doCheckin($takeout_table_no,"","1","0","000", ExternalInterface.checkin.menu,"    ","null","0","0");
			
		}

		//clear timer
		$emenu.boot_timer.stop();
	};
	

	//卓番で変更	
	//1, 2 ,3 
	switch( $table ) {
		case '89':
		default:
			$table_no_indent = 100;
			break;
		case '88':
			$table_no_indent = 200;
			break;
		case '87':
			$table_no_indent = 300;
			break;
	}

	$emenu.log.send("0","テイクアウト起動" );


	//check order keepを削除
	Config.check_order.keep = false;

	$emenu.order.onComplete = function(data, code, error) {
		// オーダーロックを解除
		$emenu.order.oeder_suspend = false;

		if( data ) {
			//オーダーの完了
			$emenu.order.response = $( data ).find("status").attr("code");
			$emenu.log.send("0","テイクアウト,注文完了:" + $emenu.order.response );

			//statuscode=1
			if($emenu.order.response != "0") {
				$emenu.order.onError();
			} else {
				$emenu.order.callback();
				$emenu.log.send("0","ORDER,注文完了" );
				$retry = 0;
			}
		} else {
			//エラーハンドリング
			console.log( error )
			$emenu.order.response = code;
			$emenu.order.onError( error );
		}
	}

	// override Order Error
	// チェックイン済みだったらcode=2のエラーになる
	// エラーの場合は次の卓版でリトライ
	// 卓版を全て使い切ったら、再度１からトライ
	// リトライ回数を40で制限する
	$emenu.onErrorOrder = function( code, item ) {

		if(code != "1009") {
			//卓チェックイン済み以外のエラー
			//callback後のカートのクリアに関してはmessage画面に記述
			$emenu.message.show( code,  "exec_order", item  );
			//スリープ解除
			ExternalInterface.sleep( false );
			$emenu.log.send("0","テイクアウト,オーダーエラー:" + code );
			return;
		}

		$.timer( function() {
			this.stop();

			//リトライチェック
			if( $retry >= $retry_max ) {
				$emenu.message.show("1000");
				$retry = 0;
				return;
			}

			//卓番を繰り上げ
			$count++;
			$retry++;
			if( $count >$count_max ) {
				$count = 1;
			}
			$takeout_table_no = String( $count + $table_no_indent ).padRight(4); //zero padding
			$emenu.tableNo = $takeout_table_no;
			$emenu.execOrder();
		}, 2000, 1 );

		$emenu.log.send("0","テイクアウト,卓使用中・卓番繰り上げます" );
	}

	$("body").addClass("takeout");


	//処理が被るので、少しずらす
	$.timer(function() {
		this.stop();
		$takeout_table_no = String( $count + $table_no_indent ).padRight(4); //Takeout Table No
		//Config.login.enable = true;
		//$top_boot_complete = false; //categorybtnをフィットさせるためfalseにセット
		$emenu.person = 1; //firstorder
		$emenu.first_order = true; //firstorder
		Config.terminal_checkin.first_order.reset_timer = 1000000;
		ExternalInterface.doCheckin($takeout_table_no,"","1","1","000",$takeoutmode,"    ","null","0","0");

		$emenu.log.send("0","テイクアウト:初期起動" + $takeout_table_no );

		//注文確認と会計を無効化
		$( "#ordercheck-btn, #accounting-call" ).attr("disabled", true);
		//$emenu.sys.mode().bashing = false;

		//スタッフコールのイベントを変更
		$("#staff-call").unbind("click");
		$("#staff-call")._click(function(){
			$emenu.message.confirm( "staffcall_confirm", function() {
				var item =  { name_1:"スタッフコール", name_2:"", id:Config.staffcall.id, code:Config.staffcall.id }; //scope.menudata.menumst[ Config.staffcall.id ];
				if( empty(item) ) {
					$emenu.log.send("0","スタッフコール,商品データが見つかりません。" );
					return;
				}
				var item_data = [{ item:item, num:1, set:[], sub:[] }];
				var tbn = String( $org_table_no ).trim();
				//先頭の一文字を削除
				tbn = tbn.substr(1);
				tbn = "1000000".substr( 0, 7 - tbn.length ) + tbn;
				var slip_no = tbn;
				$emenu.order.setOrderRequest( slip_no, item_data, $emenu.staff_call.loaded, $emenu.staff_call.onError, Config.orderdate_insert );
				$emenu.message.show( "staffcalling" );
			});
		});

	}, 300, 1);


	//一定時間でログインに戻す
	Config.fcategory_top.timer.enable = true;
	Config.fcategory_top.timer.time = 120;


	//スクリーンセーバーを停止
	$(document).bind("LOAD_MENU", function() {
		$emenu.screensaver.enable = false;
		$emenu.screensaver.stop();
	});


	//注文完了のメッセージを変更
	$(document).bind("ORDER_COMPLETE", function() {
		$emenu.message.hide("order_complete");
		$emenu.message.show( "order_complete2", null, null, function() {
			//クローズタイマーがある場合にはとめる
			if( !empty($emenu.order_complete_timer) ) {
				$emenu.order_complete_timer.stop();
			}
			//OrderCompleteのトリガー
			$(document).trigger("ORDER_COMPLETE_CLOSE");
		}, true );

		$emenu.order_complete_timer.stop();
		

		//
		if(!$emenu.payment.enable) {
			$emenu.order_complete_timer = $.timer(function(){
				//$("#order-complete").hide();
				$emenu.message.hide("order_complete2");
				$emenu.order_complete_timer.stop();
				//OrderCompleteのトリガー
				$(document).trigger("ORDER_COMPLETE_CLOSE");
			}, Config.order_complete.close_time, true);
		}
	});


	//注文完了
	if(!$emenu.payment.enable) {
		$(document).bind("ORDER_COMPLETE_CLOSE", function() {
			
			$emenu.cart.reset();
			$emenu.cart_list.reset();
			$("#page").removeClass("incart");

			//処理が被るので、少しずらす
			$count++;
			if( $count >$count_max ) {
				$count = 1;
			}
			$takeout_table_no = String( $count + $table_no_indent ).padRight(4); //Takeout Table No
			$emenu.person = 1; //firstorder
			$emenu.first_order = true; //firstorder
			ExternalInterface.doCheckin($takeout_table_no,"","1","1","000",$takeoutmode,"    ","null","0","0");

			//$emenu.login.show();
			$( "#ordercheck-btn, #accounting-call" ).attr("disabled", true);
			//$emenu.category.setFcategory("100");
			$emenu.viewTop();

			//日本語に戻す
			//$emenu.alternate.setDefaultLang();
		});
	}

	//payment × setCheckOut
	$emenu.setCheckOut = function() {
		return;
	}

	//テイクアウト用未収伝票一覧の取得
	$emenu.payment.createQR = function() {
		$("#payment-qr-container").html('<h1 class="' + Config.message.text_class + '">' + $emenu.alternate.getString("payment-lo0ading") + '</h1>');
		$emenu.unpaid_slipno.send( $emenu.payment.unpaidSlipnoLoaded );
	}
	$emenu.payment.unpaidSlipnoLoaded = function(data) {
		if( !data ) {
			$emenu.payment.getUnpaidSlipno();
			return;
		}
		var hit = false;
		$.each( data, function( i, val ) {

			if( String(val.tableno).trim() == String($takeout_table_no).trim() ) {
				$emenu.slipNo = val.slipno;
				$emenu.payment.checkOrderLoaded( val );
				hit = true;
				return false;
			}
		});

		if( !hit ) {
			$emenu.payment.getUnpaidSlipno();
			return;
		}
	}
	//リトライ
	$emenu.payment.getUnpaidSlipno = function() {
		$unbind_retry++;
		if( $unbind_retry > 3 ) {
			$unbind_retry = 0;
			$emenu.log.send("0","PAYMENT:UNPAID_SLIPNO_NG" );
			return;
		}

		//未収確認
		$emenu.setNotifyCheckin(true);

		$.timer(function() {
			this.stop();
			$emenu.payment.createQR();
		}, 1000, 1);
	}

}




$(document).bind("CATEGORY",function() {
	//tcategoryのクラス
	var focus = $("#menu-bodys .page.focus");
	$("#tcategory, #scategory").removeClass()

	if( focus.hasClass("custom2") ) {
		$("#tcategory").addClass("custom2");
		$("#scategory").addClass("custom2");
	} else if( focus.hasClass("custom1") ) {
		$("#tcategory").addClass("custom1");
	}
});


$(document).bind("SELECT_SHOW", function() {
	//商品画像
	var url = $("#select .item img.image").attr("src");
	url = url.replace( /LL/g, "select" );

	$("<img>").load(function(){
				$("#select .item img.image").attr("src", url);
			}).error(function(){
			}).attr("src", url );

	$("#select .stepbox .select-btn").each(function() {
		try {
			var data = $emenu.select.getSelectItem( $(this).parents(".stepbox").data("index"), $(this).data("id") );
			if( empty(data) ) return true;
			if( data.alt_name_1 == "icon" ) {
				$(this).append("<i></i>");
				$(this).addClass("has_icon");
			}
		} catch (e) {}
	});

});


// alt_name1がある商品にクラスをつける
$(document).bind("MENU_BOOT_FINISH",function() {
	$("#menu-bodys .page ul li").each( function() {
		var id = $(this).data("id");
		var data = $emenu.menudata.menumst[id];

		if( !empty( data ) && !empty( data.alt_name_1 ) ) {
			$(this).addClass("has_group");
			$(this).find(".detail").show();
		}
	} );

	//window.fitScategory();
});


//詳細画面に指定商品は関連商品のボタンを表示する（150,300g対応）stock
$(document).bind("DETAIL_SHOW", function() {

	var detail_data = $emenu.detail.data;
	var alt_name_1 = detail_data.alt_name_1;
	
	var items = alt_name_1.split(",");

	var detail = $("#detail section .order");

	detail.find(".custom").remove();
	detail.find("button").show();


	//商品画像
	var url = $("#detail .item img.image").attr("src");
	url = url.replace( /LL/g, "detail" );

	$("<img>").load(function(){
				$("#detail .item img.image").attr("src", url);
			}).error(function(){
			}).attr("src", url );


	var group_data = [];
	$.each( items, function( k, val ) {
		$.each( $emenu.menudata.menumst, function( h, mst ) {
			if( Number(val) == Number( mst.code ) ) {
				group_data.push(mst);
			}
		});
	});

	if( group_data.length ) {
		var btn = detail.find("button");
		var a = btn.clone(false).insertAfter(btn).addClass("custom custom1").css("margin-right","15px");
		if( empty(detail_data.name_2) ) {
			a.html( String(detail_data.name_1 + "" + detail_data.name_2 + detail_data.name_3) + "<br><span>" + priceText(detail_data.price) + "</span>" );
		} else {
			a.html( String(detail_data.name_1 + "<br>" + detail_data.name_2 + detail_data.name_3) + "<br><span>" + priceText(detail_data.price) + "</span>" );
		}
		a._click( function() {
			$emenu.selectProduct( detail_data );
			$emenu.detail.hide();
		});

		//グループ
		var ab = a;
		$.each( group_data, function( i, gr ) {
			var b = btn.clone(false).insertAfter(ab).addClass("custom custom2");
			ab = b;
			if( empty(gr.name_2) ) {
				b.html( String(gr.name_1 + "" + gr.name_2 + gr.name_3) + "<br><span>" + priceText(gr.price) + "</span>" );
			} else {
				b.html( String(gr.name_1 + "<br>" + gr.name_2 + gr.name_3) + "<br><span>" + priceText(gr.price) + "</span>" );
			}
			
			b._click( function() {
				$emenu.selectProduct( gr );
				$emenu.detail.hide();
			});
		});
		$("#detail section .custom2").not(":last-child").css("margin-right","15px");
	
		if( group_data.length > 3 ) {
			$("#detail section .order").addClass("long");
		} else {
			$("#detail section .order").removeClass("long");
		}
		$("#detail section").removeClass("single");
		btn.hide();
	} else {
		$("#detail section .order").removeClass("long");
		$("#detail section").addClass("single");
	}
});



$(document).bind("SETMENU_SHOW", function() {
	$("#setmenu").removeClass("short");
	var leng = $("#setmenu .item-list li").length;
	if( leng <= 8 ) {
		$("#setmenu").addClass("short");
	}

	//商品画像
	var images = $("#setmenu .item-list img,image");
	$.each( images, function( i, set ) {
		var url = $(set).attr("src");
		url = url.replace( /LL/g, "setmenu" );
			$("<img>").load(function(){
				$(set).attr("src", url);
			}).error(function(){
			}).attr("src", url );
	} );

	$emenu.setmenu.setListBtn();
})



//Payment
//注文完了
$(document).bind("MESSAGE_SHOW", function() {

	if(!$emenu.payment.enable) {
		return;
	}

	if( $("#message").hasClass("6100") ) {

		$emenu.bashing_bol = false;
	
		$emenu.cart.reset();
		$emenu.cart_list.reset();
		$("#page").removeClass("incart");

		//処理が被るので、少しずらす
		$count++;
		if( $count >$count_max ) {
			$count = 1;
		}
		$takeout_table_no = String( $count + $table_no_indent ).padRight(4); //Takeout Table No
		$emenu.person = 1; //firstorder
		$emenu.first_order = true; //firstorder
		ExternalInterface.doCheckin($takeout_table_no,"","1","1","000",$takeoutmode,"    ","null","0","0");

		//$emenu.login.show();
		$( "#ordercheck-btn, #accounting-call" ).attr("disabled", true);
		$emenu.sys.mode().bashing = false;

		$emenu.viewTop();

		//ほんとはこのタイマーは不要にしたいので、paymentでmessageを消すようにする
		$.timer(function() {
			this.stop();
			$emenu.message.hide();
		}, Config.order_complete.close_time, 1);


		//QRの削除
		if( $emenu.payment.widget ) {
			$emenu.payment.widget.destroy();
		}


		//日本語に戻す
		//$emenu.alternate.setDefaultLang();

	} else if( $("#message").hasClass("order_complete") || $("#message").hasClass("order_complete2") ) {

		$emenu.payment.show();
		
		//$("#payment-select .close").hide();
		$("#payment-select .close").unbind("_click");
		$("#payment-select .close")._click(function() {
			
			$emenu.bashing_bol = false;
	
			$emenu.cart.reset();
			$emenu.cart_list.reset();
			$("#page").removeClass("incart");

			//処理が被るので、少しずらす
			$count++;
			if( $count >$count_max ) {
				$count = 1;
			}
			$takeout_table_no = String( $count + $table_no_indent ).padRight(4); //Takeout Table No
			$emenu.person = 1; //firstorder
			$emenu.first_order = true; //firstorder
			ExternalInterface.doCheckin($takeout_table_no,"","1","1","000",$takeoutmode,"    ","null","0","0");

			$( "#ordercheck-btn, #accounting-call" ).attr("disabled", true);
			$emenu.sys.mode().bashing = false;
			$emenu.viewTop();

			$emenu.message.hide();
			$emenu.payment.hide();
		});


		$emenu.message.hide("order_complete");
		$emenu.message.hide("order_complete2");

		$("#pay-chash").unbind("_click");
		$("#pay-chash")._click(function() {
			console.log($emenu.message.lock)
			$emenu.message.show("order_complete_chash");
			$emenu.payment.hide();

			$.timer(function() {
				this.stop();

				$emenu.bashing_bol = false;
	
				$emenu.cart.reset();
				$emenu.cart_list.reset();
				$("#page").removeClass("incart");

				//処理が被るので、少しずらす
				$count++;
				if( $count >$count_max ) {
					$count = 1;
				}
				$takeout_table_no = String( $count + $table_no_indent ).padRight(4); //Takeout Table No
				$emenu.person = 1; //firstorder
				$emenu.first_order = true; //firstorder
				ExternalInterface.doCheckin($takeout_table_no,"","1","1","000",$takeoutmode,"    ","null","0","0");

				$( "#ordercheck-btn, #accounting-call" ).attr("disabled", true);
				$emenu.sys.mode().bashing = false;
				$emenu.viewTop();

				$emenu.message.hide();

			}, Config.order_complete.close_time, 1 );

		});

	}
});



//クーポン
$(document).bind("COUPON_SELECT", function() {
	if( $emenu.cart.cartAry.length && !$("#largecart").isVisible() ) {
		$emenu.cart_list.setOrder();
	}
});

//Code starts from here

var is_android = $(window).isTablet();
if (is_android == "windowstabret" || is_android == "windowstabret_ie")
  is_android = false;

var events = is_android ? "touchend" : "mouseup";
if (window.Config.mousedown) {
  events = is_android ? "touchstart" : "mousedown";
}

var onCooldown = false;
const cooldown = 2000;
var typingHistory = "";
const allowedCodeArr = ["100", "200", "300", "400", "500", "600"];
const allowedKeysStr = "1234567890modeback";
const allowedKeys = allowedKeysStr.split("");

const reset = () => {
  typingHistory = "";
  onCooldown = true;
  setTimeout(() => {
    onCooldown = false;
  }, cooldown);
};

$(document).keypress(function (e) {
  let key = String.fromCharCode(e.which);
  if (allowedKeys.includes(key) && !onCooldown) {
    typingHistory += key;
  }
  if (
    allowedCodeArr.includes(
      typingHistory.substring(typingHistory.length - 3, typingHistory.length)
    )
  ) {
    let code = typingHistory.substring(
      typingHistory.length - 3,
      typingHistory.length
    );
    $(`.gtc-${code}`).trigger(events);
    reset();
  }

  if (
    typingHistory.substring(
      typingHistory.length - 6,
      typingHistory.length - 2
    ) == "mode" &&
    /^\d+$/.test(
      typingHistory.substring(typingHistory.length - 2, typingHistory.length)
    )
  ) {
    let url = new URL(window.location.href);
    let mode = typingHistory.substring(
      typingHistory.length - 2,
      typingHistory.length
    );
    url.searchParams.set("mode", mode);
    window.location.href = url.href;
    reset();
  }

  if (
    typingHistory.substring(typingHistory.length - 4, typingHistory.length) ==
    "back"
  ) {
    $("#go-top").trigger(events);
    reset();
  }
});

//Code ends here

