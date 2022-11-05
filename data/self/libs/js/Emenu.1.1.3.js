/**
* Name:emenu
* Vertion:1.1.3
* Discription:HTML5 e-menu
* Date:2020-03-02
*/

;

$(function(){

	/*
		共通JS
	*/
	
	//config_localのアップデート
	var config_local = JSON.stringify(window.config_local);
	config_local = String(config_local).replace(/\n/g,'').replace(/　　　　/g,'');
	config_local = JSON.parse(config_local, revalue);
	Object.merge( Config, config_local, true );


	var mode = "01"; //プレビューのモード

	//URLでConfigを更新
	if( window.location.search ) {
		var param = window.location.search.substring(1,window.location.search.length);
		var params = param.split("&");
		$.each(params, function( i, val ) {
			var p = val.split("=");
			//modeの変数は別処理
			if(p[0] == "mode") {
				mode = p[1];
				return true;
			}
			var e = String(p[0]).split(".");
			var object = Config;
			var key;
			$.each( e, function( k, obj ){
				if( !empty(object[obj]) && typeof object[obj] == "object" ) {
					object = object[obj];
				} else {
					key = obj;
				}
			});
			//Config[decodeURIComponent(p[0])] = eval( decodeURIComponent(p[1]) );
			if( e.length > 1 ) {
				object[key] = eval( decodeURIComponent(p[1]) );
			} else {
				object[e] = eval( decodeURIComponent(p[1]) );
			}
			//console.log( decodeURIComponent(p[0]), Config[decodeURIComponent(p[0])] )
			
		});
	}

	//画面のサイズをConfigから取得
	if( Config.shop.size ) {
		//15inchはwxga+hd
		if( Config.shop.size.toLowerCase() == "hd" ) {
			var w = ( $(window).isTablet() == "windowstabret_ie" ) ? document.documentElement.clientWidth : window.innerWidth;
			if( w > 1282 ) {
				$("body").attr("id","hd");
			} else {
				$("body").attr("id","wxga");
			}
		} else {
			$("body").attr("id", Config.shop.size.toLowerCase());
		}

		//ie
		if( $(window).isTablet() == "windowstabret_ie" ) {
			$("body").attr("unselectable","on");
		}
	}
	if( Config.shop.color ) {
		$("body").addClass(Config.shop.color.toLowerCase());
	}

	//ローカルモードのセット
	if( Config.islocal ) {
		window.tcs =  new TCS();
		window.tcs.mode = mode;

	} else {
		//fixedをセット
		//$("body").css("position","fixed");

		//overflowをセット
		$("html,body").css("overflow","hidden");

		//tcsを実行する
		if( Config.use_tcs ) {
			window.tcs =  new TCS();
			window.tcs.mode = mode;
		}
	}

	//デバッグモード
	if( Config.debug ) {
		$("#debug").show();

		//デバッグ用リロード
		window.touch_count = 0;
		window.touch_counter = $.timer(function(){
			window.touch_count = 0;
			this.stop();
		}, 2000);
		$("#table-setup-btn")._click(function() {
			window.touch_count++;
			if( window.touch_count  > 2 ) {
				location.reload();
			}
			window.touch_counter.play();
		});
		
	} else {
		$("#debug").hide();
		document.oncontextmenu = function() { return false };
		//console.logを削除
		window.console = {};
		window.console.log = function(i){return;};
		window.console.time = function(i){return;};
		window.console.timeEnd = function(i){return;};
	}
	
	//console.log(  $(window).isTablet() )
	//Androidのセット
	var tablet = $(window).isTablet();
	if( tablet ) {
		if( tablet == 'android' ) {
			var ua = navigator.userAgent;
			var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8)) * 10;
			$("body").addClass("android android" + androidversion);
		} else if(  tablet == 'ipad'  ) {
			$("body").addClass("iOS");
		}
	}
	
	//カスタムCSSのセット
	if( !empty( Config.shop.css ) ) {
		var chtml = "";
		$.each( Config.shop.css, function(i,css) {
			chtml += '<link rel="stylesheet" type="text/css" href="' + css + '">';
		} );
		$("head").append(chtml);
	}
	//カスタムJSのセット
	if( !empty( Config.shop.js ) ) {
		var jhtml = "";
		$.each( Config.shop.js, function(i,js) {
			jhtml += '<script type="text/javascript" src="' + js + '"></script>';
		} );
		$("head").append(jhtml);
	}

	//pathのセット
	setWindowPath();

	//起動
	// var emenu = new MainController( this );
	// $emenu = emenu;
	// emenu.init();

	// document.emenu = ExternalInterface;
	// $("#page").hide();

	if( tablet == "ipad" && !Config.islocal ) {
	//if( true ) {
		//iPad対応
		//
		$("#page").hide();
		$(window).load(function() {
			//フォントのロード完了を文字の幅でチェック
			/*
			var html = '<div id="fontcheck1" style="position:absolute;font-family:\'AFont\' serif !important;">a</div>';
			html += '<div id="fontcheck2" style="position:absolute;font-family: serif !important;">a</div>';
			$("body").append(html);

			var count = 0;
			var load_font_timer = $.timer(function() {
				if( $("#fontcheck1").outerWidth() != $("#fontcheck2").outerWidth() ) {
			*/
					//起動
					//起動のタイミングをずらす
					//フォント読み込みように10秒増やす
					var inter = Math.random() * 10 * 1000;
					$.timer(function() {
						var emenu = new MainController( this );
						$emenu = emenu;
						emenu.init();
						document.emenu = ExternalInterface;
						this.stop();
					}, inter, 1);
			/*
					$("#fontcheck1,#fontcheck2").remove();
					this.stop();
				};
				count++;
				if( count == 120 ) {
					$("#fontcheck1").width(100);
				}
			}, 500, 1 );
			*/

		});

	} else {
		$("#page").hide();
		$(window).load(function() {

			//fontが読み込み完了前に呼ばれるかどうか
			window.clearTimeout(timer);

			//起動
			//起動タイミングを端末ごとにランダムでずらす
			var inter =　( Config.islocal ) ? 10 : Math.random() * 10 * 1000;
			$.timer(function() {

				var emenu = new MainController( this );
				$emenu = emenu;
				emenu.init();
				document.emenu = ExternalInterface;
				this.stop();

			}, inter, 1);
		});
	}
	
	//フルスクリーンのセット
	if( Config.fullscreen ) {
		$("#page")._click(function() {
			if ( document.body.msRequestFullscreen ) {
				document.body.msRequestFullscreen();
			}
			else if (document.body.webkitRequestFullScreen) {
				$("body").css({
					"width": window.screen.width + "px",
					"height": window.screen.height + "px"
				});
				document.body.webkitRequestFullScreen();
			}
			else if (document.body.mozRequestFullScreen) {
				document.body.mozRequestFullScreen();
			}
			$("#page").unbind("_click");
		});
	}

});


/**
 * 各種パスをセット
 */
function setWindowPath() {
	window.apppath = ( Config.islocal ) ? "../emenu_local/data/" : "/emenu/";
	window.htmlpath = ( Config.islocal ) ? "menu/" : '/self/menu/';
	window.languagepath = ( Config.islocal ) ? "languages/" : '/self/languages/';
	window.datapath = ( Config.islocal ) ? "data/" : '/self/data/';
	window.designpath = ( Config.islocal ) ? "design_cmn/" : '/self/design_cmn/';
	window.moviepath = ( Config.islocal ) ? "../movie/" : '/movie/';
	window.contentspath = ( Config.islocal ) ? "../contents/" : '/contents/';
	window.configpath = ( Config.islocal ) ? "../emenu_local/data/" : '/config/';
}

/**
 * JSONの整形
 */
function revalue(key, value) {
	if(/^(true|false|null|undefined|NaN)$/i.test(value)) return eval(value);
	if(parseFloat(value)+''== value) return parseFloat(value);
	return value;
};/**
* ExternalInterface
* Flash版から引継ぎ
*/
var ExternalInterface = (function( window, document ) {

	var ExternalInterface = {};
	var self = ExternalInterface;
	
	ExternalInterface.sleep_bol = false;
	ExternalInterface.stack = []; //スタック関数配列

	ExternalInterface.checkin = {}; //チェックイン
	ExternalInterface.stock = []; //ストック商品ID
	ExternalInterface.local_message = ""; //ローカルメッセージ
	ExternalInterface.message = ""; //メッセージ
	ExternalInterface.master_status; //メニュー更新情報
	ExternalInterface.battery = {}; //バッテリー状態
	ExternalInterface.wlan = {}; //無線状態
	ExternalInterface.update_wlan = {}; //無線更新情報
	ExternalInterface.close_contents = ""; //サイネージ終了ID
	ExternalInterface.eparkinfo = {}; //Eparkログイン情報
	ExternalInterface.eparkinfo_callback; //外部ドメインへのリクエスト取得後のコールバック
	ExternalInterface.eparkjson; //外部ドメインへのリクエスト取得情報

	ExternalInterface.qr_result; //QRコード読み取り結果
	ExternalInterface.ss_result; //スクリーンセーバー結果
	ExternalInterface.video_finish; //動画の終了結果
	
	
	/**
	 * 初期情報送信完了通知
	 * @return {[type]} [description]
	 */
	ExternalInterface.doInitialize = function() {

		//TODO
		//不要な可能性がある。MainController内で初期処理完了で呼ばれているので、TCSから受けるとループする可能性あり

		if( self.sleep_bol ) {
			self.stack.push( $emenu.doInitialize );
		} else {
			$emenu.doInitialize();
		}
	};

	/**
	 * 初期情報送信完了通知
	 * @return {[type]} [description]
	 */
	ExternalInterface.notifyFinish = function() {
		// if( self.sleep_bol ) {
		// 	self.stack.push( $emenu.notifyFinish );
		// } else {
		// 	$emenu.notifyFinish();
		// }
	};

	/**
	 * チェックイン
	 * arguments  tableNo, slipNo, headCount, checkinStatus, menuLockFlag, menu, menuEnd, menuEndAction, discountFlag, tableFlag 
	 */
	ExternalInterface.doCheckin = function() {

		if( arguments.length ) {
			self.checkin = {
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
		//console.log( "self.checkin", self.checkin  );
		if( self.sleep_bol ) {
			self.stack.push( $emenu.doCheckin );
		} else {
			$emenu.doCheckin();
		}
	};

	/**
	 * 品切れ
	 * @param  {[type]} stock [品切れ商品ID]
	 * @return {[type]} [description]
	 */
	ExternalInterface.doCheckStock = function()  {

		var args = [];
		var leng = arguments.length;
		for( var i=0; i<leng; i++ ) {
			args.push( arguments[i] );
		}
		//品切れがStringで入ってくる場合
		if( args.length == 1 ) {
			args = String(args[0]).split(",");
		}
		self.stock = args;

		//console.log( items )
		if( self.sleep_bol ) {
			self.stack.push( $emenu.doCheckStock );
		} else {
			$emenu.doCheckStock();
		}
	};

	/**
	 * 指定端末店舗メッセージ情報
	 * @param  {[type]} message [description]
	 * @return {[type]}         [description]
	 */
	ExternalInterface.doLocalMsg = function(message) {
		self.local_message = message;
		if( self.sleep_bol ) {
			self.stack.push( $emenu.doLocalMsg );
		} else {
			$emenu.doLocalMsg();
		}
	};
	
	/**
	 * 店舗メッセージ情報
	 * @param  {[type]} message [description]
	 * @return {[type]}         [description]
	 */
	ExternalInterface.doMsg = function(message){
		self.message = message;
		if( self.sleep_bol ) {
			self.stack.push( $emenu.doMsg );
		} else {
			$emenu.doMsg();
		}
	};


	/**
	 * メニュー更新受付情報
	 * @param  {[type]} master_status [description]
	 * @return {[type]}               [description]
	 */
	ExternalInterface.doUpdateMst = function(master_status)  {
		self.master_status = master_status;
		if( self.sleep_bol ) {
			self.stack.push( $emenu.doUpdateMst );
		} else {
			$emenu.doUpdateMst();
		}
	};
  
	/**
	 * 初期化タイムアウト
	 */
	ExternalInterface.notifyInitTimeout = function() {
		if( self.sleep_bol ) {
			self.stack.push( $emenu.notifyInitTimeout );
		} else {
			$emenu.notifyInitTimeout();
		}
	};

	/**
	 * ゲームのロード完了
	 */
	ExternalInterface.onLoadedGame = function() {
		if( self.sleep_bol ) {
			self.stack.push( $emenu.onLoadedGame );
		} else {
			$emenu.onLoadedGame();
		}
	}

	/**
	 * ゲームの景品注文
	 */
	 ExternalInterface.onPrizeOrder = function() {
	 	if( self.sleep_bol ) {
			self.stack.push( $emenu.onPrizeOrder );
		} else {
			$emenu.onPrizeOrder();
		}
	 }

	 /**
	 * ゲームの終了
	 */
	 ExternalInterface.setFinishGame = function() {
	 	if( self.sleep_bol ) {
			self.stack.push( $emenu.setFinishGame );
		} else {
			$emenu.setFinishGame();
		}
	 }
	 
	/**
	 * コンテンツ中断通知
	 * @return {[type]} [description]
	 */
	ExternalInterface.content_resume = function() {
		if( self.sleep_bol ) {
			self.stack.push( $emenu.content_resume );
		} else {
			$emenu.content_resume();
		}
	};

	/**
	 * コンテンツ終了通知
	 * @return {[type]} [description]
	 */
	ExternalInterface.notify_content_finish = function() {
		if( self.sleep_bol ) {
			self.stack.push( $emenu.notify_content_finish );
		} else {
			$emenu.notify_content_finish();
		}
	};	

	/**
	 * バッテリー残照
	 * @param  {[type]} acLineStatus       AC電源状態
	 * @param  {[type]} batteryLifePercent バッテリ残量（0～100）の整数
	 * @param  {[type]} batteryFlag        DC電源状態
	 * @param  {[type]} batteryLifeTime    DC残り維持時間（秒）
	 * @return {[type]}                    [description]
	 */
	ExternalInterface.notifyBattStat = function(acLineStatus, batteryLifePercent, batteryFlag, batteryLifeTime)  {
		self.battery = {
			acLineStatus:acLineStatus,
			batteryLifePercent:batteryLifePercent,
			batteryFlag:batteryFlag,
			batteryLifeTime:batteryLifeTime
		}
		if( self.sleep_bol ) {
			self.stack.push( $emenu.notifyBattStat );
		} else {
			$emenu.notifyBattStat();
		}
	};

	/**
	 * 無線状態
	 * @param  {[type]} level [description]
	 * @return {[type]}       [description]
	 */
	ExternalInterface.notifyWlanStat = function(level) {
		self.wlan = {
			level:level
		}
		if( self.sleep_bol ) {
			self.stack.push( $emenu.notifyWlanStat );
		} else {
			$emenu.notifyWlanStat();
		}
	};

	/**
	 *無線デバイス再取得完了通知
	 * @param  {[type]} SSID  [description]
	 * @param  {[type]} BSSID [description]
	 * @param  {[type]} RSSI  [description]
	 * @return {[type]}       [description]
	 */
	ExternalInterface.updateWifiSts = function(SSID, BSSID, RSSI)  {
		self.update_wlan = {
			SSID:SSID,
			BSSID:BSSID,
			RSSI:RSSI
		}
		if( self.sleep_bol ) {
			self.stack.push( $emenu.updateWlanStat );
		} else {
			$emenu.updateWlanStat();
		}
	}

	/**
	 * MoviePlayer再生終了要求
	 * サイネージからの戻り通知
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	ExternalInterface.closeContents = function(id)  {	
		self.close_contents = id;
		if( self.sleep_bol ) {
			self.stack.push( $emenu.closeContents );
		} else {
			$emenu.closeContents();
		}
	}

	/**
	 * Eparkログイン情報
	 * @param {String} [pdid] 店舗ID
	 * @param {String} [pass] 店舗パスワード
	 * @param {String} [pass] カードID
	 */
	ExternalInterface.eparklogininfo = function( pdid, pass, cardid ) {
		self.eparkinfo = {
			pdid:pdid,
			pass:pass,
			cardid:cardid
		}
		if( self.sleep_bol ) {
			self.stack.push( $emenu.eparkLoginInfo );
		} else {
			$emenu.eparkLoginInfo();
		}
	}

	/**
	 * 外部ドメインへのリクエスト取得
	 */
	ExternalInterface.eparkinfojson = function( json ) {
		self.eparkjson = json;

		if( empty(self.eparkinfo_callback) ) return;

		if( self.sleep_bol ) {
			self.stack.push( self.eparkinfo_callback );
		} else {
			self.eparkinfo_callback();
		}
	}


	/**
	 * QRコードの読み取り完了
	 */
	ExternalInterface.resultQRData = function( result ) {
		self.qr_result = result;
		if( self.sleep_bol ) {
			self.stack.push( $emenu.resultQRData );
		} else {
			$emenu.resultQRData();
		}
	}


	/**
	 * WindowsScreensaver動画戻り
	 */
	ExternalInterface.closedScreensaverWindow = function( result ) {
		self.ss_result = result;
		if( self.sleep_bol ) {
			self.stack.push( $emenu.screensaver.closedWindow );
		} else {
			$emenu.screensaver.closedWindow();
		}
	}


	/**
	 * MoviePlayerもどり
	 */
	ExternalInterface.finishVideo = function( type, onTouch, mCode ) {
		self.video_finish = {
			type:type,
			onTouch:onTouch,
			mCode:mCode
		};
		if( self.sleep_bol ) {
			self.stack.push( $emenu.finishVideo );
		} else {
			$emenu.finishVideo();
		}
	}


	/**
	 * 処理をスタック
	 * @param  {[type]} bol [description]
	 * @return {[type]}     [description]
	 */
	ExternalInterface.sleep = function( bol ) {
		if( bol ) {
			self.sleep_bol = true;
		} else {
			self.sleep_bol = false;
			//stackの実行
			$.each( self.stack, function( i, functions ) {
				functions();
			});
			self.stack = [];
		}
	};


	return ExternalInterface;

})( window, document, undefined );



/** ここからTCS連携
* -------------------------------------------------------------------  */

/**
 * ※未使用
 * @type {String}
 */
var terminal = "Linux";
function checkTerminal(){
	return terminal;
}

/**
* 初期化完了通知（notifyInitialize()） FLA->通信制御
*/
function notifyinitialize(){
	
	var ua = $(window).isTablet();

	if( ua == "ipad" && !Config.islocal ) {
		location.href="tcs://notifyinitialize";
	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.notifyinitialize();
	} else {
		tcs.notifyinitialize();
	}
}

/**
* 初期化完了通知（notifyLoaded()） FLA->通信制御
* ※未使用
*/
function notifyLoaded(){
	doInitialize();
}

/**
* 初期情報送信完了通知（doInitialize()）　通信制御->FLA
* ※未使用
*/
function doInitialize() {
	//$emenu.doInitialize();
	ExternalInterface.doInitialize();
}

/**
* 初期情報送信完了通知（notifyFinish()） 通信制御->FLA
* ※未使用
*/
function notifyFinish(){
	//$emenu.notifyFinish();
	ExternalInterface.notifyFinish();
}

/**
* テーブル情報（doCheckin()）　通信制御->FLA
*/ 
function doCheckin2()  {	
	document.base.doCheckin("01234","12","1","1","000", str ,"    ","NaN","0","0");
}
function doCheckin(tableNo, slipNo, headCount, checkinStatus, menuLockFlag, menu, menuEnd, menuEndAction, discountFlag, tableFlag)  {	
 	//$emenu.doCheckin(tableNo, slipNo, headCount, checkinStatus, menuLockFlag, menu, menuEnd, menuEndAction, discountFlag, tableFlag);
 	ExternalInterface.doCheckin(tableNo, slipNo, headCount, checkinStatus, menuLockFlag, menu, menuEnd, menuEndAction, discountFlag, tableFlag);
}

/**
* 品切れ更新情報（doCheckStock()） 通信制御->FLA
*/ 
function doCheckStock()  {
	//ExternalInterface.doCheckStock(ids);
	var args = [];
	var leng = arguments.length;
	for( var i=0; i<leng; i++ ) {
		args.push( arguments[i] );
	}
	ExternalInterface.doCheckStock( args );
}

/**
* 指定端末店舗メッセージ情報（doLocalMsg()）　通信制御->FLA
*/ 
function doLocalMsg(message) {
	//$emenu.doLocalMsg(message);
	ExternalInterface.doLocalMsg( message )
}

/**
* 店舗メッセージ情報（doMsg()）　通信制御->FLA
*/   
function doMsg(message){
	//alert("doMsg");
	//$emenu.doMsg(message);
	ExternalInterface.doMsg(message);
}

/**
* メニュー更新受付情報（doUpdateMst()）　通信制御->FLA
*/   
function doUpdateMst(masterStatus)  {
	ExternalInterface.doUpdateMst(masterStatus);
}

/**
* ログオフ通知（notifyCheckout()） FLA->通信制御
* @return {[type]} [description]
*/
function notifyCheckout(){
	//tcs.notifyCheckout();
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal ) {
		//サウンドと同時実行しないように延滞実行を行う
		var timer = $.timer(function() {
			location.href="tcs://notifyCheckout";
			this.stop();
		},100,1);

	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.notifyCheckout();
	} else {
		tcs.notifyCheckout();
	}
	$emenu.log.send( "0", "チェックアウト通知,notifyCheckout" );
}
/**
* 初期化タイムアウト通知（notifyInitTimeout()）　通信制御->FLA
*/   
function notifyInitTimeout()  {
	ExternalInterface.notifyInitTimeout();
}

/**
 * ゲームのロード完了
 */
function onLoadedGame() {
	ExternalInterface.onLoadedGame();
}
/**
 * ゲームの景品注文
 * @return {[type]} [description]
 */
function onPrizeOrder() {
	ExternalInterface.onPrizeOrder();
}
/**
 * ゲームの終了
 */
function setFinishGame() {
	ExternalInterface.setFinishGame();
}

/**
* コンテンツ開始要求（content_invoke()）　FLA->通信制御
*/   
function content_invoke() {
	//tcs.content_invoke();
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal ) {
		location.href="tcs://content_invoke";
	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.content_invoke();
	} else {
		tcs.content_invoke();
	}
}
/**
* コンテンツ再開要求（content_resume()）　FLA->通信制御
*/   
function notify_content_finish() {
	//tcs.notify_content_finish();
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal ) {
		location.href="tcs://notify_content_finish";
	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.notify_content_finish();
	} else {
		tcs.notify_content_finish();
	}
}
/**
* コンテンツ中断通知（notify_content_suspend()）　通信制御->FLA
*/   
function content_resume() {
	ExternalInterface.content_resume();
}
/**
* コンテンツ終了通知（notify_content_finish()）　通信制御->FLA
*/ 
function notify_content_finish() {
	ExternalInterface.notify_content_finish();
}
/**
* バッテリー残量通知（notifyBattStat ()）　通信制御->FLA
*/ 
function notifyBattStat(acLineStatus, batteryLifePercent, batteryFlag, batteryLifeTime)  {	
	//iOS以外はバッテリーアイコンを表示
	var ua = $(window).isTablet();
	if( ua != "ipad") {
		ExternalInterface.notifyBattStat(acLineStatus, batteryLifePercent, batteryFlag, batteryLifeTime);
	}
}
/**
* 無線電波強度の通知（notifyWlanStat ()）　通信制御->FLA
*/ 
function notifyWlanStat(level) {	
	ExternalInterface.notifyWlanStat(level);
}
/**
* 無線デバイス電波更新要求　FLA->通信制御
*/ 
function refleshWlanStat () {	
	//tcs.refleshWlanStat ();
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal ) {
		location.href="tcs://refleshWlanStat";
	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.refleshWlanStat();
	} else {
		tcs.refleshWlanStat();
	}
}
/**
* 無線デバイス再取得完了通知　通信制御->FLA
*/ 
function updateWlanStat (SSID, BSSID, RSSI)  {	
	ExternalInterface.updateWifiSts(SSID, BSSID, RSSI);
}
/**
* MoviePlayer再生終了要求　通信制御->FLA
*/ 
function closeContents (id)  {	
	ExternalInterface.closeContents(id);
}
/**
* MoviePlayer動画リスト登録要求　FLA->通信制御
*/ 
function registerRoll(tableNo,lists) {	
	//tcs.registerRoll(tableNo,lists);
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal ) {
		location.href="tcs://registerRoll&tableNo="+tableNo+"&lists="+lists;
	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.registerRoll(tableNo,lists);

	} else if( ( ua == "android" && !empty(Config.no_movieplayer) && Config.no_movieplayer) || Config.islocal ) {
		$("#main").videoPlay( lists );
	
	} else {
		tcs.registerRoll(tableNo,lists);
	}
}
/**
* MoviePlayer動画再生要求　FLA->通信制御
*/ 
function play() {	
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal ) {
		location.href="tcs://play";
	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.play();
	} else {
		tcs.play();
	}
}
/**
 * バーコードリーダ起動　EPARK連携
 */
function startepark( mode ) {
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal ) {
		//サウンドと同時実行しないように延滞実行を行う
		var timer = $.timer(function() {
			location.href="tcs://startepark?mode="+mode;
			this.stop();
		},100,1);
	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.startepark();
	} else {
		tcs.startepark( mode );
	}
}

/**
 * ローカルサウンド再生要求　FLA->通信制御 iOS専用処理
 */
function localSoundPlay(soundId){
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal && !Config.islocal ) {
		location.href="tcs://localSoundPlay?soundId="+soundId;
	} else if( ua == "windowstabret" ) {
		tcs.localSoundPlay( soundId );
	}
}

/**
 * EPARKログイン情報取得　通信制御->FLA
 */
function eparklogininfo(pdid,pass,cardid) {
	ExternalInterface.eparklogininfo(pdid,pass,cardid);
}

/*
 * 外部ドメインへのリクエスト FLA->通信制御
 */
function sendrequest(data) {
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal ) {
		//var dictionary = {url:url,trans:trans,param:param,param2:param2};
		window.webkit.messageHandlers.sendrequest.postMessage(data);
	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.sendrequest( JSON.stringify(data) );
	} else {
		//Android版
		tcs.sendrequest( JSON.stringify(data) );
	}
}

/**
 * 外部ドメインへのリクエストJSON取得　通信制御->FLA
 */
function eparkinfo(json) {
	ExternalInterface.eparkinfojson(json);
}

/**
 * アンケートシステム連携
 */
function startSurvey( tableNo ) {
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal ) {
		//未対応
	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.startSurvey( tableNo );
	} else {
		//Android版
		tcs.startSurvey( tableNo );
	}
}

/**
 * アンケートシステム連携
 */
function endSurvey() {
	//アンケートシステムの終了
	//スクリーンセーバーを消す
	$emenu.screensaver.hide();
}

/**
 * QRコードの読み込み開始
 */
function startCamera( type, message, timeout ) {
	var ua = $(window).isTablet();
	if( ua == "ipad" && !Config.islocal ) {
		//未対応
	} else if( ua == "windowstabret_ie" && !Config.islocal ) {
		window.external.startCamera( type, message, timeout );
	} else {
		//Android版
		tcs.startCamera( type, message, timeout );
	}
}

/**
 * QRコードの読み込み完了
 */
function resultQRData( result ) {
	ExternalInterface.resultQRData( result );
}


/**
 * Windows動画スクリーンセーバーの戻り
 */
function closedWindow(result) {
	ExternalInterface.closedScreensaverWindow( result );
}


/**
 * videoの再生
 * V4 -> TCS
 */
function startVideo( id ) {
	tcs.startVideo( id );
}

/**
 * videoの停止
 * V4 -> TCS
 */
function stopVideo() {
	tcs.stopVideo();
}

/**
 * videoの終了
 * TCS -> V4
 * @param type 0：動画ファイル再生終了 1：画面タッチに伴う再生終了
 * @param onTouch 0：トップ画面表示※ﾃﾞﾌｫﾙﾄ 1：該当商品ページ遷移 2：直前の画面
 * @param onTouch 該当商品の商品コード
 */
function finishVideo( type, onTouch, mCode ) {
	ExternalInterface.finishVideo(type, onTouch, mCode);
}
;;
/**
* MainController
* 
*
*/
var MainController = function() {

	//"use strict";
	
	var self = this;

	this.flipsnap; //フリック MenuBodyからセット
	this.log = new Log( self ); //ログ出力
	this.sys = new Sys( self ); //sys.xml
	this.local = new Local( self ); //ローカルメニューデーター
	this.nohandle = new Nohandle( self ); //取り扱いなし
	this.game = new Game(self); //ゲームデータ
	this.sinage = new Sinage(self); //サイネージデータ
	this.category = new Category( self ); //カテゴリー
	this.check_order = new CheckOrder( self ); //注文確認
	this.screensaver = new Screensaver( self ); //スクリーンセーバー
	this.menubody = new MenuBody( self ); //メニュー（レイアウトなど）
	this.cart = new Cart( self ); //カート（DB）
	this.cart_list = new CartList( self ); //カートリスト
	this.order = new Order( self ); //オーダー
	this.message = new Message( self ); //メッセージ
	this.order_lock = new OrderLock( self ); //オーダーロック
	this.alternate = new Alternate( self ); //言語選択
	this.fcategorytop = new FcategoryTop( self ); //大カテゴリートップ
	this.number_input = new NumberInput( self ); //番号入力
	this.scategorytop = new ScategoryTop( self ); //中カテゴリートップ
	this.detail = new Detail( self ); //詳細画面
	this.select = new Select( self ); //セレクト
	this.welcome = new Welcome( self ); //いらっしゃいませ
	this.bashing = new Bashing( self ); //バッシング
	this.table_no_setup = new TableNoSetup( self ); //卓番設定
	this.party_timer = new PartyTimer( self ); //パーティータイマー
	this.admessage = new AdMessage( self ); //店舗メッセージ
	this.adlocal_message = new AdLocalMessage( self ); //卓指定メッセージ
	this.first_category = new FirstCategory( self ); //味噌茶選択
	this.daily = new Daily( self ); //日替わりメニュー
	this.staff_call = new StaffCall( self ); //スタッフコール
	this.checkorder_list = new CheckOrderList( self ); //注文確認
	this.accounting_call = new AccountingCall( self ); //会計呼出
	this.arrival = new Arrival( self ); //到着案内
	this.stat = new Stat( self ); //バッテリー状態
	this.login = new Login( self ); //利用開始
	this.info = new Info( self ); //卓番表示
	this.request_checkout = new RequestCheckout( self ); //チェックアウト要求
	this.account_division = new AccountDivision( self ); //割り勘画面
	this.search = new Search( self ); //検索画面
	this.page_search = new PageSearch( self ); //ページ検索
	this.volume = new Volume( self ); //音量調節
	this.billboard = new Billboard( self ); //店舗情報ページ
	this.alert = new Alert( self ); //アラート
	this.epark = new Epark( self ); //Epark連携
	this.rank_menu = new RankMenu( self ); //ランクメニュー表示画面
	this.setmenu = new SetMenu( self ); //セットメニュー
	this.recommend = new Recommend( self ); //レコメンド
	this.preload = new Preload( self ); //初期ロード

	this.slipNo; //伝票番号
	this.tableNo; //卓番号
	this.training_bol; //トレーニングモードフラグ
	this.person; //チェックイン人数
	this.menuEnd; //モード終了時間
	this.menudata; //メニューデータ
	this.custom_menudata; //店舗カスタムメニューデータ
	this.menumst_custom; //店舗カスタムメニューアイテムデータ
	this.screensaver_local; //店舗スクリーンセーバーデータ
	this.sinage_bol; //サイネージが有効かどうか
	this.request_checkin_timer; //チェックイン要求の静止タイマー
	this.first_order; //ファーストオーダー中フラグ
	this.first_order_timer; //ファーストオーダー無操作タイマー

	this.checkin_bol; //チェックインフラグ
	this.checkin_time; //チェックイン時間
	this.checkin_uniqid; //チェックインユニークID
	this.menu_mode; //表示中のメニューモード
	this.menu_load_background; //メニューデータのバックグラウンドロード
	this.bashing_bol; //バッシング中フラグ
	this.release_table_no_bol; //テーブルNOリリースフラグ
	this.alternate_bol; //代替言語の場合TRUE
	this.mode_change_bol; //モード変更フラグ
	this.update_notice_timer; //メニュー更新通知表示のタイマー
	this.update_mst_bol; //メニュー更新中フラグ
	this.reboot_bol; //再起動中フラグ
	this.arrival_timer; //到着案内のスタックタイマー
	this.tmp_arrival_data; //到着案内のスタックデータ
	this.order_complete_timer; //注文完了表示のタイマー
	this.use_stop_bol; //利用停止フラグ
	this.order_lock_bol; //注文停止フラグ
	this.update_wlan_start; //無線更新時間
	this.update_wlan_timer; //無線更新タイマー
	this.viewtop_timer; //無操作でトップを表示する
	this.alert_product_ary; //商品アラートの警告済み商品
	this.alcohol_alert; //アルコール警告のチェック
	this.order_count; //オーダーの回数

	this.food_order_stop_bol; //フードストップフラグ
	this.drink_order_stop_bol; //ドリンクストップフラグ
	this.order_stop_bol; //オーダーストップフラグ
	this.addcart_res; //カート格納後の結果
	this.accountingcall_end; //会計呼び出し完了フラグ

	this.boot_sequence; //起動のシーケンス
	this.boot_timer; //起動タイマー

	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {

		//windowにあわせる
		if( Config.window_fit ) {
			var h = $( window ).height();
			var w = $( window ).width();
			$("#page, #page .container, #page .modal").height( h ).width( w );
		}
		
		//alternateの初期化
		//言語データの読み込みが初期ロード
		//self.alternate.init( self.doInitialize );
		self.alternate.init( self.loadSys );

		self.stat.init();

		//Bootのトリガー
		$(document).trigger("BOOT");

		//起動タイムアウト
		var time = (!empty(Config.boot)) ? Config.boot.timer : 180;
		self.boot_timer = $.timer(function(){
			self.log.send("0","起動,タイムアウトリロードします," + self.boot_sequence );
			location.reload();
		}, time * 1000, 1);

		self.boot_sequence = "language.json";

	};

	/**
	 * 再起動
	 */
	this.reboot = function() {
		//お待ちくださいの表示
		self.message.show("loading");

		//チェックインフラグを下げる
		self.checkin_bol = false;
		//スクリーンセーバーの停止
		self.screensaver.stop();
		//再起動中フラグ
		self.reboot_bol = true;

		self.loadSys();

		//Bootのトリガー
		$(document).trigger("BOOT");


		//起動タイムアウト
		var time = (!empty(Config.boot)) ? Config.boot.timer : 180;
		self.boot_timer = $.timer(function(){
			self.log.send("0","再起動,タイムアウトリロードします," + self.boot_sequence );
			location.reload();
		}, time * 1000, 1);
	}

	/**
	 * sysの読み込み
	 * @return {[type]} [description]
	 */
	this.loadSys = function() {
		self.sys.init( self.loadSinage );

		$("#page").show();
		$("#splash").hide();

		//お待ちくださいの表示
		self.message.show("loading");

		self.boot_sequence = "sys.xml";
	};

	/**
	 * サイネージの読み込み
	 */
	this.loadSinage = function() {
		self.sinage.init( self.loadLocal );

		self.boot_sequence = "sinage.xml";
	}

	/**
	 * メニューローカルデータの読み込み
	 * custompage,screensaver
	 * サイネージより先に開始しないこと
	 */
	this.loadLocal = function() {
		self.local.init( self.loadNohandle );

		//self.boot_sequence = "sinage.xml";
	}

	/**
	 * 取り扱いなしのロード
	 * @return {[type]} [description]
	 */
	this.loadNohandle = function() {
		self.nohandle.init( self.loadGame );

		self.boot_sequence = "nohandle.xml";
	}

	/**
	 * ゲームの読み込み
	 */
	this.loadGame = function() {
		self.game.init( self.loadTarminalSetting );

		self.boot_sequence = "game.xml";
	}

	/**
	 * ターミナルセッティングの読み込み
	 */
	this.loadTarminalSetting = function() {
		//TerminalSettingsの読み込み
		self.epark.getSetting( self.doInitialize );

		self.boot_sequence = "TerminalSettings.xml";
	}

	/**
	 * 起動確認(TCS)
	 * @return {[type]} [description]
	 */
	this.doInitialize = function() {

		//言語データのロード完了
		console.log( "doInitialize" )

		//mousedownの切り替え
		//mousedownの場合にはflickは使わない
		if(Config.mousedown) {
			//端末の調整で一旦、コメントアウト
			//Config.flick.enable = false;
		}

		//メニュー更新の場合には表示しない
		if(!self.menu_load_background && !self.update_mst_bol) {
			//お待ちくださいの非表示
			self.message.hide();
			//いらっしゃいませの表示
			self.welcome.show();
		}

		//bodyにreadyを追加
		$("body").addClass("ready");
		
		//notifyInitialize
		window.notifyinitialize();

		//Initializeのトリガー
		$(document).trigger("INITIALIZE");

		self.boot_sequence = "notifyinitialize";


		//メニュー更新後はpreloadを再開
		if( self.update_mst_bol ) {
			self.preload.is_stop = false;
			self.preload.start_preload = false;
		}

	};

	/**
	 * チェックイン
	 * @return {[type]} [description]
	 */
	this.doCheckin = function() {

		self.boot_sequence = "doCheckin";
		self.boot_timer.reset().stop();

		//トレーニングモードの初期化
		if( self.training_bol ) {
			window.tcs =  null;
			Config.islocal = false;
			window.setWindowPath();
			$("#training-mode").hide();
			self.training_bol = false;
		}

		var checkin_data = ExternalInterface.checkin;
		console.log( "doCheckin", checkin_data );

		self.tableNo = checkin_data.tableNo;
		self.slipNo = checkin_data.slipNo;

		if( Number(checkin_data.headCount) > 0 ){
			self.person = checkin_data.headCount;
		}

		if(isNaN(parseInt(checkin_data.menuEnd)))  checkin_data.menuEnd = null;
		self.menuEnd = checkin_data.menuEnd;

		self.log.send("0","チェックイン情報受信" + ",チェックイン状態:" + checkin_data.checkinStatus +  ",モードID:" + checkin_data.menu + ",在庫モード:" + checkin_data.tableFlag );

		if(checkin_data.tableFlag == '1' && !self.release_table_no_bol) {
			//卓番号のリリース
			//tableno_list.xmlの読み込み
			self.table_no_setup.show();
			self.log.send("0","卓番号設定画面,表示します。" );
			return;
		}

		//卓番表示
		//卓設定中に見えなくなるのは不便かもなので、ここで表示
		self.info.show();

		//チェックイン要求のタイマーを停止
		if( self.request_checkin_timer ) self.request_checkin_timer.stop();

		if(checkin_data.checkinStatus == "0") {
			//firstorder中は無視
			if( self.first_order ) {
				//default_modeと違う場合
				if( self.menu_mode != checkin_data.menu ) {
					self.loadMenu( checkin_data.menu );
					self.log.send("0","first_order,モード変更します。" );
					$(document).trigger("MODE_CHANGE");
					//first_order用にモードを保持
					Config.terminal_checkin.first_order.mode = checkin_data.menu;
				}
				return;
			}

			//チェックインをしていればチェックアウト
			if(self.checkin_bol) {
				self.checkin_bol = false;
				self.setCheckOut();
			} else {
				//メニュー更新後にwelcomeになってしまうため
				if(self.bashing_bol) {
					self.setCheckOut();
				} else {
					//初期起動完了
					
				}
			}
			
			//first_order用にモードを保持
			if( Config.terminal_checkin.enable && Config.terminal_checkin.first_order.enable ) {
				Config.terminal_checkin.first_order.mode = checkin_data.menu;
			}
			
			self.log.send("0","チェックアウト,卓番号:" + self.tableNo + ",伝票番号:" + self.slipNo);
			//classをはずす
			$("#page").removeClass("checkin");
			$("body").removeClass("order_stop");

			//初期ロード開始
			self.preload.load();

			$(document).trigger("CHECKOUT");

			//uniqコードのリセット
			self.checkin_uniqid = null;
			self.order_count　= 0;

		} else {

			//初期ロードを停止
			self.preload.stop();


			//firstorder中で伝票番号がある場合は解除
			if( self.first_order && !empty( self.slipNo ) )  {
				$( "#ordercheck-btn, #accounting-call" ).removeAttr("disabled");
				//ファーストオーダーを解除
				self.first_order = false;
				
				$(document).trigger("END_FIRST_ORDER");
			}

			//ファーストオーダーの場合にはタイマーを破棄
			if( !empty(self.first_order_timer) ) {
				self.first_order_timer.stop();
				self.first_order_timer = null;
			}

			//トレーニングモード
			if(checkin_data.checkinStatus == "2") {
				window.tcs =  new TCS();
				Config.islocal = true;
				window.setWindowPath();
				$("#training-mode").show();
				self.training_bol = true;
				//伝票番号が0（エラー判定）なので、1にする
				self.slipNo = "1";
			}

			//オーダーロック
			if( !empty(checkin_data.menuLockFlag) ) {
				if( checkin_data.menuLockFlag != "110" && checkin_data.menuLockFlag != "111" && checkin_data.menuLockFlag != "000" ) {
					//コンテンツのロック
					if(checkin_data.menuLockFlag.substr(2,1) == "1") {
						//コンテンツロック
					} else {
						//コンテンツのアンロック
					}
					
					//フードのロック
					if(checkin_data.menuLockFlag.substr(0,1) == "1") {
						//フードロック
						self.message.show("food_order_stop");
						//self.menubody.orderLock("food");
						self.food_order_stop_bol = true;
						$(document).trigger("FOOD_STOP");
					} else if(checkin_data.menuLockFlag.substr(0,1) == "2") {
						//現状維持
					} else {
						//フードのアンロック
						//self.menubody.orderUnlock("food");
						self.food_order_stop_bol = false;
						$(document).trigger("FOOD_START");
					}
					
					//ドリンクのロック
					if(checkin_data.menuLockFlag.substr(1,1) == "1") {
						//ドリンクロック
						self.message.show("drink_order_stop");
						//self.menubody.orderLock("drink");
						self.drink_order_stop_bol = true;
						$(document).trigger("DRINK_STOP");
					} else if(checkin_data.menuLockFlag.substr(1,1) == "2") {
						//現状維持
					} else {
						//ドリンクのアンロック
						//self.menubody.orderUnlock("drink");
						self.drink_order_stop_bol = false;
						$(document).trigger("DRINK_START");
					}
				} else  if( checkin_data.menuLockFlag == "111" ||  checkin_data.menuLockFlag == "110" ) {
					//全てオーダーロック
					//self.message.show("order_stop");
					//self.menubody.orderLock("all");
					self.order_lock.show("order_stop");
					self.order_stop_bol = true;

					$("body").addClass("order_stop");
					$(document).trigger("ORDER_STOP");
				} else {
					//全てオーダースタート
					self.order_lock.hide("order_stop");
					self.order_stop_bol = false;
					self.food_order_stop_bol = false;
					self.drink_order_stop_bol = false;

					$("body").removeClass("order_stop");
					$(document).trigger("ORDER_START");
				}
			} else {
				$("body").removeClass("order_stop");
			}

			if( self.checkin_bol ) {
				if(self.menu_mode == checkin_data.menu) {
					//モードに変更がなければ読み込まない
					
					//終了時間が変わる可能性があるのでパーティータイマーを更新
					if( !empty(self.menuEnd) ) {
						self.party_timer.init();
					} else {
						self.party_timer.hide();
					}

				} else {
					//モードの変更あり
					self.mode_change_bol = true;

					//完了処理フラグがある場合にはモードの終了通知
					//console.log( "モード変更", checkin_data.menu, checkin_data.menuEndAction)
					self.log.send("0","モード変更,モードID:" + checkin_data.menu + ",モード終了通知:" + checkin_data.menuEndAction + ",卓番号:" + self.tableNo + ",伝票番号:" + self.slipNo);
					
					//起動タイミングを端末ごとにランダムでずらす
					var inter =　( Config.islocal ) ? 10 : Math.random() * 10 * 1000;
					$.timer(function() {
						if(!empty(checkin_data.menuEndAction)) {
							switch( checkin_data.menuEndAction ) {
								// 0：警告画面を挟んでモード切替
								// 1：モード終了画面（オーダー不可）
								case "0":
									
									//メニューのロード
									//バックグラウンドで読み込み
									self.loadMenu( checkin_data.menu, true );
									self.message.show("finish_mode_0");

									break;
								case "1":
									
									//バックグラウンドで読み込み
									self.loadMenu( checkin_data.menu, true );
									self.order_lock.show("finish_mode_1");

									$("body").addClass("order_stop");
									self.order_stop_bol = true;

									break;
								default:
									//バックグラウンドで読み込み
									self.loadMenu( checkin_data.menu );
									break;
							}
							
						} else {
							//メニューのロード
							self.loadMenu( checkin_data.menu );
						}
						//モード変更
						$(document).trigger("MODE_CHANGE");
						
						this.stop();
					}, inter, 1);
				}

			} else {

				//初期チェックイン
				self.mode_change_bol = false;
				
				//メニューのロード
				//言語がデフォルトでない場合にはデフォルトにもどす
				if( Config.alternate.default != self.alternate.language && !self.update_mst_bol ) {
					self.alternate.init( function() {
						self.loadMenu( checkin_data.menu );
					}, true);
				} else {
					self.loadMenu( checkin_data.menu );
				}

				//チェックイン時間のセット
				self.checkin_time = new Date();

				//classをつける
				$("#page").addClass("checkin");

				//use_stopを解除する
				self.use_stop_bol = false;

				//アルコール警告の初期化
				self.alcohol_alert = false;

				//uniqコードの発番
				self.checkin_uniqid = new Date().getTime();
				self.order_count　= 0;

				self.log.send("0","チェックイン,卓番号:" + self.tableNo + ",伝票番号:" + self.slipNo + ",人数:" + self.person );

				//checinのトリガー
				//console.log( "MainController.checkin" );
				$(document).trigger("CHECKIN");
			}
		}
	};

	/**
		メニューの取得
		@menu メニューモード
		@background バックグラウンドでロード(デフォルト:false)
	*/
	this.loadMenu = function( menu, background ) {

		//ExternalInterfaceをスリープ
		ExternalInterface.sleep( true );

		//言語別ファイルの読み込み
		var lang = self.alternate.language;
		var menu_path =  lang + "_" + menu + ".json" + chache();
		if( lang == Config.alternate.default ) {
			menu_path =  menu + ".json" + chache();
		}

		//modeの取得
		var menupath = menu_path;
		//MTMLの取得
		var loaderObj = new Loader();
		loaderObj.load( window.htmlpath + menupath, null, self.loadedMenu, 'json' );

		self.menu_load_background = background;
		if( !background ) {
			self.message.show("loading",null,null,null,true);
		}

		self.checkin_bol = true;

		//classをつける
		$("#page").removeClass("mode_" + self.menu_mode).addClass("mode_" + menu);
		self.menu_mode = menu;
	};

	/**
		メニューデータのロード完了
	*/
	this.loadedMenu = function( data, textStatus, errorThrown ) {

		if( !data ) {
			// error
			//self.message.show( "3009", "menu_json" );
			self.message.show("loading", "menu_json_error");
			self.log.send("0","menu_json,読み込みエラー," + textStatus + "," +  errorThrown );

			//ExternalInterfaceのスリープを解除
			ExternalInterface.sleep( false );

			//ランダム時間経過で、再度、読み込む
			var rt = Math.floor( Math.random() * 8 ) + 8; //ずらし
			$.timer( function(){
				this.stop();
				self.loadMenu(self.menu_mode);
			}, rt * 1000, 1 );
			return;
		}
		self.menudata = data;
		//カスタムメニューのマージ
		Object.merge(self.menudata.menumst, self.menumst_custom, true );
		
		$.each( self.menudata.menumst, function( i, val ) {

			//parent商品のセット
			val.child = [];
			if( !empty( val.parent ) ) {
				self.menudata.menumst[val.parent].child.push( val );
			}

			//取り扱いなしのセット
			if( self.nohandle.data.indexOf( val.id ) > -1 ) {
				val.nohandle = true;
			}
			//パネル商品のアップデート
			if(Config.cart.panel_cart.product_all) {
				val.usePanel = 1;
			}
		});
		
		//sysのセット
		self.sys.mode( data.sys.mode );

		//CheckPersonをConfigに格納
		Config.check_person = data.checkperson;
		//カテゴリー警告をConfigに格納
		Config.category.alert = data.categorywarn;
		//商品警告をConfigに格納
		Config.product_select.alert = data.itemwarn;

		//カテゴリーのセット
		self.category.init();

		/*--------------------------------------------------
		番号入力に分岐
		*/
		if( !empty(Config.number_input) && Config.number_input.enable ) {
			//番号入力をセット
			self.number_input.init();
			//クラスを追加
			$('body').addClass("number_input");
		} else {
			//メニューのHTMLの生成
			//少しずらす
			var ua = $(window).isTablet();
			if( Config.islocal || ua == "windowstabret_ie" ) {
				self.menubody.init();
			} else {
				$.timer(function(){
					self.menubody.init();
					this.stop();
				}, 1000, true);
			}
			
		}
		//topのセット
		self.fcategorytop.init();
		self.viewTop();


		//カートのセット
		//言語切り替え時はリセットしない
		if( !self.alternate_change ) {
			self.cart.init( self );
		} else {
			self.cart.setLanguage();
			self.updateCart();
		}


		//中カテゴリーTopのセット
		self.scategorytop.init();
	

		//店舗メッセージのセット
		self.admessage.init();

		//menuEndがある場合にはpartytimerを起動
		if( !empty(self.menuEnd) ) {
			self.party_timer.init();
		} else {
			self.party_timer.hide();
		}

		//カスタムページのセット
		if( self.menudata.sys.mode.custom ) {
			self.daily.init();
		}		

		//再起動後用に注文履歴を読み込み
		self.checkOrderKeep();

		//品切れを更新
		self.doCheckStock();

		//メニューを表示
		$("#menu-page").show();

		//サイネージのセット
		//self.sinage_bolはSinage.jsでセット
		if( self.sinage_bol ) {
			self.sinage.setCheckin();
		} else {
			self.screensaver.setCheckin( self.menudata.screensaver );
		}
		
		//チェックイン初回のみ実行系
		if( !self.reboot_bol && !self.update_mst_bol ) {

			//利用開始画面の表示
			if( Config.login.enable && !self.mode_change_bol ) {
				self.login.show();
			}

			//味噌茶のページ
			if( Config.first_category.enable ) {
				self.first_category.show();
			}
		
		}
		//再開させる
		if( self.reboot_bol && !self.sinage_bol ) {
			self.screensaver.start();
			self.screensaver.reset();
		}

		//welcomeの非表示
		self.welcome.hide();
		self.bashing.hide();
		
		//商品アラート用の配列
		self.alert_product_ary = new Array();
		
		//モード変更の場ににはメッセージが表示されている場合があるので
		//メッセージを消さない
		//FcategoryTopのロード完了ではずす
		//self.menu_load_background = false;
		self.update_mst_bol = false;
		self.reboot_bol = false;

		//billbordのセット
		self.billboard.init();

		//ExternalInterfaceのスリープを解除
		ExternalInterface.sleep( false );

		//言語を更新
		//self.alternate.updateLang();
		
		//first_orderの場合は無操作でいらっしゃいませに戻す
		if( self.first_order ) {

			//ファーストオーダーの場合にはタイマーを破棄
			if( !empty(self.first_order_timer) ) {
  				self.first_order_timer.stop();
				self.first_order_timer = null;
			}

			if( !Config.terminal_checkin.first_order.reset_timer ) Config.terminal_checkin.first_order.reset_timer = 360;
			self.first_order_timer = $.timer( function() {
				this.stop();
				//いらっしゃいませ画面の表示
				self.welcome.show();
				//言語をデフォルトに戻す
				self.alternate.setDefaultLang();
				self.checkin_bol = false;
				self.first_order = false;
				self.timerStop();

				self.log.send("0","ファーストオーダー,タイマーでチェックアウトします。" );

				//uniqコードのリセット
				self.checkin_uniqid = null;
				$(document).trigger("CHECKOUT");

			}, Config.terminal_checkin.first_order.reset_timer * 1000, 1 );
		} else {
			self.first_order_timer = null;
		}

		//console.log( "MainController.LOAD_MENU" );
		$(document).trigger("LOAD_MENU");
	};

	/**
	 * チェックアウトの処理
	 */
	this.setCheckOut = function() {

		self.cart.reset();
		self.cart_list.reset();
		$("#page").removeClass("incart");

		if( self.viewtop_timer ) {
			self.viewtop_timer.stop();
		}
		
		//メッセージ画面の非表示
		self.message.hide();

		if( self.accountingcall_end ) {
			//会計済みフラグを落とす
			self.message.hide( "accountingcall_complete" );
			self.accountingcall_end = false;
		}

		//バッシング（ありがとうございました）画面のセット
		if( self.sys.mode().bashing && !self.release_table_no_bol ) {
			self.bashing.show();
			self.bashing_bol = true;
		} else {
			self.welcome.show();
			//言語をデフォルトに戻す	
			self.alternate.setDefaultLang();

			//iPadは卓変更後のチェックアウト通知で再起動するので、卓変更中はreturn
			if( !self.release_table_no_bol ) {
				//notifyCheckoutを通知
				window.notifyCheckout();
			}
			
		}

	};


	/**
	 * 品切れの受信
	 * @return {[type]} [description]
	 */
	this.doCheckStock = function(){

		var stock = ExternalInterface.stock;
		//MenuBodyに通知
		//self.menubody.setStock( stock );
		if( empty(self.menudata) ) return false;

		var added = [];
		var deleted = [];
		$.each( self.menudata.menumst, function( key, item ) {

			if( stock.indexOf( key ) > -1 ) {
				//ログ用
				added.push( item.code );
				item.stockout = true;
			} else {
				if( item.stockout ) {
					deleted.push( item.code );
				}
				item.stockout = false;
			}
		} );

		//イベントを発行
		$(document).trigger("STOCK");
		console.log( "-- STOCK --", ExternalInterface.stock );

		//ログ整形
		var added_str = ( added.length ) ? ",R," + added.join(",R,") : "";
		var deleted_str = ( deleted.length ) ? ",D," + deleted.join(",D,") : "";

		//self.log.send("0","品切れ情報受信,商品:" +ExternalInterface.stock.join(" ") );
		self.log.send("0","STOCK" + added_str + deleted_str );
		console.log( "STOCK" + added_str + deleted_str );

		//言語を更新
		self.alternate.updateLang();
	}


	/**
	 * 店舗メッセージ
	 * @return {[type]} [description]
	 */
	this.doMsg = function() {
		var str = ExternalInterface.message;
		self.admessage.setMessage( str );
		self.welcome.setAdMessage();

		self.log.send("0","店舗メッセージ受信," + str );
	}

	
	/**
	 * 卓指定メッセージ
	 * @return {[type]} [description]
	 */
	this.doLocalMsg = function() {

		var str = ExternalInterface.local_message;

		//以下の分岐で個別で行う
		//if( self.update_mst_bol ) return;

		//メッセージの判定
		if( str.substr(0,10) == "order_lock" ) {
			//オーダーロック
			self.order_stop_bol = true;
			self.order_lock.show("order_stop", true);

			$("body").addClass("order_stop");
			$(document).trigger("ORDER_STOP");


		} else if( str.substr(0,12) == "order_unlock" ) {
			//オーダーロック解除
			//メッセージは表示しない
			self.order_stop_bol = false;
			self.order_lock.hide("order_stop");

			$("body").removeClass("order_stop");
			$(document).trigger("ORDER_START");

			//利用停止中のチェック
			//オーダーロック中に利用停止が飛んできたときのため
			if( self.use_stop_bol  ) {
				self.order_lock.show("use_stop");
			}
			
		} else if( str.substr(0,4) == "lock" ) {
			
			//サービス利用停止
			//self.message.show("use_stop", null, null, null, true);
			self.order_lock.show("use_stop"); //オーダーロックを強くするためロックしない
			self.use_stop_bol = true;
			$("body").addClass("order_stop");

			$(document).trigger("ORDER_STOP");
			
		} else if( str.substr(0,6) == "unlock" ) {

			//サービス利用再開
			//self.message.hide("use_stop");
			self.order_lock.hide("use_stop");
			self.use_stop_bol = false;
			$("body").removeClass("order_stop");

			$(document).trigger("ORDER_START");
			
		} else if( str.substr(0,7) == "arrival" ) {
			
			//チェックアウト中はスルー
			if( !self.checkin_bol ) {
				ExternalInterface.local_message = "";
				return false;
			}

			//メニュー更新中はスルー
			//到着案内がくる場合があるため
			if( self.update_mst_bol ) return false;
			if( !Config.arrival.enable ) return false;

			//4.4でタイマー後にサウンドが再生されないため、ここで再生
			$("#sound_arrival1").soundPlay();
			
			//E型レーン到着案内
			var items = self.getArrivalItem(str);
			self.onArrivalStack( items );

		} else if( str.substr(0,9) == "rl_moving" ) {

			//チェックアウト中はスルー
			if( !self.checkin_bol ) {
				ExternalInterface.local_message = "";
				return false;
			}
			
			if( self.update_mst_bol ) return false;
			if( !Config.arrival.enable ) return false;

			//4.4でタイマー後にサウンドが再生されないため、ここで再生
			$("#sound_arrival1").soundPlay();

			//特急レーンまもなく到着案内
			var items = self.getArrivalItem(str);
			self.onArrivalStack( items, "rl" );

		} else if( str.substr(0,10) == "rl_arrived" ) {

			//チェックアウト中はスルー
			if( !self.checkin_bol ) {
				ExternalInterface.local_message = "";
				return false;
			}
			
			if( self.update_mst_bol ) return false;
			if( !Config.arrival.enable ) return false;
			//返却案内を表示しない
			if( !Config.arrival.arrived_enable ) return false;

			//特急レーン返却案内
			//var items = self.getArrivalItem(str);
			self.arrival.setRlArrival();

		} else if( str.substr(0,8) == "rl_clear" ) {

			//チェックアウト中はスルー
			if( !self.checkin_bol ) {
				ExternalInterface.local_message = "";
				return false;
			}
			
			if( self.update_mst_bol ) return false;
			if( !Config.arrival.enable ) return false;
			//特急レーン到着案内
			self.arrival.hide();

		} else if( str.substr(0,6) == "reload" ) {

			//繰り返し来てしまうのでNG
			// self.log.send("0","卓指定メッセージ,リロードします" );
			// location.reload();

		} else {

			//チェックアウト中はスルー
			if( !self.checkin_bol ) {
				ExternalInterface.local_message = "";
				return false;
			}

			if( self.update_mst_bol ) return false;

			//パーティータイマー中はスタッフコールを行うかチェック
			if( !empty(self.menuEnd) ) {
				if( Config.staffcall.enable && Config.party_timer.staffcall ) {
					//スタッフコールを実行
					self.staff_call.send( true );
				}
			}

			//メッセージの格納
			self.adlocal_message.show( str );

			//チェックイン中であれば卓指定メッセージに店舗メッセージを置き換える
			if( self.checkin_bol && !empty(str) ) {
				self.admessage.setMessage( str );
			}
		}

		//スクリーンセーバーを消す
		self.screensaver.hide();
		self.timerStart();
	 	self.timerReset();
		
		self.log.send("0","卓指定メッセージ受信," +str);
		ExternalInterface.local_message = "";
	};

	/**
	 * 到着案内の通知データ整形
	 * @param  {String} str 商品データテキスト
	 * @return {[type]}     [description]
	 */
	this.getArrivalItem = function( str ) {

		var products =  new Array();

		var items = str.split(":")[1];
		if( empty(items) ) return products;

		var data = items.split("&");
		$.each( data, function( i, val ) {
			var item = val.split(",");
			if( item[0].substr( 0, 4 ) == "item" ) {
				var id = item[0].split("=")[1];
				//if( empty(self.menudata.menumst[id]) ) return true;

				//セレクト商品かどうか
				if( Number(id) <= Number(Config.product.select_from) ||  Number(id) >= Number(Config.product.select_end) ) {
					products.push( { 
						item:self.menudata.menumst[id],
						num:Number(item[1]),
						set:[],
						sub:[]
					});
				} else {
					//console.log(products, products.length)
					products[products.length-1].set.push({
						item:self.menudata.menumst[id]
					});
				}
			} else {
				//item=の記述がない場合にはサブメニュー扱い
				products[products.length-1].sub.push({
					item:self.menudata.menumst[item[0]]
				});
			}
		});

		return products;
	
	};

	/**
	 * 到着案内のスタック
	 * @param  {Array} data 商品データ
	 * @param  {String} type E型か特急レーン（rl）
	 * @return {[type]}      [description]
	 */
	this.onArrivalStack = function( data, type ) {
		
		if( empty(self.tmp_arrival_data) ) {
			self.tmp_arrival_data = data;
		} else {
			self.tmp_arrival_data = self.tmp_arrival_data.concat( data );
		}
		//スタックタイマーの起動
		if( !empty(self.arrival_timer) ) {
			self.arrival_timer.reset().stop();
		}
		self.arrival_timer = $.timer( function(){
			//到着案内の表示
			self.arrival.setArrival(self.tmp_arrival_data, type);
			self.tmp_arrival_data = [];
			this.stop();

		}, Config.arrival.interval, 1);
	}

	/**
	 * メニュー更新
	 * @return {[type]} [description]
	 */
	this.doUpdateMst = function() {
		var master_status = ExternalInterface.master_status;
		if( master_status == "0" ) {

			//preloadを停止
			self.preload.is_stop = true;

			//更新通知
			self.message.show("update_mst_notice");

			$(document).trigger("UPDATE_NOTICE");
			
			//タイマーで非表示にする
			self.update_notice_timer = $.timer( function(){
				self.message.hide();
			});
			self.update_notice_timer.once(20000);
			//BOOTでタイマー停止
			$(self).bind( "BOOT", function() {
				if(  !empty( self.update_notice_timer ) ) {
					self.update_notice_timer.stop();
				}
			});
		} else {
			if( !empty(self.update_notice_timer) ) {
				self.update_notice_timer.stop();
			}

			//メニュー更新を実行
			//カートを空にする
			self.cart.reset();
			self.updateCart();
			//self.message.hide();

			$(document).trigger("UPDATE");

			//メニュー更新の実行タイミングをランダムでずらす
			var inter = Math.random() * 10 * 1000;
			$.timer(function() {
				self.update_mst_bol = true;
				self.message.hide();
				//プリロードをリセット
				self.preload.start_preload = false;
				self.reboot();
				self.log.send("0","メニュー更新,更新します。");
				this.stop();
			}, inter, 1 );
		}
	};

	/**
	 * バッテリー状態の更新
	 * @return {[type]} [description]
	 */
	this.notifyBattStat = function() {
		var battery = ExternalInterface.battery;
		self.stat.setBattery( battery );
	}

	/**
	 * 無線状態の更新取得
	 * @return {[type]} [description]
	 */
	this.notifyWlanStat = function() {
		var wlan = ExternalInterface.wlan;
		self.stat.setWlan( wlan );
	}


	/**
	 * 無線の更新
	 * @return {[type]} [description]
	 */
	this.refleshWlanStat = function() {

		self.log.send("0","WLAN,更新します。");

		self.update_wlan_start = new Date().getTime();
		//更新タイマー
		if( !empty(self.update_wlan_timer) ) {
			self.update_wlan_timer.reset().stop();
		}
		self.update_wlan_timer = $.timer(function(){
			self.message.hide();
			self.update_wlan_timer.reset().stop();
			self.log.send("0","WLAN,更新がタイムアウトしました。");
			this.stop();
		}, Config.stat.wlan_update_timer, 1);
		//メッセージの表示
		self.message.show("wifi_update");

		//ログ出力後に実行
		$.timer(function(){
			window.refleshWlanStat();
			this.stop();
		}, 1000, 1 );		
	}

	/**
	 * 無線の更新完了
	 * @return {[type]} [description]
	 */
	this.updateWlanStat = function() {
		
		self.update_wlan_timer.reset().stop();
		
		//実際につながるまでに5秒のタイムラグがあるので、一旦停止する
		self.update_wlan_timer = $.timer(function() {

			self.message.hide();

			//ログイン画面を消す
			self.timerStart();
			$("#login").hide();

			var wlan = ExternalInterface.update_wlan;
			//log
			var time =  ( !empty(self.update_wlan_start) ) ? Math.round( (new Date().getTime() - self.update_wlan_start) / 1000 ) : 0;
			self.log.send("0","WLAN,再接続しました。,接続SSID："+wlan.SSID+",BSSID："+wlan.BSSID+",RSSI:"+wlan.RSSI+",切替時間："+ time +"秒");
			
			this.stop();

		}, 5000, 1 );
	}


	/*---------------------------------------------------------------*/


	/**
	 * トップページの表示
	 * @return {[type]} [description]
	 */
	this.viewTop = function( auto ) {

		$("#admessage").show();
		$("#go-top").attr("disabled","disabled");

		$("#fcategory-top").show();
		//イベントの発行
		$("#fcategory-top").trigger("SHOW");

		//無操作タイマー
		if( Config.fcategory_top.timer.enable ) {
			if( self.viewtop_timer ) {
				self.viewtop_timer.stop();
			}
		}

		if( auto ) {
			self.log.send("0","TOP,トップ自動表示");
		}

		//classをつける
		// var timer = $.timer(function() {
		// 	$("#page").addClass("viewtop").removeClass("viewmenu");
		// 	this.stop();
		// }, 100, 1);
		// calssでないと更新されない
		//$("#page").attr("data-top", "true");
	};

	/**
	 * カテゴリーの表示の画面セット
	 * 　カテゴリーはセットしない
	 * @param  {[type]} category [カテゴリーコード]
	 * @return {[type]}          [description]
	 */
	this.viewCate = function( category ) {
		
		$("#admessage").hide();
		//最初へ戻るボタン
		$("#go-top").removeAttr("disabled");
		//イベントの発行
		if( $("#fcategory-top").isVisible() ) {
			$("#fcategory-top").hide();
			$("#fcategory-top").trigger("HIDE");
		}

		self.menubody.move();

		//無操作タイマーを起動
		if( Config.fcategory_top.timer.enable ) {
			if( self.viewtop_timer ) {
				self.viewtop_timer.stop();
			}
			var time = Config.fcategory_top.timer.time * 1000;
			self.viewtop_timer = $.timer( function() {
				self.viewTop( true );
				this.stop();
			}, time, 1 );
		}
		//classをはずす
		// var timer = $.timer(function() {
		// 	$("#page").addClass("viewmenu").removeClass("viewtop");
		// 	this.stop();
		// }, 100, 1);
		//calssでないと更新されない
		//$("#page").attr("data-top", "false");
		
	};

	/**
	 * 商品の選択
	 * @param  {Object} data 商品データ
	 * @param  {MouseEvent} e
	 * @param {Object} sdata セレクトデータ
	 * @param {Number} num 数量
	 * @return {[type]}
	 */
	this.selectProduct = function( data, e, sdata, num ) {

		self.addcart_res = false;
		if( empty(num) ) num = 1;

		//アルコール警告
		self.setAlcholeCheck( data, function() {

			//商品警告を表示
			self.setItemAlert( data.warn, data, function() {
				//商品の表示
				//セレクトがある場合
				//sdataがある場合には選択済みなので確定
				if( !empty(data.select) && empty(sdata) ) {

					self.select.show( data );

				} else {

					//selectのチェック
					var set = [];
					if( !empty(sdata) ) {
						//セレクトをセット
						set.push( { item:sdata, num:num } );
					} 

					//セットメニュー分岐
					//セットメニューがある場合には、セットメニューでsetProductをコール
					console.log( data.setmenu, !empty( data.setmenu ) )
					if( !empty( data.setmenu ) ) {
						self.setmenu.show( { item:data, num:num, set:set, sub:[] } );
						return;
					}


					//アニメーションを実行後にカートに格納
					if( !empty( e ) && !empty( e.currentTarget ) && Config.product_select.animate ) {
						//console.log(e.currentTarget)
						self.selectProductAnimation( e, function() {
							self.setProduct( { item:data, num:num, set:set, sub:[] } );
						} );
					} else {
						console.log("non-animation")
						self.setProduct( { item:data, num:num, set:set, sub:[] } );
					}

				}
			});

		});

	};


	/**
	 * 商品選択アラート
	 */
	this.setItemAlert = function( code, item, callback ) {

		if( !Config.product_select.alert || empty( Config.product_select.alert ) ) {
			callback();
			return false;
		}

		var data = Config.product_select.alert[code];
		if( code == "000" || empty( data ) ) {
			callback();
			return false;
		}

		//モードが対象かどうか
		var mode = data.mode.split( "," );
		if( data.mode != "" && mode.indexOf( self.menu_mode ) == -1 ) {
			callback();
			return false;
		}

		//毎回かどうかのチェック
		if( self.alert_product_ary.indexOf( item.id ) > -1 ) {
			if( !data.every ) {
				callback();
				return false;
			}
		}

		//カートに同じ商品があるか
		if( self.cart.getCartSameProduct( { item:item, num:1, set:[], sub:[] } ) != -1 ) {
			callback();
			return false;
		}

		self.message.show( data.message,  null, null, callback );
		if( !data.every ) self.alert_product_ary.push( item.id );
		return true;

	}


	/**
	 * アルコールチェック
	 */
	this.setAlcholeCheck = function( data ,callback ) {
		if( Config.order_confirm.alcohol && data.alcohol && !self.alcohol_alert ) {
			self.message.confirm( "alcohol_check", function() {
				self.alcohol_alert = true;
				callback();
			}, function() {	} );
		} else {
			callback();
		}
	}


	/**
	 * 商品選択のアニメーション
	 * @param  {[type]} event target
	 * @param  {[type]} callback
	 * @return {[type]}
	 */
	this.selectProductAnimation = function( e, callback ) {
		
		var target = $( e.currentTarget );

		if( $( "#animate .image" ).length ) {
			$( "#animate .image" ).trigger("webkitTransitionEnd");
		}
		$( "#animate .image" ).remove();

		var image = target.find( ".image" ).eq(0).clone();
		image.removeClass("anime01");
		image.css( "top", e.clientY );
		image.css( "left", e.clientX );

		$("#animate").html( image );

		//ターゲットをConfigで定義
		// 処理が重いためkeyframeにする
		if( Config.product_select.cart == "small" ) {
			image.addClass("small-in");
		} else {
			image.addClass("panel-in");
		}
		
		//アニメーションの完了のリスナー
		// image.bind("webkitTransitionEnd transitionend webkitAnimationEnd" , function(e){
		// 	$(e.currentTarget).remove();
		// 	callback();
		// });
		//完了のリスナーが来ない場合が想定されるので、タイマーで管理
		var timer = $.timer(function() {
			$( "#animate .image" ).remove();
			callback();
			this.stop();
		}, 400, 1);
	}


	/**
	 * 商品をカートにセット
	 * @param {[type]} data
	 */
	this.setProduct = function( data ) {

		//カートに格納
		var response = self.cart.add( data );
		
		//イベントを発行
		if( response ) {
			console.log("MainController.PRODUCT_SELECT");
			$(document).trigger("PRODUCT_SELECT");
		}

		self.addcart_res = response;
		self.updateCart();

		return response;
	};


	/**
		注文要求の実行
	*/
	this.execOrder = function() {

		//オーダー中画面の表示
		self.message.show("ordering");
		//ExternalInterfaceをスリープ
		ExternalInterface.sleep( true );

		//Config.exec_order.checkin_request_enableの使用用途が不明ため、first_orderで使用する
		//self.order.setOrderRequest( self.slipNo, self.cart.cartAry, self.onCompleteOrder, self.onErrorOrder, Config.orderdate_insert, Config.exec_order.checkin_request_enable );
		self.order.setOrderRequest( self.slipNo, self.cart.cartAry, self.onCompleteOrder, self.onErrorOrder, Config.orderdate_insert, self.first_order );

	};

	/**
		注文の完了
	*/
	this.onCompleteOrder = function() {
		
		//スリープ解除
		ExternalInterface.sleep( false );
		
		//request_checkin first_order
		if( self.first_order &&  self.order.response != "0" ) {
			self.message.show("5207","request_checkin");
			self.log.send("0","チェックイン要求,注文エラー");
			return;
		}


		//$("#order-complete").show();
		self.message.show( "order_complete", null, null, function() {
			//クローズタイマーがある場合にはとめる
			if( !empty(self.order_complete_timer) ) {
				self.order_complete_timer.stop();
			}
			//OrderCompleteのトリガー
			$(document).trigger("ORDER_COMPLETE_CLOSE");
		}, true );
		//クローズタイマー
		if( Config.order_complete.auto_close ) {
			self.order_complete_timer = $.timer(function(){
				//$("#order-complete").hide();
				self.message.hide("order_complete");
				self.order_complete_timer.stop();
				//OrderCompleteのトリガー
				$(document).trigger("ORDER_COMPLETE_CLOSE");
			}, Config.order_complete.close_time, true);
		}

		//カートのリセット
		self.cart.reset();
		self.cart_list.reset();
		self.updateCart();
		//self.order_value_alert_bol = false;
		//self.menubody.setDisabled("reset");

		//トップを表示
		if( Config.order_complete.view_top !== false ) {
			self.viewTop();
		}

		//ゲーム判定用にcheck_orderを取得
		self.checkOrderKeep();

		//ファーストオーダーの処理
		if( self.first_order ) {
			//$( "#ordercheck-btn, #accounting-call" ).removeAttr("disabled");
			self.setNotifyCheckin( true );
			//ファーストオーダーを解除
			//self.first_order = false; //setNotifyCheckinで解除
		}

		//OrderCompleteのトリガー
		$(document).trigger("ORDER_COMPLETE");
	};

	/**
		注文エラー
	*/
	this.onErrorOrder = function( code, item ) {
		//メッセージの表示
		//callback後のカートのクリアに関してはmessage画面に記述
		self.message.show( code,  "exec_order", item  );
		//スリープ解除
		ExternalInterface.sleep( false );
		//ゲーム判定用にcheck_orderを取得
		self.checkOrderKeep();

		self.order_value_alert_bol = false;

		//OrderErrorのトリガー
		$(document).trigger("ORDER_ERROR");
	};

	/**
	 * カートのアップデート
	 * @param {Boolean} nomsg_bol メッセージの表示
	 */
	this.updateCart = function( nomsg_bol ) {

		//リストの更新
	 	self.cart_list.update();

	 	//商品選択状態のセット
	 	//商品のdisableをセット
		self.menubody.setDisabled("reset");

		if( empty( Config.max_value.max_value_msg ) ) Config.max_value.max_value_msg = true;

		if( !self.cart.cart_last ) {
			self.menubody.setDisabled("all");
			//数量maxのメッセージを表示
			//if(!nomsg_bol && Config.max_value.max_value_msg) self.message.show("max_value_total");

		} else if( !self.cart.panelcart_last ) {
			self.menubody.setDisabled("panel");
			//メッセージを表示
			//if(!nomsg_bol && Config.max_value.max_value_msg) self.message.show("max_panel_value_total");
			
		} else if( empty( self.cart.cartAry ) ) {
			self.menubody.setDisabled("reset");
		} else  {
			var leng = self.cart.cartAry.length;
			for( var i=0; i<leng; i++ ) {
				var odata = self.cart.cartAry[i];
				if( odata.num >= self.cart.max_value_numtotal ) {
					self.menubody.setDisabled( odata.item.id );
				} else {
					self.menubody.setDisabled( odata.item.id, true );
				}
			}
		}

	 	//Sinage,Screensaverのタイマーの更新
		if( self.cart.cartAry.length ) {
			//timerの停止
			if( self.sinage_bol ) {
				self.sinage.stop();
			} else {
				self.screensaver.stop();
			}
			//ファーストオーダータイマー
			if(!empty(self.first_order_timer) && self.first_order_timer.isActive) {
				self.first_order_timer.stop();
			}
		} else {
			if( self.sinage_bol ) {
				self.sinage.start();
			} else {
				self.screensaver.start();
			}
			//ファーストオーダータイマー
			if(!empty(self.first_order_timer)) {
				self.first_order_timer.play(true);
			}
		}

		//カートに商品がある場合にはクラスをつける
		//mainにクラスをつけると非常に重いので注意
		// if( self.cart.cartAry.length ) {
		// 	$("#page").addClass("incart");
		// } else {
		// 	$("#page").removeClass("incart");
		// }
		// if( self.cart.cartAry.length ) {
		// 	$("#page").attr("data-cart", "true");
		// } else {
		// 	$("#page").attr("data-cart", "false");
		// }

		//イベントの発行
		console.log("MainController.CART_UPDATE");
		$(document).trigger("CART_UPDATE");
	};


	 /**
	  * 注文履歴の保持
	  */
	this.checkOrderKeep = function() {
		if( Config.check_order.keep ) {
			self.check_order.send( self.checkOrderKeepLoaded );
		}
	};

	/**
	 * 注文履歴保持のロード完了
	 */
	this.checkOrderKeepLoaded = function( data ) {
		if( !data ) return;
		//ゲームの判定
		self.game.check();
		//トップにおかわりを表示
		self.fcategorytop.setRefill();
		//人数チェック商品の確認（slip）
		self.checkPersonSlip();
	}


	/**
	 * オーダー完了後の伝票単位の人数チェック商品をチェック
	 * @return {[type]} [description]
	 */
	this.checkPersonSlip =  function() {
		
		var order_data = self.check_order.order_data;
		var tmp_num = new Array();
		var tmp_product = new Array();

		if( empty( order_data.item ) ) return;

		$.each( order_data.item, function( i, val ) {

			var data = self.menudata.menumst[val.id];
			if( empty( data ) ) return true;

			if( empty(data.check_persons) || data.check_persons == "false" || data.check_persons == "true" || data.check_persons == "000" ) {
				return true;
			}
			var check_id = data.check_persons;
			var check_person_data = Config.check_person[check_id];

			if( empty( check_person_data ) ) return;
	
			//現在のモードが対象か
			var mode = check_person_data.mode.split(",")
			if( check_person_data.mode != "" && mode.indexOf( self.menu_mode ) == -1 ) {
				return true;
			}

			//Slipで過去のオーダー数をチェック
			if( check_person_data.order == "slip" ) {
				var value = ( check_person_data.value == -1 ) ? self.person : check_person_data.value;
				var order_num = (check_person_data.type == "person") ? check_person_data.value * self.person : value;

				switch(check_person_data.type) {
					case "person": // チェックイン人数単位
					case "group": //グループ選択数
						//同じIDの別の商品をチェックするためにセット
						var num = val.amount;
						var index = -1;
						$.each(tmp_num,function(k, tmp){
							if( tmp.id == check_id ) {
								index = k;
								return false;
							}
						});
						if( index == -1 ) {
							tmp_num.push({ id:check_id, item:[data], num:val.amount, lock:false });
							index = tmp_num.length-1;
						} else {
							tmp_num[index].item.push( data );
							tmp_num[index].num += val.amount;
							num = tmp_num[index].num;
						}
						if( order_num <= num ) {
							//商品をロック対象にする
							//console.log( index )
							tmp_num[index].lock = true;
						}
						//console.log(  tmp_num )
						break;

					case "item":
						//商品データは一塊とは限らない
						var num = val.amount;
						var index = -1;
						$.each( tmp_product, function(k, tmp) {
							if( tmp.id == val.id ) {
								index = k;
								return false;
							}
						});


						if( index  == -1 ) {
							tmp_product.push({ id:val.id, item:[data], num:val.amount, lock:false });
							index = tmp_product.length-1;
						} else {
							console.log( tmp_product[index].item )
							tmp_product[index].item.push( data );
							tmp_product[index].num += val.amount;
							num = tmp_product[index].num;
						}
						
						if( order_num <= num ) {
							tmp_product[index].lock = true;
						}

						//console.log( tmp_product )
						break;
				}
			}
		});
		self.cart.person_check_item_ary = tmp_num;

		//商品のロック
		self.menubody.setCheckPerson( tmp_num, tmp_product );
	}

	 /**
	  * スクリーンセーバーなどの時間の延長
	  */
	this.timerReset = function() {
		self.sinage.reset();
		self.screensaver.reset();
		if(!empty(self.viewtop_timer) && self.viewtop_timer.isActive) {
			self.viewtop_timer.reset();
		}
		//ファーストオーダータイマー
		if(!empty(self.first_order_timer) && self.first_order_timer.isActive) {
			self.first_order_timer.reset();
		}
		//イベントの発行
		//console.log("MainController.TIMER_RESET");
		$(document).trigger("TIMER_RESET");
	};

	/**
	 * スクリーンセーバーなどを一時停止
	 * @return {[type]} [description]
	 */
	this.timerStop = function() {
		self.sinage.stop();
		self.screensaver.stop();
		//ファーストオーダータイマー
		if(!empty(self.first_order_timer) && self.first_order_timer.isActive) {
			self.first_order_timer.stop();
		}
	}

	/**
	 * スクリーンセーバーなどを再開
	 * @return {[type]} [description]
	 */
	this.timerStart = function() {
		self.sinage.start();
		self.screensaver.start();
		//ファーストオーダータイマー
		if(!empty(self.first_order_timer) && self.first_order_timer.isActive) {
			self.first_order_timer.play(true);
		}
	}

	/**
	 * サイネージの終了
	 */
	this.closeContents = function( id ) {
		if( !self.checkin_bol ) return;
		self.sinage.onTouchMovie( ExternalInterface.close_contents );
	}


	/**
	 * ゲームのロード完了
	 */
	 this.onLoadedGame = function() {
	 	self.game.onLoadedGame();
	 }

	 /**
	  * ゲーム景品の注文
	  * @return {[type]} [description]
	  */
	 this.onPrizeOrder = function() {
	 	self.game.onPrizeOrder();
	 }

	 /**
	 * ゲームのロード完了
	 */
	 this.setFinishGame = function() {
	 	self.game.setFinishGame();
	 }
	 

	/*---------------------------------------------------------------*/

	/**
		チェックイン要求
	*/
	this.setRequestCheckin = function( person ) {
		
		//ファーストオーダー選択後に送信する
		if( !empty(Config.terminal_checkin.first_order) && Config.terminal_checkin.first_order.enable ) {
			self.person = ( person ) ? person : 1;
			self.first_order = true;
			//チェックインを実行
			self.log.send("0","ファーストオーダー,擬似チェックインします。" );
			ExternalInterface.doCheckin(self.tableNo, "", self.person ,"1","000", Config.terminal_checkin.first_order.mode ,"    ","0","0","0");

			//スタッフコールと注文確認と会計を無効化
			$( "#ordercheck-btn, #accounting-call" ).attr("disabled", true);
			return;
		}
		
		var loaderObj = new Loader();
		var data = {};
		var path = (Config.islocal) ? "request_checkin.xml" : "request_checkin";
		data.TABLE_NO = self.tableNo;
		data.PERSONS = ( !empty(person) ) ? person : 1; //固定値

		self.log.send("0","チェックイン要求,送信します。,送信先:" + path );

		loaderObj.load( window.apppath + path, data, self.loadedRequestCheckin, 'xml' );
		self.message.show("loading");

	};

	/**
		チェックイン要求の完了
	*/
	this.loadedRequestCheckin = function( data ) {

		if( !data ) {
			self.message.hide();
			//error
			self.message.show("5207","request_checkin");
			return;
		}

		//すでにチェックイン済みのエラー
		if( self.order.response != "0" ) { //チェックインエラー（オーダーエラーも含む）
			if( self.first_order ) {
				self.message.show("5207","request_checkin");
				self.log.send("0","チェックイン要求,注文エラー");
			} else {
				self.log.send("0","チェックイン要求,エラー");
			}
		}

		//一定時間消さないように対応
		self.request_checkin_timer = $.timer(function() {
			self.message.hide();
			this.stop();
		}, Config.terminal_checkin.interval, 1);

		//確認を送信することで、チェックイン時間を短くする
		self.setNotifyCheckin(true);
	};

	/**
	 * チェックイン確認要求
	 */
	this.setNotifyCheckin = function( background ) {
		var loaderObj = new Loader();
		var path = (Config.islocal) ? "notify_checkin.xml" : "notify_checkin";
		self.log.send("0","チェックイン確認,送信します。,送信先:" + path );

		loaderObj.load( window.apppath + path, {}, self.loadedNotifyCheckin, 'xml' );
		if( !background ) self.message.show("loading");
	}

	/**
	 * チェックイン確認要求の完了
	 */
	this.loadedNotifyCheckin = function(data) {

		//first_order後の処理
		if(self.first_order) {
			//self.first_order = false;
			return;
		}

		if( empty(self.request_checkin_timer) || !self.request_checkin_timer.isActive ) {
			self.message.hide();
		}
		if( !data ) {
			//error
			self.message.show("5201","notify_checkin");
			return;
		}
	}


	/**
	 * 消しこみ要求
	 */
	this.setRequestDelete = function() {
		var loaderObj = new Loader();
		var data = {};
		var path;
		path = (Config.islocal) ? "request_checkout.xml" : "request_checkout";
		data.TABLE_NO = self.tableNo;
		loaderObj.load( window.apppath + path, data, self.loadedRequestDelete, 'xml' );
		self.message.show("loading");

		self.log.send("0","消しこみ要求,送信します。,送信先:" + path );
	};

	/**
	 * 消しこみ要求の完了
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.loadedRequestDelete = function( data ) {
		self.message.hide();
		if( !data ) {
			//error
			//self.message.show( "5210", "release_table_no" );
		}
	};

	/**
	 * チェックアウト要求
	 */
	this.setRequestCheckout = function() {
		var loaderObj = new Loader();
		var data = {};
		var path;

		path = (Config.islocal) ? "request_checkout.xml" : "request_checkout";
		data.TABLE_NO = self.tableNo;
		loaderObj.load( window.apppath + path, data, self.loadedRequestCheckout, 'xml' );
		self.message.show("loading");

		self.log.send("0","チェックアウト要求,送信します。,送信先:" + path );
	};
	
	/**
	 * チェックアウト要求の完了
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.loadedRequestCheckout = function( data ) {
		self.message.hide();
		if( !data ) {
			//error
			self.message.show( "5212", "request_checkout" );
		}
	}

	/**
		卓番号の返却
	*/
	this.setReleaseTableNo = function() {
		var path = (Config.islocal) ? "release_table_no.xml" : "release_table_no";
		var loaderObj = new Loader();
		var data = {};
		data.TABLE_NO = self.tableNo;
		loaderObj.load( window.apppath + path, data, self.loadedReleaseTableNo, 'xml' );
		self.message.show("loading");
		self.release_table_no_bol = true;

		self.log.send("0","卓番設定,卓番号の返却を送信します。,卓番号" + self.tableNo + ",送信先:" + path );
	};

	/**
		卓番号の返却完了
	*/
	this.loadedReleaseTableNo = function( data, code ) {
		self.message.hide();
		if( !data ) {
			//error
			self.message.show( "5210", "release_table_no" );
			return;
		}
		//卓版設定画面の起動
		self.table_no_setup.show();
		self.release_table_no_bol = false;
	};

	/**
	 * Eparkのログイン完了
	 */
	this.eparkLoginInfo = function() {
		self.epark.setData();
	}


	/**
	 * QRコード読み取り完了
	 */
	this.resultQRData = function() {
		$(document).trigger("RESULT_QR_DATA");
		self.log.send("0","QRコード,読み取り完了。,result:" + ExternalInterface.qr_result );
	}


	/**
	 * Video終了
	 */
	this.finishVideo = function() {

		$("#videoFrame").remove();

		var finish = ExternalInterface.video_finish;

		//if( finish.type == "1" ) {
			switch( finish.onTouch ) {
				case "0":
					$emenu.viewTop();
					break;
				case "1":
					if( !empty(finish.mCode) ) {
						$emenu.category.setFindProduct( finish.mCode );
					}
					break;
				case "2":
					break;
			}
		//} else {
			//$emenu.viewTop();
		//}


		$(document).trigger("FINISH_VIDEO");
		self.log.send("0","VIDEO,再生終了");
	}


}

;;
/**
 * 擬似TCS
 */
var TCS = function() {

	var self = this;
	this.mode = "01";

	this.notifyinitialize = function() {
		ExternalInterface.doCheckin("A100","8541","4","1","000", self.mode ,"    ","0","0","0");

		ExternalInterface.doCheckStock( "4900" );
		ExternalInterface.doMsg( "いらっしゃいませ" );
		//ExternalInterface.doLocalMsg( "arrival:item0=102,4&item1=8001,4&item0=103,4&item1=8001,4" );
		ExternalInterface.doLocalMsg( "" );
	};
	this.notifyCheckout = function() {
		console.log("TCS.notifyCheckout");
	};
	this.registerRoll = function( tableNo, roll ) {
		console.log( "TCS.registerRoll", tableNo, roll );
	};
	this.play = function() {
		console.log( "TCS.play" );
	};
	this.refleshWlanStat = function() {
		console.log("TCS.refleshWlanStat");
		var timer = $.timer( function() {
			window.updateWlanStat("SSID", "BSSID", "RSSI");
			this.stop();
		}, 3000, 1);
	}
	this.startepark = function() {
		console.log("TCS.startepark");
	}

	this.startSurvey = function( tableNo ) {
		console.log("TCS.startSurvey", tableNo);
	}
	this.startCamera = function() {
		console.log("TCS.startCamera");
	}	
};;;
/**
 * 会計呼び出し
 * @param {[type]} scope [description]
 */
var AccountingCall = function(scope) {

	var self = this;
	var scope = scope;

	//クリックイベント
	$("#accounting-call")._click(function() {
		if( Config.accountingcall.confirmWin ) {
			//確認画面の表示
			scope.message.confirm( "accountingcall_confirm", function() {
				self.send();
			}, function() {
				$(document).trigger("ACCOUNTINGCALL_CONFIRM_NO");
			});
		} else {
			self.send();
		}
	});

	//初期化
	$(document).bind("CHECKIN", function() {
		self.init();
	});

	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {

		//無効化
		if( !Config.accountingcall.enable ) {
			$("#accounting-call").hide().attr("disabled", true);
		} else {
			$("#accounting-call").show().removeAttr("disabled");
		}
	}

	/**
	 * 会計呼び出し
	 * @return {[type]} [description]
	 */
	this.send = function() {

		var id = Config.accountingcall.id;
		if( Config.accountingcall.exec_id == "staff" ) {
			id = Config.staffcall.id;
		}

		var item =  scope.menudata.menumst[ id ];
		if( empty(item) ) {
			scope.log.send("0","会計呼び出し,商品データが見つかりません。" );
			return;
		}

		var item_data = [{ item:item, num:1, set:[], sub:[] }];
		var slip_no = ( Config.accountingcall.exec_type == "TABLE_NO" ) ? scope.tableNo : scope.slipNo;
		
		scope.log.send("0","会計呼び出し,送信します。,商品ID:" + id + ",商品CODE:" + item.code + ",EXECTYPE:" +  Config.staffcall.exec_type );
		scope.order.setOrderRequest( slip_no, item_data, self.loaded, self.onError, Config.orderdate_insert );
		scope.message.show( "accountingcalling" );
	}

	/**
	 * 会計呼び出しの完了
	 */
	 this.loaded = function() {
	 	scope.message.show( "accountingcall_complete", null, null, null, true );
	 	//会計呼び出し完了
	 	scope.accountingcall_end = true;

	 	//消しこみボタンを表示させるために、トップ画面を表示
	 	scope.viewTop();

	 	//隠しボタンの格納
	 	$("#message").append('<button class="btn1 hide-btn"></button>');
	 	$("#message .btn1")._click(function() {
	 		scope.message.hide("accountingcall_complete");
	  		//隠しボタンの削除
	 	 	$("#message .btn1").remove();
	 	});

	 	$(document).trigger("ACCOUNTINGCALL_COMPLETE");
	 }

	 /**
	  * 会計呼び出しのエラー
	  */
	  this.onError = function( code ) {
	  	scope.message.show( "accountingcall_error",  "exec_order" );
	  }

	  /**
	   * 隠しボタンのクローズ
	   */
	  this.hide = function() {
	  	scope.message.hide("accountingcall_complete");
	  	//隠しボタンの削除
	  	$("#message .btn1").remove();

	  	//ログオフの通知
	  	//TCS
	  	window.notifyCheckout();
	  }

};var Cart = function( scope ) {

	var self = this;
	var scope = scope;

	this.persons; //人数
	this.max_value_total = 30; //最大商品数
	this.max_value_numtotal = 25; //商品最大数
	this.max_value_panel = 4; //パネルカート最大商品数

	this.cartAry = new Array(); //商品カート [{ item:商品データ, num:商品数, set:セットセレクト商品, sub:単品セレクト商品 }]
	this.panelcartAry = new Array(); //パネルカート

	this.cart_last = 0; //カート残り空き数
	this.panelcart_last = 0; //パネルカート残り空き数
	this.numtotal_last = 0; //商品最大数残り空き数 ※一時格納
	this.numsubtotal_last = 0; //単品セレクト商品最大数残り空き数
	this.totalnum = 0; //商品数合計
	this.order_id; //一番最新の変更商品ID
	this.order_product; //一番最新の変更商品オブジェクト
	this.order_index = 0; //一番最新の変更Index
	this.change_ary; //変更カート配列　通常:cart パネルカート:panel
	this.person_check_item_ary; //人数チェック 伝票用配列
	this.order_value_alert_bol; //数量選択警告フラグ

	this.drink_num = 0; //フード商品数
	this.food_num = 0; //ドリンク商品数

	//フードロックのイベントリスナー
	$(document).bind("FOOD_STOP", function() { self.setFoodLock(true); });
	//ドリンクロックのイベントリスナー
	$(document).bind("DRINK_STOP", function() { self.setDrinkLock(true); });
	//オーダーロックのイベントリスナー
	$(document).bind("ORDER_STOP", function() { 
		self.onDeleteAll();
	});

	//ストックのリスナー
	$(document).bind("STOCK", function() { self.setStockOut(); });


	//初期化
	this.init = function() {
		this.max_value_total = Config.max_value.total;
		this.max_value_numtotal = Config.max_value.subtotal;
		this.max_value_panel = Config.cart.panel_cart.total;
		self.reset();
	};

	//商品の追加
	this.add = function( data ) {

		//商品数のチェック
		if( !data ) return false;

		//カート内に同一商品があるかどうか
		var index = self.getCartSameProduct( data );
		var num = data.num; //親商品数
	
		var res = "normal";

		//数量アラート
		if( Config.max_value.alert != -1 && Config.max_value.alert <= ( self.totalnum + data.num ) && !self.order_value_alert_bol ) {
			scope.message.confirm("order_value_alert", function() {
				scope.setProduct(data);
			}, function(){} );
			self.order_value_alert_bol = true;
			return false;
		}

		//人数チェック
		var check_person = self.checkPersons(data);
		if( !check_person ) {
			return false;//"CheckParsonError";
		}
		//数量チェック
		var check_num = self.checkNum(data, index);
		if( !check_num ) {
			return false;//"CheckNumError";
		}


		//シングルモードのチェック
		var is_single = false;
		if(Config.exec_order.single_mode) {
			is_single = true;
			//インクリメントのチェック
			if( data.num == 0 ) {
				is_single = false;
			}
		}

		//カート内に商品がある分岐
		if( index >= 0 && !is_single ) {

			//カート内商品の数量を追加
			self.cartAry[index].num += num;
			
			//セレクト check=2のチェック
			//親の数量を超えてはいけない
			// if( !empty(data.sub.length) && !empty(self.cartAry[index].sub) ) {
			// 	var sleng = self.cartAry[index].sub.length;
			// 	for( var i=0; i<sleng; i++ ) {
			// 		if( self.cartAry[index].sub[i].check != "2" ) continue;
			// 		var ssleng = data.sub.length;
			// 		for( var k=0; k<ssleng; k++ ) {
			// 			if( self.cartAry[index].sub[i].item.id == data.sub[k].item.id ) {
			// 				if( self.cartAry[index].sub[i].num == self.cartAry[index].num ) {
			// 					//親数量を戻して終了
			// 					self.cartAry[index].num -= num
			// 					return false;//"SubOver";
			// 				}
			// 			}
			// 		}
			// 	}
			// }

			//セットセレクト商品がある場合にはマージ				
			if(data.set.length) {
				//console.log( self.cartAry[index].set, data.set )
				self.cartAry[index].set = self.getMergeObject( self.cartAry[index].set, data.set );
			}
			
			//単品セレクトがある場合にはマージ
			if(data.sub.length) {
				self.cartAry[index].sub = self.getMergeObject( self.cartAry[index].sub, data.sub );
			}
			
			//商品最大数の残数を格納
			self.numtotal_last = self.max_value_numtotal - self.cartAry[index].num;
			//セットのセレクトの場合には他の組み合わせの場合があるので
			//ここではチェックしない
			if(data.set.length) self.numtotal_last = self.max_value_numtotal;
			
			//商品最大数をチェック
			if( self.cartAry[index].num == self.max_value_numtotal ) res = "caution";
			
			//indexの格納
			self.order_index = index;
			self.change_ary = "cart";
			//商品データの格納
			self.orderdata = self.cartAry[index];
			
		} else {
			
			//カートに商品を追加
			//セットの配列をID順に変更
			sortOn(data.set,'item.id');
			sortOn(data.sub,'item.id');
			self.cartAry.push( data );
			
			//indexの格納
			self.order_index = self.cartAry.length -1;
			self.change_ary = "cart";
			//商品データの格納
			self.orderdata = data;
		}
		
		//商品がパネルカート商品
		//パネルカート商品は同一商品が注文済みでも別格納
		if( data.item.usePanel ) {
			
			//パネルカートは数量分dataを格納
			// var __set = { item:data.set, num:1 };
			var _data = { item:data.item, num:1, set:data.set, sub:data.sub, stockout:false, limitout:false };
			for( var i=0; i<num; i++ ) {
				//subは先頭だけつける
				if( i>1 ) _data.sub = [];
				self.panelcartAry.push( _data );
			}
			
			//パネルカート残数
			self.panelcart_last -= num;
			if( self.panelcart_last == 0 ) res = "caution";
			
			//indexの格納
			self.order_index = self.panelcartAry.length -1;
			self.change_ary = "panel";
			//商品データの格納
			self.orderdata = _data;
			
		}
		
		//カート残数
		self.cart_last -= num;
		if( self.cart_last == 0 ) res = "caution";		
		
		//最後のオーダー商品IDを格納
		self.order_id = data.item.id;

		//合計数のセット
		self.totalnum += num;

		//フードとドリンクの更新
		self.setDrinkFood();

		return res;
	};


	/**
	 * カートの商品を変更
	 */
	this.editCart = function( data, index ) {
		sortOn(data.set,'item.id');
		sortOn(data.sub,'item.id');
		var i = self.getCartSameProduct( data );
		if( i > -1 ) {
			//変更なし
			//サブがある場合に変更があるかもなので、置き換える
			if( data.sub.length ) {
				self.cartAry[index].sub = data.sub;
			}
			if(  data.setmenu && data.setmenu.length ) {
				self.cartAry[index].setmenu = data.setmenu;
			}
			scope.updateCart();
			return;
		} else {
			self.cartAry[index] = data;
			scope.updateCart();
		}		
	}


	/**
	 * ドリンクとフードの数量
	 */
	this.setDrinkFood = function() {

		self.drink_num = 0;
		self.food_num = 0;
		
		$.each( self.cartAry, function( i, val ){
			if( val.item.lock_sts == 1 ) {
				//フード
				self.food_num += val.num;
			} else if( val.item.lock_sts == 2 ) {
				//ドリンク
				self.drink_num += val.num;
			}
			if( !empty(val.sub) ) {
				$.each( val.sub, function( k, sub ) {
					if( val.item.lock_sts == 1 ) {
						//フード
						self.food_num += sub.num;
					} else if( val.item.lock_sts == 2 ) {
						//ドリンク
						self.drink_num += sub.num;
					}
				} );
			}
		});
	}


	/**
	 * カート内に同一商品があるかどうか
	 * @param	id		商品ID
	 * @return	index	商品Index
	 * 	該当商品なし	-1
	 */ 
	this.getCartSameProduct = function( data ) {
		var leng = self.cartAry.length;
		for( var i=0; i<leng; i++ ) {
			if( data.item.id == self.cartAry[i].item.id ) {

				var setsame = self.getSameObject( data.set, self.cartAry[i].set );
				if( !setsame ) {
					continue;
				} else {

					if( empty( data.setmenu ) &&  empty( self.cartAry[i].setmenu ) ) {
						return i;
					}

					//セットメニューのチェック
					var setmenusame = self.getSameObject( data.setmenu, self.cartAry[i].setmenu );
					if( !setmenusame ) {
						continue;
					} else {

						//セットメニューのセットのチェック
						var setmenusethit = true;
						$.each( data.setmenu, function( s, val ) {
							var setmenusetsame = self.getSameObject( val.set, self.cartAry[i].setmenu[s].set );
							if( !setmenusetsame ) {
								setmenusethit = false;
								return false;
							}
						} );					
						if( !setmenusethit ) {
							continue;
						} else {
							return i;
						}
					}
				}
			}
		}
		return -1;
	};

	/**
		パネルカート内に同一商品があるか
	*/
	this.getPanelCartSameProduct = function( data ) {
		var leng = self.panelcartAry.length;
		for( var i=0; i<leng; i++ ) {
			if( data.item.id == self.panelcartAry[i].item.id ) {
				//セットセレクトを持っている場合
				if( self.panelcartAry[i].set.length ) {
					var setsame = self.getSameObject( data.set, self.panelcartAry[i].set );
					if( !setsame ) continue;
				}
				return i;
			}
		}
		return -1;
	};

	/**
	 * カート内に同一商品があるかどうか
	 * セットを含まないで検索
	 * @param {Object} data 商品データ
	 * @return {Number} カート内index
	 */ 
	this.getCartSameProductExcSet = function( data ) {
		var leng = self.cartAry.length;
		var index = -1;
		for( var i=0; i<leng; i++ ) {
			if( data.item.id == self.cartAry[i].item.id ) {
				//index.push(i);
				return i;
			}
		}
		return index;
	};

	/**
	 * カート内に同一商品があるかどうか
	 * セットを含まないで検索
	 * 全ての配列を返却
	 * @param {Object} data 商品データ
	 * @return {Array} カート内index配列
	 */ 
	this.getCartSameProductExcSetAry = function( data ) {
		var leng = self.cartAry.length;
		var index = new Array();
		for( var i=0; i<leng; i++ ) {
			if( data.item.id == self.cartAry[i].item.id ) {
				index.push(i);
				//return i;
			}
		}
		return index;
	};

	/**
	 * セレクト商品の配列が同じかどうか
	 * @param	配列1
	 * @param	配列2
	 * @return	Boolean
	 */
	this.getSameObject = function( obj1, obj2 ) {
		var leng = obj1.length;
		if( leng != obj2.length ) return false;

		sortOn(obj1,'item.id');
		sortOn(obj2,'item.id');

		for( var i=0; i<leng; i++) {
			if( obj1[i].item.id != obj2[i].item.id ) {
				return false;
				break;
			}
		}
		return true;
	};

	/**
	 * セレクト商品をマージする
	 * @param	obj1	配列1 カート内配列
	 * @param	obj2	配列2 選択配列
	 * @return	obj2	マージ配列
	 */ 
	this.getMergeObject = function( obj1, obj2 ) {
		var leng2 = obj2.length;
		for( var i=0; i<leng2; i++ ) {
			var same = false;
			//同じものをチェック
			var leng1 = obj1.length;
			for( var j=0; j<leng1; j++ ) {
				if( obj2[i].item.id == obj1[j].item.id ) {
					obj1[j].num += obj2[i].num;
					same = true;
					break;
				}
			}
			if( !same ) {
				//数量が0の場合には追加しない
				if(  obj2[i].num > 0 ) {
					obj1.push( obj2[i] );
				}
			}
		}
		
		return obj1;
	};


	/**
	 * 数量チェック
	 * @return {[type]} [description]
	 */
	this.checkNum = function( data, index ) {

		if( self.cart_last <= 0 ) {
			//商品最大数のエラー
			scope.message.show( "max_value_total" );
			return false;
		} else if(  data.item.usePanel && self.panelcart_last <= 0 ) {
			//カートの数量エラー
			scope.message.show( "max_panel_value_total" );
			return false;
		//} else if( index > -1 && self.cartAry[index].num == self.max_value_numtotal ) {
		} else if( index > -1 ) {
			//親商品の同一でチェックする
			var same = self.getCartSameProductExcSetAry( data );
			var num = 0;
			var leng = same.length;
			for( var i=0; i<leng; i++ ) {
				num += self.cartAry[same[i]].num;
			}
			if( num+data.num > self.max_value_numtotal ) {
				//カートの数量エラー
				scope.message.show( "max_value_subtotal" );
				return false;
			}
		} else {
			if( data.num > self.max_value_numtotal ) {
				//カートの数量エラー
				scope.message.show( "max_value_subtotal" );
				return false;
			}
		}
		return true;
	}


	/**
	 * 人数チェック
	 * @param  {[type]} data 商品データ
	 * @return {Boolean}      エラー false
	 */
	this.checkPersons = function( data ) {

		if( empty(data.item.check_persons) || data.item.check_persons == "false" || data.item.check_persons == "true" ) {
			return true;
		}

		var check_id = data.item.check_persons;
		var check_parson_data = Config.check_person[check_id];
		
		//チェックするデータがない
		//もしくはidが000
		if( empty( check_parson_data ) || check_id == "000" ) {
			return true;
		}

		//現在のモードが対象か
		var mode = String(check_parson_data.mode).split(",");
		if( check_parson_data.mode != "" && mode.indexOf( scope.menu_mode ) == -1 ) {
			return true;
		}

		//チェックイン人数
		//scope.person
		
		//警告メッセージ後の動作
		//注文するかどうか
		var cart_event = null;
		if( check_parson_data.cart ) {
			cart_event = scope.cart_list.setOrder;
		}

		//以上の場合にはオーダー時に確認
		if( check_parson_data.fix == "2" ) return true;
		
		switch(check_parson_data.type) {
			case "person": // チェックイン人数単位
			case "group": //グループ選択数

				//カート内に同じperson_checkの商品があるか
				var num = self.getCartSameCheckParson( check_id );
				num += data.num;

				//var value = ( check_parson_data.value == -1 ) ? 1 : check_parson_data.value;
				var value;
				if( check_parson_data.value == 0 ) {
					value = 1;
				} else if( check_parson_data.value < 0 ) {
					value = check_parson_data.value * -1;
				} else if( check_parson_data.value > 0 ) {
					value = check_parson_data.value;
				}
				var order_num = (check_parson_data.type == "person" ) ? value * scope.person : value;	

				if( num > order_num ) {
					//注文数のオーバー
					scope.message.show( check_parson_data.msg, null, null, cart_event );
					$(document).trigger("CHECK_PARSON_ERROR");
					return false;
				}
				//Slipで過去のオーダー数をチェック
				if( check_parson_data.order == "slip" ) {
					var p_num = 0;
					if( !empty(self.person_check_item_ary) ) {
						$.each(self.person_check_item_ary, function( i, item ) {
							if( item.id  == check_id  ) {
								p_num += item.num;
								return false;
							}
						});
						console.log("p_num", p_num)
					}

					if( p_num+num > order_num ) {
						// 注文数のオーバー
						scope.message.show( check_parson_data.msg, null, null, cart_event );
						$(document).trigger("CHECK_PARSON_ERROR");
						return false;
					} else {
						//配列に追加
						//person_check_item_ary_tmp.push( in_obj );
						//V4ではcheck_order_keepで過去分を管理する
					}
				}
				break;

			case "item": //商品別数量
				//カート内の数量を取得
				var same = self.getCartSameProductExcSetAry( data );
				var num = 0;
				var leng = same.length;
				for( var i=0; i<leng; i++ ) {
					num += self.cartAry[same[i]].num;
				}
				//console.log( index )
				var num = ( same.length < 0 ) ? 0 : num;
				num += data.num;

				//注文可能数
				//var order_num = ( check_parson_data.value == -1 ) ? scope.person : check_parson_data.value;
				var order_num;
				if( check_parson_data.value == 0 ) {
					order_num = scope.person;
				} else if( check_parson_data.value < 0 ) {
					order_num = check_parson_data.value * scope.person * -1;
				} else if( check_parson_data.value > 0 ) {
					order_num = check_parson_data.value;
				}
				
				if( num > order_num ) {
					// 注文数のオーバー
					scope.message.show( check_parson_data.msg, null, null, cart_event );
					$(document).trigger("CHECK_PARSON_ERROR");
					return false;
				}

				//Slipで過去のオーダー数をチェック
				if( check_parson_data.order == "slip" ) {
					var p_num = 0;
					if( !empty(scope.check_order.order_data) && !empty(scope.check_order.order_data.item) ) {
						$.each(scope.check_order.order_data.item, function( i, item ) {
							if( item.id  == data.item.id  ) {
								p_num += item.amount;
								//return false;
							}
						});
					}

					if( p_num+num > order_num ) {
						//注文数のオーバー
						scope.message.show( check_parson_data.msg, null, null, cart_event );
						$(document).trigger("CHECK_PARSON_ERROR");
						return false;
					} else {
						//配列に追加
						//V4ではcheck_order_keepで過去分を管理する
					}
				}
				break;
		}

		return true;

	}


	/**
	 * カート内のcheck_parson_data.fixの商品の数をチェック
	 * 　指定数を必ず注文しなければならない
	 * @return {[type]} [description]
	 */
	this.checkPersonItemFix = function() {

		//一度チェックしたcheck_person.id
		var skip_check_person_ids = new Array();

		var leng = self.cartAry.length;
		for( var i=0; i<leng; i++ ) {

			var data = self.cartAry[i];
				
			if( empty(data.item.check_persons) || data.item.check_persons == "false" || data.item.check_persons == "true" ) {
				 continue;
			}

			//check_personのデータ
			var check_id = data.item.check_persons;
			var check_parson_data = Config.check_person[check_id];
			//データがなければスキップ
			if( check_parson_data == null ) continue;

			//現在のモードが対象か
			var mode = String(check_parson_data.mode).split(",");
			if( check_parson_data.mode != "" && mode.indexOf( scope.menu_mode ) == -1 ) {
				return true;
			}
			//一度チェックしていればスキップ
			if( skip_check_person_ids.length && skip_check_person_ids.indexOf(check_id) ) continue;
			//fixでなければskip
			if( check_parson_data.fix == "0" ) continue;
			
			//var num = (check_parson_data.type == "person") ? check_parson_data.value * scope.person : check_parson_data.value;

			//typeで切り替え
			switch( check_parson_data.type ) {
				case "person":
				case "group":
					//注文商品数
					var value;
					if( check_parson_data.value == 0 ) {
						value = 1;
					} else if( check_parson_data.value < 0 ) {
						value = check_parson_data.value * -1;
					} else if( check_parson_data.value > 0 ) {
						value = check_parson_data.value;
					}

					var order_num = (check_parson_data.type == "person") ? value * scope.person : value;	

					//カート内の同一チェックIDの商品
					var num = self.getCartSameCheckParson( check_id );

					//スキップ用にskip_check_person_idsに格納
					skip_check_person_ids.push( check_id );

					if( check_parson_data.fix == "1" && num != order_num ) {
						//オーダー可能商品数に達していない
						scope.message.show( check_parson_data.msg );
						$(document).trigger("CHECK_PARSON_ERROR");
						return false;
					} else if( check_parson_data.fix == "2" && num <  order_num ) {
						//オーダー可能商品数に達していない
						scope.message.show( check_parson_data.msg );
						$(document).trigger("CHECK_PARSON_ERROR");
						return false;
					} else if( check_parson_data.fix == "3" && num % order_num != 0 ) {
						//オーダー数がN単位ではない
						scope.message.show( check_parson_data.msg );
						$(document).trigger("CHECK_PARSON_ERROR");
						return false;
					}
					break;

				case "item":
					//var index = self.getCartSameProductExcSet( data );
					//var order_num = self.cartAry[index].num;
					//var order_num = ( check_parson_data.value == -1 ) ? scope.person : check_parson_data.value;
					var order_num;
					if( check_parson_data.value == 0 ) {
						order_num = scope.person;
					} else if( check_parson_data.value < 0 ) {
						order_num = value * scope.person * -1;
					} else if( check_parson_data.value > 0 ) {
						order_num = check_parson_data.value;
					}

					//カート内の同一商品を選択
					var same = self.getCartSameProductExcSetAry( data );
					var num = 0;
					var sleng = same.length;
					for( var k=0; k<sleng; k++ ) {
						num += self.cartAry[same[k]].num;
					}

					if( check_parson_data.fix == "1" && num !=  order_num ) {
						//オーダー可能商品数と同数ではない
						scope.message.show( check_parson_data.msg );
						return false;
					} else if( check_parson_data.fix == "2" && num < order_num ) {
						//オーダー可能商品数に達していない
						scope.message.show( check_parson_data.msg );
						return false;
					} else if( check_parson_data.fix == "3" && num % order_num != 0 ) {
						//オーダー数がN単位ではない
						scope.message.show( check_parson_data.msg );
						return false;
					}
					break;
			}


			console.log("--",i)
		}

		return true;
	}


	/**
	 * カート内にcheck_person=idの商品を検索
	 * セットを含まないで検索
	 * @param	id	商品ID
	 * @return	num	商品数
	 */ 
	this.getCartSameCheckParson = function( id ) {
		var leng = self.cartAry.length;
		var num = 0;
		for( var i=0; i<leng; i++ ) {
			if( id == self.cartAry[i].item.check_persons ) {
				num += self.cartAry[i].num;
			}
		}
		return num;
	};


	/**
	 * 商品のデクリメント
	 * @param	data	減算商品
	 * 		item	商品
	 * @return	Boolean		削除になったかどうか
	 */ 
	this.onDecrement = function( data ) {
  		
		//indexを初期化
		self.order_index = -1;
		self.change_ary = "cart";
		self.order_product = data;
		self.order_id = data.item.id;


		//商品がパネルカートの場合は都度削除
		if( data.item.usePanel ) {
			var index = self.getPanelCartSameProduct( data );
			if( index < 0 ) return;
			self.panelcartAry.splice(index,1);
			self.panelcart_last++; //残数の加算
		}

		var index = self.getCartSameProduct( data );
		if( index < 0 ) return;

		self.cartAry[index].num--;
		
		// セットの数量を減算
		if( self.cartAry[index].set.length ) {
			var _set = self.cartAry[index].set.length;
			for( var h=0; h<_set; h++ ) {
				self.cartAry[index].set[h].num--;
			}
		}
		
		self.cart_last++; //残数の加算
		self.totalnum--; //トータルの減算

		//indexの格納
		self.order_index = index;
		
		//0以下の場合は削除
		if( self.cartAry[index].num <= 0 ) {
			self.cartAry.splice(index,1);
			
			//フードとドリンクの更新
			self.setDrinkFood();
			//カートの変更を通知
			scope.updateCart();
			return false;
		}
		
		self.change_ary = "cart";

		//フードとドリンクの更新
		self.setDrinkFood();
		//カートの変更を通知
		scope.updateCart();
		return true;
	};


	/**
	 * 商品のインクリメント
	 * @param	data	加算商品
	 * 		item	商品
	 */ 
	this.onIncrement = function( data ) {

		var index = self.getCartSameProduct( data );
		if( index < 0 ) return;
		
		//追加商品用に整形
		//セットの数量を1にする
		var _set = self.cartAry[index].set;
		var _set_leng = _set.length;
		var _is_set = new Array();
		for( var i=0; i<_set_leng; i++ ) {
			_is_set.push( { item:_set[i].item, num:1, check:_set[i].check } );
		}

		//シングルモードの場合にはsubをそのままつける
		var _sub = [];
		if( Config.exec_order.single_mode ) {
			_sub = self.cartAry[index].sub;
		}

		//セットメニュー		
		var item = { item:self.cartAry[index].item, num:1, set:_is_set, sub:_sub, setmenu:self.cartAry[index].setmenu };
		
		//商品を追加
		self.add(item);
		scope.updateCart();
	};



	/**
	 * 商品の削除
	 * @param		削除商品
	 * 		item	商品
	 */ 
	this.onDelete = function( data ) {

		//IDの格納
		self.order_id = data.item.id;
		self.order_product = data;
		//indexを初期化
		self.order_index = -1;
		self.change_ary = "cart";
		
		//商品がパネルカートの場合は都度削除
		if( data.item.usePanel ) {
			
			var index = self.getPanelCartSameProduct( data );
			self.panelcartAry.splice(index,1);
			self.panelcart_last++; //残数の加算
			
			var index = self.getCartSameProduct( data );
			if( index < 0 ) return;

			//パネルカート商品を削除の場合はデクリメント
					
			self.cartAry[index].num--;
			if( self.cartAry[index].set.length ) {
				var sleng = self.cartAry[index].set.length;
				for( var s=0; s<sleng; s++ ) {
					self.cartAry[index].set[s].num--;
				}
			}
			
			self.cart_last++; //残数の加算
			self.totalnum--;

			
			//商品最大数の残数を格納
			self.numtotal_last = this.max_value_numtotal - self.cartAry[index].num;
			//人数制限商品の場合
			if( self.cartAry[index].item.check_persons ) self.persons_last += self.cartAry[index].num;

			//0以下の場合は削除
			if( self.cartAry[index].num <= 0 ) {
				//トレースログ
				//traceLog("削除", self.cartAry[index]);
				self.cartAry.splice(index,1);
			}
			//トレースログ
			//traceLog("減らす", self.cartAry[index]);
			//フードとドリンクの更新
			self.setDrinkFood();

			scope.updateCart();
			return;
		}

		var index = self.getCartSameProduct( data );
		self.cart_last += self.cartAry[index].num; //残数の加算
		self.totalnum -= self.cartAry[index].num;

		//人数制限商品の場合
		if( self.cartAry[index].item.check_persons ) self.persons_last += self.cartAry[index].num;
		self.cartAry.splice(index,1);
		
		self.order_index = index;

		//フードとドリンクの更新
		self.setDrinkFood();
		scope.updateCart();
	};


	/**
		パネル商品のすべて削除
	*/
	this.onDeletePanelAll = function() {
		var copy = [].concat(self.panelcartAry); 
		var leng = copy.length;
		for( var i=0; i<leng; i++ ) {
			self.onDelete( copy[i] );
		}
		//フードとドリンクの更新
		self.setDrinkFood();
		scope.updateCart();
	};

	/**
		すべての商品の削除
	*/
	this.onDeleteAll = function() {
		self.reset();
		scope.updateCart();
	};

	/**
	 * 指定IDの商品を削除
	 * 	品切れ商品オーダーエラー後の処理
	 * @param {Array} data 削除商品IDの配列
	 * @return {[type]} [description]
	 */
	this.onDeleteList = function( data ) {
		if( empty(data) ) return;

		var copy = [].concat(self.cartAry); 
		var leng = copy.length;
		for( var i=0; i<leng; i++ ) {
			if( data.indexOf( copy[i].item.id ) > -1 ) {
				//パネルカート商品の場合には都度削除なので
				//個数分deleteを実行
				if( copy[i].item.usePanel ) {
					var index = self.getCartSameProductExcSet( copy[i] );
					var num = self.cartAry[index].num;
					for( var k=0;k<num; k++ ) {
						self.onDelete( copy[i] );
					}
				} else {
					self.onDelete( copy[i] );
				}
			}
		}
		//フードとドリンクの更新
		self.setDrinkFood();
		scope.updateCart();
	} 

	/**
	 * サブ商品のデクリメント
	 * @param	data	減算商品
	 * 		sdata	サブ商品
	 */ 
	this.onSubDecrement = function( data, sdata ) {

		var index  = self.getCartSameProduct( data );
		if( index < 0 ) return;

		self.order_id = data.item.id;

		_sub = self.cartAry[index].sub;
		var _leng = _sub.length;
		for( var j=0; j<_leng; j++ ) {

			//console.log( _sub[j].item.id, sdata.item.id )

			if( _sub[j].item.id == sdata.item.id ) {
				self.cartAry[index].sub[j].num--;
				
				//残数チェック
				//var _limit = this.getObjectSubLimit(_sub[j].item.id, true);
				//_sub[j].item.limitout = (_limit > 0) ? true : false;
				
				//0以下の場合は削除
				if( self.cartAry[index].sub[j].num <= 0 ) {
					self.cartAry[index].sub.splice(j,1);
					//フードとドリンクの更新
					self.setDrinkFood();
					scope.updateCart();
					return false;
				}
				break;
			}
		}

		self.order_index = index;

		//フードとドリンクの更新
		self.setDrinkFood();
		scope.updateCart();
		return true;
	};

		
	/**
	 * サブ商品のインクリメント
	 * @param	data	加算商品
	 * 		item	商品情報
	 * 		parent	親商品ID
	 */ 
	this.onSubIncrement = function( data, sdata ) {

		var index = self.getCartSameProduct( data );
		if( index < 0 ) return;
		
		//セットの数量を1にする
		var _set = self.cartAry[index].set;
		var _set_leng = _set.length;
		var _is_set = new Array();
		for( var i=0; i<_set_leng; i++ ) {
			_is_set.push( { item:_set[i].item, num:0, check:_set[i].check  } );
		}

		//数量チェック
		var sl = self.cartAry[index].sub.length;
		for( var i=0; i<sl; i++ ) {
			console.log( self.cartAry[index].sub[i].item )
			if( sdata.item.id == self.cartAry[index].sub[i].item.id ) {
				if( self.cartAry[index].sub[i].num == self.max_value_numtotal ) {
					//カートの数量エラー
					scope.message.show( "max_value_subtotal" );
					return false;
				}
			}
		}
		//サブ商品用に整形
		var subitem = { item:self.cartAry[index].item, num:0, set:_is_set, sub:[{ item:sdata.item, num:1 }] };
		self.add(subitem);
		scope.updateCart();
	};
		
		
	/**
		サブ商品の削除 
		@data 親商品
		@sdata サブ商品
		@index 親商品のindex
		@sublindex サブ商品のindex
	 */ 
	this.onSubDelete = function( data, sdata, index, subindex ) {

		var index  = ( !empty( index ) ) ? index : self.getCartSameProduct( data );
		_sub = self.cartAry[index].sub;
		
		if( empty( subindex ) ) {
			var _leng = _sub.length;
			for( var j=0; j<_leng; j++ ) {
				if( _sub[j].item.id == sdata.item.id ) {
					subindex = j;
					break;
				}
			}
		}
		self.cartAry[index].sub.splice(subindex, 1);
	};
	
	/**
	 * 指定商品のオーダー残数を取得
	 * @param	data	商品オブジェクト
	 * @return	uint		商品残数
	 */ 
	this.getObjectLast = function( data ) {

		if( empty( data ) ) return  self.max_value_numtotal;

		var index = self.getCartSameProduct(data);
		var num1 = self.max_value_numtotal;
		if(index >= 0) {
			//return self.max_value_numtotal;
			var item = self.cartAry[index];
			var num1 = self.max_value_numtotal - item.num;
		}
		
		//カート全体の数量のトータル
		var num2 = self.cart_last;
		//カートの個別残数か全体残数の小さい方を返却
		num = Math.min( num1, num2 );

		//パネル商品の場合にはパネルの残数をセット
		//console.log( data.item.usePanel )
		if( data.item.usePanel ) {
			num = self.panelcart_last; //Config.panel_cart.total - item.num;
		}

		return num;
	};
		
	/**
	 * 指定商品の指定サブ商品のオーダー残数を取得
	 * @param	data	商品オブジェクト
	 * @param	id		サブ商品ID
	 * @return	uint	サブ商品残数
	 */ 
	this.getObjectSubLast = function( data, id ) {
		var index = self.getCartSameProduct(data);
		
		if(index<0) {
			return self.max_value_numtotal;
		}
		
		var item = self.cartAry[index];
		var leng = item.sub.length;
		for(var i=0; i<leng; i++) {
			if( item.sub[i].item.id != id ) continue;
			var _num = self.max_value_numtotal - item.sub[i].num;
			return _num;
		}
		
		return self.max_value_numtotal;
	};
	

	/**
	 * 品切れの受信
	 * @param	data	品切れ商品ID配列
	 */ 
	this.setStockOut = function() {
		
		var stock = ExternalInterface.stock;

		//通常カートの品切れのセット
		var _leng = self.cartAry.length;
		var cdata = self.cartAry.clone();

		var stockout_item = [];

		for(var k=0; k<_leng; k++) {
			
			//親商品のIDチェック
			if( stock.indexOf(cdata[k].item.id) > -1 ) {
				var n = 1;
				if( cdata[k].item.usePanel ) {
					n = cdata[k].num;
				}
				//パネル商品の場合には個数分削除をかける
				var data = cdata[k];
				for(var p=0;p<n;p++ ) {
					self.onDelete( data );
					// k--;
					// _leng--;
				}

				//品切れ商品を追加
				var hit = false;
				if( stockout_item.length ) {
					$.each( stockout_item, function(y,val) {
						if( val.item.id == data.item.id ) {
							hit = true;
							return false;
						}
					} );
				}
				if( !hit ) stockout_item.push( data );
				continue;
			}
			
			//サブ商品のIDチェック
			if( cdata[k].sub.length ) {
				var __leng = cdata[k].sub.length;
				for( var h=0; h<__leng; h++ ) {
					if( stock.indexOf(cdata[k].sub[h].item.id) > -1 ) {
						
						var hit = false;
						if( stockout_item.length ) {
							$.each( stockout_item, function(y,val) {
								if( val.item.id == cdata[k].sub[h].item.id ) {
									hit = true;
									return false;
								}
							} );
						}
						//品切れ商品を追加
						if( !hit ) stockout_item.push( cdata[k].sub[h] );

						self.onSubDelete( cdata[k], cdata[k].sub[h], k, h );
						break;
					}
				}
			}
		}
		
		scope.updateCart();

		//品切れ商品が含まれている場合にはアラートを表示
		if( stockout_item.length ) {
			var items = $.map(stockout_item, function(item) {
				if( empty(item.item) ) return "";
				return item.item.name_1 + item.item.name_2;
			});
			//console.log( scope.alternate.getString( "cart_stockout_item" ) )
			var msg = scope.alternate.lang_data.messages["cart_stockout_item"] || {msg:"%item%"};
			var str = msg.msg.replace(/%item%/g, items.join(","));
			scope.alert.show( str );
		}
	};

	
	/**
	 * フードのオーダーロック
	 */ 
	this.setFoodLock = function( bol ) {

		//通常カートのロックのセット
		var _leng = self.cartAry.length;
		var cdata = Object.extended(self.cartAry).clone();

		for(var k=0; k<_leng; k++) {
			
			//親商品のIDチェック
			if( cdata[k].item.lock_sts == 1 && bol ) {
				var n = 1;
				if( cdata[k].item.usePanel ) {
					n = cdata[k].num;
				}
				//パネル商品の場合には個数分削除をかける				
				var data = cdata[k]
				for(var p=0;p<n;p++ ) {
					self.onDelete( data );
				}
				continue;
			}
			
			//サブ商品のIDチェック
			if( cdata[k].sub.length ) {
				var __leng = cdata[k].sub.length;
				for( var h=0; h<__leng; h++ ) {
					if( cdata[k].sub[h].item.lock_sts == 1 && bol ) {
						self.onSubDelete( cdata[k], cdata[k].sub[h], k, h );
					}
				}
			}
		}
	};
		
	
	/**
	 * ドリンクのオーダーロック
	 */ 
	this.setDrinkLock = function( bol ) {
		//通常カートのロックのセット
		var _leng = self.cartAry.length;
		var cdata = Object.extended(self.cartAry).clone();

		for(var k=0; k<_leng; k++) {
			
			//親商品のIDチェック
			if( cdata[k].item.lock_sts == 2 && bol ) {
				var n = 1;
				if( cdata[k].item.usePanel ) {
					n = cdata[k].num;
				}
				//パネル商品の場合には個数分削除をかける
				var data = cdata[k];
				for(var p=0;p<n;p++ ) {
					self.onDelete( data );
				}
				continue;
			}
			
			//サブ商品のIDチェック
			if( cdata[k].sub.length ) {
				var __leng = cdata[k].sub.length;
				for( var h=0; h<__leng; h++ ) {
					if( cdata[k].sub[h].item.lock_sts == 2 && bol ) {
						self.onSubDelete( cdata[k], cdata[k].sub[h], k, h );
					}
				}
			}
		}
	};
	
		
	/**
	 * アルコール商品の有無のチェック
	 */ 
	this.getAlcohol = function() {

		var leng = self.cartAry.length;
		var res = false;
		
		for( var i=0; i<leng; i++ ) {	
		
			res = this.cartAry[i].item.alcohol;
			if( res ) break;
		
			var _leng = this.cartAry[i].set.length;
			for( var j=0; j<_leng; j++ ) {
				res = self.cartAry[i].set[j].item.alcohol;
				if( res ) break;
			}
			
			var __leng = self.cartAry[i].sub.length;
			for( var k=0; k<__leng; k++ ) {
				res = self.cartAry[i].sub[k].item.alcohol;
				if( res ) break;					
			}

		}
		
		return res;
	};
		
		
		
	/**
	 * カート内商品の取得
	 */ 
	this.getCartAryProduct = function( data ) {

		var index = self.getCartSameProduct( data );
		if( index >= 0 ) {
			return self.cartAry[index];
		} else {
			return null;
		}

	};
	
	/**
	 * カート内商品をIDから取得
	 * TODO 同じIDの商品IDでセレクトが違う場合の処理
	 */ 
	this.getCartAryProductId = function( id ) {

		var leng = self.cartAry.length;
		for( var i=0; i<leng; i++ ) {
			if( self.cartAry[i].item.id == id ) {
				return self.cartAry[i];
			}
		}
		return false;
	};

	/**
	 * カート内の商品をIDから取得
	 * 同じIDの商品でセレクトがあるので、配列で返却
	 * @return {[type]} [description]
	 */
	this.getCartAryProductIdAll = function( id ) {
		var ary = [];
		var leng = self.cartAry.length;
		for( var i=0; i<leng; i++ ) {
			if( self.cartAry[i].item.id == id ) {
				//セレクトのリスト用に今回追加された商品かどうかを格納
				var data = Object.clone(self.cartAry[i]);
				if( self.order_index == i ) data.selected = true;
				ary.push( data );
			}
		}
		return ary;
	}

	/**
	 * カート内の商品IDを返却
	 */ 
	this.getCartAryProductAllId = function() {
		var leng = self.cartAry.length;
		var item = new Array();
		for( var i=0; i<leng; i++ ) {
			item.push( self.cartAry[i].item.id );
		}		
		return item.join(",");
	};

	/**
	 * カートの商品をセットを見ないで数量をマージした配列を返却
	 * 親商品の数量を取得
	 */
	this.getCartAryWithoutSelect = function() {
		var ary = [];
		var leng = self.cartAry.length;
		for( var i=0; i<leng; i++ ) {
			var is_index = ary.findIndex(function( n ){
				return n['item']['id'] == self.cartAry[i].item.id;
			});
			if( is_index > -1 ) {
				ary[is_index].num += self.cartAry[i].num;
			} else {
				var clone = Object.clone( self.cartAry[i] )
				ary.push( clone );
			}
		}
		return ary;
	}


	/*
	 * カート内の言語を変更
	 */
	this.setLanguage = function() {

		var leng = self.cartAry.length
		for( var i=0; i<leng; i++ ) {
			var data = self.cartAry[i];
			$.each( scope.menudata.menumst, function( j, item ) {
				if( data.item.id == item.id ) {
					self.cartAry[i].item = item;
					return false;
				}
			} );

			if( data.set.length ) {
				var kleng = data.set.length;
				for( var k=0; k<kleng; k++ ) {
					$.each( scope.menudata.menumst, function( l, sitem ) {
						if( data.set[k].item.id == sitem.id ) {
							data.set[k].item = sitem;
							return false;
						}
					} );
				}
			}

			if( data.sub.length ) {
				var mleng = data.sub.length;
				for( var m=0; m<mleng; m++ ) {
					$.each( scope.menudata.menumst, function( o, bitem ) {
						if( data.sub[m].item.id == bitem.id ) {
							data.sub[m].item = bitem;
							return false;
						}
					} );
				}
			}

			if( !empty( data.setmenu ) ) {
				var pleng = data.setmenu.length;
				for( var p=0; p<pleng; p++ ) {
					$.each( scope.menudata.menumst, function( q, setitem ) {
						if( data.setmenu[p].item.id == setitem.id ) {
							data.setmenu[p].item = setitem;
							return false;
						}
					} );
				
					//setmenu set
					if( !empty(data.setmenu[p].set) ) {
						var rleng = data.setmenu[p].set.length;
						for( var r=0; r<rleng; r++ ) {
							$.each( scope.menudata.menumst, function( s, set_sitem ) {
								if( data.setmenu[p].set[r].item.id == set_sitem.id ) {
									data.setmenu[p].set[r].item = set_sitem;
									return false;
								}
							} );
						}
					}

					//setmenu sub
					if( !empty(data.setmenu[p].sub) ) {
						var tleng = data.setmenu[p].sub.length;
						for( var t=0; t<tleng; t++ ) {
							$.each( scope.menudata.menumst, function( s, set_bitem ) {
								if( data.setmenu[p].sub[t].item.id == set_bitem.id ) {
									data.setmenu[p].sub[t].item = set_bitem;
									return false;
								}
							} );
						}
					}
				}
			}
		}

	}
	
		
	/**
	 * カートのリセット
	 */ 
	this.reset = function() {
		self.cart_last = self.max_value_total;
		self.panelcart_last = self.max_value_panel;
		self.persons_last = self.persons;
		
		self.numtotal_last = self.max_value_numtotal;
		self.totalnum = 0;

		self.cartAry = new Array();
		self.panelcartAry = new Array();

		//indexを初期化
		self.order_id = null;
		self.order_product = null;
		self.order_index = -1;
		self.change_ary = "cart";

		self.order_value_alert_bol = false;

		self.food_num = 0;
		self.drink_num = 0;
	};


};;;
/**
 * 注文確認要求
 * @param {[type]} scope [description]
 */
var CheckOrder = function( scope ) {

	var self = this;
	var scope = scope;

	this.callback;
	this.order_data; //データ格納

	//チェックアウト
	$(document).bind( "CHECKOUT", function() { 
		self.order_data = { item:[], total:0 };
	} );


	this.init = function() {
	};

	/**
	 * 要求送信
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	this.send = function( callback ) {

		self.callback = callback;
		var loader = new Loader();
		var path = (Config.islocal) ? 'check_order.xml' : 'check_order';
		var data = {};
		data.SLIP_NO = scope.slipNo;
		data.chache = Math.floor( Math.random() * 10000 );
		loader.load( window.apppath + path, data, self.loaded, 'xml' );

	};

	/**
	 * ロード完了
	 * @return {[type]} [description]
	 */
	this.loaded = function( data ) {

		if( !data ) {
			//error
			self.callback( false );
			return;
		}

		//ローカルモード
		if( Config.islocal && !Config.emenu_local ) { //debug用にemenu_localをセットされたにはxmlを参照
			if(empty(self.order_data)) {
				self.order_data = { item:[], total:0 };
			}
			self.order_data.total = 0; 
			$.each( self.order_data.item, function(i, val) {
				self.order_data.total += val.price * val.amount;
			});
			//コールバックの実行
			self.callback( self.order_data );
			return;
		}

		//データ整形
		self.order_data = {
			total:Number($(data).find("product").attr("total")),
			item:[]
		}

		//パースする
		var items = $( data ).find( "item" );
		$.each( items, function( i, val ) {
			var id = $(val).attr("id");

			//さびぬき
			if( !empty(Config.check_order.sabinuki) && Config.check_order.sabinuki == id ) {
				var data = self.order_data.item[ self.order_data.item.length-1 ];
				data.name += "/" + $(val).attr("name").trim();
				return true;
			}
			//さびあり
			if( !empty(Config.check_order.sabiari) && Config.check_order.sabiari == id ) {
				return true;
			}

			var item = scope.menudata.menumst[id] || null;
			var submenu = false;


			if(　!empty(item) && !empty( item.nodisp )　&& item.nodisp　) {
				//注文履歴として表示しない
				return true;
			}

			//ボタン名称を付与する
			//ただし、回転寿司は表示しない
			var name_3 = "";
			if( !empty(item) && !empty( item.name_3 ) && Config.product.use_name3 !== false ) {
				name_3 += "　";
				name_3 += ( scope.alternate_bol ) ? item.alt_name_3 : item.name_3;
			}

			var name = $(val).attr("name");
			if( empty( name.substring(0,1).match(/\S/g) ) ) {
				submenu = true;
				name = name.substr(1);
			}

			var data = {
				id:id,
				item:item,
				name:( !empty(item) ) ? item.name_1 + item.name_2 + name_3 : $(val).attr("name"),
				alt_name:( !empty(item) ) ? item.alt_name_1 + item.alt_name_2 + name_3 : $(val).attr("name"),
				submenu:submenu,
				amount:Number($(val).attr("amount")),
				price:Number($(val).attr("price")),
				status:Number($(val).attr("status")),
				sub:[]
			}

			if( submenu ) {
				self.order_data.item.last().sub.push( data );
			} else {
				self.order_data.item.push( data );
			}
		});
		//コールバックの実行
		self.callback( self.order_data );
	};


	/**
	 * ローカルデモ用
	 * オーダーデータを格納
	 */
	this.setLocalData = function( data ) {

		//提供済みをセット
		var status = [1,2,3];
		var leng = self.order_data.item.length;
		$.each( data, function( i, val ) {

			if(　!empty(val.item) && !empty( val.item.nodisp )　&& val.item.nodisp　) {
				//注文履歴として表示しない
				return true;
			}

			var data = {
				id:val.item.id,
				item:val.item,
				name:val.item.name_1 + val.item.name_2,
				alt_name:val.item.alt_name_1 + val.item.alt_name_2,
				amount:val.num,
				price:Number(val.item.price),
				status:status[(leng+i)%3],
			}
			self.order_data.item.push( data );
		});
	}
};;
/**
 * Epark
 * @param {[type]} scope [description]
 */
var Epark = function( scope ) {

	var self = this;
	var scope = scope;

	this.memberinfo_url = (Config.islocal) ? window.apppath + 'memberinfo.json' : "api/memberinfo"; //API – 来店会員基本情報取得
	this.membershopinfo_url = (Config.islocal) ? window.apppath + 'membershopinfo.json' : "api/shoppointinfo"; //"api/membershopinfo"; //API – 来店会員基本情報取得

	this.banner_path = 'billboard/epark/'; //バナーの画像パス

	this.hostname; //Eparkのホスト
	this.callback; //TerminalSettingsのロードコールバック

	this.pdid; //店舗ID
	this.pass; //店舗パスワード

	this.cardid = []; //カードID
	this.member_data = []; //ログインユーザーデータ
	this.temp_member_data; //ユーザーデータの一時保存

	this.banner_array; //表示バナー配列

	//起動イベントリスナー
	//初期化イベントリスナー
	$(document).bind("CHECKOUT", function(){self.init(); });

	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {
		self.cardid = [];
		self.member_data = [];
	}

	/**
	 * ターミナルセッティングの取得
	 */
	this.getSetting = function( callback ) {

		self.callback = callback;

		//TerminalSettingsの読み込み
		var loaderObj = new Loader();
		loaderObj.load( window.configpath + "TerminalSettings.xml" + chache(), null, self.loadedSetting, 'xml' );
	}

	/**
	 * ターミナルセッティングの取得完了
	 */
	this.loadedSetting = function(data) {

		if( !data ) {
			//error
			scope.log.send("0","Epark,TerminalSettings.xml読み込みエラー" );
			self.callback();
			return;
		}
		var edata = $(data).find("root").children();
		$.each( edata, function( i, val ) {
			if( val.nodeName == "epark.HostName" ) self.hostname = val.textContent ;
			if( val.nodeName == "epark.StoreID" ) self.pdid = val.textContent ;
			if( val.nodeName == "epark.StorePassword" ) self.pass = val.textContent ;
		});

		//ロードの完了
		self.callback();
	}

	/**
	 * ログインデータの取得
	 */
	this.setData = function() {
		var data = ExternalInterface.eparkinfo;

		//重複ユーザーはreturn
		var ca = self.cardid.filter(function(value, index) {
			return value == data.cardid;
		});
		console.log( ca )
		if( !ca.length ) {
			self.cardid.push( data.cardid );
			self.getMemberData( data.cardid );
		}
	}

	/**
	 * ユーザーデータの取得
	 * @return {[type]} [description]
	 */
	this.getMemberData = function( cardid ) {
		var data = {
			shop_id:self.pdid,
			password:self.pass,
			card_id:cardid,
		}

		if( Config.islocal ) {
			var loaderObj = new Loader();
			loaderObj.load( self.memberinfo_url, data, self.loadedMemberData, 'json' );
		} else {
			ExternalInterface.eparkinfo_callback = self.loadedMemberData;
			window.sendrequest({
				url:self.hostname + self.memberinfo_url,
				trans:"POST",
				param:data
			});
		}
	}

	/**
	 * ユーザーデータの取得完了
	 * @return {[type]}      [description]
	 */
	this.loadedMemberData = function(data) {

		self.temp_member_data = (Config.islocal) ? data :  JSON.parse(ExternalInterface.eparkjson);
		scope.log.send("0","EPARK,メンバーデータ取得完了:" + self.temp_member_data.response.result);

		if( self.temp_member_data.response.result == 'ng' ) {
			//エラー処理
			
			return;
		}

		//ランクの情報の取得
		var data = {
			shop_id:self.pdid,
			password:self.pass,
			card_id:self.cardid.last(),
		}

		if( Config.islocal ) {
			var loaderObj = new Loader();
			loaderObj.load( self.membershopinfo_url, data, self.loadedMemberShopData, 'json' );
		} else {
			ExternalInterface.eparkinfo_callback = self.loadedMemberShopData;
			window.sendrequest({
				url:self.hostname + self.membershopinfo_url,
				trans:"POST",
				param:data
			});
		}
	}

	/**
	 * ユーザーデータ（ランク）の取得完了
	 * @return {[type]} [description]
	 */
	this.loadedMemberShopData = function( data ) {
		var member_shop_data = (Config.islocal) ? data : JSON.parse(ExternalInterface.eparkjson);
		scope.log.send("0","EPARK,メンバーショップデータ取得完了:" + member_shop_data.response.result);

		var data = {
			card_id:self.cardid.last(),
			point:member_shop_data.response.shop_point_info.point,
			rank:member_shop_data.response.shop_point_info.rank,
			call_name:self.temp_member_data.response.info.call_name,
			sex:self.temp_member_data.response.info.sex //男:0,女:1
		}
		self.member_data.push( data );

		self.setBannerArea();
	}


	/**
	 * 表示のセット
	 */
	this.setBannerArea = function() {

		var banner = $("#billboard-banner .item-list li.epark, #fcategory-top .banners .item-list li.epark");
		if( !banner.length ) return;
		if( empty( self.member_data ) ) return;

		var html = "";
		var li = '';
		$.each( self.member_data ,function( i, val ) {
			var name = scope.alternate.getString("epark_user_name").replace(/%name%/g,val.call_name);
			li += '<li class="member" data-id="' + val.card_id + '">' + name + '</li>';
		});
		html = '<ul class="login-member">';
		html += li;
		html += '<li class="add-user-li"><button class="add-user">' + scope.alternate.getString("epark_user_add") + '</button></li>';
		html += '</ul>';
		
		if( banner.find( ".login-member" ).length ) {
			banner.find( ".login-member" ).remove();
		}

		banner.addClass( "loggedin" ).append( html );

		//ランク別のメニューを表示
		self.setRankBanner();
		
	}

	/**
	 * ランク別のメニューバナー表示
	 */
	this.setRankBanner = function() {

		if( empty(scope.menudata.epark) ) return;

		var pages = scope.menudata.epark.page;
		if( empty(pages) ) return;
		if( empty(self.member_data) ) return;

		//ランク名からメニューを抽出
		self.banner_array = [];
		$.each( self.member_data, function(i,member) {
			var rank = member.rank;
			$.each(pages, function(k,page) {
				if( page.type == rank || empty(page.type) || page.type == "none" ) {
					//性別のチェック
					if( !empty( page.sex ) && page.sex != "none" ) {
						if( String(page.sex) != String(member.sex) ) {
							return true;
						}
					}

					//配列に追加
					page.id = k;
					if( empty(self.banner_array) ) {
						self.banner_array.push( page );
					} else {
						//banner_arrayに同じものがあるかチェック
						var ba = self.banner_array.filter(function(value, index) {
							return value.id == k;
						});
						if( !ba.length ) {
							self.banner_array.push( page );
						}
					}
				}
			});
		});

		if( empty( self.banner_array ) ) {
			return;
		}

		var html = '<li class="rank-banner"><ul class="">';
		$.each( self.banner_array, function( h, banner ) {
			html += '<li class="" data-index="' + h + '"><img src="' + self.banner_path + banner.banner + '"></li>'
		});
		html += '</li></ul></li>';

		var item_list = $("#billboard-banner .item-list, #fcategory-top .banners .item-list");

		item_list.find(".rank-banner").remove();
		item_list.find("ul.banner-area").append(html);

		//クリックイベントのセット
		item_list.find(".rank-banner li")._click(function() {
			var index = Number( $(this).data('index') );
			var data = self.banner_array[index];
			scope.rank_menu.setView( data.item, data.class, data.name );
		}, 1, "mouseup", true);
	}
};;
/**
 * メニューローカルデータの読み込み
 * 1.page/custompage_local.xml
 * 2.menu/menumst_custom.xml
 * 3.screensaver/screensaver_local.xml
 */
var Local = function( scope ) {

	var self = this;
	var scope =scope;

	this.callback;

	/**
	 * 起動
	 */
	this.init = function( callback ) {
		self.callback = callback;

		//custompage_localの読み込み
		var loaderObj = new Loader();
		loaderObj.load( window.datapath + "page/custompage_local.xml" + chache(), null, self.loaded, 'xml' );

		scope.boot_sequence = "custompage_local.xml";
	};

	/**
	 * custompage_localの読み込み完了
	 */
	this.loaded = function( data ) {

		if( !data ) {
			//error
			scope.message.show( "3010", "custompage_local.xml" );
			return;
		}
		//パースする
		var category = $( data ).find( "category" );
		var cat = {};
		$.each( category, function( i, val ) {
			var item = [];
			var items = $(val).find("item");
			if( items.length ) {
				$.each( items, function( k, value ) {
					item.push( $(value).attr("id") );
				});
			}
			cat[ $(val).attr("code") ] ={
				code:$(val).attr("code"),
				template:{
					type:$(val).find("template").attr("type"),
				},
				item:item
			}
		});

		scope.custom_menudata = cat;

		//menumst_customの読み込み
		var loaderObj = new Loader();
		loaderObj.load( window.datapath + "menu/menumst_custom.xml" + chache(), null, self.loadedMenumst, 'xml' );

		scope.boot_sequence = "menumst_custom.xml";
	};


	/**
	 * menumst_customの読み込み完了
	 */
	this.loadedMenumst = function( data ) {

		if( !data ) {
			//error
			scope.message.show( "3003", "menumst_custom.xml" );
			return;
		}

		//パース
		var menumst = $(data).find("item");
		var items = {};
		if( menumst.length ) {
			$.each( menumst, function( i, val ) {
				items[$(val).attr("id")] = {
					code: $(val).attr("code"),
					id: $(val).attr("id"),
					no: $(val).attr("no"),
					name_1: $(val).attr("name_1") || "",
					name_2: $(val).attr("name_2") || "",
					name_3: $(val).attr("name_3") || "",
					price: $(val).attr("price"),
					comment_1: $(val).attr("comment_1") || "",
					comment_2: $(val).attr("comment_2") || "",
					text_1: $(val).attr("text_1") || "",
					text_2: $(val).attr("text_2") || "",
					icon_1: $(val).attr("icon_1"),
					icon_2: $(val).attr("icon_2"),
					icon_3: $(val).attr("icon_3"),
					lock_sts: $(val).attr("lock_sts"),
					detail: $(val).attr("detail"),
					select: $(val).attr("select"),
					check_persons: $(val).attr("check_persons"),
					alt_name_1: $(val).attr("alt_name_1") || "",
					alt_name_2: $(val).attr("alt_name_2") || "",
					alt_name_3: $(val).attr("alt_name_3") || "",
					alt_comment_1: $(val).attr("alt_comment_1") || "",
					alt_text_1: $(val).attr("alt_text_1") || "",
					usePanel: $(val).attr("usePanel"),
					alcohol: $(val).attr("alcohol"),
					name_i: $(val).attr("name_i") || "",
				}
			});
		}

		scope.menumst_custom = items;

		//サイネージが有効の場合にはスクリーンセーバーは利用しない
		if( scope.sinage_bol ) {
			//Localの終了
			self.callback();	
		} else {
			//screensaver_localの読み込み
			var loaderObj = new Loader();
			loaderObj.load( window.datapath + "screensaver/screensaver_local.xml" + chache(), null, self.loadedScreensaver, 'xml' );

			scope.boot_sequence = "screensaver_local.xml";
		}

	};


	/**
	 * スクリーンセーバーのロード完了
	 * @return {[type]} [description]
	 */
	this.loadedScreensaver = function( data ) {

		if( !data ) {
			//error
			scope.message.show( "3100", "screensaver_local.xml" );
			return;
		}
		//パースする
		var ss = {};
		var contents = $(data).find("contents");
		ss.timer = Number( contents.attr("timer") );
		ss.movielength = Number( contents.attr("movielength") );
		ss.enable = (contents.attr("enable")=="true");
		ss.movie = new Array();
		var mm = contents.find("movie"); 
		$.each(mm, function( i, val ) {
			var movie = {
				url:$(val).attr("url"),
				title:$(val).attr("title"),
				alt_title:$(val).attr("alt_title"),
				caption:$(val).attr("caption"),
				alt_caption:$(val).attr("alt_caption"),
				align:$(val).attr("align"),
				valign:$(val).attr("valign"),
				linktype:$(val).attr("linktype"),
				code:$(val).attr("code"),
				display_after:$(val).attr("display_after"),
			};
			ss.movie.push( movie );
		});

		//maincontrollerに格納
		scope.screensaver_local = ss;

		//Localの終了
		self.callback();
	};

	
};;
/**
 * Log出力
 * @param {[type]} scope [description]
 */
var Log = function( scope ) {

	var self = this;
	var scope = scope;

	this.stack = []; //出力のスタック
	this.loading_bol; //ロード中フラグ
	this.lognumber = ""; //ログ番号（ユニーク伝票番号）

	$(document).bind("CHECKIN", function(){
		self.lognumber = "CHECKIN_TIME:" + Date.create().format("{yyyy}/{MM}/{dd} {hh}:{mm}:{ss}");
	});
	$(document).bind("CHECKOUT", function(){
		self.lognumber = "";
	});


	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	this.init = function() {

	};

	/**
	 * ログ出力
	 * @return {[type]} [description]
	 */
	this.send = function( type, out ) {

		var data = new Object();
		data.TABLE_NO = scope.tableNo || "unset";
		data.SLIP_NO = String(scope.slipNo).padRight(5) || "    0"; 
		data.TYPE = type;
		data.OUT = out;
		
		//チェックインユニークIDをセット
		var uniqid = (empty(scope.checkin_uniqid)) ? '' : scope.checkin_uniqid.toString(16);
		data.OUT = uniqid + "," + data.OUT;

		//ログ時間のセット
		data.OUT = data.OUT + "," + Date.create().format("{yyyy}/{MM}/{dd} {hh}:{mm}:{ss}");
		self.stack.push( data );

		if( !self.loading_bol ) {
			self.load( Object.clone(data) );
		}
	};

	/**
	 * ロード開始
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.load = function( data ) {
		//logの読み込み
		var loaderObj = new Loader();
		var path = (Config.islocal) ? "log.xml" : "log";
		
		//ログ番号の出力
		data.OUT = data.OUT + "," + self.lognumber;
		
		loaderObj.load( window.apppath + path, data, self.loaded, 'xml' );
		self.loading_bol = true;

		console.log( "Log", data.TABLE_NO, data.SLIP_NO, data.TYPE, data.OUT );
	};

	/**
	 * ロード完了
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.loaded = function( data, textStatus ) {
		//戻り値は空（？）
		if( !empty(textStatus) ) {
			//error
			console.log( "Log error" );
			
			$.timer( function() {
				self.load( Object.clone( self.stack[0] ) );
				this.stop();
			}, 10000, 1 );
			return;
		}
		
		var next_data = self.stack.shift();

		if( self.stack.length ) {			
			//self.load( next_data );
			self.load( Object.clone( self.stack[0] ) );
		} else {
			self.loading_bol = false;
		}

	};
};;
/**
 * nohandle.xml
 */
var Nohandle = function( scope ) {

	var self = this;
	var scope = scope;

	this.data;
	this.callback;

	this.init = function( callback ) {
		self.callback = callback;

		self.data = [];

		//nohandle_globalの読み込み
		var loaderObj = new Loader();
		loaderObj.load( window.datapath + "menu/nohandle_global.xml" + chache(), null, self.loaded, 'xml' );
	};

	/**
	 * nohandle_global.xmlのロード完了
	 */
	this.loaded = function( data ) {
		if( !data ) {
			//error
			scope.message.show( "3005", "nohandle_global.xml" );
			return;
		}
		var product = $(data).find("product");
		if( product.length ) {
			self.data = $.map( product, function( item ){ 
				return $(item).attr("id");
			});
		}
		

		//nohandle_globalの読み込み
		var loaderObj = new Loader();
		loaderObj.load( window.datapath + "menu/nohandle_local.xml" + chache(), null, self.loaded_local, 'xml' );
	};

	/**
	 * nohandle_local.xmlのロード完了
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.loaded_local = function( data ) {

		if( !data ) {
			//error
			scope.message.show( "3005", "nohandle_local.xml" );
			return;
		}
		var product = $(data).find("product");
		if( product.length ) {
			var ids = $.map( product, function( item ){ 
				return $(item).attr("id");
			});
			self.data = self.data.concat( ids );
		}

		//終了の通知
		self.callback();
	};
};;
/**
 * [Order description]
 * @param {[type]} scope [description]
 */
var Order = function( scope ) {
	
	var self = this;
	var scope = scope;

	this.oeder_suspend = false; //オーダー処理ロック
	this.callback; //コールバック
	this.error; //エラー時のコールバック
	this.response; //注文結果
	this.localdata; //デモ用データ

	/**
	 * オーダー処理の開始
	 * @param	slipNo	伝票番号
	 * @param	data	オーダー配列
	 * 		item	商品情報
	 * 		num		数量
	 * 		set		セット商品
	 * 		sub		サブ商品
	 * @param {function} callback コールバック
	 * @param {function} error エラーのコールバック
	 * @param {boolean} data_bol 日付の有無
	 * @param {boolean} checkin チェックイン要求でオーダーする
	 */ 
	this.setOrderRequest = function( slipNo, data, callback, error, date_bol, checkin ) {

		//console.log( checkin )

		if( self.oeder_suspend ) {
			scope.log.send("1","ORDER,2重オーダー検出強制終了" );
			return;
		}
		// オーダー中に変更
		self.oeder_suspend = true;
		self.callback = callback;
		self.error = error;

		var _variables = {};
		_variables.SLIP_NO = slipNo;

		var table_bol = true;
		//if( !empty(data[0].staffcall) && data[0].staffcall && (!scope.checkin_bol || scope.first_order) ) {
		if( !empty(data[0].staffcall) && data[0].staffcall ) {
			table_bol = false;
		}
		if( Config.exec_order.use_table_no == false ) {
			table_bol = false;
		}
		if( table_bol ) _variables.TABLE_NO = scope.tableNo;

		
		//オーダーの整形
		var leng = data.length;
		var _count = 0;
		var _log = ""; //ログ用文字列
		var _log2_ary = [];
		
		// itemが0の場合はエラー
		if( leng == 0  ) {
			self.onError();
			return;
		}
		// slipNoが0の場合にはエラー
		if( _variables.SLIP_NO == "0" &&  !checkin ) {
			self.onError();
			return;
		}			
		
		//シングルモードの対応
		//商品配列を数量分個別にする
		if( Config.exec_order.single_mode ) {
			var leng2 = 0;
			var singleAry = [];
			for( var k=0; k<leng; k++ ) {
				if( data[k].num == 1 ) {
					singleAry.push( data[k] );
				} else {
					var num2 = data[k].num;
					data[k].num = 1;
					$.each( data[k].set, function( i, set ) {
						set.num = 1;
					} );
					$.each( data[k].sub, function( i, sub ) {
						sub.num = 1;
					} );
					for( var h=0; h<num2; h++ ) {
						singleAry.push( data[k] );
					}
				}
			}
			data = singleAry;
			leng = singleAry.length;
		}

		//商品データの整形
		for( var i=0; i<leng; i++ ) {
			
			//商品の格納
			_variables["ITEM"+_count] = data[i].item.id + "," + data[i].num;
			_count++;

			if( i > 0 ) {
				_log += ",";
			}
			_log += data[i].item.name_1 + data[i].item.name_2;

			var _log2 = "";
			_log2 += data[i].item.id + ":" + data[i].num;
			
			//セットの格納
			var _leng = (data[i].set) ? data[i].set.length : 0;
			for( var j=0; j<_leng; j++ ) {
				_variables["ITEM"+_count] = data[i].set[j].item.id + "," + data[i].set[j].num;
				_count++;
				
				_log += "/" + data[i].set[j].item.name_1 + data[i].set[j].item.name_2;
				_log2 += ";" + data[i].set[j].item.id + ":" + data[i].set[j].num;
			}
			
			_log += "=" + data[i].num;
			
			
			//サブの格納
			var __leng = (data[i].sub) ? data[i].sub.length : 0;
			if(__leng) _log += ",";
			for( var k=0; k<__leng; k++ ) {
				_variables["ITEM"+_count] = data[i].sub[k].item.id + "," + data[i].sub[k].num;
				_count++;
				
				_log += "," + data[i].sub[k].item.name_1 + data[i].sub[k].item.name_2 + "=" + data[i].sub[k].num;
				_log2 += ";" + data[i].sub[k].item.id + ":" + data[i].sub[k].num;
			}

			//セットメニューの格納
			var sleng = (data[i].setmenu) ? data[i].setmenu.length : 0;
			for( var h=0; h<sleng; h ++ ) {
				var setmenu = data[i].setmenu[h];
				_variables["ITEM"+_count] = setmenu.item.id + "," + data[i].num;
				_count++;

				_log += "," + setmenu.item.name_1 + setmenu.item.name_2;

				var _sleng = (setmenu.set) ? setmenu.set.length : 0;
				for( var g=0; g<_sleng; g++ ) {
					_variables["ITEM"+_count] = setmenu.set[g].item.id + "," + data[i].num;
					_count++;
					
					_log += "/" + setmenu.set[g].item.name_1 + setmenu.set[g].item.name_2;
					_log2 += ";" + setmenu.set[g].item.id + ":" + data[i].num;
				}

				_log += "=" + data[i].num;
			}

			_log2_ary.push( _log2 );
		}
		
		_variables.COUNT = _count;

		if(date_bol){
			//2重オーダ対策(パラメータにDATEを持たせる対応)
			var _date = new Date();
			var wkMon = _date.getMonth() + 1;
			var wkDay = _date.getDate();
			_variables.DATE =  Date.create().format("{yyyy}{MM}{dd}{hh}{mm}{ss}"); 
		}
		
		//オーダーの開始
		var loaderObj = new Loader();
		var path = (Config.islocal) ? 'exec_order.xml' : 'exec_order';
		var callback = (Config.islocal) ? self.onLocalComplete : self.onComplete;

		self.localdata = data;
		
		if( checkin ) {
			path = (Config.islocal) ? "request_checkin.xml" : "request_checkin";	
			_variables.PERSONS = scope.person; //固定値
			loaderObj.load( window.apppath + path, _variables, callback, 'xml' );
		} else {
			loaderObj.load( window.apppath + path, _variables, callback, 'xml' );
		}

		scope.log.send("0","ORDER,注文します。,商品:" + _log + ",商品数:" + _variables.COUNT + ",送信先:" + path + ",言語:" + scope.alternate.language );

		scope.order_count++;
		$.each( _log2_ary, function( k, _l ) {
			scope.log.send("0","ORDER_LOG," + scope.order_count + "," + _l );
		} );
		console.log( _variables, scope.order_count );

		this.response = null;
	}



	/**
	 * オーダーの完了
	 * @param {[type]} data データ エラーはfalse
	 * @param {[type]} code エラーコード
	 * @param {[type]} error エラーデータ
	 */ 
	this.onComplete = function( data, code, error ) {

		// オーダーロックを解除
		self.oeder_suspend = false;

		if( data ) {
			//オーダーの完了
			self.response = $( data ).find("status").attr("code");
			self.callback();
			scope.log.send("0","ORDER,注文完了" );
		} else {
			//エラーハンドリング
			console.log( error )
			self.response = code;
			self.onError( error );
		}
		
	}


	/**
	 * onError
	 */ 
	this.onError = function( data ) {		

		// オーダーロックを解除
		self.oeder_suspend = false;

		var __code = "";
		var __description = "";

		//回転寿司の場合のみエラーの商品が取得できる
		var __item = (self.response == "5" || self.response == "9" ) ? $(data).find("spec desc").attr("value").split(",") : null;
		if( !empty(__item) && isNaN(__item[0]) ) __item = null; //OES版は品切れ商品が帰ってこない、文字列なため

		switch( self.response ){
			case "0":
				__code="1000";
				__description="VOES_SRV";
				scope.log.send("0","ORDER,疑似接続エラー," + __code + ",疑似OES" );
				break;
								
			case "1":
				__code="1001";
				__description="SLIP_NO";
				scope.log.send("0","ORDER,注文エラー," + __code + ",チェックインに失敗しました（伝票番号不正）");
				break;
				
			case "2":
				__code="1002";
				__description="PRICE_MAX";
				scope.log.send("0","ORDER,注文エラー," + __code + ",注文金額がPOS設定の金額を超えました");
				break;
				
			case "3":
				__code="1003";
				__description="COUNT_MAX";
				scope.log.send("0","ORDER,注文エラー," + __code + ",注文数量がPOS設定の数量を超えました");
				break;
				
			case "4":
				__code="1004";
				__description="CHECKKING";
				scope.log.send("0","ORDER,注文エラー," + __code + ",POSにて伝票がロックされています");
				break;
				
			case "5":
				__code="1005";
				__description="STOCK";
				scope.log.send("0","ORDER,注文エラー," + __code + ",注文商品に品切れ商品が含まれます");
				break;
				
			case "6":
				__code="1006";
				__description="SELECTMENU";
				scope.log.send("0","ORDER,注文エラー," + __code + ",サブメニューエラーが発生しています");
				break;
				
			case "7":
				__code="1007";
				__description="PRINTER";
				scope.log.send("0","ORDER,注文エラー," + __code + ",キッチンプリンタエラーが発生しています");
				//エラーコード7の場合にはカート内の商品を全てitemに追加
				__item = scope.cart.getCartAryProductAllId().split(",");
				break;
				
			case "8":
				__code="1008";
				__description="MASTER";
				scope.log.send("0","ORDER,注文エラー," + __code + ",商品マスタエラーが発生しています。（マスタなし）");
				break;
			
			case "9":
				__code="1009";
				__description="PRINTER";
				scope.log.send("0","ORDER,注文エラー," + __code + ",キッチンプリンタエラーが発生しています");
				break;
			
			
			case "100":
				__code="1100";
				__description="TRAFFICJAM";
				scope.log.send("0","ORDER,注文エラー," + __code + ",OES処理が込み合っており、オーダーを受け付けることが出来ません");
				break;
				
			case "101":
				__code="1101";
				__description="TIMEOUT";
				scope.log.send("0","ORDER,注文エラー," + __code + ",タイムアウトエラー（応答がありません）");
				break;
			
			case null:
				__code="5104";
				__description="exec_order";
				scope.log.send("0","ORDER,注文エラー," + __code + ",サーブレット異常");
				break;
			
			default:
				__code="1102";
				__description="UNKNOWN";
				scope.log.send("0","ORDER,注文エラー," + __code + ",その他のエラーが発生しています");
				break;
		}

		//エラーのコールバック
		self.error( __code, __item );

	}


	/**
	 * ローカル用debag
	 * 一定時間後に完了を発行
	 */ 
	this.onLocalComplete = function( data, code, error ) {

		//CheckOrderに格納
		scope.check_order.setLocalData( self.localdata );

		$.timer(function(){
			self.onComplete( data, code, error );
		}).once(3000);
	}
	
};;
/**
 * サイネージ
 */
var Sinage = function( scope ) {

	var self = this;
	var scope = scope;

	this.sinagedata;
	this.callback;

	this.checkin_time; //チェックイン時間
	//タイマー
	this.timer = $.timer(function(){ 
		self.setTimeUp();
	}); 
	this.timer.set({ time : 60000, autostart : false });
	this.timer_stop_bol; //タイマーの停止フラグ

	/**
	 * 起動
	 */
	this.init = function( callback ) {

		self.callback = callback;

		//sinageの読み込み
		var loaderObj = new Loader();
		loaderObj.load( window.datapath + "conf/sinage.xml" + chache(), null, self.loaded, 'xml' );

	};

	/**
	 * ロード完了
	 */
	this.loaded = function( data ) {
		if( !data ) {
			//error
			//self.message.show( "3005", "sinage.xml" );
			scope.sinage_bol = false;
			self.callback();
			return;
		}
		//パースする
		var contents = $( data ).find("contents");
		self.sinagedata = {
			enable:contents.attr( "enable" ),
			boot_timer:contents.attr( "boot_timer" ),
			mode:contents.attr( "mode" ),
			movie:{},
			roll:[]
		}

		if( contents.attr( "enable" ) == "true" ) {
			//movielistの取得
			var loaderObj = new Loader();
			loaderObj.load( window.moviepath + "movielist.xml" + chache(), null, self.loadedMovieList, 'xml' );
			scope.sinage_bol = true;
		} else {
			//サイネージの利用なし
			scope.sinage_bol = false;
			self.callback();
		}
	};

	/**
	 * ムービーリストの読み込み完了
	 */
	this.loadedMovieList = function( data ) {
		if( !data ) {
			//error
			//self.message.show( "3005", "movielist.xml" );
			scope.sinage_bol = false;
			self.callback();
			return;
		}
		//パースする
		var movie = $(data).find("movie");
		var m = {};
		$.each( movie, function( i, val ) {
			m[ $(val).attr("id") ] = {
				id:$(val).attr("id"),
				name:$(val).attr("name"),
				length:$(val).attr("length"),
				resume:$(val).attr("resume"),
				onTouch:$(val).attr("onTouch"),
				mCode:$(val).attr("mCode"),
				x:$(val).attr("x"),
				y:$(val).attr("y"),
				swf:$(val).attr("swf")
			}
		});

		self.sinagedata.movie = m;

		//rollの取得
		var loaderObj = new Loader();
		loaderObj.load( window.moviepath + "roll.xml" + chache(), null, self.loadedRoll, 'xml' );
	};

	/**
	 * ロールの取得
	 */
	this.loadedRoll = function( data ) {
		if( !data ) {
			//error
			//self.message.show( "3005", "roll.xml" );
			scope.sinage_bol = false;
			self.callback();
			return;
		}
		//パースする
		var roll = $(data).find("roll");
		var r = [];
		$.each( roll, function( i, val ) {
			var m = [];
			var mm = $(val).find("movie");
			$.each( mm, function( k, movie ) {
				var id = $(movie).attr("id");
				m.push( self.sinagedata.movie[id] );
			});

			var obj = {
				id:$(val).attr("id"),
				startTime:Number($(val).attr("startTime")),
				endTime:Number($(val).attr("endTime")),
				movie:m
			}
			r.push( obj );
		});

		self.sinagedata.roll = r;

		//ロード終了
		self.callback();
	};

	/**
	 * チェックイン
	 * タイマースタート
	 */
	this.setCheckin = function() {

		if( !scope.sinage_bol ) {
			self.timer.stop();
			return;
		}

		//現在時間を格納
		var checkin = new Date();
		self.checkin_time = checkin;
		var  boot_time = self.sinagedata.boot_timer * 1000;
		self.timer.set({ time : boot_time, autostart : true });
		self.timer_stop_bol = false;

		scope.log.send("0","SINAGE,タイマーを起動します。");
	};
	
	/**
	 * timeup
	 */
	this.setTimeUp = function() {

		console.log( "Sinage.setTimeUp" );

		//サイネージのチェック
		var now = Date.create();

		//rollはあるか
		var roll = new Array();
		var c1 = "";
		var c2  = "";
		$.each( self.sinagedata.roll, function( i, val ) {
			c1 =  self.checkin_time.clone().addMinutes( val.startTime );
			c2 =  self.checkin_time.clone().addMinutes( val.endTime );

			if( now.isBetween( c1, c2 ) ) {
				//再生対象
				var ids = $.map( val.movie, function( n, k ) {
					return 	n.id;
				});
				roll.push( ids.join() );
				//対象のrollは1つのみにする
				return false;
			}
		});

		if( roll.length ) {
			//再生動画あり
			if( self.sinagedata.mode == "fullscreen" ) {
				//フルスクリーン
				//TCSに通知
				scope.log.send("0","MOVIE,サイネージムービーを再生します。:" + roll.join() + ",チェックイン時間:" + c1 + " - " + c2 );
				window.registerRoll( scope.tableNo, roll.join() );
				window.play();
				//トップへ戻す
				scope.viewTop();
				//タイマーを停止
				self.stop();

			} else {
				//TODO
				//swfの読み込み
			}
		}
	};


	/**
	 * ムービーの再生終了
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	this.onTouchMovie = function( id ) {

		//タイマーを再開
		self.start();
		self.reset();

		if( id == "0" ) {
			//自動終了
			scope.log.send("0","SINAGE,終了します。,自動終了");
			scope.viewTop();
			return;
		}

		var mv = self.sinagedata.movie[id];

		scope.log.send("0","SINAGE,終了します。,タッチ終了,動画ID:" + id );

		if( empty( mv ) || mv.onTouch == "0" ) {
			scope.viewTop();
		} else {
			var code =mv.mCode;
			scope.category.setFindProduct( code );
		}
	}


	/**
	 * タイマーストップ
	 */
	this.stop = function() {
		self.timer.stop();
		self.timer_stop_bol = true;

		if(self.enable) scope.log.send("0","SINAGE,タイマーを停止します。");
	}

	/**
	 * タイマースタート
	 */
	this.start = function() {
		self.timer_stop_bol = false;

		if(self.enable) scope.log.send("0","SINAGE,タイマーを有効にします。");
	}

	/**
	 * タイマーリセット
	 */
	this.reset = function() {
		self.timer.reset().stop();
		if( scope.sinage_bol && !self.timer_stop_bol ) {
			self.timer.play();
		}
	}

};;
/**
 * Staff呼び出し
 * @param {[type]} scope [description]
 */
var StaffCall = function(scope) {

	var self = this;
	var scope = scope;

	this.close_timer; //自動で閉じるタイマー
	this.background_bol; //バックグラウンドで実行

	this.code_class; //セレクトコード
	this.select_data; //セレクトデータ
	this.selected_id = []; //選択セレクトデータ
	

	//クリックイベント
	$("#staff-call")._click(function() {

		//サブメニューのチェック
		var item =  scope.menudata.menumst[ Config.staffcall.id ];
		if( Config.staffcall.no_use_select !== true && item.select != "" ) {
			self.setStaffSelect();
			return;
		}

		if( Config.staffcall.confirmWin ) {
			//確認画面の表示
			scope.message.confirm( "staffcall_confirm", function() {
				self.send();
			});
		} else {
			self.send();
		}
	});

	//サブメニュー画面の注文
	$("#staffcall-select .order-btn")._click( function() {
		self.send( false, self.selected_id );
		self.hide();
	});

	//スタッフセレクトクローズボタン
	$("#staffcall-select .close-btn")._click(function() {
		self.hide();
	});

	//次へ
	$("#staffcall-select .prev")._click(function() {
		var list = $("#staffcall-select .box ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h * 2 ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	});
	//前へ
	$("#staffcall-select .next")._click(function() {
		var list = $("#staffcall-select .box ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() +  h * 2 ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	});
	

	//初期化
	$(document).bind("CHECKIN", function() {
		self.init();
	});

	this.init = function() {
		//無効化
		if( !Config.staffcall.btn_enable ) { //トップボタンがあるのでボタンを表示しない
			$("#staff-call").remove();
		} else if( !Config.staffcall.enable ) {
			$("#staff-call").hide().attr("disabled", true);
		} else {
			$("#staff-call").show().removeAttr("disabled");
		}
	}

	/**
	 * スタッフ呼び出し
	 * @return {[type]} [description]
	 */
	this.send = function( background_bol, sdata ) {

		var item =  scope.menudata.menumst[ Config.staffcall.id ];
		if( empty(item) ) {
			scope.log.send("0","スタッフコール,商品データが見つかりません。,商品ID:" +  Config.staffcall.id  );
			return;
		}
		var item_data = [{ 
			item:item,
			num:1,
			set:[],
			sub:(!empty(sdata)) ? sdata : [],
			staffcall:true
		}];
		
		var slip_no = ( Config.staffcall.exec_type == "TABLE_NO" ) ? scope.tableNo : scope.slipNo;
		//first_orderの場合にはslipnoを変更
		if( scope.first_order ) {
			var tbn = String(scope.tableNo).trim();
			tbn = "1000000".substr( 0, 7 - tbn.length ) + tbn;
			slip_no = ( Config.staffcall.exec_type == "TABLE_NO" ) ? scope.tableNo : tbn;


			//表示器がない場合、KPに新規オーダー
			if( !empty(Config.staffcall.first_order_kp) && Config.staffcall.first_order_kp ) {
				slip_no = "";
				item_data[0].staffcall = false;
			}
		}

		if( !background_bol ) {
			scope.log.send("0","スタッフコール,送信します。,商品ID:" + Config.staffcall.id + ",商品CODE:" + item.code + ",EXECTYPE:" +  Config.staffcall.exec_type );			
		} else {
			scope.log.send("0","スタッフコール,自動送信します。,商品ID:" + Config.staffcall.id + ",商品CODE:" + item.code + ",EXECTYPE:" +  Config.staffcall.exec_type );
		}
		

		if( item_data[0].staffcall ) {
			scope.order.setOrderRequest( slip_no, item_data, self.loaded, self.onError, Config.orderdate_insert );
		} else {
			//staffcallがfalseの場合は
			scope.order.setOrderRequest( slip_no, item_data, self.loaded, self.onError, Config.orderdate_insert, true );
		}
		

		self.background_bol = background_bol;
		if( !self.background_bol ) {
			scope.message.show( "staffcalling" );
		}
	}

	/**
	 * スタッフ呼び出しの完了
	 */
	 this.loaded = function() {
	 	if( self.background_bol ) return;

	 	scope.message.show( "staffcall_complete", null, null, function(){
	 		//クローズタイマーがある場合にはとめる
	 		if( !empty(self.close_timer) ) {
	 			self.close_timer.stop();
	 		}
	 	});
	 	if( Config.staffcall.auto_close ) {
	 		self.close_timer = $.timer(function(){
				//$("#order-complete").hide();
				scope.message.hide();
				self.close_timer.stop();
			}, Config.staffcall.close_time, true );
	 	}		
	 }

	/**
	 * ウェルカム画面スタッフコール
	 */
	this.loginCall = function( callback, error ) {
		var item =  { name_1:"スタッフコール", name_2:"", id:Config.staffcall.id, code:Config.staffcall.id }; //scope.menudata.menumst[ Config.staffcall.id ];
		if( empty(item) ) {
			scope.log.send("0","スタッフコール,商品データが見つかりません。" );
			return;
		}
		var item_data = [{ item:item, num:1, set:[], sub:[], staffcall:true }];
		var tbn = String(scope.tableNo).trim();
		tbn = "1000000".substr( 0, 7 - tbn.length ) + tbn;
		var slip_no = ( Config.staffcall.exec_type == "TABLE_NO" ) ? scope.tableNo : tbn;
		scope.order.setOrderRequest( slip_no, item_data, callback, error, Config.orderdate_insert );
		scope.message.show( "staffcalling" );
	}

	/**
	* スタッフ呼び出しのエラー
	*/
	this.onError = function( code, item ) {
		if( self.background_bol ) return;
		scope.message.show( "staffcall_error",  "exec_order" );
	}


	/**
	* スタッフ呼び出しのサブメニュー選択
	*/
	this.setStaffSelect = function() {

		var item =  scope.menudata.menumst[ Config.staffcall.id ];
		self.code_class = item.select;
		self.select_data =  scope.menudata.select[self.code_class];
		self.selected_id = [];

		var show_pic = self.select_data.option[0].show_pic;
		var is_class = ( show_pic == "1" ) ? "has_photo" : "";

		//ボタンの生成
		var html = "";
		$.each( self.select_data.option[0].member, function( i, option ) {
			var name = (empty(option.name_2)) ? option.name_1 : option.name_1 + "<br>" + option.name_2;
			html += '<li class="' + is_class + '"><button class="select-btn" data-id="' + option.id + '">';
			if( show_pic == "1" ) html += '<span><img src="design_cmn/product/LL/' + option.code + Config.product.type + '" class="image"></span>';
			html += '<span>' + name + '</span>';
			html += '</button>';
			html += self.getCounter(option.id, i);
			html += '</li>';
		});
		$("#staffcall-select .box ul").html( html );
		$("#staffcall-select .title").text( self.select_data.option[0].text );
		
		$("#staffcall-select .box button")._click( function( e ) {

			var id = $(this).data("id");
			var group = $(this).parents("li");
			if( $(this).hasClass("decrement") ) {

				var leng = self.selected_id.length;
				$.each( self.selected_id, function( k, sdata ) {
					if( sdata.item.id == id ) {
						sdata.num--;
						group.find(".counter").find("em").text( sdata.num );
						if( sdata.num == 0 ) {
							self.selected_id.splice(k,1);
							group.find(".counter").hide();
							group.find(".select-btn").removeClass("selected");
						}
						return false;
					}
				} );
				return;
			}

			var is_data = null;
			$.each(self.selected_id, function( i, data) {
				if( data.item.id == id ) {
					is_data = data;
					is_data.num++;
					return false;
				}

			});
			if( empty(is_data) ) {
				is_data = { item:scope.menudata.menumst[id], num:1 };
				self.selected_id.push( is_data );
			}
			
			group.find(".counter").show().find("em").text( is_data.num );
			//$("#staffcall-select .box button.selected").removeClass("selected");
			$(this).addClass("selected");

		} );
		$("#staffcall-select").show();
		self.setListBtn();
	}


	/**
	* [getCounter description]
	* @param {[type]} [varname] 数量変更ボタン
	* @return {[type]} [description]
	*/
	this.getCounter = function( id, index ) {

		var html = "";

		html += '<div class="counter">';
		html += '<button class="decrement" data-id="' + id + '" data-index="' + index + '" data-num="' + 0 + '">-</button>';
		html += '<span class="count"><em></em></span>';
		html += '<button class="increment" data-id="' + id + '" data-index="' + index + '" data-num="' + 0 + '">+</button>';
		html += '</div>';
		
		return html;
	}


	/**
	 * ボタンの表示セット
	 */
	this.setListBtn = function() {
		var target = $("#staffcall-select");
		var list = $("#staffcall-select .box ul");
		if( !list.get(0) ) return;

		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;
		if( list.scrollTop() >= max-1 || sh <= list.get(0).offsetHeight ) {
			target.find(".next").hide();
			list.scrollTop(max-1);
		} else {
			target.find(".next").show();
		}
		if( list.scrollTop() <= 1 || sh <= list.get(0).offsetHeight ) {
			target.find(".prev").hide();
			list.scrollTop(1);
		} else {
			target.find(".prev").show();
		}
	};

	/**
	* セレクト画面のクローズ
	*/
	this.hide = function() {

		self.code_class = null;
		self.select_data =  null;
		self.selected_id = [];
		$("#staffcall-select").hide();

	}



};;
var Sys = function( scope ) {

	var self = this;
	var scope = scope;

	this.data;
	this.callback; //ロード完了後のコールバック
	this.mode_data; //モードデータ

	/**
		起動
	*/
	this.init = function( callback ){
		self.callback = callback;

		var loaderObj = new Loader();
		loaderObj.load( window.datapath + "conf/sys.xml" + chache(), null, self.loaded, 'xml' );
	};

	/**
		sys.xmlのロード完了
	*/
	this.loaded = function( data ) {
		
		if( !data ) {
			//エラー
			scope.message.show( "3001", "sys.xml" );
			return;
		}

		self.data = data;

		Config.version = $( data ).find("version").attr("menu");

		//configのアップデート
		Config.max_value.total = Number( $( data ).find("max_value").attr("total") );
		Config.max_value.subtotal = Number( $( data ).find("max_value").attr("subtotal") );
		Config.max_value.alert = Number( $( data ).find("max_value").attr("alert") );
		Config.displayTableInfo = ( $( data ).find("displayTableInfo").attr("enable") == "true" );
		Config.include_tax.enable = ( $( data ).find("include_tax").attr("enable") == "true" );
		Config.include_tax.type = Number( $( data ).find("include_tax").attr("type") );
		Config.custompage.type = $( data ).find("custompage").attr("type");
		Config.staffcall.enable = ( $( data ).find("staffcall").attr("enable") == "true" );
		Config.staffcall.id = $( data ).find("staffcall").attr("id");
		Config.accountingcall.enable = ( $( data ).find("accountingcall").attr("enable") == "true" );
		Config.accountingcall.id = $( data ).find("accountingcall").attr("id");
		Config.terminal_checkin.enable = ( $( data ).find("terminal_checkin").attr("usage") == "true" );
		Config.terminal_checkin.inp_number = ( $( data ).find("terminal_checkin").attr("inp_number") == "true" );
		Config.timer.servlet = Number( $( data ).find("timer").attr("servlet") );

		if(!empty(self.callback)) {
			self.callback();
			self.callback = null;
		}
	};

	/**
		modeデータ
	*/
	this.mode = function( data ) {
		if( empty(data) ) {
			return self.mode_data
		} else {
			self.mode_data = data;
		}
	};

};/**
 * flipsnap.js
 *
 * @version  0.6.2
 * @url http://hokaccha.github.com/js-flipsnap/
 *
 * Copyright 2011 PixelGrid, Inc.
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function(window, document, undefined) {

var div = document.createElement('div');
var prefix = ['webkit', 'moz', 'o', 'ms'];
var saveProp = {};
var support = Flipsnap.support = {};
var gestureStart = false;
var sstime = false;

var DISTANCE_THRESHOLD = 5;
var ANGLE_THREHOLD = 55;

support.transform3d = hasProp([
  'perspectiveProperty',
  'WebkitPerspective',
  'MozPerspective',
  'OPerspective',
  'msPerspective'
]);

support.transform = hasProp([
  'transformProperty',
  'WebkitTransform',
  'MozTransform',
  'OTransform',
  'msTransform'
]);

support.transition = hasProp([
  'transitionProperty',
  'WebkitTransitionProperty',
  'MozTransitionProperty',
  'OTransitionProperty',
  'msTransitionProperty'
]);

support.addEventListener = 'addEventListener' in window;
support.mspointer = window.navigator.msPointerEnabled;
support.cssAnimation = (support.transform3d || support.transform) && support.transition;

var eventTypes = ['touch', 'mouse'];
var events = {
  start: {
    touch: 'touchstart',
    mouse: 'mousedown'
  },
  move: {
    touch: 'touchmove',
    mouse: 'mousemove'
  },
  end: {
    touch: 'touchend',
    mouse: 'mouseup'
  }
};

if (support.addEventListener) {
  document.addEventListener('gesturestart', function() {
    gestureStart = true;
  });

  document.addEventListener('gestureend', function() {
    gestureStart = false;
  });
}

function Flipsnap(element, opts) {
  return (this instanceof Flipsnap)
    ? this.init(element, opts)
    : new Flipsnap(element, opts);
}

Flipsnap.prototype.init = function(element, opts) {
  var self = this;

  // set element
  self.element = element;
  if (typeof element === 'string') {
    self.element = document.querySelector(element);
  }

  if (!self.element) {
    throw new Error('element not found');
  }

  if (support.mspointer) {
    self.element.style.msTouchAction = 'pan-y';
  }

  // set opts
  opts = opts || {};
  self.distance = opts.distance;
  self.maxPoint = opts.maxPoint;
  self.disableTouch = (opts.disableTouch === undefined) ? false : opts.disableTouch;
  self.disable3d = (opts.disable3d === undefined) ? false : opts.disable3d;

  if( opts.transitionDuration <= 10 ) opts.transitionDuration = 0;
  self.transitionDuration = (opts.transitionDuration === undefined) ? '350ms' : opts.transitionDuration + 'ms';


  //!!!
  support.cssAnimation = (opts.cssAnimation === undefined) ? support.cssAnimation : opts.cssAnimation;

  // set property
  self.currentPoint = 0;
  self.currentX = 0;
  self.animation = false;
  self.use3d = support.transform3d;
  if (self.disable3d === true) {
    self.use3d = false;
  }

  // set default style
  if (support.cssAnimation) {
    self._setStyle({
      transitionProperty: getCSSVal('transform'),
      transitionTimingFunction: 'cubic-bezier(0,0,0.25,1)',
      transitionDuration: '0ms',
      transform: self._getTranslate(0)
    });
  }
  else {
    self._setStyle({
      position: 'relative',
      left: '0px'
    });
  }

  // initilize
  self.refresh();

  eventTypes.forEach(function(type) {
    self.element.addEventListener(events.start[type], self, false);
  });

  return self;
};

Flipsnap.prototype.handleEvent = function(event) {
  var self = this;

  switch (event.type) {
    // start
    case events.start.touch: self._touchStart(event, 'touch'); break;
    case events.start.mouse: self._touchStart(event, 'mouse'); break;

    // move
    case events.move.touch: self._touchMove(event, 'touch'); break;
    case events.move.mouse: self._touchMove(event, 'mouse'); break;

    // end
    case events.end.touch: self._touchEnd(event, 'touch'); break;
    case events.end.mouse: self._touchEnd(event, 'mouse'); break;

    // click
    case 'click': self._click(event); break;
  }
};

Flipsnap.prototype.refresh = function() {
  var self = this;

  // setting max point
  self._maxPoint = (self.maxPoint === undefined) ? (function() {
    var childNodes = self.element.childNodes,
      itemLength = -1,
      i = 0,
      len = childNodes.length,
      node;
    for(; i < len; i++) {
      node = childNodes[i];
      if (node.nodeType === 1) {
        itemLength++;
      }
    }

    return itemLength;
  })() : self.maxPoint;

  // setting distance
  if (self.distance === undefined) {
    if (self._maxPoint < 0) {
      self._distance = 0;
    }
    else {
      self._distance = self.element.scrollWidth / (self._maxPoint + 1);
    }
  }
  else {
    self._distance = self.distance;
  }

  // setting maxX
  self._maxX = -self._distance * self._maxPoint;

  self.moveToPoint();
};

Flipsnap.prototype.hasNext = function() {
  var self = this;

  return self.currentPoint < self._maxPoint;
};

Flipsnap.prototype.hasPrev = function() {
  var self = this;

  return self.currentPoint > 0;
};

Flipsnap.prototype.toNext = function(transitionDuration) {
  var self = this;

  if (!self.hasNext()) {
    return;
  }

  self.moveToPoint(self.currentPoint + 1, transitionDuration);
};

Flipsnap.prototype.toPrev = function(transitionDuration) {
  var self = this;

  if (!self.hasPrev()) {
    return;
  }

  self.moveToPoint(self.currentPoint - 1, transitionDuration);
};

Flipsnap.prototype.moveToPoint = function(point, transitionDuration) {
  var self = this;
  
  transitionDuration = transitionDuration === undefined
    ? self.transitionDuration : transitionDuration + 'ms';

  var beforePoint = self.currentPoint;

  // not called from `refresh()`
  if (point === undefined) {
    point = self.currentPoint;
  }

  if (point < 0) {
    self.currentPoint = 0;
  }
  else if (point > self._maxPoint) {
    self.currentPoint = self._maxPoint;
  }
  else {
    self.currentPoint = parseInt(point, 10);
  }

  if (support.cssAnimation) {
    self._setStyle({ transitionDuration: transitionDuration });
  }
  else {
    //!!!
    self.animation = false; //true;
  }
  self._setX(- self.currentPoint * self._distance, transitionDuration);

  if (beforePoint !== self.currentPoint) { // is move?
    // `fsmoveend` is deprecated
    // `fspointmove` is recommend.
    self._triggerEvent('fsmoveend', true, false);
    self._triggerEvent('fspointmove', true, false);
  }
};

Flipsnap.prototype._setX = function(x, transitionDuration) {
  var self = this;

  self.currentX = x;
  if (support.cssAnimation) {
    self.element.style[ saveProp.transform ] = self._getTranslate(x);
  }
  else {
    if (self.animation) {

      self._animate(x, transitionDuration || self.transitionDuration);
    }
    else {
      self.element.style.left = x + 'px';
    }
  }
};

Flipsnap.prototype._touchStart = function(event, type) {
  var self = this;

  if (self.disableTouch || self.scrolling || gestureStart) {
    return;
  }

  self.element.addEventListener(events.move[type], self, false);
  document.addEventListener(events.end[type], self, false);

  var tagName = event.target.tagName;
  if (type === 'mouse' && tagName !== 'SELECT' && tagName !== 'INPUT' && tagName !== 'TEXTAREA' && tagName !== 'BUTTON') {
    event.preventDefault();
  }

  if (support.cssAnimation) {
    self._setStyle({ transitionDuration: '0ms' });
  }
  else {
    self.animation = false;
  }
  self.scrolling = true;
  self.moveReady = false;
  self.startPageX = getPage(event, 'pageX');
  self.startPageY = getPage(event, 'pageY');
  self.basePageX = self.startPageX;
  self.directionX = 0;
  self.startTime = event.timeStamp;
  self._triggerEvent('fstouchstart', true, false);

  sstime= true;
};

Flipsnap.prototype._touchMove = function(event, type) {
  var self = this;


  //!!!
  // if( sstime ) {
  //   sstime = false;
  //   var timer = setInterval(function() {
  //       sstime = true;
  //       clearInterval(timer);
      
  //   }, 10);
  // } else {
  //   return;
  // }
  // console.log("hogehoge", sstime)

  
  if (!self.scrolling || gestureStart) {
    return;
  }

  var pageX = getPage(event, 'pageX');
  var pageY = getPage(event, 'pageY');
  var distX;
  var newX;

  if (self.moveReady) {
    event.preventDefault();

    distX = pageX - self.basePageX;
    newX = self.currentX + distX;
    if (newX >= 0 || newX < self._maxX) {
      newX = Math.round(self.currentX + distX / 3);
    }

    // When distX is 0, use one previous value.
    // For android firefox. When touchend fired, touchmove also
    // fired and distX is certainly set to 0. 
    self.directionX =
      distX === 0 ? self.directionX :
      distX > 0 ? -1 : 1;

    // if they prevent us then stop it
    var isPrevent = !self._triggerEvent('fstouchmove', true, true, {
      delta: distX,
      direction: self.directionX
    });

    if (isPrevent) {
      self._touchAfter({
        moved: false,
        originalPoint: self.currentPoint,
        newPoint: self.currentPoint,
        cancelled: true
      });

    //!!!
    } else if( support.cssAnimation ) {
        self._setX(newX);
       
    } else {
        self.currentX = newX;
    }

  }
  else {
    // https://github.com/hokaccha/js-flipsnap/pull/36
    var triangle = getTriangleSide(self.startPageX, self.startPageY, pageX, pageY);
    if (triangle.z > DISTANCE_THRESHOLD) {
      if (getAngle(triangle) > ANGLE_THREHOLD) {
        event.preventDefault();
        self.moveReady = true;
        self.element.addEventListener('click', self, true);
      }
      else {
        self.scrolling = false;
      }
    }
  }

  self.basePageX = pageX;

};

Flipsnap.prototype._touchEnd = function(event, type) {
  var self = this;

  self.element.removeEventListener(events.move[type], self, false);
  document.removeEventListener(events.end[type], self, false);

  if (!self.scrolling) {
    return;
  }

  var newPoint = -self.currentX / self._distance;
  newPoint =
    (self.directionX > 0) ? Math.ceil(newPoint) :
    (self.directionX < 0) ? Math.floor(newPoint) :
    Math.round(newPoint);

  if (newPoint < 0) {
    newPoint = 0;
  }
  else if (newPoint > self._maxPoint) {
    newPoint = self._maxPoint;
  }

  self._touchAfter({
    moved: newPoint !== self.currentPoint,
    originalPoint: self.currentPoint,
    newPoint: newPoint,
    cancelled: false
  });

  self.moveToPoint(newPoint);
};

Flipsnap.prototype._click = function(event) {
  var self = this;

  event.stopPropagation();
  event.preventDefault();
};

Flipsnap.prototype._touchAfter = function(params) {
  var self = this;

  self.scrolling = false;
  self.moveReady = false;

  setTimeout(function() {
    self.element.removeEventListener('click', self, true);
  }, 200);

  self._triggerEvent('fstouchend', true, false, params);
};

Flipsnap.prototype._setStyle = function(styles) {
  var self = this;
  var style = self.element.style;

  for (var prop in styles) {
    setStyle(style, prop, styles[prop]);
  }
};

Flipsnap.prototype._animate = function(x, transitionDuration) {
  var self = this;

  var elem = self.element;
  var begin = +new Date();
  var from = parseInt(elem.style.left, 10);
  var to = x;
  var duration = parseInt(transitionDuration, 10);
  var easing = function(time, duration) {
    return -(time /= duration) * (time - 2);
  };
  var timer = setInterval(function() {
    var time = new Date() - begin;
    var pos, now;
    if (time > duration) {
      clearInterval(timer);
      now = to;
    }
    else {
      pos = easing(time, duration);
      now = pos * (to - from) + from;
    }
    elem.style.left = now + "px";
  }, 10);
};

Flipsnap.prototype.destroy = function() {
  var self = this;

  eventTypes.forEach(function(type) {
    self.element.removeEventListener(events.start[type], self, false);
  });
};

Flipsnap.prototype._getTranslate = function(x) {
  var self = this;

  return self.use3d
    ? 'translate3d(' + x + 'px, 0, 0)'
    : 'translate(' + x + 'px, 0)';
};

Flipsnap.prototype._triggerEvent = function(type, bubbles, cancelable, data) {
  var self = this;

  var ev = document.createEvent('Event');
  ev.initEvent(type, bubbles, cancelable);

  if (data) {
    for (var d in data) {
      if (data.hasOwnProperty(d)) {
        ev[d] = data[d];
      }
    }
  }

  return self.element.dispatchEvent(ev);
};

function getPage(event, page) {
  return event.changedTouches ? event.changedTouches[0][page] : event[page];
}

function hasProp(props) {
  return some(props, function(prop) {
    return div.style[ prop ] !== undefined;
  });
}

function setStyle(style, prop, val) {
  var _saveProp = saveProp[ prop ];
  if (_saveProp) {
    style[ _saveProp ] = val;
  }
  else if (style[ prop ] !== undefined) {
    saveProp[ prop ] = prop;
    style[ prop ] = val;
  }
  else {
    some(prefix, function(_prefix) {
      var _prop = ucFirst(_prefix) + ucFirst(prop);
      if (style[ _prop ] !== undefined) {
        saveProp[ prop ] = _prop;
        style[ _prop ] = val;
        return true;
      }
    });
  }
}

function getCSSVal(prop) {
  if (div.style[ prop ] !== undefined) {
    return prop;
  }
  else {
    var ret;
    some(prefix, function(_prefix) {
      var _prop = ucFirst(_prefix) + ucFirst(prop);
      if (div.style[ _prop ] !== undefined) {
        ret = '-' + _prefix + '-' + prop;
        return true;
      }
    });
    return ret;
  }
}

function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

function some(ary, callback) {
  for (var i = 0, len = ary.length; i < len; i++) {
    if (callback(ary[i], i)) {
      return true;
    }
  }
  return false;
}

function getTriangleSide(x1, y1, x2, y2) {
  var x = Math.abs(x1 - x2);
  var y = Math.abs(y1 - y2);
  var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

  return {
    x: x,
    y: y,
    z: z
  };
}

function getAngle(triangle) {
  var cos = triangle.y / triangle.z;
  var radina = Math.acos(cos);

  return 180 / (Math.PI / radina);
}

if (typeof exports == 'object') {
  module.exports = Flipsnap;
}
else if (typeof define == 'function' && define.amd) {
  define(function() {
    return Flipsnap;
  });
}
else {
  window.Flipsnap = Flipsnap;
}

})(window, window.document);
;/**
 * Flash (http://jquery.lukelutman.com/plugins/flash)
 * A jQuery plugin for embedding Flash movies.
 * 
 * Version 1.0
 * November 9th, 2006
 *
 * Copyright (c) 2006 Luke Lutman (http://www.lukelutman.com)
 * Dual licensed under the MIT and GPL licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-license.php
 * 
 * Inspired by:
 * SWFObject (http://blog.deconcept.com/swfobject/)
 * UFO (http://www.bobbyvandersluis.com/ufo/)
 * sIFR (http://www.mikeindustries.com/sifr/)
 * 
 * IMPORTANT: 
 * The packed version of jQuery breaks ActiveX control
 * activation in Internet Explorer. Use JSMin to minifiy
 * jQuery (see: http://jquery.lukelutman.com/plugins/flash#activex).
 *
 **/ 
;(function(){
	
var $$;

/**
 * 
 * @desc Replace matching elements with a flash movie.
 * @author Luke Lutman
 * @version 1.0.1
 *
 * @name flash
 * @param Hash htmlOptions Options for the embed/object tag.
 * @param Hash pluginOptions Options for detecting/updating the Flash plugin (optional).
 * @param Function replace Custom block called for each matched element if flash is installed (optional).
 * @param Function update Custom block called for each matched if flash isn't installed (optional).
 * @type jQuery
 *
 * @cat plugins/flash
 * 
 * @example $('#hello').flash({ src: 'hello.swf' });
 * @desc Embed a Flash movie.
 *
 * @example $('#hello').flash({ src: 'hello.swf' }, { version: 8 });
 * @desc Embed a Flash 8 movie.
 *
 * @example $('#hello').flash({ src: 'hello.swf' }, { expressInstall: true });
 * @desc Embed a Flash movie using Express Install if flash isn't installed.
 *
 * @example $('#hello').flash({ src: 'hello.swf' }, { update: false });
 * @desc Embed a Flash movie, don't show an update message if Flash isn't installed.
 *
**/
$$ = jQuery.fn.flash = function(htmlOptions, pluginOptions, replace, update) {
	
	// Set the default block.
	var block = replace || $$.replace;
	
	// Merge the default and passed plugin options.
	pluginOptions = $$.copy($$.pluginOptions, pluginOptions);
	
	// Detect Flash.
	if(!$$.hasFlash(pluginOptions.version)) {
		// Use Express Install (if specified and Flash plugin 6,0,65 or higher is installed).
		if(pluginOptions.expressInstall && $$.hasFlash(6,0,65)) {
			// Add the necessary flashvars (merged later).
			var expressInstallOptions = {
				flashvars: {  	
					MMredirectURL: location,
					MMplayerType: 'PlugIn',
					MMdoctitle: jQuery('title').text() 
				}					
			};
		// Ask the user to update (if specified).
		} else if (pluginOptions.update) {
			// Change the block to insert the update message instead of the flash movie.
			block = update || $$.update;
		// Fail
		} else {
			// The required version of flash isn't installed.
			// Express Install is turned off, or flash 6,0,65 isn't installed.
			// Update is turned off.
			// Return without doing anything.
			return this;
		}
	}
	
	// Merge the default, express install and passed html options.
	htmlOptions = $$.copy($$.htmlOptions, expressInstallOptions, htmlOptions);
	
	// Invoke $block (with a copy of the merged html options) for each element.
	return this.each(function(){
		block.call(this, $$.copy(htmlOptions));
	});
	
};
/**
 *
 * @name flash.copy
 * @desc Copy an arbitrary number of objects into a new object.
 * @type Object
 * 
 * @example $$.copy({ foo: 1 }, { bar: 2 });
 * @result { foo: 1, bar: 2 };
 *
**/
$$.copy = function() {
	var options = {}, flashvars = {};
	for(var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		if(arg == undefined) continue;
		jQuery.extend(options, arg);
		// don't clobber one flash vars object with another
		// merge them instead
		if(arg.flashvars == undefined) continue;
		jQuery.extend(flashvars, arg.flashvars);
	}
	options.flashvars = flashvars;
	return options;
};
/*
 * @name flash.hasFlash
 * @desc Check if a specific version of the Flash plugin is installed
 * @type Boolean
 *
**/
$$.hasFlash = function() {
	// look for a flag in the query string to bypass flash detection
	if(/hasFlash\=true/.test(location)) return true;
	if(/hasFlash\=false/.test(location)) return false;
	var pv = $$.hasFlash.playerVersion().match(/\d+/g);
	var rv = String([arguments[0], arguments[1], arguments[2]]).match(/\d+/g) || String($$.pluginOptions.version).match(/\d+/g);
	for(var i = 0; i < 3; i++) {
		pv[i] = parseInt(pv[i] || 0);
		rv[i] = parseInt(rv[i] || 0);
		// player is less than required
		if(pv[i] < rv[i]) return false;
		// player is greater than required
		if(pv[i] > rv[i]) return true;
	}
	// major version, minor version and revision match exactly
	return true;
};
/**
 *
 * @name flash.hasFlash.playerVersion
 * @desc Get the version of the installed Flash plugin.
 * @type String
 *
**/
$$.hasFlash.playerVersion = function() {
	// ie
	try {
		try {
			// avoid fp6 minor version lookup issues
			// see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
			var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
			try { axo.AllowScriptAccess = 'always';	} 
			catch(e) { return '6,0,0'; }				
		} catch(e) {}
		return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
	// other browsers
	} catch(e) {
		try {
			if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
				return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
			}
		} catch(e) {}		
	}
	return '0,0,0';
};
/**
 *
 * @name flash.htmlOptions
 * @desc The default set of options for the object or embed tag.
 *
**/
$$.htmlOptions = {
	height: 240,
	flashvars: {},
	pluginspage: 'http://www.adobe.com/go/getflashplayer',
	src: '#',
	type: 'application/x-shockwave-flash',
	width: 320		
};
/**
 *
 * @name flash.pluginOptions
 * @desc The default set of options for checking/updating the flash Plugin.
 *
**/
$$.pluginOptions = {
	expressInstall: false,
	update: true,
	version: '6.0.65'
};
/**
 *
 * @name flash.replace
 * @desc The default method for replacing an element with a Flash movie.
 *
**/
$$.replace = function(htmlOptions) {
	this.innerHTML = '<div class="alt">'+this.innerHTML+'</div>';
	jQuery(this)
		.addClass('flash-replaced')
		.prepend($$.transform(htmlOptions));
};
/**
 *
 * @name flash.update
 * @desc The default method for replacing an element with an update message.
 *
**/
$$.update = function(htmlOptions) {
	var url = String(location).split('?');
	url.splice(1,0,'?hasFlash=true&');
	url = url.join('');
	var msg = '<p>This content requires the Flash Player. <a href="http://www.adobe.com/go/getflashplayer">Download Flash Player</a>. Already have Flash Player? <a href="'+url+'">Click here.</a></p>';
	this.innerHTML = '<span class="alt">'+this.innerHTML+'</span>';
	jQuery(this)
		.addClass('flash-update')
		.prepend(msg);
};
/**
 *
 * @desc Convert a hash of html options to a string of attributes, using Function.apply(). 
 * @example toAttributeString.apply(htmlOptions)
 * @result foo="bar" foo="bar"
 *
**/
function toAttributeString() {
	var s = '';
	for(var key in this)
		if(typeof this[key] != 'function')
			s += key+'="'+this[key]+'" ';
	return s;		
};
/**
 *
 * @desc Convert a hash of flashvars to a url-encoded string, using Function.apply(). 
 * @example toFlashvarsString.apply(flashvarsObject)
 * @result foo=bar&foo=bar
 *
**/
function toFlashvarsString() {
	var s = '';
	for(var key in this)
		if(typeof this[key] != 'function')
			s += key+'='+encodeURIComponent(this[key])+'&';
	return s.replace(/&$/, '');		
};
/**
 *
 * @name flash.transform
 * @desc Transform a set of html options into an embed tag.
 * @type String 
 *
 * @example $$.transform(htmlOptions)
 * @result <embed src="foo.swf" ... />
 *
 * Note: The embed tag is NOT standards-compliant, but it 
 * works in all current browsers. flash.transform can be
 * overwritten with a custom function to generate more 
 * standards-compliant markup.
 *
**/
$$.transform = function(htmlOptions) {
	htmlOptions.toString = toAttributeString;
	if(htmlOptions.flashvars) htmlOptions.flashvars.toString = toFlashvarsString;
	return '<embed ' + String(htmlOptions) + '/>';		
};

/**
 *
 * Flash Player 9 Fix (http://blog.deconcept.com/2006/07/28/swfobject-143-released/)
 *
**/
if (window.attachEvent) {
	window.attachEvent("onbeforeunload", function(){
		__flash_unloadHandler = function() {};
		__flash_savedUnloadHandler = function() {};
	});
}
	
})();;/**
 * jquery.timer.js
 *
 * Copyright (c) 2011 Jason Chavannes <jason.chavannes@gmail.com>
 *
 * http://jchavannes.com/jquery-timer
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

;(function($) {
	$.timer = function(func, time, autostart) {	
	 	this.set = function(func, time, autostart) {
	 		this.init = true;
	 	 	if(typeof func == 'object') {
		 	 	var paramList = ['autostart', 'time'];
	 	 	 	for(var arg in paramList) {if(func[paramList[arg]] != undefined) {eval(paramList[arg] + " = func[paramList[arg]]");}};
 	 			func = func.action;
	 	 	}
	 	 	if(typeof func == 'function') {this.action = func;}
		 	if(!isNaN(time)) {this.intervalTime = time;}
		 	if(autostart && !this.isActive) {
			 	this.isActive = true;
			 	this.setTimer();
		 	}
		 	return this;
	 	};
	 	this.once = function(time) {
			var timer = this;
	 	 	if(isNaN(time)) {time = 0;}
			window.setTimeout(function() {timer.action();}, time);
	 		return this;
	 	};
		this.play = function(reset) {
			if(!this.isActive) {
				if(reset) {this.setTimer();}
				else {this.setTimer(this.remaining);}
				this.isActive = true;
			}
			return this;
		};
		this.pause = function() {
			if(this.isActive) {
				this.isActive = false;
				this.remaining -= new Date() - this.last;
				this.clearTimer();
			}
			return this;
		};
		this.stop = function() {
			this.isActive = false;
			this.remaining = this.intervalTime;
			this.clearTimer();
			return this;
		};
		this.toggle = function(reset) {
			if(this.isActive) {this.pause();}
			else if(reset) {this.play(true);}
			else {this.play();}
			return this;
		};
		this.reset = function() {
			this.isActive = false;
			this.play(true);
			return this;
		};
		this.clearTimer = function() {
			window.clearTimeout(this.timeoutObject);
		};
	 	this.setTimer = function(time) {
			var timer = this;
	 	 	if(typeof this.action != 'function') {return;}
	 	 	if(isNaN(time)) {time = this.intervalTime;}
		 	this.remaining = time;
	 	 	this.last = new Date();
			this.clearTimer();
			this.timeoutObject = window.setTimeout(function() {timer.go();}, time);
		};
	 	this.go = function() {
	 		if(this.isActive) {
	 			this.action();
	 			this.setTimer();
	 		}
	 	};
	 	
	 	if(this.init) {
	 		return new $.timer(func, time, autostart);
	 	} else {
			this.set(func, time, autostart);
	 		return this;
	 	}
	};
})(jQuery);;/**
 * 細かいjQuery pluginなど
 */
//表示チェック
$.fn.isVisible = function() {
	if( !this[0] ) return false;
	return $.expr.filters.visible(this[0]);
};

$.fn.isTablet = function() {
	var userAgent = window.navigator.userAgent.toLowerCase();
	if( userAgent.indexOf('android') > 0) {
		return 'android';
	} else if( userAgent.indexOf('ipad') > 0 || userAgent.indexOf('iphone') > 0 ) {
		return 'ipad';
	} else if( userAgent.indexOf('openwebkitsharp') > 0 ) {
		return 'windowstabret';
	} else if( userAgent.indexOf('windows nt') > 0 ) {
		return 'windowstabret_ie';
	}
	return false;
};;/*
 *  Sugar Library v1.4.1
 *
 *  Freely distributable and licensed under the MIT-style license.
 *  Copyright (c) 2013 Andrew Plummer
 *  http://sugarjs.com/
 *
 * ---------------------------- */
(function(){function aa(a){return function(){return a}}
var m=Object,p=Array,q=RegExp,r=Date,s=String,t=Number,u=Math,ba="undefined"!==typeof global?global:this,v=m.prototype.toString,da=m.prototype.hasOwnProperty,ea=m.defineProperty&&m.defineProperties,fa="function"===typeof q(),ga=!("0"in new s("a")),ia={},ja=/^\[object Date|Array|String|Number|RegExp|Boolean|Arguments\]$/,w="Boolean Number String Array Date RegExp Function".split(" "),la=ka("boolean",w[0]),y=ka("number",w[1]),z=ka("string",w[2]),A=ma(w[3]),C=ma(w[4]),D=ma(w[5]),F=ma(w[6]);
function ma(a){var b="Array"===a&&p.isArray||function(b,d){return(d||v.call(b))==="[object "+a+"]"};return ia[a]=b}function ka(a,b){function c(c){return G(c)?v.call(c)==="[object "+b+"]":typeof c===a}return ia[b]=c}
function na(a){a.SugarMethods||(oa(a,"SugarMethods",{}),H(a,!1,!0,{extend:function(b,c,d){H(a,!1!==d,c,b)},sugarRestore:function(){return pa(this,a,arguments,function(a,c,d){oa(a,c,d.method)})},sugarRevert:function(){return pa(this,a,arguments,function(a,c,d){d.existed?oa(a,c,d.original):delete a[c]})}}))}function H(a,b,c,d){var e=b?a.prototype:a;na(a);I(d,function(d,f){var h=e[d],l=J(e,d);F(c)&&h&&(f=qa(h,f,c));!1===c&&h||oa(e,d,f);a.SugarMethods[d]={method:f,existed:l,original:h,instance:b}})}
function K(a,b,c,d,e){var g={};d=z(d)?d.split(","):d;d.forEach(function(a,b){e(g,a,b)});H(a,b,c,g)}function pa(a,b,c,d){var e=0===c.length,g=L(c),f=!1;I(b.SugarMethods,function(b,c){if(e||-1!==g.indexOf(b))f=!0,d(c.instance?a.prototype:a,b,c)});return f}function qa(a,b,c){return function(d){return c.apply(this,arguments)?b.apply(this,arguments):a.apply(this,arguments)}}function oa(a,b,c){ea?m.defineProperty(a,b,{value:c,configurable:!0,enumerable:!1,writable:!0}):a[b]=c}
function L(a,b,c){var d=[];c=c||0;var e;for(e=a.length;c<e;c++)d.push(a[c]),b&&b.call(a,a[c],c);return d}function sa(a,b,c){var d=a[c||0];A(d)&&(a=d,c=0);L(a,b,c)}function ta(a){if(!a||!a.call)throw new TypeError("Callback is not callable");}function M(a){return void 0!==a}function N(a){return void 0===a}function J(a,b){return!!a&&da.call(a,b)}function G(a){return!!a&&("object"===typeof a||fa&&D(a))}function ua(a){var b=typeof a;return null==a||"string"===b||"number"===b||"boolean"===b}
function va(a,b){b=b||v.call(a);try{if(a&&a.constructor&&!J(a,"constructor")&&!J(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}return!!a&&"[object Object]"===b&&"hasOwnProperty"in a}function I(a,b){for(var c in a)if(J(a,c)&&!1===b.call(a,c,a[c],a))break}function wa(a,b){for(var c=0;c<a;c++)b(c)}function xa(a,b){I(b,function(c){a[c]=b[c]});return a}function ya(a){ua(a)&&(a=m(a));if(ga&&z(a))for(var b=a,c=0,d;d=b.charAt(c);)b[c++]=d;return a}function O(a){xa(this,ya(a))}
O.prototype.constructor=m;var P=u.abs,za=u.pow,Aa=u.ceil,Q=u.floor,R=u.round,Ca=u.min,S=u.max;function Da(a,b,c){var d=za(10,P(b||0));c=c||R;0>b&&(d=1/d);return c(a*d)/d}var Ea=48,Fa=57,Ga=65296,Ha=65305,Ia=".",Ja="",Ka={},La;function Ma(){return"\t\n\x0B\f\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u2028\u2029\u3000\ufeff"}function Na(a,b){var c="";for(a=a.toString();0<b;)if(b&1&&(c+=a),b>>=1)a+=a;return c}
function Oa(a,b){var c,d;c=a.replace(La,function(a){a=Ka[a];a===Ia&&(d=!0);return a});return d?parseFloat(c):parseInt(c,b||10)}function T(a,b,c,d){d=P(a).toString(d||10);d=Na("0",b-d.replace(/\.\d+/,"").length)+d;if(c||0>a)d=(0>a?"-":"+")+d;return d}function Pa(a){if(11<=a&&13>=a)return"th";switch(a%10){case 1:return"st";case 2:return"nd";case 3:return"rd";default:return"th"}}
function Qa(a,b){function c(a,c){if(a||-1<b.indexOf(c))d+=c}var d="";b=b||"";c(a.multiline,"m");c(a.ignoreCase,"i");c(a.global,"g");c(a.u,"y");return d}function Ra(a){z(a)||(a=s(a));return a.replace(/([\\/\'*+?|()\[\]{}.^$])/g,"\\$1")}function U(a,b){return a["get"+(a._utc?"UTC":"")+b]()}function Sa(a,b,c){return a["set"+(a._utc&&"ISOWeek"!=b?"UTC":"")+b](c)}
function Ta(a,b){var c=typeof a,d,e,g,f,h,l,n;if("string"===c)return a;g=v.call(a);d=va(a,g);e=A(a,g);if(null!=a&&d||e){b||(b=[]);if(1<b.length)for(l=b.length;l--;)if(b[l]===a)return"CYC";b.push(a);d=a.valueOf()+s(a.constructor);f=e?a:m.keys(a).sort();l=0;for(n=f.length;l<n;l++)h=e?l:f[l],d+=h+Ta(a[h],b);b.pop()}else d=-Infinity===1/a?"-0":s(a&&a.valueOf?a.valueOf():a);return c+g+d}function Ua(a,b){return a===b?0!==a||1/a===1/b:Va(a)&&Va(b)?Ta(a)===Ta(b):!1}
function Va(a){var b=v.call(a);return ja.test(b)||va(a,b)}function Wa(a,b,c){var d,e=a.length,g=b.length,f=!1!==b[g-1];if(!(g>(f?1:2)))return Xa(a,e,b[0],f,c);d=[];L(b,function(b){if(la(b))return!1;d.push(Xa(a,e,b,f,c))});return d}function Xa(a,b,c,d,e){d&&(c%=b,0>c&&(c=b+c));return e?a.charAt(c):a[c]}function Ya(a,b){K(b,!0,!1,a,function(a,b){a[b+("equal"===b?"s":"")]=function(){return m[b].apply(null,[this].concat(L(arguments)))}})}na(m);I(w,function(a,b){na(ba[b])});var Za,$a;
for($a=0;9>=$a;$a++)Za=s.fromCharCode($a+Ga),Ja+=Za,Ka[Za]=s.fromCharCode($a+Ea);Ka[","]="";Ka["\uff0e"]=Ia;Ka[Ia]=Ia;La=q("["+Ja+"\uff0e,"+Ia+"]","g");
"use strict";H(m,!1,!1,{keys:function(a){var b=[];if(!G(a)&&!D(a)&&!F(a))throw new TypeError("Object required");I(a,function(a){b.push(a)});return b}});
function ab(a,b,c,d){var e=a.length,g=-1==d,f=g?e-1:0;c=isNaN(c)?f:parseInt(c>>0);0>c&&(c=e+c);if(!g&&0>c||g&&c>=e)c=f;for(;g&&0<=c||!g&&c<e;){if(a[c]===b)return c;c+=d}return-1}function bb(a,b,c,d){var e=a.length,g=0,f=M(c);ta(b);if(0!=e||f)f||(c=a[d?e-1:g],g++);else throw new TypeError("Reduce called on empty array with no initial value");for(;g<e;)f=d?e-g-1:g,f in a&&(c=b(c,a[f],f,a)),g++;return c}function cb(a){if(0===a.length)throw new TypeError("First argument must be defined");}H(p,!1,!1,{isArray:function(a){return A(a)}});
H(p,!0,!1,{every:function(a,b){var c=this.length,d=0;for(cb(arguments);d<c;){if(d in this&&!a.call(b,this[d],d,this))return!1;d++}return!0},some:function(a,b){var c=this.length,d=0;for(cb(arguments);d<c;){if(d in this&&a.call(b,this[d],d,this))return!0;d++}return!1},map:function(a,b){b=arguments[1];var c=this.length,d=0,e=Array(c);for(cb(arguments);d<c;)d in this&&(e[d]=a.call(b,this[d],d,this)),d++;return e},filter:function(a){var b=arguments[1],c=this.length,d=0,e=[];for(cb(arguments);d<c;)d in
this&&a.call(b,this[d],d,this)&&e.push(this[d]),d++;return e},indexOf:function(a,b){return z(this)?this.indexOf(a,b):ab(this,a,b,1)},lastIndexOf:function(a,b){return z(this)?this.lastIndexOf(a,b):ab(this,a,b,-1)},forEach:function(a,b){var c=this.length,d=0;for(ta(a);d<c;)d in this&&a.call(b,this[d],d,this),d++},reduce:function(a,b){return bb(this,a,b)},reduceRight:function(a,b){return bb(this,a,b,!0)}});
H(Function,!0,!1,{bind:function(a){var b=this,c=L(arguments,null,1),d;if(!F(this))throw new TypeError("Function.prototype.bind called on a non-function");d=function(){return b.apply(b.prototype&&this instanceof b?this:a,c.concat(L(arguments)))};d.prototype=this.prototype;return d}});H(r,!1,!1,{now:function(){return(new r).getTime()}});
(function(){var a=Ma().match(/^\s+$/);try{s.prototype.trim.call([1])}catch(b){a=!1}H(s,!0,!a,{trim:function(){return this.toString().trimLeft().trimRight()},trimLeft:function(){return this.replace(q("^["+Ma()+"]+"),"")},trimRight:function(){return this.replace(q("["+Ma()+"]+$"),"")}})})();
(function(){var a=new r(r.UTC(1999,11,31)),a=a.toISOString&&"1999-12-31T00:00:00.000Z"===a.toISOString();K(r,!0,!a,"toISOString,toJSON",function(a,c){a[c]=function(){return T(this.getUTCFullYear(),4)+"-"+T(this.getUTCMonth()+1,2)+"-"+T(this.getUTCDate(),2)+"T"+T(this.getUTCHours(),2)+":"+T(this.getUTCMinutes(),2)+":"+T(this.getUTCSeconds(),2)+"."+T(this.getUTCMilliseconds(),3)+"Z"}})})();
"use strict";function db(a){a=q(a);return function(b){return a.test(b)}}
function eb(a){var b=a.getTime();return function(a){return!(!a||!a.getTime)&&a.getTime()===b}}function fb(a){return function(b,c,d){return b===a||a.call(this,b,c,d)}}function gb(a){return function(b,c,d){return b===a||a.call(d,c,b,d)}}function hb(a,b){var c={};return function(d,e,g){var f;if(!G(d))return!1;for(f in a)if(c[f]=c[f]||ib(a[f],b),!1===c[f].call(g,d[f],e,g))return!1;return!0}}function jb(a){return function(b){return b===a||Ua(b,a)}}
function ib(a,b){if(!ua(a)){if(D(a))return db(a);if(C(a))return eb(a);if(F(a))return b?gb(a):fb(a);if(va(a))return hb(a,b)}return jb(a)}function kb(a,b,c,d){return b?b.apply?b.apply(c,d||[]):F(a[b])?a[b].call(a):a[b]:a}function V(a,b,c,d){var e=+a.length;0>c&&(c=a.length+c);c=isNaN(c)?0:c;for(!0===d&&(e+=c);c<e;){d=c%a.length;if(!(d in a)){lb(a,b,c);break}if(!1===b.call(a,a[d],d,a))break;c++}}
function lb(a,b,c){var d=[],e;for(e in a)e in a&&(e>>>0==e&&4294967295!=e)&&e>=c&&d.push(parseInt(e));d.sort().each(function(c){return b.call(a,a[c],c,a)})}function mb(a,b,c,d,e,g){var f,h,l;0<a.length&&(l=ib(b),V(a,function(b,c){if(l.call(g,b,c,a))return f=b,h=c,!1},c,d));return e?h:f}function nb(a,b){var c=[],d={},e;V(a,function(g,f){e=b?kb(g,b,a,[g,f,a]):g;ob(d,e)||c.push(g)});return c}
function pb(a,b,c){var d=[],e={};b.each(function(a){ob(e,a)});a.each(function(a){var b=Ta(a),h=!Va(a);if(qb(e,b,a,h)!==c){var l=0;if(h)for(b=e[b];l<b.length;)b[l]===a?b.splice(l,1):l+=1;else delete e[b];d.push(a)}});return d}function rb(a,b,c){b=b||Infinity;c=c||0;var d=[];V(a,function(a){A(a)&&c<b?d=d.concat(rb(a,b,c+1)):d.push(a)});return d}function sb(a){var b=[];L(a,function(a){b=b.concat(a)});return b}function qb(a,b,c,d){var e=b in a;d&&(a[b]||(a[b]=[]),e=-1!==a[b].indexOf(c));return e}
function ob(a,b){var c=Ta(b),d=!Va(b),e=qb(a,c,b,d);d?a[c].push(b):a[c]=b;return e}function tb(a,b,c,d){var e,g,f,h=[],l="max"===c,n="min"===c,x=p.isArray(a);for(e in a)if(a.hasOwnProperty(e)){c=a[e];f=kb(c,b,a,x?[c,parseInt(e),a]:[]);if(N(f))throw new TypeError("Cannot compare with undefined");if(f===g)h.push(c);else if(N(g)||l&&f>g||n&&f<g)h=[c],g=f}x||(h=rb(h,1));return d?h:h[0]}
function ub(a,b){var c,d,e,g,f=0,h=0;c=p[xb];d=p[yb];var l=p[zb],n=p[Ab],x=p[Bb];a=Cb(a,c,d);b=Cb(b,c,d);do c=a.charAt(f),e=l[c]||c,c=b.charAt(f),g=l[c]||c,c=e?n.indexOf(e):null,d=g?n.indexOf(g):null,-1===c||-1===d?(c=a.charCodeAt(f)||null,d=b.charCodeAt(f)||null,x&&((c>=Ea&&c<=Fa||c>=Ga&&c<=Ha)&&(d>=Ea&&d<=Fa||d>=Ga&&d<=Ha))&&(c=Oa(a.slice(f)),d=Oa(b.slice(f)))):(e=e!==a.charAt(f),g=g!==b.charAt(f),e!==g&&0===h&&(h=e-g)),f+=1;while(null!=c&&null!=d&&c===d);return c===d?h:c-d}
function Cb(a,b,c){z(a)||(a=s(a));c&&(a=a.toLowerCase());b&&(a=a.replace(b,""));return a}var Ab="AlphanumericSortOrder",xb="AlphanumericSortIgnore",yb="AlphanumericSortIgnoreCase",zb="AlphanumericSortEquivalents",Bb="AlphanumericSortNatural";H(p,!1,!0,{create:function(){var a=[];L(arguments,function(b){if(!ua(b)&&"length"in b&&("[object Arguments]"===v.call(b)||b.callee)||!ua(b)&&"length"in b&&!z(b)&&!va(b))b=p.prototype.slice.call(b,0);a=a.concat(b)});return a}});
H(p,!0,!1,{find:function(a,b){ta(a);return mb(this,a,0,!1,!1,b)},findIndex:function(a,b){var c;ta(a);c=mb(this,a,0,!1,!0,b);return N(c)?-1:c}});
H(p,!0,!0,{findFrom:function(a,b,c){return mb(this,a,b,c)},findIndexFrom:function(a,b,c){b=mb(this,a,b,c,!0);return N(b)?-1:b},findAll:function(a,b,c){var d=[],e;0<this.length&&(e=ib(a),V(this,function(a,b,c){e(a,b,c)&&d.push(a)},b,c));return d},count:function(a){return N(a)?this.length:this.findAll(a).length},removeAt:function(a,b){if(N(a))return this;N(b)&&(b=a);this.splice(a,b-a+1);return this},include:function(a,b){return this.clone().add(a,b)},exclude:function(){return p.prototype.remove.apply(this.clone(),
arguments)},clone:function(){return xa([],this)},unique:function(a){return nb(this,a)},flatten:function(a){return rb(this,a)},union:function(){return nb(this.concat(sb(arguments)))},intersect:function(){return pb(this,sb(arguments),!1)},subtract:function(a){return pb(this,sb(arguments),!0)},at:function(){return Wa(this,arguments)},first:function(a){if(N(a))return this[0];0>a&&(a=0);return this.slice(0,a)},last:function(a){return N(a)?this[this.length-1]:this.slice(0>this.length-a?0:this.length-a)},
from:function(a){return this.slice(a)},to:function(a){N(a)&&(a=this.length);return this.slice(0,a)},min:function(a,b){return tb(this,a,"min",b)},max:function(a,b){return tb(this,a,"max",b)},least:function(a,b){return tb(this.groupBy.apply(this,[a]),"length","min",b)},most:function(a,b){return tb(this.groupBy.apply(this,[a]),"length","max",b)},sum:function(a){a=a?this.map(a):this;return 0<a.length?a.reduce(function(a,c){return a+c}):0},average:function(a){a=a?this.map(a):this;return 0<a.length?a.sum()/
a.length:0},inGroups:function(a,b){var c=1<arguments.length,d=this,e=[],g=Aa(this.length/a);wa(a,function(a){a*=g;var h=d.slice(a,a+g);c&&h.length<g&&wa(g-h.length,function(){h=h.add(b)});e.push(h)});return e},inGroupsOf:function(a,b){var c=[],d=this.length,e=this,g;if(0===d||0===a)return e;N(a)&&(a=1);N(b)&&(b=null);wa(Aa(d/a),function(d){for(g=e.slice(a*d,a*d+a);g.length<a;)g.push(b);c.push(g)});return c},isEmpty:function(){return 0==this.compact().length},sortBy:function(a,b){var c=this.clone();
c.sort(function(d,e){var g,f;g=kb(d,a,c,[d]);f=kb(e,a,c,[e]);return(z(g)&&z(f)?ub(g,f):g<f?-1:g>f?1:0)*(b?-1:1)});return c},randomize:function(){for(var a=this.concat(),b=a.length,c,d;b;)c=u.random()*b|0,d=a[--b],a[b]=a[c],a[c]=d;return a},zip:function(){var a=L(arguments);return this.map(function(b,c){return[b].concat(a.map(function(a){return c in a?a[c]:null}))})},sample:function(a){var b=this.randomize();return 0<arguments.length?b.slice(0,a):b[0]},each:function(a,b,c){V(this,a,b,c);return this},
add:function(a,b){if(!y(t(b))||isNaN(b))b=this.length;p.prototype.splice.apply(this,[b,0].concat(a));return this},remove:function(){var a=this;L(arguments,function(b){var c=0;for(b=ib(b);c<a.length;)b(a[c],c,a)?a.splice(c,1):c++});return a},compact:function(a){var b=[];V(this,function(c){A(c)?b.push(c.compact()):a&&c?b.push(c):a||(null==c||c.valueOf()!==c.valueOf())||b.push(c)});return b},groupBy:function(a,b){var c=this,d={},e;V(c,function(b,f){e=kb(b,a,c,[b,f,c]);d[e]||(d[e]=[]);d[e].push(b)});
b&&I(d,b);return d},none:function(){return!this.any.apply(this,arguments)}});H(p,!0,!0,{all:p.prototype.every,any:p.prototype.some,insert:p.prototype.add});function Db(a,b){K(m,!1,!0,a,function(a,d){a[d]=function(a,c,f){var h=m.keys(ya(a)),l;b||(l=ib(c,!0));f=p.prototype[d].call(h,function(d){var f=a[d];return b?kb(f,c,a,[d,f,a]):l(f,d,a)},f);A(f)&&(f=f.reduce(function(b,c){b[c]=a[c];return b},{}));return f}});Ya(a,O)}
H(m,!1,!0,{map:function(a,b){var c={},d,e;for(d in a)J(a,d)&&(e=a[d],c[d]=kb(e,b,a,[d,e,a]));return c},reduce:function(a){var b=m.keys(ya(a)).map(function(b){return a[b]});return b.reduce.apply(b,L(arguments,null,1))},each:function(a,b){ta(b);I(a,b);return a},size:function(a){return m.keys(ya(a)).length}});var Eb="any all none count find findAll isEmpty".split(" "),Fb="sum average min max least most".split(" "),Gb=["map","reduce","size"],Hb=Eb.concat(Fb).concat(Gb);
(function(){function a(){var a=arguments;return 0<a.length&&!F(a[0])}var b=p.prototype.map;K(p,!0,a,"every,all,some,filter,any,none,find,findIndex",function(a,b){var e=p.prototype[b];a[b]=function(a){var b=ib(a);return e.call(this,function(a,c){return b(a,c,this)})}});H(p,!0,a,{map:function(a){return b.call(this,function(b,e){return kb(b,a,this,[b,e,this])})}})})();
(function(){p[Ab]="A\u00c1\u00c0\u00c2\u00c3\u0104BC\u0106\u010c\u00c7D\u010e\u00d0E\u00c9\u00c8\u011a\u00ca\u00cb\u0118FG\u011eH\u0131I\u00cd\u00cc\u0130\u00ce\u00cfJKL\u0141MN\u0143\u0147\u00d1O\u00d3\u00d2\u00d4PQR\u0158S\u015a\u0160\u015eT\u0164U\u00da\u00d9\u016e\u00db\u00dcVWXY\u00ddZ\u0179\u017b\u017d\u00de\u00c6\u0152\u00d8\u00d5\u00c5\u00c4\u00d6".split("").map(function(a){return a+a.toLowerCase()}).join("");var a={};V("A\u00c1\u00c0\u00c2\u00c3\u00c4 C\u00c7 E\u00c9\u00c8\u00ca\u00cb I\u00cd\u00cc\u0130\u00ce\u00cf O\u00d3\u00d2\u00d4\u00d5\u00d6 S\u00df U\u00da\u00d9\u00db\u00dc".split(" "),
function(b){var c=b.charAt(0);V(b.slice(1).split(""),function(b){a[b]=c;a[b.toLowerCase()]=c.toLowerCase()})});p[Bb]=!0;p[yb]=!0;p[zb]=a})();Db(Eb);Db(Fb,!0);Ya(Gb,O);p.AlphanumericSort=ub;
"use strict";
var W,Ib,Jb="ampm hour minute second ampm utc offset_sign offset_hours offset_minutes ampm".split(" "),Kb="({t})?\\s*(\\d{1,2}(?:[,.]\\d+)?)(?:{h}([0-5]\\d(?:[,.]\\d+)?)?{m}(?::?([0-5]\\d(?:[,.]\\d+)?){s})?\\s*(?:({t})|(Z)|(?:([+-])(\\d{2,2})(?::?(\\d{2,2}))?)?)?|\\s*({t}))",Lb={},Mb,Nb,Ob,Pb=[],Qb={},X={yyyy:function(a){return U(a,"FullYear")},yy:function(a){return U(a,"FullYear")%100},ord:function(a){a=U(a,"Date");return a+Pa(a)},tz:function(a){return a.getUTCOffset()},isotz:function(a){return a.getUTCOffset(!0)},
Z:function(a){return a.getUTCOffset()},ZZ:function(a){return a.getUTCOffset().replace(/(\d{2})$/,":$1")}},Rb=[{name:"year",method:"FullYear",k:!0,b:function(a){return 864E5*(365+(a?a.isLeapYear()?1:0:0.25))}},{name:"month",error:0.919,method:"Month",k:!0,b:function(a,b){var c=30.4375,d;a&&(d=a.daysInMonth(),b<=d.days()&&(c=d));return 864E5*c}},{name:"week",method:"ISOWeek",b:aa(6048E5)},{name:"day",error:0.958,method:"Date",k:!0,b:aa(864E5)},{name:"hour",method:"Hours",b:aa(36E5)},{name:"minute",
method:"Minutes",b:aa(6E4)},{name:"second",method:"Seconds",b:aa(1E3)},{name:"millisecond",method:"Milliseconds",b:aa(1)}],Sb={};function Tb(a){xa(this,a);this.g=Pb.concat()}
Tb.prototype={getMonth:function(a){return y(a)?a-1:this.months.indexOf(a)%12},getWeekday:function(a){return this.weekdays.indexOf(a)%7},addFormat:function(a,b,c,d,e){var g=c||[],f=this,h;a=a.replace(/\s+/g,"[,. ]*");a=a.replace(/\{([^,]+?)\}/g,function(a,b){var d,e,h,B=b.match(/\?$/);h=b.match(/^(\d+)\??$/);var k=b.match(/(\d)(?:-(\d))?/),E=b.replace(/[^a-z]+$/,"");h?d=f.tokens[h[1]]:f[E]?d=f[E]:f[E+"s"]&&(d=f[E+"s"],k&&(e=[],d.forEach(function(a,b){var c=b%(f.units?8:d.length);c>=k[1]&&c<=(k[2]||
k[1])&&e.push(a)}),d=e),d=Ub(d));h?h="(?:"+d+")":(c||g.push(E),h="("+d+")");B&&(h+="?");return h});b?(b=Vb(f,e),e=["t","[\\s\\u3000]"].concat(f.timeMarker),h=a.match(/\\d\{\d,\d\}\)+\??$/),Wb(f,"(?:"+b+")[,\\s\\u3000]+?"+a,Jb.concat(g),d),Wb(f,a+"(?:[,\\s]*(?:"+e.join("|")+(h?"+":"*")+")"+b+")?",g.concat(Jb),d)):Wb(f,a,g,d)}};
function Xb(a,b,c){var d,e,g=b[0],f=b[1],h=b[2];b=a[c]||a.relative;if(F(b))return b.call(a,g,f,h,c);e=a.units[8*(a.plural&&1<g?1:0)+f]||a.units[f];a.capitalizeUnit&&(e=Yb(e));d=a.modifiers.filter(function(a){return"sign"==a.name&&a.value==(0<h?1:-1)})[0];return b.replace(/\{(.*?)\}/g,function(a,b){switch(b){case "num":return g;case "unit":return e;case "sign":return d.src}})}function Zb(a,b){b=b||a.code;return"en"===b||"en-US"===b?!0:a.variant}
function $b(a,b){return b.replace(q(a.num,"g"),function(b){return ac(a,b)||""})}function ac(a,b){var c;return y(b)?b:b&&-1!==(c=a.numbers.indexOf(b))?(c+1)%10:1}function Y(a,b){var c;z(a)||(a="");c=Sb[a]||Sb[a.slice(0,2)];if(!1===b&&!c)throw new TypeError("Invalid locale.");return c||Ib}
function bc(a,b){function c(a){var b=h[a];z(b)?h[a]=b.split(","):b||(h[a]=[])}function d(a,b){a=a.split("+").map(function(a){return a.replace(/(.+):(.+)$/,function(a,b,c){return c.split("|").map(function(a){return b+a}).join("|")})}).join("|");a.split("|").forEach(b)}function e(a,b,c){var e=[];h[a].forEach(function(a,f){b&&(a+="+"+a.slice(0,3));d(a,function(a,b){e[b*c+f]=a.toLowerCase()})});h[a]=e}function g(a,b,c){a="\\d{"+a+","+b+"}";c&&(a+="|(?:"+Ub(h.numbers)+")+");return a}function f(a,b){h[a]=
h[a]||b}var h,l;h=new Tb(b);c("modifiers");"months weekdays units numbers articles tokens timeMarker ampm timeSuffixes dateParse timeParse".split(" ").forEach(c);l=!h.monthSuffix;e("months",l,12);e("weekdays",l,7);e("units",!1,8);e("numbers",!1,10);f("code",a);f("date",g(1,2,h.digitDate));f("year","'\\d{2}|"+g(4,4));f("num",function(){var a=["-?\\d+"].concat(h.articles);h.numbers&&(a=a.concat(h.numbers));return Ub(a)}());(function(){var a=[];h.i={};h.modifiers.push({name:"day",src:"yesterday",value:-1});
h.modifiers.push({name:"day",src:"today",value:0});h.modifiers.push({name:"day",src:"tomorrow",value:1});h.modifiers.forEach(function(b){var c=b.name;d(b.src,function(d){var e=h[c];h.i[d]=b;a.push({name:c,src:d,value:b.value});h[c]=e?e+"|"+d:d})});h.day+="|"+Ub(h.weekdays);h.modifiers=a})();h.monthSuffix&&(h.month=g(1,2),h.months="1 2 3 4 5 6 7 8 9 10 11 12".split(" ").map(function(a){return a+h.monthSuffix}));h.full_month=g(1,2)+"|"+Ub(h.months);0<h.timeSuffixes.length&&h.addFormat(Vb(h),!1,Jb);
h.addFormat("{day}",!0);h.addFormat("{month}"+(h.monthSuffix||""));h.addFormat("{year}"+(h.yearSuffix||""));h.timeParse.forEach(function(a){h.addFormat(a,!0)});h.dateParse.forEach(function(a){h.addFormat(a)});return Sb[a]=h}function Wb(a,b,c,d){a.g.unshift({r:d,locale:a,q:q("^"+b+"$","i"),to:c})}function Yb(a){return a.slice(0,1).toUpperCase()+a.slice(1)}function Ub(a){return a.filter(function(a){return!!a}).join("|")}function cc(){var a=r.SugarNewDate;return a?a():new r}
function dc(a,b){var c;if(G(a[0]))return a;if(y(a[0])&&!y(a[1]))return[a[0]];if(z(a[0])&&b)return[ec(a[0]),a[1]];c={};Nb.forEach(function(b,e){c[b.name]=a[e]});return[c]}function ec(a){var b,c={};if(a=a.match(/^(\d+)?\s?(\w+?)s?$/i))N(b)&&(b=parseInt(a[1])||1),c[a[2].toLowerCase()]=b;return c}function fc(a,b,c){var d;N(c)&&(c=Ob.length);for(b=b||0;b<c&&(d=Ob[b],!1!==a(d.name,d,b));b++);}
function gc(a,b){var c={},d,e;b.forEach(function(b,f){d=a[f+1];N(d)||""===d||("year"===b&&(c.t=d.replace(/'/,"")),e=parseFloat(d.replace(/'/,"").replace(/,/,".")),c[b]=isNaN(e)?d.toLowerCase():e)});return c}function hc(a){a=a.trim().replace(/^just (?=now)|\.+$/i,"");return ic(a)}
function ic(a){return a.replace(Mb,function(a,c,d){var e=0,g=1,f,h;if(c)return a;d.split("").reverse().forEach(function(a){a=Lb[a];var b=9<a;b?(f&&(e+=g),g*=a/(h||1),h=a):(!1===f&&(g*=10),e+=g*a);f=b});f&&(e+=g);return e})}
function jc(a,b,c,d){function e(a){vb.push(a)}function g(){vb.forEach(function(a){a.call()})}function f(){var a=n.getWeekday();n.setWeekday(7*(k.num-1)+(a>Ba?Ba+7:Ba))}function h(){var a=B.i[k.edge];fc(function(a){if(M(k[a]))return E=a,!1},4);if("year"===E)k.e="month";else if("month"===E||"week"===E)k.e="day";n[(0>a.value?"endOf":"beginningOf")+Yb(E)]();-2===a.value&&n.reset()}function l(){var a;fc(function(b,c,d){"day"===b&&(b="date");if(M(k[b])){if(d>=wb)return n.setTime(NaN),!1;a=a||{};a[b]=k[b];
delete k[b]}});a&&e(function(){n.set(a,!0)})}var n,x,ha,vb,B,k,E,wb,Ba,ra,ca;n=cc();vb=[];n.utc(d);C(a)?n.utc(a.isUTC()).setTime(a.getTime()):y(a)?n.setTime(a):G(a)?(n.set(a,!0),k=a):z(a)&&(ha=Y(b),a=hc(a),ha&&I(ha.o?[ha.o].concat(ha.g):ha.g,function(c,d){var g=a.match(d.q);if(g){B=d.locale;k=gc(g,d.to);B.o=d;k.utc&&n.utc();if(k.timestamp)return k=k.timestamp,!1;d.r&&(!z(k.month)&&(z(k.date)||Zb(ha,b)))&&(ca=k.month,k.month=k.date,k.date=ca);k.year&&2===k.t.length&&(k.year=100*R(U(cc(),"FullYear")/
100)-100*R(k.year/100)+k.year);k.month&&(k.month=B.getMonth(k.month),k.shift&&!k.unit&&(k.unit=B.units[7]));k.weekday&&k.date?delete k.weekday:k.weekday&&(k.weekday=B.getWeekday(k.weekday),k.shift&&!k.unit&&(k.unit=B.units[5]));k.day&&(ca=B.i[k.day])?(k.day=ca.value,n.reset(),x=!0):k.day&&-1<(Ba=B.getWeekday(k.day))&&(delete k.day,k.num&&k.month?(e(f),k.day=1):k.weekday=Ba);k.date&&!y(k.date)&&(k.date=$b(B,k.date));k.ampm&&k.ampm===B.ampm[1]&&12>k.hour?k.hour+=12:k.ampm===B.ampm[0]&&12===k.hour&&
(k.hour=0);if("offset_hours"in k||"offset_minutes"in k)n.utc(),k.offset_minutes=k.offset_minutes||0,k.offset_minutes+=60*k.offset_hours,"-"===k.offset_sign&&(k.offset_minutes*=-1),k.minute-=k.offset_minutes;k.unit&&(x=!0,ra=ac(B,k.num),wb=B.units.indexOf(k.unit)%8,E=W.units[wb],l(),k.shift&&(ra*=(ca=B.i[k.shift])?ca.value:0),k.sign&&(ca=B.i[k.sign])&&(ra*=ca.value),M(k.weekday)&&(n.set({weekday:k.weekday},!0),delete k.weekday),k[E]=(k[E]||0)+ra);k.edge&&e(h);"-"===k.year_sign&&(k.year*=-1);fc(function(a,
b,c){b=k[a];var d=b%1;d&&(k[Ob[c-1].name]=R(d*("second"===a?1E3:60)),k[a]=Q(b))},1,4);return!1}}),k?x?n.advance(k):(n._utc&&n.reset(),kc(n,k,!0,!1,c)):("now"!==a&&(n=new r(a)),d&&n.addMinutes(-n.getTimezoneOffset())),g(),n.utc(!1));return{c:n,set:k}}function lc(a){var b,c=P(a),d=c,e=0;fc(function(a,f,h){b=Q(Da(c/f.b(),1));1<=b&&(d=b,e=h)},1);return[d,e,a]}
function mc(a){var b=lc(a.millisecondsFromNow());if(6===b[1]||5===b[1]&&4===b[0]&&a.daysFromNow()>=cc().daysInMonth())b[0]=P(a.monthsFromNow()),b[1]=6;return b}function nc(a,b,c){function d(a,c){var d=U(a,"Month");return Y(c).months[d+12*b]}Z(a,d,c);Z(Yb(a),d,c,1)}function Z(a,b,c,d){X[a]=function(a,g){var f=b(a,g);c&&(f=f.slice(0,c));d&&(f=f.slice(0,d).toUpperCase()+f.slice(d));return f}}
function oc(a,b,c){X[a]=b;X[a+a]=function(a,c){return T(b(a,c),2)};c&&(X[a+a+a]=function(a,c){return T(b(a,c),3)},X[a+a+a+a]=function(a,c){return T(b(a,c),4)})}function pc(a){var b=a.match(/(\{\w+\})|[^{}]+/g);Qb[a]=b.map(function(a){a.replace(/\{(\w+)\}/,function(b,e){a=X[e]||e;return e});return a})}
function qc(a,b,c,d){var e;if(!a.isValid())return"Invalid Date";Date[b]?b=Date[b]:F(b)&&(e=mc(a),b=b.apply(a,e.concat(Y(d))));if(!b&&c)return e=e||mc(a),0===e[1]&&(e[1]=1,e[0]=1),a=Y(d),Xb(a,e,0<e[2]?"future":"past");b=b||"long";if("short"===b||"long"===b||"full"===b)b=Y(d)[b];Qb[b]||pc(b);var g,f;e="";b=Qb[b];g=0;for(c=b.length;g<c;g++)f=b[g],e+=F(f)?f(a,d):f;return e}
function rc(a,b,c,d,e){var g,f,h,l=0,n=0,x=0;g=jc(b,c,null,e);0<d&&(n=x=d,f=!0);if(!g.c.isValid())return!1;if(g.set&&g.set.e){Rb.forEach(function(b){b.name===g.set.e&&(l=b.b(g.c,a-g.c)-1)});b=Yb(g.set.e);if(g.set.edge||g.set.shift)g.c["beginningOf"+b]();"month"===g.set.e&&(h=g.c.clone()["endOf"+b]().getTime());!f&&(g.set.sign&&"millisecond"!=g.set.e)&&(n=50,x=-50)}f=a.getTime();b=g.c.getTime();h=sc(a,b,h||b+l);return f>=b-n&&f<=h+x}
function sc(a,b,c){b=new r(b);a=(new r(c)).utc(a.isUTC());23!==U(a,"Hours")&&(b=b.getTimezoneOffset(),a=a.getTimezoneOffset(),b!==a&&(c+=(a-b).minutes()));return c}
function kc(a,b,c,d,e){function g(a){return M(b[a])?b[a]:b[a+"s"]}function f(a){return M(g(a))}var h;if(y(b)&&d)b={milliseconds:b};else if(y(b))return a.setTime(b),a;M(b.date)&&(b.day=b.date);fc(function(d,e,g){var l="day"===d;if(f(d)||l&&f("weekday"))return b.e=d,h=+g,!1;!c||("week"===d||l&&f("week"))||Sa(a,e.method,l?1:0)});Rb.forEach(function(c){var e=c.name;c=c.method;var h;h=g(e);N(h)||(d?("week"===e&&(h=(b.day||0)+7*h,c="Date"),h=h*d+U(a,c)):"month"===e&&f("day")&&Sa(a,"Date",15),Sa(a,c,h),
d&&"month"===e&&(e=h,0>e&&(e=e%12+12),e%12!=U(a,"Month")&&Sa(a,"Date",0)))});d||(f("day")||!f("weekday"))||a.setWeekday(g("weekday"));var l;a:{switch(e){case -1:l=a>cc();break a;case 1:l=a<cc();break a}l=void 0}l&&fc(function(b,c){if((c.k||"week"===b&&f("weekday"))&&!(f(b)||"day"===b&&f("weekday")))return a[c.j](e),!1},h+1);return a}
function Vb(a,b){var c=Kb,d={h:0,m:1,s:2},e;a=a||W;return c.replace(/{([a-z])}/g,function(c,f){var h=[],l="h"===f,n=l&&!b;if("t"===f)return a.ampm.join("|");l&&h.push(":");(e=a.timeSuffixes[d[f]])&&h.push(e+"\\s*");return 0===h.length?"":"(?:"+h.join("|")+")"+(n?"":"?")})}function tc(a,b,c){var d,e;y(a[1])?d=dc(a)[0]:(d=a[0],e=a[1]);return jc(d,e,b,c).c}
H(r,!1,!0,{create:function(){return tc(arguments)},past:function(){return tc(arguments,-1)},future:function(){return tc(arguments,1)},addLocale:function(a,b){return bc(a,b)},setLocale:function(a){var b=Y(a,!1);Ib=b;a&&a!=b.code&&(b.code=a);return b},getLocale:function(a){return a?Y(a,!1):Ib},addFormat:function(a,b,c){Wb(Y(c),a,b)}});
H(r,!0,!0,{set:function(){var a=dc(arguments);return kc(this,a[0],a[1])},setWeekday:function(a){if(!N(a))return Sa(this,"Date",U(this,"Date")+a-U(this,"Day"))},setISOWeek:function(a){var b=U(this,"Day")||7;if(!N(a))return this.set({month:0,date:4}),this.set({weekday:1}),1<a&&this.addWeeks(a-1),1!==b&&this.advance({days:b-1}),this.getTime()},getISOWeek:function(){var a;a=this.clone();var b=U(a,"Day")||7;a.addDays(4-b).reset();return 1+Q(a.daysSince(a.clone().beginningOfYear())/7)},beginningOfISOWeek:function(){var a=
this.getDay();0===a?a=-6:1!==a&&(a=1);this.setWeekday(a);return this.reset()},endOfISOWeek:function(){0!==this.getDay()&&this.setWeekday(7);return this.endOfDay()},getUTCOffset:function(a){var b=this._utc?0:this.getTimezoneOffset(),c=!0===a?":":"";return!b&&a?"Z":T(Q(-b/60),2,!0)+c+T(P(b%60),2)},utc:function(a){oa(this,"_utc",!0===a||0===arguments.length);return this},isUTC:function(){return!!this._utc||0===this.getTimezoneOffset()},advance:function(){var a=dc(arguments,!0);return kc(this,a[0],a[1],
1)},rewind:function(){var a=dc(arguments,!0);return kc(this,a[0],a[1],-1)},isValid:function(){return!isNaN(this.getTime())},isAfter:function(a,b){return this.getTime()>r.create(a).getTime()-(b||0)},isBefore:function(a,b){return this.getTime()<r.create(a).getTime()+(b||0)},isBetween:function(a,b,c){var d=this.getTime();a=r.create(a).getTime();var e=r.create(b).getTime();b=Ca(a,e);a=S(a,e);c=c||0;return b-c<d&&a+c>d},isLeapYear:function(){var a=U(this,"FullYear");return 0===a%4&&0!==a%100||0===a%400},
daysInMonth:function(){return 32-U(new r(U(this,"FullYear"),U(this,"Month"),32),"Date")},format:function(a,b){return qc(this,a,!1,b)},relative:function(a,b){z(a)&&(b=a,a=null);return qc(this,a,!0,b)},is:function(a,b,c){var d,e;if(this.isValid()){if(z(a))switch(a=a.trim().toLowerCase(),e=this.clone().utc(c),!0){case "future"===a:return this.getTime()>cc().getTime();case "past"===a:return this.getTime()<cc().getTime();case "weekday"===a:return 0<U(e,"Day")&&6>U(e,"Day");case "weekend"===a:return 0===
U(e,"Day")||6===U(e,"Day");case -1<(d=W.weekdays.indexOf(a)%7):return U(e,"Day")===d;case -1<(d=W.months.indexOf(a)%12):return U(e,"Month")===d}return rc(this,a,null,b,c)}},reset:function(a){var b={},c;a=a||"hours";"date"===a&&(a="days");c=Rb.some(function(b){return a===b.name||a===b.name+"s"});b[a]=a.match(/^days?/)?1:0;return c?this.set(b,!0):this},clone:function(){var a=new r(this.getTime());a.utc(!!this._utc);return a}});
H(r,!0,!0,{iso:function(){return this.toISOString()},getWeekday:r.prototype.getDay,getUTCWeekday:r.prototype.getUTCDay});function uc(a,b){function c(){return R(this*b)}function d(){return tc(arguments)[a.j](this)}function e(){return tc(arguments)[a.j](-this)}var g=a.name,f={};f[g]=c;f[g+"s"]=c;f[g+"Before"]=e;f[g+"sBefore"]=e;f[g+"Ago"]=e;f[g+"sAgo"]=e;f[g+"After"]=d;f[g+"sAfter"]=d;f[g+"FromNow"]=d;f[g+"sFromNow"]=d;t.extend(f)}H(t,!0,!0,{duration:function(a){a=Y(a);return Xb(a,lc(this),"duration")}});
W=Ib=r.addLocale("en",{plural:!0,timeMarker:"at",ampm:"am,pm",months:"January,February,March,April,May,June,July,August,September,October,November,December",weekdays:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",units:"millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s",numbers:"one,two,three,four,five,six,seven,eight,nine,ten",articles:"a,an,the",tokens:"the,st|nd|rd|th,of","short":"{Month} {d}, {yyyy}","long":"{Month} {d}, {yyyy} {h}:{mm}{tt}",full:"{Weekday} {Month} {d}, {yyyy} {h}:{mm}:{ss}{tt}",
past:"{num} {unit} {sign}",future:"{num} {unit} {sign}",duration:"{num} {unit}",modifiers:[{name:"sign",src:"ago|before",value:-1},{name:"sign",src:"from now|after|from|in|later",value:1},{name:"edge",src:"last day",value:-2},{name:"edge",src:"end",value:-1},{name:"edge",src:"first day|beginning",value:1},{name:"shift",src:"last",value:-1},{name:"shift",src:"the|this",value:0},{name:"shift",src:"next",value:1}],dateParse:["{month} {year}","{shift} {unit=5-7}","{0?} {date}{1}","{0?} {edge} of {shift?} {unit=4-7?}{month?}{year?}"],
timeParse:"{num} {unit} {sign};{sign} {num} {unit};{0} {num}{1} {day} of {month} {year?};{weekday?} {month} {date}{1?} {year?};{date} {month} {year};{date} {month};{shift} {weekday};{shift} week {weekday};{weekday} {2?} {shift} week;{num} {unit=4-5} {sign} {day};{0?} {date}{1} of {month};{0?}{month?} {date?}{1?} of {shift} {unit=6-7}".split(";")});Ob=Rb.concat().reverse();Nb=Rb.concat();Nb.splice(2,1);
K(r,!0,!0,Rb,function(a,b,c){function d(a){a/=f;var c=a%1,d=b.error||0.999;c&&P(c%1)>d&&(a=R(a));return 0>a?Aa(a):Q(a)}var e=b.name,g=Yb(e),f=b.b(),h,l;b.j="add"+g+"s";h=function(a,b){return d(this.getTime()-r.create(a,b).getTime())};l=function(a,b){return d(r.create(a,b).getTime()-this.getTime())};a[e+"sAgo"]=l;a[e+"sUntil"]=l;a[e+"sSince"]=h;a[e+"sFromNow"]=h;a[b.j]=function(a,b){var c={};c[e]=a;return this.advance(c,b)};uc(b,f);3>c&&["Last","This","Next"].forEach(function(b){a["is"+b+g]=function(){return rc(this,
b+" "+e,"en")}});4>c&&(a["beginningOf"+g]=function(){var a={};switch(e){case "year":a.year=U(this,"FullYear");break;case "month":a.month=U(this,"Month");break;case "day":a.day=U(this,"Date");break;case "week":a.weekday=0}return this.set(a,!0)},a["endOf"+g]=function(){var a={hours:23,minutes:59,seconds:59,milliseconds:999};switch(e){case "year":a.month=11;a.day=31;break;case "month":a.day=this.daysInMonth();break;case "week":a.weekday=6}return this.set(a,!0)})});
W.addFormat("([+-])?(\\d{4,4})[-.]?{full_month}[-.]?(\\d{1,2})?",!0,["year_sign","year","month","date"],!1,!0);W.addFormat("(\\d{1,2})[-.\\/]{full_month}(?:[-.\\/](\\d{2,4}))?",!0,["date","month","year"],!0);W.addFormat("{full_month}[-.](\\d{4,4})",!1,["month","year"]);W.addFormat("\\/Date\\((\\d+(?:[+-]\\d{4,4})?)\\)\\/",!1,["timestamp"]);W.addFormat(Vb(W),!1,Jb);Pb=W.g.slice(0,7).reverse();W.g=W.g.slice(7).concat(Pb);oc("f",function(a){return U(a,"Milliseconds")},!0);
oc("s",function(a){return U(a,"Seconds")});oc("m",function(a){return U(a,"Minutes")});oc("h",function(a){return U(a,"Hours")%12||12});oc("H",function(a){return U(a,"Hours")});oc("d",function(a){return U(a,"Date")});oc("M",function(a){return U(a,"Month")+1});(function(){function a(a,c){var d=U(a,"Hours");return Y(c).ampm[Q(d/12)]||""}Z("t",a,1);Z("tt",a);Z("T",a,1,1);Z("TT",a,null,2)})();
(function(){function a(a,c){var d=U(a,"Day");return Y(c).weekdays[d]}Z("dow",a,3);Z("Dow",a,3,1);Z("weekday",a);Z("Weekday",a,null,1)})();nc("mon",0,3);nc("month",0);nc("month2",1);nc("month3",2);X.ms=X.f;X.milliseconds=X.f;X.seconds=X.s;X.minutes=X.m;X.hours=X.h;X["24hr"]=X.H;X["12hr"]=X.h;X.date=X.d;X.day=X.d;X.year=X.yyyy;K(r,!0,!0,"short,long,full",function(a,b){a[b]=function(a){return qc(this,b,!1,a)}});
"\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u767e\u5343\u4e07".split("").forEach(function(a,b){9<b&&(b=za(10,b-9));Lb[a]=b});xa(Lb,Ka);Mb=q("([\u671f\u9031\u5468])?([\u3007\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u4e03\u516b\u4e5d\u5341\u767e\u5343\u4e07"+Ja+"]+)(?!\u6628)","g");
(function(){var a=W.weekdays.slice(0,7),b=W.months.slice(0,12);K(r,!0,!0,"today yesterday tomorrow weekday weekend future past".split(" ").concat(a).concat(b),function(a,b){a["is"+Yb(b)]=function(a){return this.is(b,0,a)}})})();r.utc||(r.utc={create:function(){return tc(arguments,0,!0)},past:function(){return tc(arguments,-1,!0)},future:function(){return tc(arguments,1,!0)}});
H(r,!1,!0,{RFC1123:"{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}",RFC1036:"{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}",ISO8601_DATE:"{yyyy}-{MM}-{dd}",ISO8601_DATETIME:"{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{fff}{isotz}"});
"use strict";function Range(a,b){this.start=vc(a);this.end=vc(b)}function vc(a){return C(a)?new r(a.getTime()):null==a?a:C(a)?a.getTime():a.valueOf()}function wc(a){a=null==a?a:C(a)?a.getTime():a.valueOf();return!!a||0===a}
function xc(a,b){var c,d,e,g;if(y(b))return new r(a.getTime()+b);c=b[0];d=b[1];e=U(a,d);g=new r(a.getTime());Sa(g,d,e+c);return g}function yc(a,b){return s.fromCharCode(a.charCodeAt(0)+b)}function zc(a,b){return a+b}Range.prototype.toString=function(){return this.isValid()?this.start+".."+this.end:"Invalid Range"};
H(Range,!0,!0,{isValid:function(){return wc(this.start)&&wc(this.end)&&typeof this.start===typeof this.end},span:function(){return this.isValid()?P((z(this.end)?this.end.charCodeAt(0):this.end)-(z(this.start)?this.start.charCodeAt(0):this.start))+1:NaN},contains:function(a){return null==a?!1:a.start&&a.end?a.start>=this.start&&a.start<=this.end&&a.end>=this.start&&a.end<=this.end:a>=this.start&&a<=this.end},every:function(a,b){var c,d=this.start,e=this.end,g=e<d,f=d,h=0,l=[];F(a)&&(b=a,a=null);a=
a||1;y(d)?c=zc:z(d)?c=yc:C(d)&&(c=a,y(c)?a=c:(d=c.toLowerCase().match(/^(\d+)?\s?(\w+?)s?$/i),c=parseInt(d[1])||1,d=d[2].slice(0,1).toUpperCase()+d[2].slice(1),d.match(/hour|minute|second/i)?d+="s":"Year"===d?d="FullYear":"Day"===d&&(d="Date"),a=[c,d]),c=xc);for(g&&0<a&&(a*=-1);g?f>=e:f<=e;)l.push(f),b&&b(f,h),f=c(f,a),h++;return l},union:function(a){return new Range(this.start<a.start?this.start:a.start,this.end>a.end?this.end:a.end)},intersect:function(a){return a.start>this.end||a.end<this.start?
new Range(NaN,NaN):new Range(this.start>a.start?this.start:a.start,this.end<a.end?this.end:a.end)},clone:function(){return new Range(this.start,this.end)},clamp:function(a){var b=this.start,c=this.end,d=c<b?c:b,b=b>c?b:c;return vc(a<d?d:a>b?b:a)}});[t,s,r].forEach(function(a){H(a,!1,!0,{range:function(b,c){a.create&&(b=a.create(b),c=a.create(c));return new Range(b,c)}})});
H(t,!0,!0,{upto:function(a,b,c){return t.range(this,a).every(c,b)},clamp:function(a,b){return(new Range(a,b)).clamp(this)},cap:function(a){return this.clamp(void 0,a)}});H(t,!0,!0,{downto:t.prototype.upto});H(p,!1,function(a){return a instanceof Range},{create:function(a){return a.every()}});
"use strict";function Ac(a,b,c,d,e){Infinity!==b&&(a.timers||(a.timers=[]),y(b)||(b=1),a.n=!1,a.timers.push(setTimeout(function(){a.n||c.apply(d,e||[])},b)))}
H(Function,!0,!0,{lazy:function(a,b,c){function d(){g.length<c-(f&&b?1:0)&&g.push([this,arguments]);f||(f=!0,b?h():Ac(d,l,h));return x}var e=this,g=[],f=!1,h,l,n,x;a=a||1;c=c||Infinity;l=Aa(a);n=R(l/a)||1;h=function(){var a=g.length,b;if(0!=a){for(b=S(a-n,0);a>b;)x=Function.prototype.apply.apply(e,g.shift()),a--;Ac(d,l,function(){f=!1;h()})}};return d},throttle:function(a){return this.lazy(a,!0,1)},debounce:function(a){function b(){b.cancel();Ac(b,a,c,this,arguments)}var c=this;return b},delay:function(a){var b=
L(arguments,null,1);Ac(this,a,this,this,b);return this},every:function(a){function b(){c.apply(c,d);Ac(c,a,b)}var c=this,d=arguments,d=1<d.length?L(d,null,1):[];Ac(c,a,b);return c},cancel:function(){var a=this.timers,b;if(A(a))for(;b=a.shift();)clearTimeout(b);this.n=!0;return this},after:function(a){var b=this,c=0,d=[];if(!y(a))a=1;else if(0===a)return b.call(),b;return function(){var e;d.push(L(arguments));c++;if(c==a)return e=b.call(this,d),c=0,d=[],e}},once:function(){return this.throttle(Infinity,
!0)},fill:function(){var a=this,b=L(arguments);return function(){var c=L(arguments);b.forEach(function(a,b){(null!=a||b>=c.length)&&c.splice(b,0,a)});return a.apply(this,c)}}});
"use strict";function Bc(a,b,c,d,e,g){var f=a.toFixed(20),h=f.search(/\./),f=f.search(/[1-9]/),h=h-f;0<h&&(h-=1);e=S(Ca(Q(h/3),!1===e?c.length:e),-d);d=c.charAt(e+d-1);-9>h&&(e=-3,b=P(h)-9,d=c.slice(0,1));c=g?za(2,10*e):za(10,3*e);return Da(a/c,b||0).format()+d.trim()}
H(t,!1,!0,{random:function(a,b){var c,d;1==arguments.length&&(b=a,a=0);c=Ca(a||0,N(b)?1:b);d=S(a||0,N(b)?1:b)+1;return Q(u.random()*(d-c)+c)}});
H(t,!0,!0,{log:function(a){return u.log(this)/(a?u.log(a):1)},abbr:function(a){return Bc(this,a,"kmbt",0,4)},metric:function(a,b){return Bc(this,a,"n\u03bcm kMGTPE",4,N(b)?1:b)},bytes:function(a,b){return Bc(this,a,"kMGTPE",0,N(b)?4:b,!0)+"B"},isInteger:function(){return 0==this%1},isOdd:function(){return!isNaN(this)&&!this.isMultipleOf(2)},isEven:function(){return this.isMultipleOf(2)},isMultipleOf:function(a){return 0===this%a},format:function(a,b,c){var d,e,g,f="";N(b)&&(b=",");N(c)&&(c=".");d=
(y(a)?Da(this,a||0).toFixed(S(a,0)):this.toString()).replace(/^-/,"").split(".");e=d[0];g=d[1];for(d=e.length;0<d;d-=3)d<e.length&&(f=b+f),f=e.slice(S(0,d-3),d)+f;g&&(f+=c+Na("0",(a||0)-g.length)+g);return(0>this?"-":"")+f},hex:function(a){return this.pad(a||1,!1,16)},times:function(a){if(a)for(var b=0;b<this;b++)a.call(this,b);return this.toNumber()},chr:function(){return s.fromCharCode(this)},pad:function(a,b,c){return T(this,a,b,c)},ordinalize:function(){var a=P(this),a=parseInt(a.toString().slice(-2));
return this+Pa(a)},toNumber:function(){return parseFloat(this,10)}});(function(){function a(a){return function(c){return c?Da(this,c,a):a(this)}}H(t,!0,!0,{ceil:a(Aa),round:a(R),floor:a(Q)});K(t,!0,!0,"abs,pow,sin,asin,cos,acos,tan,atan,exp,pow,sqrt",function(a,c){a[c]=function(a,b){return u[c](this,a,b)}})})();
"use strict";var Cc=["isObject","isNaN"],Dc="keys values select reject each merge clone equal watch tap has toQueryString".split(" ");
function Ec(a,b,c,d){var e,g,f;(g=b.match(/^(.+?)(\[.*\])$/))?(f=g[1],b=g[2].replace(/^\[|\]$/g,"").split("]["),b.forEach(function(b){e=!b||b.match(/^\d+$/);!f&&A(a)&&(f=a.length);J(a,f)||(a[f]=e?[]:{});a=a[f];f=b}),!f&&e&&(f=a.length.toString()),Ec(a,f,c,d)):a[b]=d&&"true"===c?!0:d&&"false"===c?!1:c}function Fc(a,b){var c;return A(b)||G(b)&&b.toString===v?(c=[],I(b,function(b,e){a&&(b=a+"["+b+"]");c.push(Fc(b,e))}),c.join("&")):a?Gc(a)+"="+(C(b)?b.getTime():Gc(b)):""}
function Gc(a){return a||!1===a||0===a?encodeURIComponent(a).replace(/%20/g,"+"):""}function Hc(a,b,c){var d,e=a instanceof O?new O:{};I(a,function(a,f){d=!1;sa(b,function(b){(D(b)?b.test(a):G(b)?b[a]===f:a===s(b))&&(d=!0)},1);d===c&&(e[a]=f)});return e}H(m,!1,!0,{watch:function(a,b,c){if(ea){var d=a[b];m.defineProperty(a,b,{enumerable:!0,configurable:!0,get:function(){return d},set:function(e){d=c.call(a,b,d,e)}})}}});
H(m,!1,function(){return 1<arguments.length},{keys:function(a,b){var c=m.keys(a);c.forEach(function(c){b.call(a,c,a[c])});return c}});
H(m,!1,!0,{isObject:function(a){return va(a)},isNaN:function(a){return y(a)&&a.valueOf()!==a.valueOf()},equal:function(a,b){return Ua(a,b)},extended:function(a){return new O(a)},merge:function(a,b,c,d){var e,g,f,h,l,n,x;if(a&&"string"!==typeof b)for(e in b)if(J(b,e)&&a){h=b[e];l=a[e];n=M(l);g=G(h);f=G(l);x=n&&!1===d?l:h;n&&F(d)&&(x=d.call(b,e,l,h));if(c&&(g||f))if(C(h))x=new r(h.getTime());else if(D(h))x=new q(h.source,Qa(h));else{f||(a[e]=p.isArray(h)?[]:{});m.merge(a[e],h,c,d);continue}a[e]=x}return a},
values:function(a,b){var c=[];I(a,function(d,e){c.push(e);b&&b.call(a,e)});return c},clone:function(a,b){var c;if(!G(a))return a;c=v.call(a);if(C(a,c)&&a.clone)return a.clone();if(C(a,c)||D(a,c))return new a.constructor(a);if(a instanceof O)c=new O;else if(A(a,c))c=[];else if(va(a,c))c={};else throw new TypeError("Clone must be a basic data type.");return m.merge(c,a,b)},fromQueryString:function(a,b){var c=m.extended();a=a&&a.toString?a.toString():"";a.replace(/^.*?\?/,"").split("&").forEach(function(a){a=
a.split("=");2===a.length&&Ec(c,a[0],decodeURIComponent(a[1]),b)});return c},toQueryString:function(a,b){return Fc(b,a)},tap:function(a,b){var c=b;F(b)||(c=function(){if(b)a[b]()});c.call(a,a);return a},has:function(a,b){return J(a,b)},select:function(a){return Hc(a,arguments,!0)},reject:function(a){return Hc(a,arguments,!1)}});K(m,!1,!0,w,function(a,b){var c="is"+b;Cc.push(c);a[c]=ia[b]});
H(m,!1,function(){return 0===arguments.length},{extend:function(){var a=Cc.concat(Dc);"undefined"!==typeof Hb&&(a=a.concat(Hb));Ya(a,m)}});Ya(Dc,O);
"use strict";H(q,!1,!0,{escape:function(a){return Ra(a)}});H(q,!0,!0,{getFlags:function(){return Qa(this)},setFlags:function(a){return q(this.source,a)},addFlag:function(a){return this.setFlags(Qa(this,a))},removeFlag:function(a){return this.setFlags(Qa(this).replace(a,""))}});
"use strict";
function Ic(a){a=+a;if(0>a||Infinity===a)throw new RangeError("Invalid number");return a}function Jc(a,b){return Na(M(b)?b:" ",a)}function Kc(a,b,c,d,e){var g;if(a.length<=b)return a.toString();d=N(d)?"...":d;switch(c){case "left":return a=e?Lc(a,b,!0):a.slice(a.length-b),d+a;case "middle":return c=Aa(b/2),g=Q(b/2),b=e?Lc(a,c):a.slice(0,c),a=e?Lc(a,g,!0):a.slice(a.length-g),b+d+a;default:return b=e?Lc(a,b):a.slice(0,b),b+d}}
function Lc(a,b,c){if(c)return Lc(a.reverse(),b).reverse();c=q("(?=["+Ma()+"])");var d=0;return a.split(c).filter(function(a){d+=a.length;return d<=b}).join("")}function Mc(a,b,c){z(b)&&(b=a.indexOf(b),-1===b&&(b=c?a.length:0));return b}var Nc,Oc;H(s,!0,!1,{repeat:function(a){a=Ic(a);return Na(this,a)}});
H(s,!0,function(a){return D(a)||2<arguments.length},{startsWith:function(a){var b=arguments,c=b[1],b=b[2],d=this;c&&(d=d.slice(c));N(b)&&(b=!0);c=D(a)?a.source.replace("^",""):Ra(a);return q("^"+c,b?"":"i").test(d)},endsWith:function(a){var b=arguments,c=b[1],b=b[2],d=this;M(c)&&(d=d.slice(0,c));N(b)&&(b=!0);c=D(a)?a.source.replace("$",""):Ra(a);return q(c+"$",b?"":"i").test(d)}});
H(s,!0,!0,{escapeRegExp:function(){return Ra(this)},escapeURL:function(a){return a?encodeURIComponent(this):encodeURI(this)},unescapeURL:function(a){return a?decodeURI(this):decodeURIComponent(this)},escapeHTML:function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/\//g,"&#x2f;")},unescapeHTML:function(){return this.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#x2f;/g,
"/").replace(/&amp;/g,"&")},encodeBase64:function(){return Nc(unescape(encodeURIComponent(this)))},decodeBase64:function(){return decodeURIComponent(escape(Oc(this)))},each:function(a,b){var c,d,e;F(a)?(b=a,a=/[\s\S]/g):a?z(a)?a=q(Ra(a),"gi"):D(a)&&(a=q(a.source,Qa(a,"g"))):a=/[\s\S]/g;c=this.match(a)||[];if(b)for(d=0,e=c.length;d<e;d++)c[d]=b.call(this,c[d],d,c)||c[d];return c},shift:function(a){var b="";a=a||0;this.codes(function(c){b+=s.fromCharCode(c+a)});return b},codes:function(a){var b=[],
c,d;c=0;for(d=this.length;c<d;c++){var e=this.charCodeAt(c);b.push(e);a&&a.call(this,e,c)}return b},chars:function(a){return this.each(a)},words:function(a){return this.trim().each(/\S+/g,a)},lines:function(a){return this.trim().each(/^.*$/gm,a)},paragraphs:function(a){var b=this.trim().split(/[\r\n]{2,}/);return b=b.map(function(b){if(a)var d=a.call(b);return d?d:b})},isBlank:function(){return 0===this.trim().length},has:function(a){return-1!==this.search(D(a)?a:Ra(a))},add:function(a,b){b=N(b)?
this.length:b;return this.slice(0,b)+a+this.slice(b)},remove:function(a){return this.replace(a,"")},reverse:function(){return this.split("").reverse().join("")},compact:function(){return this.trim().replace(/([\r\n\s\u3000])+/g,function(a,b){return"\u3000"===b?b:" "})},at:function(){return Wa(this,arguments,!0)},from:function(a){return this.slice(Mc(this,a,!0))},to:function(a){N(a)&&(a=this.length);return this.slice(0,Mc(this,a))},dasherize:function(){return this.underscore().replace(/_/g,"-")},underscore:function(){return this.replace(/[-\s]+/g,
"_").replace(s.Inflector&&s.Inflector.acronymRegExp,function(a,b){return(0<b?"_":"")+a.toLowerCase()}).replace(/([A-Z\d]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").toLowerCase()},camelize:function(a){return this.underscore().replace(/(^|_)([^_]+)/g,function(b,c,d,e){b=(b=s.Inflector)&&b.acronyms[d];b=z(b)?b:void 0;e=!1!==a||0<e;return b?e?b:b.toLowerCase():e?d.capitalize():d})},spacify:function(){return this.underscore().replace(/_/g," ")},stripTags:function(){var a=this;sa(0<arguments.length?
arguments:[""],function(b){a=a.replace(q("</?"+Ra(b)+"[^<>]*>","gi"),"")});return a},removeTags:function(){var a=this;sa(0<arguments.length?arguments:["\\S+"],function(b){b=q("<("+b+")[^<>]*(?:\\/>|>.*?<\\/\\1>)","gi");a=a.replace(b,"")});return a},truncate:function(a,b,c){return Kc(this,a,b,c)},truncateOnWord:function(a,b,c){return Kc(this,a,b,c,!0)},pad:function(a,b){var c,d;a=Ic(a);c=S(0,a-this.length)/2;d=Q(c);c=Aa(c);return Jc(d,b)+this+Jc(c,b)},padLeft:function(a,b){a=Ic(a);return Jc(S(0,a-
this.length),b)+this},padRight:function(a,b){a=Ic(a);return this+Jc(S(0,a-this.length),b)},first:function(a){N(a)&&(a=1);return this.substr(0,a)},last:function(a){N(a)&&(a=1);return this.substr(0>this.length-a?0:this.length-a)},toNumber:function(a){return Oa(this,a)},capitalize:function(a){var b;return this.toLowerCase().replace(a?/[^']/g:/^\S/,function(a){var d=a.toUpperCase(),e;e=b?a:d;b=d!==a;return e})},assign:function(){var a={};sa(arguments,function(b,c){G(b)?xa(a,b):a[c+1]=b});return this.replace(/\{([^{]+?)\}/g,
function(b,c){return J(a,c)?a[c]:b})}});H(s,!0,!0,{insert:s.prototype.add});
(function(a){if(ba.btoa)Nc=ba.btoa,Oc=ba.atob;else{var b=/[^A-Za-z0-9\+\/\=]/g;Nc=function(b){var d="",e,g,f,h,l,n,x=0;do e=b.charCodeAt(x++),g=b.charCodeAt(x++),f=b.charCodeAt(x++),h=e>>2,e=(e&3)<<4|g>>4,l=(g&15)<<2|f>>6,n=f&63,isNaN(g)?l=n=64:isNaN(f)&&(n=64),d=d+a.charAt(h)+a.charAt(e)+a.charAt(l)+a.charAt(n);while(x<b.length);return d};Oc=function(c){var d="",e,g,f,h,l,n=0;if(c.match(b))throw Error("String contains invalid base64 characters");c=c.replace(/[^A-Za-z0-9\+\/\=]/g,"");do e=a.indexOf(c.charAt(n++)),
g=a.indexOf(c.charAt(n++)),h=a.indexOf(c.charAt(n++)),l=a.indexOf(c.charAt(n++)),e=e<<2|g>>4,g=(g&15)<<4|h>>2,f=(h&3)<<6|l,d+=s.fromCharCode(e),64!=h&&(d+=s.fromCharCode(g)),64!=l&&(d+=s.fromCharCode(f));while(n<c.length);return d}}})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=");})();;/* sort */
function sortOn( ary, dataStr ) {
	ary.sort( function( dataA,dataB ){

		if( !empty(dataStr) ) {
			var as = dataStr.split(".");
			var al = as.length;
			for( i=0; i<al; i++ ) {
				dataA = dataA[as[i]];
			}
			var bs = dataStr.split(".");
			var bl = bs.length;
			for( i=0; i<bl; i++ ) {
				dataB = dataB[bs[i]];
			}
		}

		if( !isNaN(Number(dataA)) ) {
			dataA = Number( dataA );
			dataB = Number( dataB );
		}
		if ( dataA < dataB ) {
			return -1;
		}
		if ( dataA > dataB ) {
			return 1;
		} else {
			// a は b と等しいはず
			return 0;
		}
	} );
	return ary;
};;
function chache() {
	var chache_str = Math.floor( Math.random() * 10000 );
	if( !empty(Config.version) ) {
		chache_str = Config.version;
	}
	return (Config.islocal) ? "" : "?chache=" + chache_str;
};
;;
(function(){
	"use strict";
	

	$.fn._click = function( callback, sound, is_event, is_scroll ) {

		var is_callback = callback;
		var is_move; //動いたかどうか
		var is_this; //自身がクリックされたかどうか

		if( $.isFunction( is_callback )  ) {

			$(this).unbind("click");
			$(this).unbind("mousedown");
			$(this).unbind("mouseup");
			$(this).unbind("mousemove");
			$(this).unbind("touchstart");
			$(this).unbind("touchend");
			$(this).unbind("touchmove");
			$(this).unbind("dblclick");

			//
			//touchstartとtouchendが別のオブジェクトで発生しても起きるので
			//商品を選択してしまう
			//フリックでも商品を選択してしまうので、clickにする
			var is_android = $(window).isTablet();
			if( is_android == 'windowstabret' || is_android == 'windowstabret_ie' ) is_android = false;
			
			var events = (is_android) ? 'touchend' : 'mouseup';
			if( window.Config.mousedown ) {
				//2回実行されることがあるので実記確認必須
				//基本はtouchendがいいと思う
				events = (is_android) ? 'touchstart' : 'mousedown';
			}
			if( !empty(is_event) ) {
				if( is_event == "mousedown" && is_android ) is_event = 'touchstart';
				if( is_event == "mouseup" && is_android ) is_event = 'touchend';
			} 
			//event指定がある場合には優先
			events = (!empty(is_event)) ? is_event : events; //"click";

			//フリックされたかどうか
			//スクロールする部分だけ使用する
			if( events == 'touchend' || events == 'mouseup' ) {
				if(is_android) {
					$(this).bind("touchstart", function() {
						$(this).unbind("touchmove");
						this.is_move = 1;
						this.is_this = 1;
						if( is_scroll ) {
							this.sx = event.changedTouches[0].pageX;
							this.sy = event.changedTouches[0].pageY;
							$(this).bind("touchmove", function(e) {
								if( this.is_move == 0 ) {
									$(this).unbind("touchmove");
								}
								var mx = event.changedTouches[0].pageX;
								var my = event.changedTouches[0].pageY;
								if( Math.abs(my-this.sy) > 10 || Math.abs(mx-this.sx) > 10 ) {
									this.is_move = 0;
								}
							});
						}
					});
				} else {
					$(this).bind("mousedown", function(e) {
						$(this).unbind("mousemove");
						this.is_move = 1;
						this.is_this = 1;
						if( is_scroll ) {
							this.sx = e.pageX;
							this.sy = e.pageY;
							$(this).bind("mousemove", function(e) {
								if( this.is_move == 0 ) {
									$(this).unbind("mousemove");
								}
								var mx = e.pageX;
								var my = e.pageY;
								if( Math.abs(my-this.sy) > 10 || Math.abs(mx-this.sx) > 10 ) {
									this.is_move = 0;
								}
							});
						}
					});
				}
			}
		
			if(is_android && events != 'touchend') {
				$(this).bind("touchend", function(e) {
					e.preventDefault();
				});
			}

			//デフォルトの動作
			$(this).bind( events, function(e, no_sound, is_call ) {

				if( is_call ) {
					this.is_move = 1;
					this.is_this = 1;
				}

				//マウスが動いた場合にはイベントしない
				if( (events == 'touchend' || events == 'mouseup') ) {
					$(this).unbind("touchmove");
					$(this).unbind("mousemove");
					if(!this.is_move || !this.is_this) {
						return;
					}
				}

				this.is_move = 0;
				this.is_this = 0;

				//マウスダウンで下部にあるクリックが反応してしまうので、クラスで制御
				if( (navigator.userAgent.indexOf('Android') > 0) && events == "click" ) {
					if( !$(this).hasClass("active") ) return;
				}
				$(this).removeClass("active");

				//コールバックをセット
				$.proxy( is_callback, e.currentTarget ).call( this, e );
				
				// //screensaverの延長など
				$emenu.timerReset();

				if( no_sound ) {
					e.preventDefault();
					return;
				}

				e.preventDefault();

				switch( sound ) {
					case 1:
					default :
						$("#sound1").soundPlay();
						break;
					case 2:
						$("#sound2").soundPlay();
						break;
					case 3:
						$("#sound3").soundPlay();
						break;

					case -1: 
						//無音
						break;
				}

			});
			
			//イベントをdataに格納しておく
			$(this).data('events', events );

			//androidの場合にactiveのクラスをつける
			if(navigator.userAgent.indexOf('Android') > 0) {
				$(this).bind("touchstart", function( e ){
					$(this).addClass("active");
					//e.preventDefault();
				});
				if( events != "click" ) {
					$(this).bind("touchend", function(){
						$(this).removeClass("active");
					});
				}
			}

		} else {

			var events = $(this).data('events');
			if( events == "click" ) {
				$(this).addClass("active");
			}
			//$(this)[events]();
			$(this).trigger(events,[true,true]);
		}
	}
})();
;;
function empty(val) {
    /*
    if( !val ) {
        return true;
    } else
    */ 
    if( $.isArray( val ) && !val.length ) {
        return true;
    } else if( val ===  undefined ) {
        return true;
    } else if( val == null ) {
        return true;
    } else if( val === "" ) {
        return true;
    }

    return false;
}
;;
/**
 * [Loader description]
 * newの頻度が高いのでprototypeで定義
 */
function Loader() {

	"use strict";
	//self  = this;
	this.url;
	this.dataType;
	this.callBack;
	this.request;
	this.ajaxStatusCode = {
		200: function() {
			// Success
		},
		404: function() {
			// Not Found
			console.log("Not Found");
		},
		500: function() {
			// Internal Server Error
			console.log("Internal Server Error");
		}
	};

};

/**
 * ロード
 * @param  {[type]}   url      ファイルパス
 * @param  {[type]}   data     GETデータ
 * @param  {Function} callback コールバック
 * @param  {[type]}   dataType データタイプ xml, json
 * @return {[type]}            [description]
 */
Loader.prototype.load = function(url, data, callback, dataType, posttype) {

	this.url = url + chache();
	this.posttype = posttype || 'get';
	this.dataType = dataType || 'json';
	this.callBack = callback;
	var self  = this;

	$.ajaxPrefilter( 'xml json html script text', function( options ) { options.crossDomain = true; }); 
	this.request = $.ajax({
		type: posttype,
		dataType: dataType || 'json',
		timeout: Config.timer.servlet, //サーブレットのタイムアウト値を使用
		url: url,
		data: data,
		success: $.proxy( self.ajaxOnSuccess, self ),
		error: $.proxy( self.ajaxOnError, self ),
		statusCode: $.proxy( self.ajaxStatusCode, self ),
	});

	console.log( this.url, "load", this.posttype );
};

/**
 * ロード完了
 * @param  {[type]} data       [description]
 * @param  {[type]} textStatus [description]
 * @param  {[type]} jqXHR      [description]
 * @return {[type]}            [description]
 */
Loader.prototype.ajaxOnSuccess = function(data, textStatus, jqXHR) {

	console.log( this.url, "ajaxOnSuccess" );

	if( empty(data) ) {
		//error
		this.callBack( false );
		return;
	}

	//エラーチェック
	switch( this.dataType ) {
		case "xml":
			//console.log( $(data).find("root").attr("id") );
			if( $(data).find("root").attr("id") == "error" ) {
				//エラー
				var code = $(data).find("error").attr("code");
				this.callBack( false, code, data );
				return;
			}
			break;

		case "json":
			break;
	}

	this.callBack( data );

};

/**
 * エラー
 * 基本的に通信エラー
 * @param  {[type]} XMLHttpRequest  [description]
 * @param  {[type]} textStatus  [description]
 * @param  {[type]} errorThrown [description]
 * @return {[type]}             [description]
 */
Loader.prototype.ajaxOnError = function(XMLHttpRequest, textStatus, errorThrown) {
	if( !empty( this.callBack ) ) {
		this.callBack( false, textStatus, errorThrown );
	}
};
;;
/**
 * 値段表示
 * @param  {[type]} val    [description]
 * @param  {[boolean]} no_tax [税別金額表示]
 * @param  {[boolean]} fix_include_tax [税込固定/注文履歴の合計金額など]
 * @return {[type]}        [description]
 */
function priceText( val, no_tax, fix_include_tax ) {

	var txt = "";

	val = String( val ).replace( /円||,/g, "" );
	if( empty( val ) || isNaN(val) ) val = 0;
	val = Number( val ).format();

	if( no_tax ) {
		txt += String( $emenu.alternate.getString( "no_tax" ) ).replace(/%price%/g, val );
	} else if( fix_include_tax ) {
		txt += String( $emenu.alternate.getString( "fix_include_tax" ) ).replace(/%price%/g, val );
	} else if( Config.include_tax.enable ) {
		txt += String( $emenu.alternate.getString( "include_tax" ) ).replace(/%price%/g, val );
	} else {
		switch( Config.include_tax.type ) {
			case 3:
				txt += String( $emenu.alternate.getString( "wo_tax_3" ) ).replace(/%price%/g, val );
				break;
			case 4:
				txt += String( $emenu.alternate.getString( "wo_tax_4" ) ).replace(/%price%/g, val );
				break;
			default:
				txt += String( $emenu.alternate.getString( "wo_tax_0" ) ).replace(/%price%/g, val );
				break;
		}
	}

	return txt;
};/**
 * Scroll
 * 断続的にイベントを発行する
 */
;
(function(){
	"use strict";

	$.fn._scroll = function( fn, msec ) {

		var timer = null;
		var stoptimer = null;
		var time = (msec) ? msec : 300;
		var bol = false;
		
		$(this).unbind("scroll");  
		$(this).bind('scroll',function( e ) {
			if( bol ) return;
			bol = true;
			fn(e);
			timer = setTimeout(function() {
				bol = false;
				clearTimeout( timer );
				fn(e);
			}, time );
		});
		// $(this).bind('scroll', function( e ) {
		// 	if (stoptimer) {
		// 		clearInterval(stoptimer);
		// 	}
		// 	stoptimer = setInterval(function(){
		// 		fn( e );
		// 		clearInterval(stoptimer);
		// 		e.preventDefault();
		// 		return false;
		// 	} , 200 );
		// });
	};

})();;;
/**
 * Sound
 * 全てのサウンドをとめてから再生
 */
(function(){
	"use strict";

	$.fn.soundPlay = function() {
console.log( "soundPlay" )
		//iOSはTCS連携を使ってサウンドを鳴らす
		var ua = $(window).isTablet();
		if( ua == "ipad" && ( !Config.islocal || $emenu.training_bol ) ) {
			
			var idname = $(this).attr("id");
			window.localSoundPlay(idname);

		} else if( ua == "windowstabret" ) {

			var idname = $(this).attr("id");
			window.localSoundPlay(idname);
			
		}else{

			$( "audio" ).each(function(){
				$(this).get(0).pause();
				if (!isNaN($(this).get(0).duration)) {
					$(this).get(0).currentTime = 0;
				}
			});

			var self = $(this);
			var timer = $.timer(function() {
				self.get(0).play();
				this.stop();
			}, 100, 1);
 		}
	};
})();;;
/**
 * Video
 * TCSのVideoから再生
 */
(function(){
	"use strict";

	// videoを開始
	$.fn.videoPlay = function( id ) {

		//iOSはvideoタグで再生
		var ua = $(window).isTablet();
		if( ua != "android" || Config.islocal || (ua == "android" && !empty(Config.no_movieplayer) && Config.no_movieplayer) ) {

			if( String(id).substr( -4, 4 ) != ".mp4" ) id = id + ".mp4";

			//Videoタグを追加
			var path = window.designpath + "screensaver/" + id;

			//.mp4
			var html = '<video id="videoFrame" style="z-index:990;position:absolute;background:#000;top:0;left:0" width="100%" height="100%" muted="muted" preload="true"  poster="design_cmn/skin/poster.png">';
			html += '<source src="' + path + '">';
			html += '<object>';
			html += '<embed src="' + path + '" type= "application/x-shockwave-flash" allowfullscreen="false" allowscriptaccess="always" />';
			html += '</object>';
			html += '</video>';
			$("#main").append( html );


			var video = $("#videoFrame").get(0);

			//動画の再生開始
			video.oncanplaythrough = function(){
				video.play();
			}

			//動画の再生終了
			video.addEventListener( 'ended' ,function() {
				$("#videoFrame").remove();
				$(document).trigger("FINISH_VIDEO");
				$emenu.log.send("0","VIDEO,再生終了");
			}, false );

			//動画ロード途中での停止
			video.onstalled = function() {
			}
			video.onerror = function() {
			}

			//クリック
			$("#videoFrame")._click(function() {
				$("#videoFrame").remove();
				$(document).trigger("FINISH_VIDEO");
				$emenu.log.send("0","VIDEO,クリックで再生終了");
			});
			
		}　else　{

			//TCSに通知
			window.startVideo( id );

 		}
	};

	// videoの停止
	$.fn.stopVideo = function() {
		var ua = $(window).isTablet();
		if( ua != "android" || ( Config.islocal ) || (ua == "android" && !empty(Config.no_movieplayer) && Config.no_movieplayer) ) {
			
			//Videoタグを追加
			$("#videoFrame").remove();
			
		}　else　{

			//TCSに通知
			window.stopVideo();

 		}
	}

})();;;
/**
 * 割り勘
 */
var AccountDivision = function( scope ) {
	
	var self = this;
	var scope = scope;

	this.total_price;
	this.m_person = 0;
	this.f_person = 0;
	this.m_price = 0;
	this.f_price = 0;
	this.price_focus;

	//初期化イベントリスナー
	$(document).bind("BOOT", function(){
		self.init();
	});
	//チェックアウト
	$(document).bind("CHECKOUT", function() { self.init(); });

	//closeボタン
	$("#account-division .close-btn")._click(function(){
		self.hide();
	});

	//menのpersonのadd
	$("#account-division .men .num-area .add")._click(function(){
		self.m_person++;
		if(  self.m_person + self.f_person > scope.person) {
			//全体を超えた場合には女性を減算
			self.f_person--;
			if(  self.f_person < 0 ) {
				self.f_person = 0;
				self.m_person = scope.person;
			}
		}
		self.price_focus = null;
		self.change();
	});
	//menのpersonのdecrement
	$("#account-division .men .num-area .decrement")._click(function(){
		self.m_person--;
		if(  self.m_person < 0 ) {
			self.m_person = 0;
		}
		self.price_focus = null;
		self.change();
	});

	//womenのpersonのadd
	$("#account-division .women .num-area .add")._click(function(){
		self.f_person++;
		if(  self.m_person + self.f_person > scope.person) {
			//全体を超えた場合には女性を減算
			self.m_person--;
			if(  self.m_person < 0 ) {
				self.m_person = 0;
				self.f_person = scope.person;
			}
		}
		self.price_focus = null;
		self.change();
	});
	//womenのpersonのdecrement
	$("#account-division .women .num-area .decrement")._click(function(){
		self.f_person--;
		if(  self.f_person < 0 ) {
			self.f_person = 0;
		}
		self.price_focus = null;
		self.change();
	});


	//menのpriceのadd
	$("#account-division .men .price-area .add")._click(function(){
		self.price_focus = "m";
		self.m_price +=  Config.account_division.price_raund;
		if( self.m_price < self.total_price ) {
			self.m_price = Math.round(self.m_price/Config.account_division.price_raund) * Config.account_division.price_raund;	
		} else {
			self.m_price = self.total_price;
		}
		self.change();
	});
	//menのpriceのdecrement
	$("#account-division .men .price-area .decrement")._click(function(){
		self.price_focus = "m";
		self.m_price -=  Config.account_division.price_raund;
		if( self.m_price > 0 ) {
			self.m_price = Math.round(self.m_price/Config.account_division.price_raund) * Config.account_division.price_raund;			
		} else {
			self.m_price = 0;
		}
		console.log( "self.m_price", self.m_price )
		self.change();
	});
	//womenのpriceのadd
	$("#account-division .women .price-area .add")._click(function(){
		self.price_focus = "f";
		self.f_price +=  Config.account_division.price_raund;
		if( self.f_price < self.total_price ) {
			self.f_price = Math.round(self.f_price/Config.account_division.price_raund) * Config.account_division.price_raund;	
		} else {
			self.f_price = self.total_price;
		}

		self.change();
	});
	//womenのpriceのdecrement
	$("#account-division .women .price-area .decrement")._click(function(){
		self.price_focus = "f";
		self.f_price -=  Config.account_division.price_raund;
		if( self.f_price > 0 ) {
			self.f_price = Math.round(self.f_price/Config.account_division.price_raund) * Config.account_division.price_raund;			
		} else {
			self.f_price = 0;
		}
		self.change();
	});



	this.init = function(){
		this.hide();
	}

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function() {

		var data = scope.check_order.order_data;

		if(!empty(Config.check_order.total_no_tax_display) && Config.check_order.total_no_tax_display) {
			var total = String( data.total ).replace( /円||,/g, "" );
			if( empty( total ) || isNaN(total) ) total = 0;
			total = Number( total ).format();
			$("#account-division .total-price").html( String( $emenu.alternate.getString( "wo_tax_0" ) ).replace(/%price%/g, total ) );
		} else {
			$("#account-division .total-price").html( priceText(data.total, false, Config.check_order.total_include_tax) );
		}
		
		

		self.total_price = data.total;

		//男女比率は初期半々にする
		//奇数の場合は男性多めにする
		self.m_person = Math.round( scope.person/2 );
		self.f_person = scope.person - self.m_person;
		//初期金額は人数等分
		var p = Math.ceil(  data.total/scope.person );
		self.m_price = p;
		self.f_price = p;

		self.change();

		$("#account-division").show();
	}


	this.change = function() {

		if( self.price_focus == "m" ) {
			//男性の金額を固定
			var mtotal = self.m_price * self.m_person;
			var sum = self.total_price - mtotal;
			if( self.f_person && sum > 0) {
				self.f_price = Math.ceil( sum / self.f_person );
			} else {
				self.f_price = 0;

				//女性が0の場合には女性にすべてつける
				if( self.m_person ) {
					self.m_price = Math.ceil( self.total_price / self.m_person  );
				} else {
					self.m_price = self.total_price;
				}
			}
			

		} else if( self.price_focus == "f" ) {
			//女性の金額を固定
			var ftotal = self.f_price * self.f_person;
			var sum = self.total_price - ftotal;
			if( self.m_person && sum > 0) {
				self.m_price = Math.ceil( sum / self.m_person );
			} else {
				self.m_price = 0;
				
				//男性が0の場合には女性にすべてつける
				if( self.f_person ) {
					self.f_price = Math.ceil( self.total_price / self.f_person  );
				} else {
					self.f_price = self.total_price;
				}
			}			

		} else {

			var is_price = self.total_price;
			if(self.m_person + self.f_person > 0) {
				var is_price = Math.ceil( self.total_price / ( self.m_person + self.f_person ) );
			}

			self.m_price = (self.m_person) ? is_price : 0;
			var mtotal = self.m_price * self.m_person;
			var sum = self.total_price - mtotal;
			if( self.f_person ) {
				self.f_price = Math.ceil( sum / self.f_person );
			} else {
				self.f_price = 0;
			}

			//人数が00の場合にはトータルを男性に表示
			if(self.m_person + self.f_person == 0) {
				self.m_price = self.total_price;
			}
		}

		$( "#account-division .men .person").text( self.m_person );
		$( "#account-division .men .price").text( Number(self.m_price).format() );
		$( "#account-division .women .person").text( self.f_person );
		$( "#account-division .women .price").text( Number(self.f_price).format() );
	}


	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		self.total_price = 0;
		self.m_person = 0;
		self.f_person = 0;
		self.m_price = 0;
		self.f_price = 0;
		self.price_focus = null;

		$( "#account-division" ).hide();
	}
};;

var AdLocalMessage = function( scope ) {

	var self = this;
	var scope = scope;

	//クローズボタン
	$("#adlocalmessage .close-btn")._click(function(){
		self.hide();
	});

	//初期化イベントリスナー
	$(document).bind("BOOT", function() { self.init(); } );
	//チェックアウト
	$(document).bind("MODE_CHANGE CHECKOUT", function() { self.hide(); } );

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	this.init = function() {

	}

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function( str ) {

		if( empty( str ) || str == "" ) return;

		try {

			var str1 = scope.alternate.getString( str );
			if( !empty(str1) ) {
				str = str1;
			}

		} catch(e) {

		}

		str = str.replace(/&#10;|\n/g, '<br>');
		$("#adlocalmessage .message").html( str );
		$("#adlocalmessage").show();

		$(document).trigger("ADLOCAL_MSG_SHOW");

		//サウンドを再生
		$("#sound4").soundPlay();

	}

	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#adlocalmessage").hide();
	}

};;
/**
 * 店舗メッセージ
 */
var AdMessage = function( scope ) {

	var self =this;
	var scope = scope;

	this.message;

	//チェックアウトした場合は卓指定メッセージの場合があるので、店舗メッセージに切り替え
	//チェックアウト
	$(document).bind("CHECKOUT", function() { 
		self.setMessage( ExternalInterface.message );
	});

	//トップ
	$("#fcategory-top").bind( "SHOW", function() {
		console.log( "view_top_admessage" );
		if( empty( Config.fcategory_top.admessage ) || Config.fcategory_top.admessage.enable ) {
			$("#admessage").show();
		} else {
			$("#admessage").hide();
		}
	});


	/**
	 * 起動
	 */
	this.init = function() {
		//self.setMessage();	
	};

	/**
	 * メッセージをセット
	 * @param {[type]} str [description]
	 */
	this.setMessage = function( str ) {

		self.message = str;
		str = str.replace(/&#10;|\n/g, '<br>');
		if( empty(str) || scope.alternate_bol ) {
			//代替言語の場合はデフォルト値を表示する
			str = scope.alternate.getString("admessage");
		}
		$("#admessage .message").html( str );
		
	};

	/**
	 * 代替言語のセット
	 */
	this.setAlternate = function() {
		if( scope.alternate_bol ) {
			//代替言語の場合はデフォルト値を表示する
			str = scope.alternate.getString("admessage");	
		} else {
			str = self.message;
		}
		$("#admessage .message").html( str );
	};

};;
/**
 * 基本動作はメッセージと同じだが、メニュー内で出すダイアログ
 * チェックアウトで閉じる
 * ロックはなし
 */
var Alert = function( scope ) {

	var self = this;
	var scope = scope;
	this.messages; 
		//{ "msg":"メッセージ", "action":"-1", "blink":"点滅 Boolean", "yes":"ボタン名, "no":"ボタン名"}
		//action
		//0:再起動
		//1:閉じる
		//2:注文商品にエラー（品切れ）があった場合で、カート内の対象商品を削除する場合
		//3:注文商品にエラーがあった場合で,カートをクリアする場合
		//-1:クローズボタン非表示
	this.item; //エラー商品
	this.callback;
	this.message_code; //メッセージID

	//リストの上下
	$("#alert .prev")._click(function(){
		self.setListPrev();
	});
	$("#alert .next")._click(function(){
		self.setListNext();
	});
	//リストのスクロールイベント
	$("#alert .item-list ul").scroll( function() {
		self.setListBtn();
	});


	/**
		起動
		@data メッセージデータ（alternateから）
	*/
	this.init = function( data ) {
		self.messages = data;
	};


	/**
	 * メッセージの表示
	 * @param  {[type]}   code        メッセージコード 
	 * @param  {[type]}   description 詳細
	 * @param  {[type]}   item       オーダーエラー時の商品配列
	 * @param  {Function} callback    閉じた後のcallback（クローズボタン押下後）
	 * @return {[type]}               [description]
	 */
	this.show = function( code, description, item, callback ) {
		
		if( empty(self.messages) ) return;

		var msgobj = self.messages[code];
		if( empty( msgobj ) ) { //オブジェクトなし
			//console.log("Messageデータがありません。", code);
			//return;
			//codeをそのまま表示する
			msgobj = { "msg":code, "action":1, noclass:true };
		}

		var message = $("#alert");
		var close  = $("#alert .close-btn");
		var h1 = $("#alert h1");

		//confirm用のボタンを非表示
		$("#alert .confirm").hide();

		if( self.message_code ) {
			message.removeClass( self.message_code );
		}
		message.removeClass( "in-item-list" );
		h1.removeClass( "blink in" );

		//表示
		if( !msgobj.noclass ) message.addClass( code );
		message.show();
		h1.html(msgobj.msg);
		//discriptionがある場合に表示
		if( !empty( description ) ) {
			$("#alert .description").text( code + " " + description ).show();
		} else {
			$("#alert .description").hide();
		}

		self.message_code = code;

		// エラー商品配列を生成
		var html = "";
		self.item = item;
		if( !empty(item) ) {
			//商品リストを作る
			$.each( item, function(i, id) {
				var val = scope.cart.getCartAryProductId( id );
				if( !val ) return true;
				var name = ( scope.alternate_bol ) ? val.item.alt_name_1 + val.item.alt_name_2 : val.item.name_1 + val.item.name_2;
				html += '<li><span class="name">' + name + '</span>';
				html += '<span class="price">' + val.item.price + '</span>';
				html += '<span class="num">' + val.num + '</span>';
				html += '</li>';
			});
			$( "#alert .item-list ul" ).html( html );
			$( "#alert .item-list" ).show();
			$( "#alert").addClass("in-item-list");
		} else {
			$( "#alert .item-list" ).hide();
			$( "#alert").removeClass("in-item-list");
		}
		self.setListBtn();


		if( msgobj.action == "-1" ) {
			//actionがない場合にはクローズボタンを表示しない
			$("#alert .close").hide();
		} else {
			$("#alert .close").show();
		}

		//blink
		if( msgobj.blink ) {
			//h1.addClass( "blink" );
		} else {
			//h1.addClass( "in" );
		}

		self.callback = callback;

		//クローズボタンのイベントのセット
		close._click(function(){
			switch(msgobj.action) {
				case "0" :
					scope.reboot();
					break;
				
				case "1":
					//this.scope.Hidden();
					message.hide();
					break;
				
				case "2":
					// 注文商品にエラー（品切れ）があった場合で、カート内の対象商品を削除する場合
					if( !empty(self.item) ) scope.cart.onDeleteList();
					message.hide();	
					break;
				
				case "3":
					// 注文商品にエラーがあった場合で,カートをクリアする場合
					scope.cart.onDeleteAll();
					message.hide();
					break;
					
				default :
					message.hide();
					break;
			}
			message.removeClass( self.message_code );
			h1.removeClass("in");
			//callbackがある場合には実行
			if( !empty(self.callback) ) {
				self.callback();
			}
		}, 1, "mouseup"); //下の言語切り替えをクリックすることがあるのでマウスアップ

		scope.log.send("0","ALERT,アラートを表示します。,メッセージCODE:" + code + ",DESC:" + description);
	};

	/**
		yes, noの画面
		@code メッセージコード
		@yfunc yesのcallback
		@nfunc noのcallback
	*/
	this.confirm = function( code, yfunc, nfunc ) {

		var msgobj = self.messages[code];

		if( empty( msgobj ) ) { //オブジェクトなし
			msgobj = { "msg":code, "yes":"はい", "no":"いいえ", "action":"-1"  };
		}

		$("#alert .close").hide();

		var message = $("#alert");
		var h1 = $("#alert h1");
		h1.removeClass( "blink in" );

		if( self.message_code ) {
			message.removeClass( self.message_code );
		}
		$( "#alert .item-list" ).hide();
		message.removeClass( "in-item-list" );
		$("#alert .description").hide();

		//表示
		message.addClass( code ).show();
		h1.html(msgobj.msg).addClass( "in" );

		self.message_code = code;

		//yesボタンのクリック
		$("#alert .yes").text(msgobj.yes)._click(function(){
			if( empty(yfunc) ) {
				self.hide();
			} else {
				self.hide();
				yfunc();
			}
		});
		//noボタンのクリック
		$("#alert .no").text(msgobj.no)._click(function(){
			if( empty(nfunc) ) {
				self.hide();
			} else {
				self.hide();
				nfunc();
			}
		});

		$("#alert .confirm").show();
	};

	/**
	 * setListBtn ボタンの表示セット
	 */
	this.setListBtn = function() {

		$("#alert").find(".next,.prev").hide();

		var list = $("#alert .item-list ul");
		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;

		if( list.scrollTop() >= max || sh <= list.get(0).offsetHeight ) {
			$("#alert .next").hide();
		} else {
			$("#alert .next").show();
		}
		if( list.scrollTop() <= 0 || sh <= list.get(0).offsetHeight ) {
			$("#alert .prev").hide();
		} else {
			$("#alert .prev").show();
		}
	};

	/**
	 * setListPrev 前へのボタンクリック
	 */
	this.setListPrev = function() {
		var list = $("#alert .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h * 5 ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	};

	/**
	 * setListNext 次へのボタンクリック
	 */
	this.setListNext = function() {
		var list = $("#alert .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() +  h * 5 ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	};


	/**
		非表示
	*/
	this.hide = function( code ) {

		$("#alert").hide();
		if( self.message_code ) {
			$("#alert").removeClass( self.message_code );
			self.message_code = "";
		}
	};

};;

var Alternate = function( scope ) {

	"use strict";

	var self = this;
	this.scope = scope;
	this.callback; //言語データ読み込み後のcallback
	this.lang_data; //言語データ
	this.local_data; //ショップ言語データ
	this.common_data; //共通データ
	this.language; //現在の文字ID
	
	//トップページのみで表示する
	$("#fcategory-top").bind("HIDE" , function(){
		$("#alternate-btn").hide();
	});
	$("#fcategory-top").bind("SHOW" , function(){
		if( Config.alternate.enable ) {
			$("#alternate-btn").show();
		}
	});

	//閉じるボタン
	$("#alternate .close-btn" )._click(function(){
		$("#alternate").hide();
	});

	//ボタンを使用しない
	//トップで切り替える場合もあるため
	if( !Config.alternate.button_enable ) {
		$("#alternate-btn").remove();
	}

	/**
		起動
	*/
	this.init = function( callback, background ) {

		if( Config.alternate.enable ) {
			//起動ボタン
			$("#alternate-btn").show()._click(function() {
				$("#alternate").show();
			});

			//言語設定ボタン
			var html = self.createButton();
			$("#alternate .box").html( html );
			$("#alternate .box button").each(function() {
				$(this)._click( function(){
					self.setLanguage( $(this).data("code") );
				});
			});

		} else {
			//利用しない
			$("#alternate-btn").hide();
		}

		//初期言語をセット
		self.setLanguage( Config.alternate.default, background );
		//callback
		self.callback = callback;
	}

	/**
	 * ボタンの生成
	 */
	this.createButton = function() {

		var data = Config.alternate.language;
		var html = "";
		$.each( data, function( i, val ) {
			html += '<button class="lang-' + val.id + '" data-code="' + val.id + '">' + val.name + '</button>';
		});

		return html;

	}

	/**
	 * 言語をロード
	 * @param {[type]} lang       [description]
	 * @param {[type]} background [ローディングを表示しない]
	 */
	this.setLanguage = function( lang, background ) {
		//お待ちくださいの表示
		if( !background ) {
			//言語のローディングを表示
			var loading = "お待ちください";
			var data = Config.alternate.language;
			$.each( data, function( i, val ) {
				if( val.id == lang && !empty(val.loading) ) {
					loading = val.loading;
					return false;
				}
			});
			scope.message.show( loading );
			//戻るボタンが出てしまうので、ここで強制的にhide
			$("#message .close").hide();
		}

		var timer = $.timer( function() {
		var loaderObj = new Loader();
			loaderObj.load( window.languagepath + lang + ".json", null, self.setLocalLanguage );
			self.language = lang;

			this.stop();
		}, 1000, 1 );
	}

	/**
	 * ショップ言語ファイルをロード
	 */
	this.setLocalLanguage = function( data ) {

		if( !data ) {
			//エラー
			scope.message.hide();
			//console.log( data )
			return;
		}

		self.common_data = data;

		var loaderObj = new Loader();
		loaderObj.load( window.languagepath + "shop/" + self.language + ".json", null, self.loadedLang );
	}

	/**
	 * 言語のセット
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.loadedLang = function( data ) {

		// if( !scope.checkin_bol && !scope.menu_load_background && !scope.use_stop_bol ) {
		// 	//チェックインしていない場合はロードがないのでメッセージを消す
		// 	scope.message.hide();
		// }

		if( !data ) {
			//エラー
			//TODO エラーの場合の処理を検討
			scope.message.hide();
			//ローカルがエラーび場合には継続
			//return;
		}
		if( empty( self.lang_data ) ) self.lang_data = { name:"" }

		$("body").removeClass(self.lang_data.name);
		scope.log.send("0","多言語,言語を切り替えます。言語:" + self.lang_data.name + "から" + self.common_data.name );

		self.local_data = data;
		self.lang_data = Object.merge(  self.common_data, self.local_data, true, true );

		self.language = self.lang_data.name;
		
		//言語のセット
		$.each( self.lang_data, function( key, val ) {
			$( key ).html( val );
		});

		//MainControllerにフラグをセット
		if( self.lang_data.name == Config.alternate.default ) {
			scope.alternate_bol = false;
		} else {
			scope.alternate_bol = true;
		}

		//bodyのクラスにセット
		$("body").addClass(self.language);
		$("#alternate").hide();
		
		//各画面のセット
		//メッセージ画面に言語データをセット
		scope.message.init( self.lang_data.messages );
		scope.alert.init( self.lang_data.messages );

		scope.doMsg();

		if( scope.checkin_bol ) {

			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
				scope.category.setAlternate( scope.alternate_bol );
				scope.menubody.setAlternate( scope.alternate_bol );
				scope.admessage.setAlternate( scope.alternate_bol );
				scope.fcategorytop.setAlternate( scope.alternate_bol, true );
				scope.scategorytop.setAlternate( scope.alternate_bol );
				scope.updateCart( true );
			} else {
				scope.alternate_change = true;
				scope.loadMenu( scope.menu_mode, false );
			}

		}

		$(document).trigger("ALTERNATE-CHANGE");

		//ロード完了
		if( !empty(self.callback) ) {
			self.callback();
			self.callback = null;
		}

		//もしチェックインしていなければメッセージを閉じる
		if( !scope.checkin_bol ) {
			scope.message.hide();
		}
	};


	/**
	 * 言語を更新
	 * 自動生成後のリストなど
	 * @return {[type]} [description]
	 */
	this.updateLang = function() {
		//言語のセット
		$.each( self.lang_data, function( key, val ) {
			$( key ).html( val );
		});
		//言語の更新
		console.log("Alternate updateLang");
	}

	/**
	 * 言語を返却
	 */
	 this.getString = function( key ) { 
	 	//console.log( "getString", key,  self.data[key] )
	 	return self.lang_data[key];
	 }

	 /**
	  * デフォルト言語をセット
	  */
	this.setDefaultLang = function() {
		//初期言語をセット
		if( Config.alternate.default != self.language ) {
			self.setLanguage( Config.alternate.default, true );
		}
	}
};;

var Arrival = function( scope ) {

	var self = this;
	var scope = scope;

	this.close_timer; //クローズタイマー

	//初期化イベントリスナー
	$(document).bind("BOOT", function() { self.init(); } );
	//チェックアウト
	$(document).bind("MODE_CHANGE CHECKOUT", function() { self.hide(); } );
	
	
	//クローズボタン
	$("#arrival .close-btn")._click(function(){
		self.hide();
	});
	//返却ボタン
	$("#rl-arrival .close-btn")._click(function(){
		self.setRlClear();
	});

	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {
		//self.hide();
	};

	/**
	 * 到着案内のセット
	 * @param {[type]} data [description]
	 */
	this.setArrival = function( data, type ) {

		console.log( "setArrival" )

		var html = "";
		//表示は4まで
		var leng = data.length;
		//$.each( data, function( i, item ) {
		var index = 0;
		for( var i=0; i<leng; i++ ) {
			if( index >= 4 ) break;
			var item = data[i].item;
			if(empty(item)) continue;

			//さびあり・さびぬきを破棄
			if( Config.check_order.sabiari == item.id || Config.check_order.sabinuki == item.id ) continue;

			var num = data[i].num;
			for( var k=0; k<num; k++ ) {
				html += '<li><img class="image" src="design_cmn/product/LL/' + item.code + Config.product.type + '">';
				html += '<p class="name">' + item.name_1 + item.name_2 + '</p>';
				html += '</li>'
				index++;
				if( index >= 4 ) break;
			}
			//scope.log.send("0","到着案内1," + item.id );
		};
		//0の場合もある
		//if( index == 0 ) return;
		if( index == 0 ) {
			$("#arrival .item-list ul").addClass("no-list");
		}

		$("#arrival .item-list ul").html( html ).addClass("move");
		//デフォルト画像のセット
		$("#arrival  li .image").error(function(){
			$(this).attr("src", Config.product.default_image);
		});

		$("#arrival").show();

		if( type == "rl" ) {
			$("#arrival").addClass("rl");
		} else {
			$("#arrival").removeClass("rl");
		}

		//クローズタイマー
		if( Config.arrival.autoclose > -1 ) {
			if( !empty( self.close_timer  ) ) {
				self.close_timer.stop();
			}
			self.close_timer = $.timer(function() {
				self.hide();
				this.stop();
			}, Config.arrival.autoclose, 1 );
		}

		//サウンドの再生
		//$("#sound_arrival1").soundPlay();
	};

	/**
	 * 返却案内
	 */
	this.setRlArrival = function() {

		//タイマーの停止
		if( !empty( self.close_timer  ) ) {
			self.close_timer.stop();
		}
		
		$("#arrival").hide();
		$("#rl-arrival").show();

		//サウンドの再生
		$("#sound_arrival2").soundPlay();

	};

	/**
	 * 返却要求
	 */
	this.setRlClear = function() {

		if( Config.arrival.request == "SERVER" ) {

			//サーブレットに通知
			var path = (Config.islocal) ? "request_express_control.xml" : "request_express_control";
			var data = {};
			data.TABLE_NO = scope.tableNo;
			data.TYPE = 1; //固定値
			var loaderObj = new Loader();
			loaderObj.load( window.apppath + path, data, self.loadedRlClear, 'xml' );

		} else {

			//オーダーとして通知
			var item =  scope.menudata.menumst[ Config.arrival.exec_id ];
			var item_data = [{ item:item, num:1, set:[], sub:[] }];
			var slip_no = ( Config.arrival.exec_type == "TABLE_NO" ) ? scope.tableNo : scope.slipNo;
			scope.order.setOrderRequest( slip_no, item_data, self.loadedRlClearOrder, self.onErrorRlClearOrder, Config.orderdate_insert );
			//scope.message.show( "" );
		}

	};

	/**
	 * 返却要求の完了
	 * @return {[type]} [description]
	 */
	this.loadedRlClear = function( data, code ) {
		if( !data ) {
			//error
			scope.message.show( code );
			return;
		}
		self.hide();
	};

	/**
	 * 返却要求の完了（オーダー）
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.loadedRlClearOrder = function( data ) {
		self.hide();
	}
	/**
	 * 返却要求のエラー（オーダー）
	 * @param  {[type]} code エラーコード
	 * @param  {[type]} item エラー商品
	 * @return {[type]}      [description]
	 */
	this.onErrorRlClearOrder = function( code, item ) {
		scope.message.show( code,  "exec_order", item );
		self.hide();
	}

	/**
	 * 閉じる
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#arrival").hide();
		$("#rl-arrival").hide();

		//サウンドの再生
		$("#sound_arrival1").get(0).pause();
		$("#sound_arrival1").get(0).currentTime = 0;
		$("#sound_arrival2").get(0).pause();
		$("#sound_arrival2").get(0).currentTime = 0;

		//タイマーの停止
		if( !empty( self.close_timer  ) ) {
			self.close_timer.stop();
		}
	};
};/**
	バッシング画面
*/
var Bashing = function( scope ) {

	var self = this;
	var scope = scope;

	this.step_btn_num = $( "#bashing #go-welcome button" ).length;
	this.step = 0;

	//初期化イベントリスナー
	$(document).bind("BOOT", function(){
		self.init();
	});

	//いらっしゃいませ画面移動のステップボタン
	$("#bashing #go-welcome button")._click(function(){
		self.setStep( $(this) );
	});

	//stepリセット用のボタン
	$("#bashing #go-welcome  .background")._click(function(){
		self.step = 0;
	});

	//文字色クラスをセット
	if( !empty( Config.message ) ) {
		$("#bashing").find("#bashing-text").addClass( Config.message.text_class );
	}

	/**
		起動
	*/
	this.init = function() {
	}

	/**
		表示
	*/
	this.show = function() {
		$("#bashing").show();
		self.step = 0;
	}

	/**
		ステップボタンのクリック
	*/
	this.setStep = function( btn ) {
		var index = btn.data("index");
		if( self.step+1 == index ) {
			self.step = index;
			if( index == self.step_btn_num ) {

				//言語をデフォルトに戻す	
				scope.alternate.setDefaultLang();
				
				//ステップの完了
				//いらっしゃいませ画面の表示
				scope.welcome.show();
				scope.bashing_bol = false;
				$("#bashing").hide();
				self.step = 0;

				//notifyCheckoutを通知
				window.notifyCheckout();
			}
		} else {
			self.step = 0;
		}
	};

	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#bashing").hide();
		self.step = 0;
	};
};;
/**
 * ビルボード
 */
var Billboard = function( scope ) {

	var self = this;
	var scope = scope;

	this.page = 0; //表示ページ
	this.total = 0; //トータルページ

	//クローズボタン
	$("#billboard .close-btn")._click(function(){
		self.hide();
	});

	//次へ前へ
	$("#billboard .next")._click(function() {
		$("#billboard-body img").eq(self.page).hide();
		self.page++;
		$("#billboard-body img").eq(self.page).show();
		if( self.page == self.total ) {
			$(this).hide();
		}
		$("#billboard .prev").show();
	});
	$("#billboard .prev")._click(function() {
		$("#billboard-body img").eq(self.page).hide();
		self.page--;
		$("#billboard-body img").eq(self.page).show();
		if( self.page == 0 ) {
			$(this).hide();
		}
		$("#billboard .next").show();
	});

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	this.init = function() {
		//バナーの生成
		if( !Config.billboard.enable || empty(Config.billboard.banners) ) {
			$( "#billboard-banner .item-list" ).remove();
			$( "#billboard" ).remove();
			return;
		}

		//ボタン生成
		var html = "";
		$.each( Config.billboard.banners, function( i, val ) {
			
			//モードが対象かどうか
			//val.modeが空の場合には全て対象
			//modeをストリングに変更
			var modes = $.map(val.mode, function(m) {
				return m.toString();
			});

			if( !empty(modes) && modes.indexOf( scope.menu_mode ) == -1 ) return true;

			html += '<li class="banner ' + val.type + ' bindex-' + i + ' bid-' + val.id + '"  data-index="' + i + '">';
			if( val.type != 'epark' ) html += '<img class="image" src="' + val.banner + '" />';
			html += '</li>';
		});

		$( "#billboard-banner .item-list ul" ).html( html );
		//バナー画像のエラー
		$( "#billboard-banner .item-list .image" ).error(function(){
			$(this).parents("li").remove();
		});
		//クリックイベントのセット
		$( "#billboard-banner .item-list li" )._click(function(){
			var index = $(this).data("index");
			var data = Config.billboard.banners[index];
			self.show( data );
		}, 1, "mouseup", true);

		//Epark Bannerをもっている場合はセット
		if( $("#billboard-banner .item-list li.epark").length ) {
			scope.epark.setBannerArea();
		}
	}

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function( data ) {

		$("#billboard").find(".next,.prev").hide();

		if (data.type == "movie") {
			if( empty( data.value ) ) return;

			//ムービーの再生
			//TCSに通知
			//タイマーを停止
			scope.sinage.stop();

			scope.log.send("0","BILLBOARD,バナーからムービーを再生します。:" + data.value);
			//window.registerRoll( scope.tableNo, data.value );
			//window.play();
			$("#main").videoPlay(data.value);
			
			return;

		} else if(data.type == "html") {
			//HTML
			var html = '<iframe id="billboard-body-frame" src="" sandbox="allow-same-origin allow-forms allow-scripts"></iframe>';
			$("#billboard-body").html(html);
			
			scope.message.show("loading");
			
			$.get( data.value, function(data) {
				$("#billboard-body-frame").attr("srcdoc", data.value );
				$("#billboard").show();
				scope.message.hide();
			}).error( function() {
				$("#billboard").hide();
				scope.message.hide();
			 	scope.message.show("billboard_error", "billboard");
			});
		} else if(data.type == "epark") {

			//Epark連携
			//ローカルモード時は出す
			if( Config.islocal ) {
				window.eparklogininfo("111");
			} else {
				window.startepark( "epark" );
			}
			
			scope.log.send("0","BILLBOARD,Eparkのログイン画面を呼び出します");

		} else if(data.type == "survey") {

			window.startSurvey( scope.tableNo );
			scope.log.send("0","BILLBOARD,アンケート画面を呼び出します");

		} else if(data.type == "qrcode") {

			window.startCamera();
			scope.log.send("0","BILLBOARD,QRコードリーダを呼び出します");

		} else if(data.type == "page") {

			scope.category.setCategoryCode( data.value );
			scope.log.send("0","BILLBOARD,ページを表示します");

		} else {

			if( empty( data.value ) ) return;

			//Image
			var html = "";
			if( Array.isArray(data.value) ) {
				$.each( data.value, function( i, val ) {
					html += '<img src="' + val + '" id="billbord-body-image-' + i + '" class="billbord-body-image" />';
				});
			} else {
				html = '<img src="' + data.value + '" id="billbord-body-image-0" class="billbord-body-image" />';
			}
			$("#billboard-body").html(html);

			//クラスをつける
			$("#billboard").removeClass().addClass("modal " + "id-" + data.id);

			scope.message.show("loading");
			$( "#billbord-body-image-0" ).load(function(){
				$("#billboard").show();
				scope.message.hide();
			}).error( function() {
				$("#billboard").hide();
				scope.message.hide();
			 	scope.message.show("billboard_error", "billboard");
			});

			//次へ前へボタンの表示			
			if( Array.isArray(data.value) && data.value.length > 1 ) {
				self.total = data.value.length-1;
				self.page = 0;

				$("#billboard-body").find("img").hide().first().show();
				$("#billboard .next").show();
			}

			scope.log.send("0","BILLBOARD,イメージを表示します。:" + data.value);

		}

		//イベントの発行
		$( document ).trigger("BILLBOARD_SHOW");
	}

	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#billboard").hide();
		$("#billboard-body-frame").remove();
	}


};;
/**
 * カートリスト
 */
var CartList = function( scope ) {

	var self = this;
	var scope = scope;
	var cart = scope.cart;

	var largecart_bol; //確認画面が表示中かどうか
	var change_index; //変更したリスト番号

	//キャッチアイコンタイマー
	//キャッチ画像を動かすタイマー　V2デザイン
	this.smallcart_cache_timer = $.timer(function(){
		$("#smallcart .cart-catch").addClass("move");
		$.timer(function(){
			$("#smallcart .cart-catch").removeClass("move");
			this.stop();
		}, 300, 1);
	}, Config.cart.smallcart.catch.time, false );
	
	//アラートタイマー
	this.alert_timer = $.timer(function(){ 
		self.setTimeAlert();
	}, Config.cart.timeup_alert.time , false );
	//アラートのクリックイベント
	$("#cart-timeup-alert")._click(function() {
		//self.setOrder();
		//アラートを閉じるだけに変更
		$("#cart-timeup-alert").hide();
		$(document).trigger("CART_TIMEUP_ALERT_CLOSE");

		//2回目以降
		if( Config.cart.timeup_alert.enable ) {
			self.alert_timer.play(true);
		}
	});

	//初期化イベントリスナー
	$(document).bind("CHECKIN", function(){
		self.init();
	});
	//チェックアウト
	$(document).bind("MODE_CHANGE CHECKOUT", function() { self.reset(); });
	

	//クリックイベント
	$("#smallcart .cart-open")._click( function() {
		self.setOrder();
	});

	//panelcart
	$("#panelcart .order-btn")._click( function() {
		self.setOrder();
	});
	$("#panelcart .cancel-btn")._click( function(){
		self.cancelPanel();
	});

	//largecart
	$("#largecart .order-btn")._click( function() {
		self.setLargeOrder();
	});
	$("#largecart .cancel-btn")._click( function(){
		self.cancelCart();
	});
	$("#largecart .close-btn")._click( function(){
		$("#largecart").hide();
		self.largecart_bol = false;
		//ノーマルカートをアップデート
		self.setCart( true );

		if( Config.cart.timeup_alert.enable ) {
			self.alert_timer.play(true);
		}

		$("#largecart").trigger("HIDE");
	});
	//リストの上下
	$("#largecart .prev")._click(function(){
		self.setListPrev( "large" );
	});
	$("#largecart .next")._click(function(){
		self.setListNext( "large" );
	});
	$("#largecart ul")._scroll(function(e){
		self.setListBtn();
	});
	$("#largecart ul").bind("touchend touchcancel", function(e){
		$.timer(function() {
			this.stop();
			e.preventDefault();
		}, 10, 1 );
	});

	//nomalcart
	$("#normalcart .order-btn")._click( function() {
		self.setOrder();
	});
	$("#normalcart .cancel-btn")._click( function(){
		self.cancelCart();
	});
	$("#normalcart .close-btn")._click( function(){
		$("#largecart").hide();
		self.largecart_bol = false;
	});
	//リストの上下
	$("#normalcart .prev")._click(function(){
		self.setListPrev( "normal" );
	});
	$("#normalcart .next")._click(function(){
		self.setListNext( "normal" );
	});
	$("#normalcart ul")._scroll(function(){
		self.setListBtn();
	});
	$("#normalcart ul").bind("touchend touchcancel", function(e){
		$.timer(function() {
			this.stop();
			e.preventDefault();
		}, 10, 1 );
	});
	
	//androidのバグで表示時にリストがずれるのでイベントで修正
	if(Config.cart.normal_cart.enable) {
		$("#fcategory-top").bind("HIDE",function() { 
			var timer = $.timer(function() {
				$("#normalcart .item-list ul").scrollTop(0);
				this.stop();
			}, 10 ,1);
		});
	}

	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {

		self.reset();

		//税込み表示
		if( Config.include_tax.enable ) {
			$("#normalcart, #largecart").addClass("w-tax");
		} else {
			$("#normalcart, #largecart").addClass("wo-tax");
		}

		if( !Config.cart.normal_cart.enable ) {
			$("#normalcart").remove();
		}
		if( !Config.cart.smallcart.enable ) {
			$("#smallcart").remove();
		}
	};

	/**
	 * リストのアップデート
	 * @return {[type]} [description]
	 */
	this.update = function() {

		//パネルカート
		if( Config.cart.panel_cart.enable ) {
			self.setPanel();
		}

		//ノーマルカート
		if( Config.cart.normal_cart.enable || self.largecart_bol ) {
			self.setCart();
		}

		if( scope.cart.cartAry.length ) {
			//オーダーボタンを有効化
			// var timer = $.timer( function() {
			// 	$(".cart .order button").removeAttr("disabled");
			// 	this.stop();
			// }, 300, 1 );
			$(".cart .order button").removeAttr("disabled");
			
			//カートオープンボタン
			self.setSmallcart( true );

			//警告メッセージのタイマー起動
			if( Config.cart.timeup_alert.enable ) {
				self.alert_timer.play(true);
			}
			//catchのタイマーを起動
			if( Config.cart.smallcart.catch.enable ) {
				self.smallcart_cache_timer.play(true);
			}

		} else {
			//オーダーボタンをdisabled
			// var timer = $.timer( function() {
			// 	$(".cart .order button").attr("disabled",true);
			// 	this.stop();
			// }, 300, 1 );
			$(".cart .order button").attr("disabled",true);

			//カートオープンボタン
			self.setSmallcart( false );

			//警告メッセージのタイマー停止
			$("#cart-timeup-alert").hide();
			self.alert_timer.stop();

			self.reset();
		}
	};

	/**
	 * パネルカートのセット
	 * 種類でまとめないカート
	 */
	this.setPanel = function() {

		$("#panelcart .item-list ul li").remove();

		var ary = cart.panelcartAry;
		var total = 0;
		html = "";
		$.each( ary, function( i, val ) {
			
			html += '<li data-index="' + i + '">';
			html += '<img class="image" src="design_cmn/product/LL/' + val.item.code + Config.product.type + '" >';
			html += '<span class="name">';
			
			var name = val.item.name_1 + val.item.name_2;
			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
				var name = ( scope.alternate_bol && !empty(val.item.alt_name_1) ) ? val.item.alt_name_1 + val.item.alt_name_2 : val.item.name_1 + val.item.name_2;
			}

			//セット商品
			var bprice = 0;
			var set_class = [];
			if( val.set.length ) {
				var set_name = new Array();
				$.each( val.set, function( k, sitem ) {
					var sname = sitem.item.name_1 + sitem.item.name_2;
					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						var sname =  ( scope.alternate_bol && !empty(sitem.item.alt_name_1) ) ? sitem.item.alt_name_1 + sitem.item.alt_name_2 : sitem.item.name_1 + sitem.item.name_2;
					}
					set_name.push( sname );

					if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
						var t1 = String( sitem.item.price ).replace( /円||,/g, "" );
						bprice += Number( t1 );
					} else {
						bprice += Number( sitem.item.price );
					}
					set_class.push( sitem.item.id );
				});
				name += "/" + set_name.join(",");
			}
			
			//20文字に整形
			//name.truncate( 30 );
			html += name;
			html += '</span>';

			//寿司のさび無しアイコン
			//CheckOrderのさびぬきIDを使用する
			console.log( set_class.indexOf( Config.check_order.sabinuki ) )
			if( set_class.indexOf( Config.check_order.sabinuki ) > -1 ) {
				html += '<span class="sabinuki"></span>';
			}

			html += '<span class="num">' + val.num + '</span>';

			//オプションテキストを金額として利用する
			var price = ( Number( val.item.price ) + bprice ) * Number( val.num );
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				var t1 = String( val.item.text_1 ).replace( /円||,/g, "" );
				price = ( Number( t1 ) + bprice ) * Number( val.num );
			}
			//var price = ( Number( val.item.price ) + bprice ) * Number( val.num );
			html += '<span class="price">' + priceText(price,true) + '</span>';
			html += '<span class="delete"><button data-index="' + i + '">×</button></span>';
			
			total += price;
			
			//サブ商品
			if( val.sub.length ) {
				$.each( val.sub, function( b, bitem ) {
					var bname = bitem.item.name_1 + bitem.item.name_2;
					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						var bname = ( scope.alternate_bol && !empty( bitem.item.alt_name_1 ) ) ? bitem.item.alt_name_1 + bitem.item.alt_name_2 : bitem.item.name_1 + bitem.item.name_2;
					}
					html += '<p class="sub-item" data-index="' + i + '" data-sub="true"><span class="name">' + bname + '</span>';
					html += '<span class="num">' + bitem.num + '</span>';
					
					var bprice = Number( bitem.item.price ) * Number( bitem.num );
					if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
						var t1 = String( bitem.item.text_1 ).replace( /円||,/g, "" );
						bprice = Number( t1 ) * Number( bitem.num );
					}
					html += '<span class="price">' + priceText(bprice,true) + '</span>';
					html += '<span class="delete"><button data-index="' + i + '" data-sub="' + b + '">×</button></span>';
					html += '</p>';

					total += bprice;
				});
			}

			html += '</li>';
		});
		$("#panelcart .item-list ul").html( html );

		$("#panelcart li .image").error(function(){
			$(this).attr("src", Config.product.default_image);
		});

		$("#panelcart li .delete button")._click(function(){
			self.deleteItem( $(this).data("index"), $(this).data("sub"), true);
			self.update();
		});
		//console.log( ary );
		//ハイライトしてみる
		// $("#panelcart .item-list ul li").last().addClass("highlight");
		// var timer = $.timer(function(){
		// 	$("#panelcart .item-list ul li").last().removeClass("highlight");
		// 	this.stop();
		// }, 200, 1);

		//残数メッセージの表示
		if( scope.cart.panelcart_last <= 0 ) {
			$("#panelcart #cart-limit-message").addClass("full");
			var limit = scope.alternate.getString("panelcart-limit-full-message");
			var ls =  '<em>' + scope.cart.panelcart_last + '</em>';
			limit = String(limit).replace( /%num%/gi, ls );
			$("#panelcart #cart-limit-message").html( "<p>" + limit + "</p>");
		} else {
			$("#panelcart #cart-limit-message").removeClass("full");
			var limit = scope.alternate.getString("panelcart-limit-message");
			var ls =  '<em>' + scope.cart.panelcart_last + '</em>';
			limit = String(limit).replace( /%num%/gi, ls );
			$("#panelcart #cart-limit-message").html( "<p>" + limit + "</p>");
		}

		// 合計金額
		var total_enable = Config.cart.panel_cart.total_price;
		if( total_enable ) {
			$("#panelcart .total-price").text( priceText(total) );
			$("#panelcart .total").show();
			$("#panelcart").addClass("show-price");
		} else {
			$("#panelcart .total").hide();
			$("#panelcart").removeClass("show-price");
		}

	};

	/**
	 * パネルカートの全商品クリア
	 * @return {[type]} [description]
	 */
	this.cancelPanel = function() {
		scope.message.confirm( "order_cancel", scope.cart.onDeletePanelAll );
	};


	/**
	 * スモールカート
	 * @param {[type]} bol [description]
	 */
	this.setSmallcart = function(bol) {
		if( bol ) {
			//カートオープンボタン
			$("#smallcart").addClass("show").show();
			//数量のセット
			$("#smallcart .drink-num em").text("×" + scope.cart.drink_num);
			$("#smallcart .food-num em").text("×" + scope.cart.food_num);
		} else {
			//カートオープンボタン
			$("#smallcart").removeClass("show").hide();
		}
	}


	/**
	 * カートの放置アラート
	 */
	this.setTimeAlert = function() {

		if( !scope.cart.cartAry.length ) {
			self.alert_timer.stop();
			return;
		}

		$("#cart-timeup-alert").show().addClass("in");
		self.alert_timer.stop();

		$(document).trigger("CART_TIMEUP_ALERT");
	}

	
	/**
	 * 注文ボタン
	 */
	this.setOrder = function() {

		//注文確認画面（LargeCart）を表示
		if( Config.order_confirm.enable ) {
			self.largecart_bol = true;
			self.setCart( true );
		} else if( !scope.cart.checkPersonItemFix() ) {
			//人数チェック
			return;
		// } else if( Config.order_confirm.alcohol ) {
		// 	self.alcoholCheck();
		} else {
			self.execOrder();
		}

		//注文ボタン押下でタイマーを停止
		$("#cart-timeup-alert").hide();
		self.alert_timer.stop();
	};

	/**
	 * 通常カート・確認画面のセット
	 * @param {Boolean} init 初期かどうか
	 */
	this.setCart = function( init ) {

		var target = (self.largecart_bol) ? $("#largecart") :  $("#normalcart");
		var list = target.find(".item-list");
		
		list.find( "ul li" ).remove();
		list.find(".prev,.next").hide();

		var ary = cart.cartAry.clone();
		var total = 0;
		var list_index = 0; 

		//indexを追加
		$.each(ary, function(k,value) {
			value.index = k;
		});
		ary = ary.reverse();
		
		if( !self.largecart_bol && !ary.length ) {
			target.hide();
			return;
		}

		html = "";
		$.each( ary, function( i, val ) {

			var has_set = ( !empty(val.item.select) ) ? "has_set" : "";

			html += '<li data-index="' + val.index + '" data-listindex="' + list_index + '" class="' + has_set + '"><span class="name">';
			var name = val.item.name_1 + val.item.name_2;
			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
				var name = ( scope.alternate_bol && !empty(val.item.alt_name_1) ) ? val.item.alt_name_1 + val.item.alt_name_2 : val.item.name_1 + val.item.name_2;
			}
			if( !empty( val.item.name_3 )  && Config.product.use_name3 !== false ) {
				name += "　";
				if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
					name += ( scope.alternate_bol ) ? val.item.alt_name_3 : val.item.name_3;
				} else {
					name += val.item.name_3;
				}
			}

			//セット商品
			var bprice = 0;
			if( val.set.length ) {
				var set_name = new Array();
				$.each( val.set, function( k, sitem ) {
					var sname = sitem.item.name_1 + sitem.item.name_2;
					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						var sname =  ( scope.alternate_bol && !empty(sitem.item.alt_name_1) ) ? sitem.item.alt_name_1 + sitem.item.alt_name_2 : sitem.item.name_1 + sitem.item.name_2;
					}

					set_name.push( sname );
					if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
						var t1 = String( sitem.item.text_1 ).replace( /円||,/g, "" );
						bprice += Number( t1 );
					} else {
						bprice += Number( sitem.item.price );
					}
				});
				name += " / " + set_name.join(",");
			}
			html += name;

			//変更アイコン
			if( !empty(val.item.select) ) {
				html += '<i class="edit">' + scope.alternate.getString("#largecart .edit") + '</i>';
			}

			html += '</span>';
			html += '<span class="num">' + val.num + '</span>';

			var price = ( Number( val.item.price ) + bprice ) * Number( val.num );
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				var t1 = String( val.item.text_1 ).replace( /円||,/g, "" );
				price = ( Number( t1 ) + bprice ) * Number( val.num );
			}

			html += '<span class="price">' + priceText(price,true) + '</span>';
			html += '<span class="delete"><button data-index="' + val.index + '">×</button></span>';
			html += '<span class="cart_counter">';
			html += '<button class="increment" data-index="' + val.index + '">+</button>';
			html += '<button class="decrement" data-index="' + val.index + '">-</button>';
			html += '</span>';
			html += '</li>';

			total += Number( price );

			//サブ商品
			if( val.sub.length ) {
				$.each( val.sub, function( b, bitem ) {
					list_index++;
					var bname = bitem.item.name_1 + bitem.item.name_2;
					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						var bname = ( scope.alternate_bol && !empty(bitem.item.alt_name_1) ) ? bitem.item.alt_name_1 + bitem.item.alt_name_2 : bitem.item.name_1 + bitem.item.name_2;
					}

					html += '<li data-index="' + val.index + '" data-sub="true" data-listindex="' + list_index + '"  class="sublist"><span class="name sub">' + bname + '</span>';
					html += '<span class="num">' + bitem.num + '</span>';

					var bprice = Number( bitem.item.price ) * Number( bitem.num );
					if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
						var t1 = String( bitem.item.text_1 ).replace( /円||,/g, "" );
						bprice = Number( t1 ) * Number( bitem.num );
					}

					html += '<span class="price">' + priceText(bprice,true) + '</span>';
					html += '<span class="delete"><button data-index="' + val.index + '" data-sub="' + b + '">×</button></span>';
					html += '<span class="cart_counter">';
					html += '<button class="increment" data-index="' + val.index + '" data-sub="' + b + '">+</button>';
					html += '<button class="decrement" data-index="' + val.index + '" data-sub="' + b + '">-</button>';
					html += '</span>';
					html += '</li>';

					total += Number( bprice );
				});
			}


			//セットメニュー商品
			if( val.setmenu && val.setmenu.length ) {
				$.each( val.setmenu, function( b, aitem ) {
					list_index++;
					var amenu = aitem.item.name_1 + aitem.item.name_2;
					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						var aname = ( scope.alternate_bol && !empty(aitem.item.alt_name_1) ) ? aitem.item.alt_name_1 + aitem.item.alt_name_2 : aitem.item.name_1 + aitem.item.name_2;
					}

					var aprice = Number( aitem.item.price ) * Number( val.num );

					if( aitem.set.length ) {
						var set_name = new Array();
						$.each( aitem.set, function( k, sitem ) {
							var sname = sitem.item.name_1 + sitem.item.name_2;
							if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
								var sname = ( scope.alternate_bol && !empty(sitem.item.alt_name_1) ) ? sitem.item.alt_name_1 + sitem.item.alt_name_2 : sitem.item.name_1 + sitem.item.name_2;
							}

							set_name.push( sname );
							if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
								var t1 = String( sitem.item.text_1 ).replace( /円||,/g, "" );
								aprice += Number( t1 );
							} else {
								aprice += Number( sitem.item.price );
							}
						});
						amenu += "/" + set_name.join(",");
					}

					html += '<li data-index="' + val.index + '" data-sub="true" data-listindex="' + list_index + '" class="sublist has_setmenu"><span class="name sub setmenu">';
					html += amenu;

					//変更アイコン
					if( !empty(val.item.select) ) {
						var select_open = ( aitem.select ) ? "select" : "";
						html += '<i class="edit ' + select_open + '">' + scope.alternate.getString("#largecart .edit") + '</i>';
					}
					html += '</span>';
					//親の数量を継承
					html += '<span class="num">' + val.num + '</span>';

					if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
						var t1 = String( aitem.item.text_1 ).replace( /円||,/g, "" );
						aprice = Number( t1 ) * Number( val.num );
					}

					html += '<span class="price">' + priceText(aprice,true) + '</span>';
					html += '<span class="delete"></span>';
					html += '<span class="cart_counter">';
					// html += '<button class="increment" data-index="' + i + '" data-sub="' + b + '">+</button>';
					// html += '<button class="decrement" data-index="' + i + '" data-sub="' + b + '">-</button>';
					html += '</span>';
					html += '</li>';

					total += Number( aprice );
				});
			}

			list_index++;
		});
		list.find( "ul" ).html( html );
		target.show();

		//delete
		list.find( "ul li .delete button")._click(function(){
			self.deleteItem( $(this).data("index"), $(this).data("sub") );
			self.change_index = $(this).parents("li").first().data("listindex");
			//self.setCart();
		});
		//increment
		list.find( "ul li .cart_counter .increment")._click(function(){
			self.incrementItem( $(this).data("index"), $(this).data("sub") );
			self.change_index = $(this).parents("li").first().data("listindex");
			//self.setCart();
		});
		//decrement
		list.find( "ul li .cart_counter .decrement")._click(function(){
			self.decrementItem( $(this).data("index"), $(this).data("sub") );
			self.change_index = $(this).parents("li").first().data("listindex");
			//self.setCart();
		});

		// 合計金額
		var total_enable = (self.largecart_bol) ? Config.order_confirm.total_price : Config.cart.normal_cart.total_price;
		if( total_enable ) {
			target.find(".total-price").html( priceText(total) );
			target.find(".total").show();
			target.addClass("show-price");
		} else {
			target.find(".total").hide();
			target.removeClass("show-price");
		}

		//カートに追加された商品をハイライト
		//scope.cart.order_product
		//scope.cart.order_index
		//セレクトが表示している場合にはハイライトしない
		//処理が不安定なのでハイライトしない
		if( false && !init && !(self.largecart_bol || ary.length <= 1) && !$("#select").isVisible() ) {
			var item;

			if( self.change_index == -1 ) {
				self.change_index = scope.cart.order_index;
			}

			item = list.find( "li" ).eq(self.change_index);
			if( !item.length ) {
				item = list.find( "li" ).last();
			}

			if( item.length ) {
				item.addClass("highlight");
				var timer = $.timer(function(){
					item.removeClass("highlight");
					this.stop();
				}, 200, 1);
				list.find("ul").scrollTop( item.get(0).offsetTop - item.get(0).offsetHeight );
			}
			
		} 
		self.change_index = -1;

		//変更クリックのセット
		list.find( "ul li.has_set .name")._click(function() {
			var index = $(this).parents("li").data("index");
			scope.select.show( cart.cartAry[index].item, null, index );
		});
		list.find( "ul li.has_setmenu .name")._click(function() {
			var index = $(this).parents("li").data("index");
			var setdata = Object.clone(cart.cartAry[index]);
			
			if( $(this).find(".edit").hasClass("select") ) {
				scope.select.show( cart.cartAry[index].item, null, index );
			} else {
				setdata.setmenu = [];
				scope.setmenu.show( setdata, index );
			}
		});
		

		//recommend
		if( !empty(Config.recommend) && Config.recommend.largecart ) {
			scope.recommend.createList( $("#largecart .recommend") );
		}

		target.trigger( "SHOW" );

		$.timer( function() {
			self.setListBtn();
			this.stop();
		}, 100, 1 );
	};


	/**
	 * 注文確認画面注文ボタン
	 */
	this.setLargeOrder = function() {
		//人数チェック
		if( !scope.cart.checkPersonItemFix() ) {
			return;
		// } else if( Config.order_confirm.alcohol ) {
		// 	//アルコールチェック
 	// 		self.alcoholCheck();
		} else {
			self.execOrder();
		}
		
		$("#largecart").hide();
		self.largecart_bol = false;
	};


	/**
	 * 注文確認画面の全商品クリア
	 * @return {[type]} [description]
	 */
	this.cancelCart = function() {
		scope.message.confirm( "order_cancel", function(){
			scope.cart.onDeleteAll();
			//$( "#largecart").hide();
			self.reset();
		});
	};


	/**
	 * アルコールチェック
	 * @return {[type]} [description]
	 */
	this.alcoholCheck = function() {

		if( Config.order_confirm.alcohol ) {
			if( cart.getAlcohol() ) {
				scope.message.confirm( "alcohol_check", self.execOrder );
			} else {
				self.execOrder();
			}
		} else {
			self.execOrder();
		}

	};

	/**
	 * 注文
	 * @return {[type]} [description]
	 */
	this.execOrder = function() {
		//scope.message.hide();
		scope.execOrder();
	};

	/**
	 * 商品の削除
	 * @param  {[type]} index cart内のindex
	 * @param  {[type]} sub商品かどうか
	 * @param  {[type]} panelCartかどうか
	 * @return {[type]}       [description]
	 */
	this.deleteItem = function( index, sub, panel ) {
		var data;
		index = Number(index);
		if( panel ) {
			data = cart.panelcartAry[index];
		} else {
			data = cart.cartAry[index];
		}
		//sub商品かどうか
		if( !empty(sub) ) {
			var sdata = data.sub[sub];
			cart.onSubDelete( data, sdata, index, sub );
		} else {
			cart.onDelete( data, index );
		}
	};

	/**
	 * 商品の加算
	 * @param {[type]} [index] [cart内のindex]
	 * @param {[type]} [sub] [sub商品かどうか]
	 * @return {[type]} [description]
	 */
	this.incrementItem  = function( index, sub, panel  ) {
		//sub商品かどうか
		var data;
		index = Number(index);
		if( panel ) {
			data = cart.panelcartAry[index];
		} else {
			data = cart.cartAry[index];

			//セットメニューのインクリメント
			
		}
		if( !empty(sub) ) {
			var sdata = data.sub[sub];
			cart.onSubIncrement( data, sdata, index, sub );
		} else {
			cart.onIncrement( data );
		}

	};

	/**
	 * 商品の減算
	 * @param {[type]} [index] [cart内のindex]
	 * @param {[type]} [sub] [sub商品かどうか]
	 * @return {[type]} [description]
	 */
	this.decrementItem  = function( index, sub, panel  ) {
		//sub商品かどうか
		var data;
		index = Number(index);
		if( panel ) {
			data = cart.panelcartAry[index];
		} else {
			data = cart.cartAry[index];
		}
		if( !empty(sub) ) {
			var sdata = data.sub[sub];
			cart.onSubDecrement( data, sdata, index, sub );
		} else {
			cart.onDecrement( data );
		}
	};


	/**
	 * ボタンの表示セット
	 */
	this.setListBtn = function() {
		
		var target = (self.largecart_bol) ? $("#largecart") :  $("#normalcart");
		var list = target.find(".item-list ul");
		if( !list.get(0) ) return;

		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;

		if( list.scrollTop() >= max-1 || sh <= list.get(0).offsetHeight ) {
			target.find(".next").hide();
			list.scrollTop(max-1);
		} else {
			target.find(".next").show();
		}
		if( list.scrollTop() <= 1 || sh <= list.get(0).offsetHeight ) {
			target.find(".prev").hide();
			list.scrollTop(1);
		} else {
			target.find(".prev").show();
		}
	};

	/**
	 * 前へのボタンクリック
	 */
	this.setListPrev = function( cart ) {

		var target = ( cart == "normal" ) ? $("#normalcart") : $("#largecart");
		var list = target.find(".item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h * 2 ) / h );
		// list.animate( { scrollTop:sh*h }, {
		// 	'duration':100,
		// 	'complete':$.proxy( self.setListBtn, self )
		// });
		list.scrollTop( sh*h );
		//list.addClass("scroll").scrollTop( sh*h ).removeClass("scroll");
		self.setListBtn();

		list.find("li.focus").removeClass("focus");
		var index = Math.floor( list.scrollTop()/h );
		list.find("li").eq( index ).addClass("focus");

		return false;
	};

	/**
	 * 次へのボタンクリック
	 */
	this.setListNext = function( cart ) {

		var target = ( cart == "normal" ) ? $("#normalcart") : $("#largecart");
		var list = target.find(".item-list ul");

		var h = list.find("li").first().outerHeight();		
		var sh = Math.round( ( list.scrollTop() +  h * 2 ) / h );
		// list.animate( { scrollTop:sh*h }, {
		// 	'duration':100,
		// 	'complete':$.proxy( self.setListBtn, self )
		// });
		list.scrollTop( sh*h );

		list.find("li.focus").removeClass("focus");
		var index = Math.floor( list.scrollTop()/h );
		list.find("li").eq( index ).addClass("focus");

		self.setListBtn();

		return false;
	};

	/**
	 * リセット
	 * @return {[type]} [description]
	 */
	this.reset = function() {
		$("#largecart .item-list ul").html("");
		$("#panelcart .item-list ul").html("");
		$("#normalcart .item-list ul").html("");
		self.largecart_bol = false;

		$("#normalcart, #largecart").find(".total-price").text( priceText(0) );

		$("#panelcart #cart-limit-message").removeClass("full");
		var limit = scope.alternate.getString("panelcart-limit-message");
		var ls =  '<em>' + Config.cart.panel_cart.total + '</em>';
		limit = String(limit).replace( /%num%/gi, ls );
		$("#panelcart #cart-limit-message").html( "<p>" + limit + "</p>");

		//オーダーボタンをdisabled
		$(".cart .order button").attr("disabled",true);
		//カートオープンボタン
		$("#smallcart").hide();
		$("#largecart").hide();

		$("#cart-timeup-alert").hide();
		self.alert_timer.stop();

		$("#normalcart").find(".prev, .next").hide();

		$(document).trigger("CART_RESET");
	};
};;
var Category = function( scope ) {

	"use strict";

	var self = this;
	var scope = scope; //maincontroller

	this.category_ary;
	this.page_category_ary; //ページ毎にtcodeを格納
	this.page_category_code_ary; //カテゴリーコードをキーに配列に格納
	this.page_width; //ページの幅
	this.page_height; //ページの高さ
	this.cate_index; //現在のカテゴリー
	this.cate_tcode; //現在の小カテゴリーコード
	this.cate_scode; //現在の中カテゴリーコード
	this.cate_fcode; //現在の大カテゴリーコード
	this.pager_timer; //ページャーアニメ遅延
	this.alert_category_ary; //警告中カテゴリーのコード配列
	this.page_animate_set_timer; //アニメーションタイマーをセットするまでの遅延
	this.page_animate_timer; //ページ商品画像のアニメタイマー
	this.select_category_bol; //選択でカテゴリーを表示したか
	this.select_category_timer; //選択でカテゴリーを表示した場合のスクロールロックタイマー
	this.page_item_ary; //ページに配置されている商品配列を格納
	this.scroll_lock; //スクロールの処理止め
	this.has_lock_category; //ロックカテゴリーの有無

	//トップページを表示したときには、カテゴリーをリセット
	$("#fcategory-top").bind("SHOW" , function(){
		self.cate_index = null;
		self.cate_tcode = null;
		self.cate_scode = null;
		self.cate_fcode = null;
	});

	/**
	 * categoryデータ構造にセット
	 * @return {[type]} [description]
	 */
	this.init = function() {

		self.category_ary = scope.menudata.category;

		//ページ幅の初期化
		// var first = $("#menu-bodys .page").first();
		// self.page_width = first.outerWidth(true);
		// self.page_height = first.outerHeight(true);
		
		//ボタンの生成
		self.createButton();

		//初期化
		//self.setFcategory(0);
		$("#fcategory button").first().addClass("selected");
		self.alert_category_ary = new Array();
	};


	/**
		ボタンの生成
	*/
	this.createButton = function() {

		var fc_ary = self.category_ary.fcode;
		var fhtml = "";
		var shtml = "";
		var thtml = "";
		self.page_category_ary = new Array();
		self.page_category_code_ary = new Array();
		self.page_item_ary = [];

		$.each( fc_ary, function( f, fcate ) {
			//fcategory button
			//英語が設定されていない場合には日本語を表示
			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
				var fname = ( !empty( fcate.text_2 ) ) ?  fcate.text_1 + '<br>' + fcate.text_2 : fcate.text_1;
				if( scope.alternate_bol && !empty(fcate.alt_text_1) ) {
					fname = ( !empty( fcate.alt_text_2 ) ) ?  fcate.alt_text_1 + '<br>' + fcate.alt_text_2 : fcate.alt_text_1;
				}
			} else {
				var fname = ( !empty( fcate.text_2 ) ) ?  fcate.text_1 + '<br>' + fcate.text_2 : fcate.text_1;
			}
			
			var fclass = ( !empty(fcate.text_2) ) ? "l2" : "";

			fhtml += '<button id="fcate-btn-' + fcate.categorycode + '" data-index="' + f + '" data-code="' + fcate.categorycode + '" class="' + fclass + '" data-lock="' + fcate.lock + '">' + fname + '</button>';

			self.page_category_code_ary[fcate.categorycode] = { fcode:fcate, scode:fcate.scode, tcode:null };

			//ロックカテゴリー
			if( fcate.lock ) self.has_lock_category = true;

			//scategory button
			$.each( fcate.scode, function( s, scate ) {

				if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
					var sname = ( !empty( scate.text_2 ) ) ?  scate.text_1 + '<br>' + scate.text_2 : scate.text_1;
					if( scope.alternate_bol && !empty(scate.alt_text_1) ) {
						sname = ( !empty( scate.alt_text_2 ) ) ?  scate.alt_text_1 + '<br>' + scate.alt_text_2 : scate.alt_text_1;
					}
				} else {
					var sname = ( !empty( scate.text_2 ) ) ?  scate.text_1 + '<br>' + scate.text_2 : scate.text_1;
				}

				var sclass = ( !empty(scate.text_2) ) ? "l2" : "";

				shtml += '<button id="scate-btn-' + scate.categorycode + '" data-index="' + s  + '" data-code="' + scate.categorycode + '" data-findex="' + f + '" data-fcode="' + fcate.categorycode + '" class="' + sclass + '">';
				shtml += sname + '</button>';

				self.page_category_code_ary[scate.categorycode] = { fcode:fcate, scode:scate, tcode:scate.tcode };

				//tcategory button
				$.each( scate.tcode, function( t, tcate ) {

					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						var tname = ( !empty( tcate.text_2 ) ) ?  tcate.text_1 + '<br>' + tcate.text_2 : tcate.text_1;
						if( scope.alternate_bol && !empty(tcate.alt_text_1) ) {
							tname = ( !empty( tcate.alt_text_2 ) ) ?  tcate.alt_text_1 + '<br>' + tcate.alt_text_2 : tcate.alt_text_1;
						}
					} else {
						var tname = ( !empty( tcate.text_2 ) ) ?  tcate.text_1 + '<br>' + tcate.text_2 : tcate.text_1;
					}
					var tclass = ( !empty(tcate.text_2) ) ? "l2" : "";

					thtml += '<button id="tcate-btn-' + tcate.categorycode + '" data-index="' + t  + '" data-code="' + tcate.categorycode + '" data-findex="' + f + '" data-fcode="' + fcate.categorycode + '" data-sindex="' + s + '" data-scode="' + scate.categorycode + '" class="' + tclass + '">';
					thtml += tname + '</button>';

					//page_aryに格納
					//各categoryにindexを保存
					self.page_category_ary.push( { 
						fcode:fcate.categorycode,
						findex:f,
						scode:scate.categorycode,
						sindex:s,
						tcode:tcate.categorycode,
						tindex:t,
						data:{
							fcode:fcate,
							scode:scate,
							tcode:tcate
						}
					});

					self.page_category_code_ary[tcate.categorycode] = { fcode:fcate, scode:scate, tcode:tcate };

					//配置商品を格納
					self.page_item_ary = self.page_item_ary.concat( tcate.item );
				} );
			});
		});
		
		//店舗おすすめメニュー
		//店舗おすすめメニューが有効の場合には、ページ配列に追加
		if( scope.sys.mode_data.custom ) {
			$.each( scope.custom_menudata, function(i, items) {
				console.log( items.item )
				if( !empty( items.item ) ) {
					$.each( items.item, function(k,item) {
						if( self.page_item_ary.indexOf( item ) == -1 ) {
							self.page_item_ary.push( item );
						}
					});
				}
			});
		}
				
		$("#fcategory button").remove();
		$("#scategory button").remove();
		$("#tcategory button").remove();

		fhtml = "<div class='outer'>" + fhtml + "</div>";
		shtml = "<div class='outer'>" + shtml + "</div>";
		thtml = "<div class='outer'>" + thtml + "</div>";

		//クリックイベント
		//vertical対応
		var mouse = ( !empty(Config.category.btn_click) && Config.category.btn_click ) ? "mouseup" : 'mousedown';
		var scroll = Config.category.btn_click;

		//フリックの時には音をならさない
		var sound = ( Config.flick.enable ) ? -1 : 1;

		$("#fcategory").html(fhtml).find("button").hide()._click( function() {
			//$(this).addClass("selected");
			self.setFcategory( $(this).data("code"), "head" );
			return false;
		}, sound, mouse, scroll );
		$("#scategory").html(shtml).find("button").hide()._click( function() {
			//$(this).addClass("selected");
			self.setScategory( $(this).data("code"), "head" );
			return false;
		}, sound, mouse, scroll);
		$("#tcategory").html(thtml).find("button").hide()._click( function() {
			//$(this).addClass("selected");
			self.setTcategory( $(this).data("code"), true );
		}, sound, mouse, scroll );

		//中カテゴリーのページャー
		if( Config.scategory.pager ) {
			var pager = '<div class="pager"></div>';
			$("#scategory").append( pager );
			return false;
		}
	
	};


	/**
		カテゴリーの取得
	*/
	this.getCategoryData = function( fcode, scode, tcode ) {

		var fcategory = null;
		var scategory = null;
		var tcategory = null;

		var f_leng = self.category_ary.fcode.length;
		for( var i=0; i<f_leng; i++ ) {
			var fcate = self.category_ary.fcode[i];
			if( fcode == fcate.categorycode ) {
				fcategory = fcate;
				if( empty(scode) ) {
					scategory = fcategory.scode;
					break;
				} else {
					//scode
					var s_leng = fcate.scode.length;
					for( var k=0; k<s_leng; k++ ) {
						var scate = fcate.scode[k];
						if( scode == scate.categorycode ) {
							scategory = scate;
							if( empty(tcode) ) {
								tcategory = scategory.tcode;
								break;
							} else {
								//tcode
								var t_leng = scate.tcode.length;
								for( var h=0; h<t_leng; h++ ) {
									var tcate = scate.tcode[h];
									if( tcode == tcate.categorycode ) {
										tcategory = tcate;
										break;
									}
								}
							}
						}
					}
				}
			}

		}

		return { fcode:fcategory, scode:scategory, tcode:tcategory };

	};

	/**
	 * カテゴリーの取得
	 * 　横断的に検索
	 * @param {[type]} code [カテゴリーコード（大中小どれでもOK）]
	 */
	this.getCategoryDataByCode = function( code ) {
		var data;
		var leng = self.page_category_ary.length;
		for( var i=0; i<leng; i++ ) {
			var cate = self.page_category_ary[i];
			if( code == cate.fcode ) {
				data = self.getCategoryData( code );
				break;
			} else if( code == cate.scode ) {
				data = self.getCategoryData( cate.fcode, code );
				break;
			} else if( code == cate.tcode ){
				data = cate.data; //self.getCategoryData( cate.fcode, cate.scode, cate.tcode );
				break;
			}
		}
		return data;
	};

	/**
	 * カテゴリーを表示
	 * @param {[type]} index [description]
	 * @param Object data getCategoryDataByCodeのreturnデータ
	 * @param Boolean 小カテゴリーをセットされた（中カテトップを表示しない）
	 */
	this.setCategoryCode = function( tcode, data, direct ) {

		//ロックカテゴリーの表示非表示のセット
		if( self.has_lock_category ) scope.menubody.setLockCategory( tcode, data );

		//位置を検索
		var index = 0;
		var pageobj;
		var leng = scope.menubody.visible_page.length;
		for( var i=0; i<leng; i++ ) {
			if( scope.menubody.visible_page[i].data("tcode") == tcode ) {
				index = i;
				pageobj = scope.menubody.visible_page[i];
				break;
			}
		}

		// メニューを表示
		if( !empty( scope.flipsnap ) ) {
			
			self.scroll_lock = true;
			var timer = $.timer(function() {
				self.scroll_lock = false;		
				this.stop();
			}, 1000, 1);

			scope.flipsnap.moveToPoint( index );

		} else if ( Config.flick.scroll ) {

			//スクロールアニメーション
			if( Config.flick.vertical ) { //縦スクロール
				var e = scope.menubody.page_height * index;
				//移動量
				//var diff = $("#menu-page-layout").scrollTop() - e;
				if( Config.flick.movetime > 0 ) {
					//処理が重いので注意
					$("#menu-page-layout").animate( {scrollTop:e}, { 
						duration:Config.flick.movetime,
						complete:function(){
							//scope.menubody.move();
						}
					});
				} else {
					var list = $("#menu-page-layout");
					// var left = list.scrollTop();
					// list.scrollTop(left);
					// var timer = $.timer(function(){
					// 	$("#menu-page-layout").scrollTop( e );
					// 	this.stop();
					// }, 10, 1);
					
					self.scroll_lock = true;
					var timer = $.timer(function() {
						self.scroll_lock = false;		
						this.stop();
					}, 1000, 1);
					list.scrollTop( e );
					
					list.find(".focus").removeClass("focus");
					list.find(".page").eq(index).addClass("focus");
					//list.find(".page").attr("data-focus", "false").eq(index).attr("data-focus", "true");
					// list.addClass("scroll").scrollTop( e ).removeClass("scroll");
				}
			} else {
				var e = scope.menubody.page_width * index;
				//移動量
				//var diff = $("#menu-page-layout").scrollLeft() - e;
				if( Config.flick.movetime > 0 ) {
					//処理が重いので注意
					$("#menu-page-layout").animate( {scrollLeft:e}, { 
						duration:Config.flick.movetime,
						complete:function(){
							//scope.menubody.move();
						}
					});
				} else {
					var list = $("#menu-page-layout");
					// var left = $("#menu-page-layout").scrollLeft();
					// $("#menu-page-layout").scrollLeft(left);
					// var timer = $.timer(function(){
					// 	scope.alert.show( $("#menu-page-layout").scrollLeft() );
					// 	this.stop();
					// }, 1000, 1);
					// 
					
					self.scroll_lock = true;
					var timer = $.timer(function() {
						self.scroll_lock = false;		
						this.stop();
					}, 1000, 1);
					list.scrollLeft( e );

					list.find(".focus").removeClass("focus");
					list.find(".page").eq(index).addClass("focus");
					//list.find(".page").attr("data-focus", "false").eq(index).attr("data-focus", "true");
					//list.addClass("scroll").scrollLeft( e ).removeClass("scroll");
				}
			}

		} else {

			if( Config.flick.vertical ) { //縦スクロール
				var e = scope.menubody.page_height * index;
				$("#menu-page-layout").scrollTop( e );

			} else {
				var e = scope.menubody.page_width * index;
				$("#menu-page-layout").scrollLeft( e );

				var list = $("#menu-page-layout");
				list.find(".focus").removeClass("focus");
				list.find(".page").eq(index).addClass("focus");
			}
			
		}	

		//カテゴリーインデックスのセット
		self.setCategoryIndex( index, true, direct );

		//商品のアニメーションをセットしてみる
		if( !empty( self.page_animate_set_timer ) ) {
			self.page_animate_set_timer.reset();
		}
		if( Config.category.page_animate.enable ) {

			self.page_animate_set_timer = $.timer(function(){
				$( "#menu-bodys li .anime01").removeClass("anime01");
				if( !empty( self.page_animate_timer ) ) {
					self.page_animate_timer.stop();
				}				
				var timer = Config.category.page_animate.time;
				self.page_animate_timer = $.timer(function(){
					var li = pageobj.find("li").each(function(){
						var random = Math.floor(Math.random()*100);
						if( random > 80 ) {
							$(this).find(".image").addClass("anime01");
						}
					});
					this.stop();
				}, timer, 1 );
				this.stop();
			}, 1000, 1);
			
		}
		
		//カテゴリー移動のリスナー
		scope.viewCate();

	};


	/**
	 * 大カテゴリーのセット
	 * @param {[type]} code [description]
	 */
	this.setFcategory = function( code, btn ) {

		//先頭の小カテゴリーをセット
		var data = self.page_category_code_ary[code]; //self.getCategoryDataByCode( code );
		//tcategoryの先頭をセット
		var tcode = data.scode[0].tcode[0].categorycode;

		self.setCategoryCode( tcode, data );

		if( Config.scategory.top_enable && data.scode.length >= 2 ) {
			scope.scategorytop.show( data.fcode.categorycode );
		} else {
			scope.scategorytop.hide();
		}

		if(btn=="top") {
			scope.log.send("0","大カテゴリートップボタン," + tcode );
		} else if(btn=="head") {
			scope.log.send("0","大カテゴリーボタン," + tcode );
		}

		//カテゴリーが選択された
		// self.select_category_bol = true;
		// if( !empty(self.select_category_timer) ) self.select_category_timer.stop();
		// self.select_category_timer = $.timer(function(){
		// 	self.select_category_bol = false;
		// 	this.stop();
		// }, 500, 1);
	};

	/**
	 * 中カテゴリーのセット
	 * @param {[type]} code [description]
	 * 
	 */
	this.setScategory = function( code, btn ) {
		//先頭の小カテゴリーをセット
		var data = self.page_category_code_ary[code]; //self.getCategoryDataByCode( code );
		var tcode = data.scode.tcode[0];
		self.setCategoryCode( tcode.categorycode, data );

		if(btn=="top") {
			scope.log.send("0","中カテゴリートップボタン," + tcode.categorycode );
		} else if(btn=="head") {
			scope.log.send("0","中カテゴリーボタン," + tcode.categorycode );
		}

		//カテゴリーが選択された
		// self.select_category_bol = true;
		// if( !empty(self.select_category_timer) ) self.select_category_timer.stop();
		// self.select_category_timer = $.timer(function(){
		// 	self.select_category_bol = false;
		// 	this.stop();
		// }, 500, 1);
	};

	/**
	 * 小カテゴリーのセット
	 * @param {[type]} code [description]
	 */
	this.setTcategory = function( code, btn ) {

		self.setCategoryCode( code, null, true );

		//中カテゴリートップがある場合にはここで消す
		if( Config.scategory.top_enable && $( "#scategory-top" ).isVisible() ) {
			scope.scategorytop.hide();
		}

		if(btn) {
			scope.log.send("0","小カテゴリーボタン," + code );
		}

		//カテゴリーが選択された
		// self.select_category_bol = true;
		// if( !empty(self.select_category_timer) ) self.select_category_timer.stop();
		// self.select_category_timer = $.timer(function(){
		// 	self.select_category_bol = false;
		// 	this.stop();
		// }, 500, 1);
	};

	/**
	 * 次の小カテゴリーの表示
	 * @param {[type]} diff [description]
	 */
	this.setNextPrevPage = function( diff ) {

		var index;
		var tcode;
		if( !Config.flick.enable && Config.flick.scroll ) {
			//マイナス方向の移動の場合で
			//スクロールの位置によってはページ起点にあわせる
			if( Config.flick.vertical ) {
				var st = $("#menu-page-layout").scrollTop();
				if( diff < 0 && st % scope.menubody.page_height > 0  ) {
					index = Math.floor( st / scope.menubody.page_height ) * scope.menubody.page_height;
				} else {
					index = st + ( scope.menubody.page_height * diff );
				}
				//スクロールでセットする
				var pageindex = (index > 0) ? Math.floor( index / scope.menubody.page_height ) : 0;

			} else {
				var sl = Math.round( $("#menu-page-layout").scrollLeft() ); //chromeのバグ対応
				if( diff < 0 && sl % scope.menubody.page_width > 0  ) {
					index = Math.floor( sl / scope.menubody.page_width ) * scope.menubody.page_width;
				} else {
					index = sl + ( scope.menubody.page_width * diff );
				}
				//スクロールでセットする
				var pageindex = (index > 0) ? Math.floor( index / scope.menubody.page_width ) : 0;
			}

			var pageobj = scope.menubody.visible_page[pageindex];
			tcode = pageobj.data("tcode");
			self.setCategoryCode( tcode );

		} else {

			//flickのセット
			index = self.cate_index + diff;
			if(index < 0) index = 0;
			
			var page = scope.menubody.visible_page;
			if(index > page.length) index = page.length -1;

			var pageobj = page[index];
			tcode = pageobj.data("tcode");
			self.setCategoryCode( tcode );

		}


		if(diff == -1) {
			scope.log.send("0","前のページ," + tcode );
		} else {
			scope.log.send("0","次のページ," + tcode );
		}

		//カテゴリーが選択された
		// self.select_category_bol = true;
		// if( !empty(self.select_category_timer) ) self.select_category_timer.stop();
		// self.select_category_timer = $.timer(function(){
		// 	self.select_category_bol = false;
		// 	this.stop();
		// }, 500, 1);
	};

	/**
		フリックのときのカテゴリー
		　フリックのアニメーション完了で呼ばれる
	*/
	this.setFlick = function( index ) {

		if( self.scroll_lock ) return;

		//カテゴリー変更のイベント
		self.setCategoryIndex( scope.flipsnap.currentPoint, false );

		var page = scope.menubody.visible_page[scope.flipsnap.currentPoint];
		var tcode = page.data("tcode");
		scope.log.send("0","フリック," + tcode );
	};

	/**
	 * スクロールしたときのカテゴリー
	 */
	this.setScroll = function() {

		if( self.scroll_lock ) return;

		var par = 0;
		if( Config.flick.vertical ) { //縦スクロール
			var scroll = $("#menu-page-layout").scrollTop();
			var pageindex = (scroll > 0) ? Math.floor( scroll / scope.menubody.page_height ) : 0;
			par = scroll % scope.menubody.page_height;
		} else {
			var scroll = $("#menu-page-layout").scrollLeft();
			var pageindex = (scroll > 0) ? Math.floor( scroll / scope.menubody.page_width ) : 0;
			par = scroll % scope.menubody.page_width;
		}

		//カテゴリー変更のイベント
		//スクロールの場合はindexを1つ進めてみる
		var diff = ( scroll > 100 && par > 100 ) ? 1 : 0;
		self.setCategoryIndex( pageindex+diff, false, true );


		var page = scope.menubody.visible_page[pageindex+diff];
		var tcode = page.data("tcode");
		scope.log.send("0","スクロール," + tcode );		

		//$("#info").remove(".a2").append('<p class="a2">' + $("#menu-page-layout").scrollTop() + '</p>');
	};


	/**
	 * カテゴリー変更のイベント
	 * カテゴリーが変わったかチェック
	 * @param Number index ページインデックス
	 * @param Boolean pager ページャーを動かすかどうか
	 * @param Boolean direct 小カテを指定
	 * @param Object data カテゴリーデータ
	 */
	this.setCategoryIndex = function( index, pager, direct ) {

		var page = scope.menubody.visible_page[index];
		var tcode = page.data("tcode");

		self.cate_index = index;

		if(self.cate_fcode != page.data("fcode")) {
			//大カテゴリーが変わった
			self.cate_fcode = page.data("fcode");
			self.cate_scode = page.data("scode");
			self.cate_tcode = tcode;

			//中カテトップのチェック
			var data = self.page_category_code_ary[self.cate_fcode]; //self.getCategoryDataByCode(self.cate_fcode);

			//direct
			//直接小カテが呼ばれた場合には表示しない
			//if( Config.scategory.top_enable && data.scode.length >= 2 && !direct ) {
			// if( Config.scategory.top_enable && data.scode.length >= 2 && !direct ) {
			// 	scope.scategorytop.show( data.fcode.categorycode );
			// } else {
			// 	scope.scategorytop.hide();
			// }

			var alert = self.setCategoryAlert( data.fcode );
			if( !alert ) {

				var sdata = self.page_category_code_ary[self.cate_scode]; //self.getCategoryDataByCode( self.cate_scode );
				var alert_s = self.setCategoryAlert( sdata.scode );
				if( !alert_s ) {
					var tdata = self.page_category_code_ary[self.cate_tcode]; //self.getCategoryDataByCode( self.cate_tcode );
					var alert_t = self.setCategoryAlert( tdata.tcode );
				}
			}

		} else if(self.cate_scode != page.data("scode")) {

			//中カテゴリーが変わった
			self.cate_scode = page.data("scode");
			self.cate_tcode = tcode;

			//中カテトップのチェック
			var data = self.page_category_code_ary[self.cate_scode]; //self.getCategoryDataByCode(self.cate_scode);

			var alert = self.setCategoryAlert( data.scode );
			if( !alert ) {
				var tdata = self.page_category_code_ary[self.cate_tcode]; //self.getCategoryDataByCode( self.cate_tcode );
				var alert_t = self.setCategoryAlert( tdata.tcode );
			}

		} else if(self.cate_tcode != tcode) {
			//小カテゴリーが変わった
			self.cate_tcode = tcode;

			//中カテトップのチェック
			var data = self.page_category_code_ary[self.cate_tcode]; //self.getCategoryDataByCode(self.cate_tcode);
			self.setCategoryAlert( data.tcode );
		}

		//カテゴリーボタンのセット
		self.setCategoryBtn( tcode, pager );

	};


	/**
	 * カテゴリーボタンのセット
	 * @param String code カテゴリーコード
	 * @param Boolean pager_anime ページャーのアニメーション
	 */
	this.setCategoryBtn = function( code, pager_anime ) {

		var cdata =  self.page_category_code_ary[code]; //self.getCategoryDataByCode( code );
		var page = "";

		//大カテゴリーボタン
		$("#fcategory button").removeClass("selected").each(function(){
			
			var code = $(this).data("code");
			var btnlock = $(this).data("lock");
			var is = (code == cdata.fcode.categorycode);

			//ロックカテゴリーの判定
			//ロックカテゴリーの場合にはそれしか出さない
			if( cdata.fcode.lock ) {
				if( is ) {
					$(this).show();
				} else {
					$(this).hide();
				}
			} else {
				//ロックカテゴリーを出さない
				if( btnlock ) {
					$(this).hide();
				} else {
					$(this).show();
				}
			}

			//選択状態
			if( is ) {
				$(this).addClass( "selected" );
			}
		});

		//中カテゴリーボタン
		var sv = 0;
		$("#scategory").removeClass("has_one");
		$("#scategory button").hide().removeClass("selected").each(function(){

			if( $(this).data("fcode") == cdata.fcode.categorycode ) {
				$(this).show();
				sv++;
			} else {
				//$(this).hide();
			}

			//if( $(this).data("code") ==  cdata.scode.categorycode ) {
			if( $(this).data("code") ==  cdata.scode.categorycode ) {
				$(this).addClass( "selected" );
				//pagerのセット
				//scrollEventでセットする
				if( Config.scategory.pager ) {
					var leng = cdata.scode.tcode.length;
					var x = $(this).offset().left + $(this).outerWidth() / 2;
					$("#scategory .pager").css("left", x).removeClass("in");
					//アニメーション
					if( Config.scategory.pager_animate ) {
						if( pager_anime ) {
							self.pager_timer = $.timer(function(){
								$("#scategory .pager").addClass("in");
								this.stop();
							}, 100, 1);
						}
					}	
					page = leng;
				}
			}
		});
		//中カテゴリーボタンが1つしかない場合にはクラスをつける
		if( sv == 1 ) $("#scategory").addClass("has_one");

		//小カテゴリーボタン
		$("#tcategory button").hide().removeClass("selected").each(function(){
			//if( $(this).data("fcode") == cdata.fcode.categorycode && $( this ).data("scode") == cdata.scode.categorycode ) {
			if( $(this).data("fcode") == cdata.fcode.categorycode && $(this).data("scode") == cdata.scode.categorycode ) {
				$(this).show();
			} else {
				//$(this).hide();
			}

			if( $(this).data("code")  == cdata.tcode.categorycode ) {
				$(this).addClass( "selected" );

				var scode = cdata.scode;
				var index = 0;
				$.each( scode.tcode, function( i, val ) {
					if( val.categorycode == cdata.tcode.categorycode ) {
						index = i+1;
						return false;
					}
				} );
				var pagertext =  index + "/" + page;

				//ページャーをセット
				if( Config.scategory.pager ) {
					$("#scategory .pager").text(pagertext);
				}

				//ページナビ内のページ番号をセット
				if( !empty(Config.menubody.page_navi_pager) && Config.menubody.page_navi_pager.enable ) {
					//全ページ数に変更
					if( Config.menubody.page_navi_pager.total_type == "total" ) {
						pagertext = (self.cate_index+1) + "/" + scope.menubody.visible_page.length;
					}
					$(".pager-box .pager").text(pagertext);
				}
			}
		});


		//ログを出力
		//トップがない場合用に回避フラグを借り設置
		if( !window.no_page_logging ) {
			var time = scope.checkin_time.minutesAgo();
			console.log( cdata.fcode.categorycode, cdata.scode.categorycode, cdata.tcode.categorycode, time );
			$emenu.log.send("0","PAGE," +  cdata.fcode.categorycode + "," +  cdata.scode.categorycode + "," + cdata.tcode.categorycode + "," + time );
		}

		//カテゴリー変更イベントの通知
		$(document).trigger("CATEGORY");
	};


	/**
	 * カテゴリー警告
	 * @param {[type]} [varname] カテゴリーデータ
	 */
	this.setCategoryAlert = function( cdata ) {

		if( !Config.category.alert && empty(Config.category.alert) ) return;

		var code = cdata.warn;
		var data = Config.category.alert[code];
		if( code == "000" || empty( data ) ) return false;

		//モードが対象かどうか
		var mode = data.mode.split( "," );
		if( data.mode != "" && mode.indexOf( scope.menu_mode ) == -1 ) {
			return false;
		}

		//毎回かどうかのチェック
		if( self.alert_category_ary.indexOf( cdata.categorycode ) > -1 ) {
			if( !data.every ) {
				return false;
			}
		}
		scope.message.show( data.message );
		if( !data.every ) self.alert_category_ary.push( cdata.categorycode );
		
		return true;

		//カテゴリー警告
		// $.each( Config.category.alert, function( i, val ) {
		// 	//000の場合はなし

		// 	//警告チェック
		// 	var alert_bol = false;
		// 	if( code == val.code ) {
		// 		alert_bol = true;
		// 	}

		// 	//警告を出す
		// 	if( alert_bol ) {
		// 		//毎回かどうかのチェック
		// 		if( self.alert_category_ary.indexOf( val.code ) > -1 ) {
		// 			if( !val.every ) {
		// 				return false;
		// 			}
		// 		}
		// 		scope.message.show( val.message );
		// 		if( !val.every ) self.alert_category_ary.push( val.code );
		// 		return false;
		// 	}
		// });
	};


	/**
	 * 指定idの商品が登場するページを検索してセットする
	 */
	this.setFindProduct = function(id) {

		var f_leng = self.category_ary.fcode.length;
		for( var i=0; i<f_leng; i++ ) {
			var fcate = self.category_ary.fcode[i];
			//scode
			var s_leng = fcate.scode.length;
			for( var k=0; k<s_leng; k++ ) {
				var scate = fcate.scode[k];
				var t_leng = scate.tcode.length;
				for( var h=0; h<t_leng; h++ ) {
					var tcate = scate.tcode[h];
					var i_leng = tcate.item.length;
					for( var j=0; j<i_leng; j++ ) {
						var menudata = scope.menudata.menumst[tcate.item[j]];
						if( !empty( menudata ) && id == menudata.code ) {
							//商品をヒット
							var data = { fcode:fcate, scode:scate, tcode:tcate };
							self.setCategoryCode( tcate.categorycode, data, true );
							return true;
						}
					}	
				}
			}
		}
		return false;
	}


	/**
	 * 代替言語のセット
	 * @param {[type]} bol [description]
	 */
	this.setAlternate = function( bol ) {
		self.createButton();
		if( !empty( self.cate_tcode ) ) {
			self.setCategoryBtn( self.cate_tcode );
		}	
	};

};
;;
/**
 * 
 */
var CheckOrderList = function( scope ) {

	var self = this;
	var scope = scope;

	//初期化イベントリスナー
	$(document).bind("BOOT", function() { self.hide(); });
	//チェックイン
	$(document).bind("CHECKIN", function() { self.init(); });
	//チェックアウト
	$(document).bind("CHECKOUT", function() { self.hide(); });
	//オーダーストップ
	$(document).bind("FOOD_STOP DRINK_STOP ORDER_STOP", function() { self.init(); });
	//品切れ
	$(document).bind("STOCK", function() { self.setStock(); });


	//開くボタンのセット
	if( Config.check_order.enable ) {
		$("#ordercheck-btn").show();
		$("#ordercheck-btn")._click( function() {
			self.show();
		});
	} else {
		$("#ordercheck-btn").remove();
	}

	//closeボタン
	$("#check-order-list .close-btn")._click(function(){
		self.hide();
	});

	//リストの上下
	$("#check-order-list .prev")._click(function(){
		self.setListPrev();
	});
	$("#check-order-list .next")._click(function(){
		self.setListNext();
	});

	//リストのスクロールイベント
	$("#check-order-list .item-list ul")._scroll( function() {
		self.setListBtn();
	});
	$("#check-order-list .item-list ul").bind("touchend touchcancel", function(e){
		$.timer(function() {
			this.stop();
			e.preventDefault();
		}, 10, 1 );
	});

	//割り勘ボタン
	$("#check-order-list .account-btn")._click(function() {
		scope.account_division.show();
	});
	if( Config.account_division.enable ) {
		$("#check-order-list .account-btn").show();
	} else {
		$("#check-order-list .account-btn").hide();
	}

	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function(){
		self.hide();

		//税込み表示
		if( Config.check_order.total_include_tax || Config.include_tax.enable ) {
			$("#check-order-list").addClass("w-tax");
		} else {
			$("#check-order-list").addClass("wo-tax");
		}
	};

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function() {
		//最新のロード
		if( !Config.islocal ) {
			scope.check_order.send( self.loaded );
			scope.message.show("loading");
		} else {
			self.loaded( scope.check_order.order_data );
		}
		
		scope.log.send("0","CHECKORDER,注文履歴を取得します。" );
	}

	/**
	 * リストのセット
	 * @param  {[type]} data [order data]
	 * @return {[type]}      [description]
	 */
	this.loaded = function( data ) { 

		scope.message.hide();
		if( !data ) {
			//error
			scope.message.show( "5204", "check_order.xml" );
			return;	
		}
		var html = "";
		//console.log( data )
		var page_data = scope.category.page_item_ary;

		data.item.reverse();


		//提供ステータスでソート
		var n1 = new Array();
		var n2 = new Array();
		$.each( data.item, function( k, s ) {
			if( Number(s.status) == 1 ) {
				n1.push( s );
			} else {
				n2.push( s );
			}
		} )
		data.item = n1.concat(n2);

		$.each( data.item, function( i, val ) {

			var item = scope.menudata.menumst[val.id];
			
			var classes = [];
			var name = val.name;
			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt  ) {
				var name = ( scope.alternate_bol && !empty(val.alt_name) ) ? val.alt_name : val.name;
			}

			if( val.submenu ) {
				classes.push("submenu");
			}

			//オプションテキストを金額として利用してる場合には, Config.check_order.total_include_taxを使う
			//それ以外はsysの表記に順ずる
			var tax = ( Config.product.option_price_text ) ? Config.check_order.total_include_tax : false;


			//サブメニュー
			var price = Number(val.price) * Number(val.amount);
			if( !empty(val.sub) && val.sub.length ) {
				var sname = [];
				$.each(val.sub, function( k, sval ) {
					sname.push( sval.name );
					price += Number(sval.price) * Number(sval.amount);
				});
				name += "/" + sname.join();
			}

			html += '<li class="' + classes.join(" ") + '"><span class="name">' + name + '</span>';
			html += '<span class="num">' + val.amount + '</span>';
			html += '<span class="price">' + priceText(price, false, tax ) + '</span>';
			//提供済み表示
			var st = "";
			switch( val.status  ) {
				case 1: //未提供
					if( Config.check_order.not_offered.enable ) {
						st = ( Config.check_order.not_offered.type == "1" ) ? '<i class="status1">未提供</i>' : '<b class="status1">未提供</b>';
					} else {
						st = "";
					}
					break;
				case 2: //提供済
					if( Config.check_order.supply.enable ) {
						st = ( Config.check_order.supply.type == "1" ) ? '<i class="status2">提供済</i>' : '<b class="status2">提供済</b>';
					} else {
						st = "";
					}
					break;
				case 3: //管理外
					if( Config.check_order.excluded.enable ) {
						st = ( Config.check_order.excluded.type == "1" ) ? '<i class="status3">管理外</i>' : '<b class="status3">管理外</b>';
					} else {
						st = "";
					}
					break;
			}
			html += '<span class="status">' + st + '</span>';
			
			
			var disabled = "";
			if( !empty(item) ) {
				//order stopのセット
				if( scope.order_stop_bol || scope.use_stop_bol ) {
					disabled = 'disabled';
				} else if( scope.food_order_stop_bol && item.lock_sts == 1) {
					disabled = 'disabled';
				} else if( scope.drink_order_stop_bol && item.lock_sts == 2) {
					disabled = 'disabled';
				}
				//品切れ、取り扱いなし
				if( item.nohandle || item.stockout ) {
					disabled = 'disabled';
				}
				//ロックステータスが1か2のもののみ
				if( item.lock_sts != 1 && item.lock_sts != 2 ) {
					disabled = 'disabled';
				}
			} else {
				disabled = 'disabled';
			}

			//メニューに配置されていない場合には表示しない
			if( page_data.indexOf( String(val.id) ) == -1 ) {
				disabled = 'disabled';
			}

			html += '<span class="refill"><button class="refill-btn" data-id="' + val.id + '" ' + disabled + ' ></button></span>';
			html += '</li>';

		});
		$("#check-order-list .item-list ul").html(html);
		//合計金額の表示
		//$("#check-order-list .total-price").text( priceText(data.total) );
		//合計金額に税表示しない
		if(!empty(Config.check_order.total_no_tax_display) && Config.check_order.total_no_tax_display) {
			var total = String( data.total ).replace( /円||,/g, "" );
			if( empty( total ) || isNaN(total) ) total = 0;
			total = Number( total ).format();
			$("#check-order-list .total-price").html(  String( $emenu.alternate.getString( "wo_tax_0" ) ).replace(/%price%/g, total ) );
		} else {
			$("#check-order-list .total-price").html( priceText(data.total, false, Config.check_order.total_include_tax) );
		}
		

		//提供済みのセット
		if( Config.check_order.status ) {
			$("#check-order-list").addClass("show-status");
		} else {
			$("#check-order-list").removeClass("show-status");
		}

		//金額のセット
		if( Config.check_order.price ) {
			$("#check-order-list").addClass("show-price");
		} else {
			$("#check-order-list").removeClass("show-price");
		}

		//おかわりのセット
		if( Config.check_order.refill ) {
			$("#check-order-list").addClass("show-refill");

			//おかわりのクリック
			$("#check-order-list  .item-list li .refill-btn")._click(function(e){
				self.selectProduct( $(this).data("id"), e );
				var item = $(this).parents("li");
				item.addClass("highlight");

				var timer = $.timer(function(){
					item.removeClass("highlight");
					this.stop();
				}, 200, 1);
			}, 2);

		} else {
			$("#check-order-list").removeClass("show-refill");
		}


		//テキストの更新
		scope.alternate.updateLang();

		$("#check-order-list").show();

		self.setListBtn();

		$(document).trigger("CHECKORDERLIST_SHOW");

	};


	/**
	 * [setListBtn ボタンの表示セット]
	 */
	this.setListBtn = function() {

		var list = $("#check-order-list .item-list ul");
		if( !list.get(0) ) return;

		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;

		if( list.scrollTop() >= max-1 || sh <= list.get(0).offsetHeight ) {
			$("#check-order-list .next").hide();
			list.scrollTop(max-1);
		} else {
			$("#check-order-list .next").show();
		}
		if( list.scrollTop() <= 1 || sh <= list.get(0).offsetHeight ) {
			$("#check-order-list .prev").hide();
			list.scrollTop(1);
		} else {
			$("#check-order-list .prev").show();
		}
	};

	/**
	 * [setListPrev 前へのボタンクリック]
	 */
	this.setListPrev = function() {
		var list = $("#check-order-list .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h * 5 ) / h );
		// list.animate( { scrollTop:sh*h }, {
		// 	'duration':100,
		// 	'complete':$.proxy( self.setListBtn, self )
		// });
		list.scrollTop( sh*h );
		//list.addClass("scroll").scrollTop( sh*h ).removeClass("scroll");
		self.setListBtn();
	};

	/**
	 * [setListNext 次へのボタンクリック]
	 */
	this.setListNext = function() {
		var list = $("#check-order-list .item-list ul");
		var h = list.find("li").first().outerHeight();
		
		var sh = Math.round( ( list.scrollTop() +  h * 5 ) / h );
		// list.animate( { scrollTop:sh*h }, {
		// 	'duration':100,
		// 	'complete':$.proxy( self.setListBtn, self )
		// });
		//list.scrollTop( sh*h );
		list.addClass("scroll").scrollTop( sh*h ).removeClass("scroll");
		self.setListBtn();
	};


	/**
	 * 商品の選択
	 * @param  {[type]} id [description]
	 * @param  {[type]} e  [description]
	 * @return {[type]}    [description]
	 */
	this.selectProduct = function( id, e ) {
		var data = scope.menudata.menumst[id];
		if( !empty(data) ) {
			var res = scope.selectProduct( data );
			if( !scope.addcart_res ) return false;

			if( empty(data.select) ) {
				var val =  { item:data, num:1, set:[], sub:[] };
				var name = ( scope.alternate_bol && !empty(val.item.alt_name_1) ) ? val.item.alt_name_1 + val.item.alt_name_2 : val.item.name_1 + val.item.name_2;

				var msg =  scope.alternate.getString("select-cartadd-message");
				msg = String(msg).replace( /%item%/gi, name );
				var html = '<div id="select-message"><p>';
				html += msg;
				html += '</p></div>';

				$("#menu-page").append(html);
				var timer = $.timer(function() {
					$("#select-message").remove();
					this.stop();
				}, 2000, 1);
			}
			
		}
	};


	/**
	 * 品切れのセット
	 */
	this.setStock = function() {
		if( $("#check-order-list").isVisible() ) {
			var stock = ExternalInterface.stock;
			$("#check-order-list .refill-btn").each(function() {
				var id = $(this).data("id");
				if( stock.indexOf( String(id) ) > -1 ) {
					$(this).attr("disabled",true);
				}
			});
		}
	}


	/**
	 * 閉じる
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#check-order-list").hide();
	};

};;
/**
 * 日替わりメニュー
 * Modalで表示する
 * カテゴリコード「９２０」
 * fair：日替り＋期間限定 カテゴリコード「９２０・９３０」
 * recommend：店舗エディットメニュー カテゴリコード「９１０」
 */
var Daily = function( scope ) {

	var self = this;
	var scope = scope;

	this.mode; //daily,fair, recommend
	this.menu; //メニューデータ
	this.menumst;

	//初期化
	$(document).bind("BOOT MODE_CHANGE CHECKOUT", function() {
		$(".daily-btn").hide();
		self.hide();
	});

	//オーダーロック
	$(document).bind("FOOD_STOP FOOD_START DRINK_STOP DRINK_START ORDER_STOP ORDER_START", function() { self.orderLock( ); } );

	//ストックのチェック
	$(document).bind("STOCK", function() { self.setStock(); } );
	//言語切り替えのチェック
	$(document).bind("ALTERNATE-CHANGE", function() { self.setAlternate(); });

	//dailyのタブボタンのセット
	$("#daily header .daily")._click( function() { 
		self.setDailyTab(); 
	});
	//fairのタブボタンのセット
	$("#daily header .fair")._click( function() {
		self.setFairTab();
	});

	//daily-btnのセット
	$(".daily-btn")._click(function(){
		self.show();
	});

	//閉じるボタン
	$( "#daily .close-btn" )._click(function(){
		self.hide();
	});

	//リストの上下
	$("#daily .prev")._click(function(){
		self.setListPrev();
	});
	$("#daily .next")._click(function(){
		self.setListNext();
	});

	//リストのスクロールイベント
	$("#daily .item-list ul")._scroll( function() {
		self.setListBtn();
	});

	//無効化
	if( !Config.custompage.enable ) {
		$(".daily-btn").remove();
	}

	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {
		self.mode = Config.custompage.type;
		self.menumst = scope.menudata.menumst;

		$(".daily-btn").hide();
		$("#daily header").hide();

		var data = scope.custom_menudata;
		var html = "";
		switch( self.mode ) {
			case "dairy":
				if( empty(data["920"]) ) return;
				var menu = data["920"]["item"];
				self.menu = menu;
				html = self.createItem( menu, "daily" );
				break; 

			case "fair":
				var menu = "";
				if( !empty(data["920"]) ) {;
					var menu = data["920"]["item"];
					html = self.createItem( menu, "daily" );
				}
				if( empty(data["930"]) ) return;
				var menu2 = data["930"]["item"];
				self.menu = menu.concat( menu2 );
				html += self.createItem( menu2, "fair" );

				//ヘッダーを表示
				$("#daily header").show();
				break;

			case "recommend":
				if( empty(data["910"]) ) return;
				var menu = data["910"]["item"];
				self.menu = menu;
				html = self.createItem( menu, "recommend" );
				break;
		}
		$("#daily .item-list ul").html( html );
		//$("#daily header .daily")._click();
		//
		//デフォルト画像のセット
		$("#daily .item-list ul .image").error(function(){
			$(this).attr("src", Config.product.default_image);
			$(this).unbind("error");
		});

		self.setDailyTab(); //Dailyを初期値にセット

		//クリックのセット
		$("#daily .item-list li").each( function() {
			//クリックイベント
			$(this)._click(function( e ){

				var id = $(this).data("id");
				var data  = self.menumst[id];
				var target = e.target;
				//詳細ボタンのクリック
				if( $(target).hasClass("detail") ) {
					scope.detail.show( data );
					return false;
				} else if( $(target).hasClass("increment") && empty(data.select) && empty(data.setmenu) ) {
					scope.cart.onIncrement( { item:data, num:1, set:[], sub:[], setmenu:[] } );
					return false;
				} else if( $(target).hasClass("decrement") && empty(data.select) && empty(data.setmenu) ) {
					scope.cart.onDecrement( { item:data, num:1, set:[], sub:[], setmenu:[] } );
					return false;
				}

				//商品のセット
				scope.selectProduct( data, e );

			}, 2, "mouseup", true); //強制的にクリックにする
		});

		
		//おすすめボタンの表示
		//どこにあってもOK？
		//一旦は大カテゴリー内に表示	
		
		//ボタンを非表示にするかどうか
		if( Config.custompage.btn_hide ) {
			$(".daily-btn").hide();
		} else {
			$(".daily-btn").show();
			if( html != "" ) {	
				//$(".daily-btn").show();
				$(".daily-btn").removeClass("disabled");
			} else {
				$(".daily-btn").addClass("disabled");
			}
		}

		//イベントでセット
		if( Config.counter.enable ) {
			$(document).bind("CART_UPDATE", self.updateCounter );
		}
	};

	/**
	 * [createItem description]
	 * @param  {[type]} item [description]
	 * @param  {[type]} key  [description]
	 * @return {[type]}      [description]
	 */
	this.createItem = function( items, key ) {

		if( !items.length ) return "";

		var html = "";
		$.each( items,  function( i, item ){

			var data = self.menumst[item];

			if( empty( data ) ) {
				html += '<li class="dummy"></li>';
				return true;
			}

			var classes = [];
			if( data.nohandle ) {
				classes.push("nohandle");
			}
			//セレクトを持っているかどうか
			if( !empty(data.select) ) {
				classes.push("has_select");
			}

			var name_1 = data.name_1;
			var name_2 = data.name_2;
			if( scope.alternate_bol && !empty(data.alt_name_1) ) {
				name_1 = data.alt_name_1;
				name_2 = data.alt_name_2;
			} 
			var name_3 = ( scope.alternate_bol && !empty(data.alt_name_3)  ) ? data.alt_name_3 : data.name_3;
			var text_1 =  ( scope.alternate_bol ) ? data.alt_text_1 : data.text_1;
			var comment_1 =  ( scope.alternate_bol ) ? data.alt_comment_1 : data.comment_1;
			var comment_2 =  ( scope.alternate_bol ) ? data.alt_comment_2 : data.comment_2;
			//オプションテキストを金額として利用する
			var price = priceText(data.price);
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				text_1 = "";
				var price = priceText(data.text_1) 
			}

			html += '<li id="product-' + data.id + '" data-id="' + data.id + '" class="product ' + key + ' ' + classes.join(" ") + '">';
			html += '<img class="image" src="design_cmn/product/LL/' + data.code + Config.product.type + '" >';
			html += '<span class="name_1">' + name_1 + '</span>';
			html += '<span class="name_2">' + name_2 + '</span>';
			html += '<span class="price">' + price + '</span>';
			html += '<span class="comment_1">' + comment_1 + '</span>';
			html += '<span class="text_1">' + text_1 + '</span>';

			//アイコンのセット
			//詳細アイコン
			//console.log( !empty(data.comment_2) && data.comment_2 != "" )
			if( !empty(comment_2) && comment_2 != "" ) html += '<button class="detail">詳細</button>';
			var icon_path = window.designpath + "icon/LL/icon_";
			if( !empty(data.icon_1) ) html += '<i class="icon_1" style="background-image:url(' + icon_path + data.icon_1 + '.png);"></i>';
			if( !empty(data.icon_2) ) html += '<i class="icon_2" style="background-image:url(' + icon_path + data.icon_2 + '.png);"></i>';
			if( !empty(data.icon_3) ) html += '<i class="icon_3" style="background-image:url(' + icon_path + data.icon_3 + '.png);"></i>';
			
			if( data.nohandle ) {
				html += '<i class="icon_nohandle">取り扱いなし</i>';
			} else if( data.stockout ) {
				html += '<i class="icon_stockout">品切れ</i>';
			}

			html += '</li>';
		});

		return html;

	};

	/**
	 * [show description]
	 * @return {[type]} [description]
	 */
	this.show = function() {

		self.setDailyTab();
		$("#daily").show();

	};

	/**
	 * Dailyタブのセット
	 */
	this.setDailyTab = function() {
		$("#daily header .fair").removeClass("selected");
		$("#daily header .daily").addClass("selected");
		//リストの切り替え
		$("#daily ul li").each(function(){
			if( $(this).hasClass("fair") ) {
				$(this).hide();
			} else {
				$(this).show();
			}
		});
		//self.setListBtn();
		var timer = $.timer(function(){
			self.setListBtn();
			this.stop();
		} , 10, 1);
	}

	/**
	 * Fairタブのセット
	 */
	this.setFairTab = function() {
		$("#daily header .daily").removeClass("selected");
		$("#daily header .fair").addClass("selected");
		//リストの切り替え
		$("#daily ul li").each(function(){
			if( $(this).hasClass("fair") ) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
		
		var timer = $.timer(function(){
			self.setListBtn();
			this.stop();
		} , 10, 1);	
	}


	/**
	 * ボタンの表示セット
	 */
	this.setListBtn = function() {

		var list = $("#daily .item-list ul");
		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;

		if( list.scrollTop() >= max || sh <= list.get(0).offsetHeight ) {
			$("#daily .next").hide();
		} else {
			$("#daily .next").show();
		}
		if( list.scrollTop() <= 0 || sh <= list.get(0).offsetHeight ) {
			$("#daily .prev").hide();
		} else {
			$("#daily .prev").show();
		}
	};

	/**
	 *  前へのボタンクリック
	 */
	this.setListPrev = function() {
		var list = $("#daily .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h * 2 ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	};

	/**
	 * 次へのボタンクリック
	 */
	this.setListNext = function() {
		var list = $("#daily .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() +  h * 2 ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	};

	/**
	 * [updateCounter description]
	 * @return {[type]} [description]
	 */
	this.updateCounter = function() {
		var id = scope.cart.order_id;
		
		$("#daily .counter").remove();
		var data = scope.cart.getCartAryWithoutSelect(); //scope.cart.cartAry;
		if( data.length ) {
			$.each( data, function( i, item ) {
				var html = '<span class="counter">';
				html += '<button class="decrement">-</button>';
				html += '<span class="count"><em>' + item.num + '</em></span>';
				html += '<button class="increment">+</button>';
				html += '</span>';
				$("#daily #product-" + item.item.id).append(html);
			});
			if( Config.counter.animate ) {
				var counter = $("#daily #product-" + id).find(".counter");
				counter.removeClass("up");
				self.counter_timer = $.timer(function(){
					counter.addClass("up");
					this.stop();
				}, Config.counter.delay, 1);
			}
		}
	}

	/**
		品切れのセット
		@items 品切れ商品配列
	*/
	this.setStock = function() {

		var items = ExternalInterface.stock;

		$("#daily .stockout").removeClass("stockout")
		$.each( items, function( i, item ) {
			html = '<i class="icon_stockout">品切れ</i>';
			$("#daily #product-" + item).addClass("stockout").append( html );
		});
	};

	/**
	 * オーダーロック
	 * @param  {[type]} mode [ロック対象 food,drink,all]
	 * @return {[type]}      [description]
	 */
	this.orderLock = function( mode ){

		if( empty( self.menu ) ) return;

		$("#daily .product").find(".icon_stop").remove();
		$("#daily .product.stop").removeClass("stop");

		if( scope.food_order_stop_bol ) {
			$.each( self.menu, function(i, item){
				var data = scope.menudata.menumst[item];
				if( !empty(data) && Number(data.lock_sts) == 1 ) {
					html = '<i class="icon_stop">終了しました</i>';
					$("#daily #product-" + item).addClass("stop").append( html );
				}
			});
		}
		if( scope.drink_order_stop_bol ) {
			$.each( self.menu, function(i, item){
				var data = scope.menudata.menumst[item];
				if( !empty(data) && Number(data.lock_sts) == 2 ) {
					html = '<i class="icon_stop">終了しました</i>';
					$("#daily #product-" + item).addClass("stop").append( html );
				}
			});
		}
		if( scope.order_stop_bol ) {
			$.each( self.menu, function(i, item){
				$("#daily #product-" + item).find(".icon_stop").remove();
				$("#daily #product-" + item).addClass("stop").append( html );
			});
		}
	};


	/**
	 * 代替言語のセット
	 */
	this.setAlternate = function() {

		var bol = scope.alternate_bol;

		//商品の変更
		$("#daily li").each( function() {
			var id = $(this).data("id");
			var data  = self.menumst[id];
			if( empty( data ) ) {
				//dummyの場合
				return true;
			}

			var name_1 = data.name_1;
			var name_2 = data.name_2;
			if( bol && !empty(data.alt_name_1) ) {
				name_1 = data.alt_name_1;
				name_2 = data.alt_name_2;
			} 
			var name_3 = ( bol && !empty(data.alt_name_3)  ) ? data.alt_name_3 : data.name_3;
			var text_1 =  ( bol ) ? data.alt_text_1 : data.text_1;
			var comment_1 =  ( bol ) ? data.alt_comment_1 : data.comment_1;
			var comment_2 =  ( bol ) ? data.alt_comment_2 : data.comment_2;
			//オプションテキストを金額として利用する
			var price = priceText(data.price);
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				text_1 = "";
				var price = priceText(data.text_1) 
			}
			//var price = ( bol ) ? data.price : data.price;
			$(this).find( ".name_1" ).html( name_1 );
			$(this).find( ".name_2" ).html( name_2 );
			$(this).find( ".name_3" ).html( name_3 );
			$(this).find( ".text_1" ).html( text_1 );
			$(this).find( ".comment_1" ).html( comment_1 );
			$(this).find( ".comment_2" ).html( comment_2 );
			$(this).find( ".price" ).html( price );

			if( !empty(comment_2) && comment_2 != "" ) {
				$(this).find(".detail").show();
			} else {
				$(this).find(".detail").hide();
			}
		});

	};

	/**
	 * [hide description]
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#daily").hide();
	};
};;
/**
 * 商品詳細
 * @param Object scope MainController
 */
var Detail = function( scope ) {

	var self = this;
	var scope = scope;

	this.data; //商品データ

	//初期化イベントリスナー
	$(document).bind("BOOT", function() { self.init(); });
	//チェックアウト
	$(document).bind("MODE_CHANGE CHECKOUT", function() { self.init(); });
	//オーダーロック
	$(document).bind("FOOD_STOP DRINK_STOP ORDER_STOP", function() { self.hide(); } );
	//ストックのチェック
	$(document).bind("STOCK", function() { self.setStockOut(); } );

	//閉じるボタン
	$( "#detail .close-btn" )._click(function(){
		self.hide();
	});

	//注文ボタン
	$("#detail .order-btn")._click(function(e){
		self.order(e);
	}, 2 );


	/**
	 * 起動
	 * @return {[type]}
	 */
	this.init = function() {
		self.hide();
	};

	
	/**
	 * 表示
	 * @param  {[type]} data
	 * @return {[type]}
	 */
	this.show = function( data ) {	

		self.data = data;

		var html = "";
		html += '<img class="image" src="design_cmn/product/LL/' + data.code + Config.product.type + chache() + '" >';
			

		if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
			var name_1 = data.name_1;
			var name_2 = data.name_2;
			var name_3 = data.name_3;

			if( scope.alternate_bol && !empty(data.alt_name_1) ) {
				name_1 = data.alt_name_1;
				name_2 = data.alt_name_2;
				name_3 = data.alt_name_3;
			}
			var text_1 = ( scope.alternate_bol && !empty(data.alt_text_1)  ) ? data.alt_text_1 : data.text_1;
			var comment_1 = ( scope.alternate_bol && !empty(data.alt_comment_1) ) ? data.alt_comment_1 : data.comment_1;
			var comment_2 = ( scope.alternate_bol && !empty(data.alt_comment_2) ) ? data.alt_comment_2 : data.comment_2;
		} else {
			var name_1 = data.name_1;
			var name_2 = data.name_2;
			var name_3 = data.name_3;
			var text_1 = data.text_1;
			var comment_1 = data.comment_1;
			var comment_2 =  data.comment_2;
		}


		//オプションテキストを金額として利用する
		var price = priceText(data.price);
		if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
			text_1 = "";
			var price = priceText(data.text_1) 
		}

		//番号入力の場合には出力する
		if( !empty( Config.number_input ) && Config.number_input.enable ) {
			html += '<p class="no">' + scope.alternate.getString('#number-input .no-input-label') + data.no + '</p>';
		}

		var name = name_1 + "<br>" + name_2;
		if( !empty( name_3 )  && Config.product.use_name3 !== false ) {
			name += "　";
			name += String( name_3 ).replace(/<br \/>/,'');
		}

		html += '<p class="name_1">' + name + '</p>';
		//html += '<p class="name_2">' + name_2 + '</p>';
		html += '<p class="text_1">' +  text_1 + '</p>';
		html += '<p class="comment_1">' +  comment_1 + '</p>';
		html += '<p class="price">' +  price + '</p>';
		html += '<p class="comment_2">' + comment_2 + '</p>';

		//アイコンのセット
		var lang = scope.alternate.language;
		if( lang == Config.alternate.default ) {
			lang =  "";
		} else {
			lang = lang + "_";
		}
		var icons = "";
		var icon_path = window.designpath + "icon/LL/" + lang + "icon_";
		if( !empty(data.icon_1) ) icons += '<i class="icon_1" style="background-image:url(' + icon_path + data.icon_1 + '.png);"></i>';
		if( !empty(data.icon_2) ) icons += '<i class="icon_2" style="background-image:url(' + icon_path + data.icon_2 + '.png);"></i>';
		if( !empty(data.icon_3) ) icons += '<i class="icon_3" style="background-image:url(' + icon_path + data.icon_3 + '.png);"></i>';
		if( icons != "" ) {
			html += '<p class="icons">' + icons + '</p>';
		}

		$("#detail .item").html(html);

		//デフォルト画像のセット
		$("#detail .item .image").error(function(){
			$(this).attr("src", Config.product.default_image);
		});

		$("#detail").show();

		//イベントの発行
		$( document ).trigger("DETAIL_SHOW");

		scope.log.send("0","商品詳細,表示します。");
	}

	/**
	 * 注文
	 * @return {[type]}
	 */
	this.order = function(e) {

		var image = $("#detail .image");
		$.extend( e, {
			clientY:image.offset().top,
			clientX:image.offset().left,
			currentTarget:$("#detail").get(0)
		} );
		scope.selectProduct( self.data, e );

		if( scope.addcart_res ) {
			var val =  { item:self.data, num:1, set:[], sub:[] };
			var name = ( scope.alternate_bol && !empty(val.item.alt_name_1) ) ? val.item.alt_name_1 + val.item.alt_name_2 : val.item.name_1 + val.item.name_2;
			var timer1 = $.timer( function() {		
				var msg =  scope.alternate.getString("select-cartadd-message");
				msg = String(msg).replace( /%item%/gi, name );
				var html = '<div id="select-message"><p>';
				html += msg;
				html += '</p></div>';
				$("#menu-page").append(html);
				var timer = $.timer(function() {
					$("#select-message").remove();
					this.stop();
				}, 3000, 1);

				this.stop();
			}, 100, 1);
		}

		self.hide();

	}

	/**
	 * 品切れのチェック
	 * 自身が対象の場合には閉じる
	 */
	this.setStockOut = function() {

		if( empty( self.data ) || !$("#detail").isVisible() ) return;

		var stock = ExternalInterface.stock;
		if( stock.indexOf( self.data.id ) != -1 ) self.hide();
		
	}

	/**
	 * 閉じる
	 * @return {[type]}
	 */
	this.hide = function() {
		$("#detail").hide();
	}

}
;;
/**
 * 大カテゴリートップ
 * @param {[type]} scope [description]
 */
var FcategoryTop = function( scope ) {

	var self = this;
	var scope = scope;
	var template_class = "";

	this.load_count; //画像ロード数
	this.loaded_count; //画像ロード完了数
	this.load_timer; //画像ロードタイマー
	this.alt_change; //言語切り替えかどうか

	this.menu; //メニューデータ
	this.recommend_menu = []; //メニューデータ

	this.top_move_bol = false; //トップからの移動フラグ

	//チェックアウト
	$(document).bind("CHECKOUT", function() { self.reset(); } );

	//オーダーロック
	$(document).bind("FOOD_STOP FOOD_START DRINK_STOP DRINK_START ORDER_STOP ORDER_START", function() { self.orderLock( ); } );

	//ストックのチェック
	$(document).bind("STOCK", function() { self.setStock(); } );

	//カウンターの更新
	$(document).bind("CART_UPDATE", function(){
		self.updateCounter();
	});

	//人数チェックエラー
	$(document).bind("CHECK_PARSON_ERROR", function() {
		//セレクトメッセージを強制的に消す
		$("#select-message").remove();
	} );

	//トップへもどるボタンのセット
	$("#go-top")._click(function(){
		scope.viewTop();
	});


	/**
	*	起動
	*	@param {Boolean} alt_change 言語切り替えかどうか
	*/
	this.init = function( alt_change ) {

		self.alt_change = alt_change;

		var mode = scope.menu_mode;
		$( "#fcategory-top .body button" ).remove();
		$( "#fcategory-top .recommend li" ).remove();
		$("#fcategory-top .refill li").remove();

		$("#fcategory-top").removeClass( self.template_class );
		self.template_class =  "type"  + scope.menudata.category.type;
		$("#fcategory-top").addClass( self.template_class );
		
		self.load_count = 0;
		self.loaded_count = 0;
		
		//全体背景
		var lang = scope.alternate.language;
		if( lang == Config.alternate.default ) {
			lang =  "";
		} else {
			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
				lang = "alt_";
			} else {
				lang = lang + "_";
			}
			
		}

		var bg = lang + "background.jpg" + chache();
		var imagename = designpath + "UI/top/mode" + mode + "/" + bg; // +  chache();
		var background_imaege = "url(" + imagename + ")";
		$("#fcategory-top").css(  "background-image", background_imaege );
		//ロード完了の取得
		$("<img>").load(function(){
			self.loadCount();	
		}).error(function(){
			self.loadCount();
		}).attr("src", imagename);

		self.load_count++;

		//番号入力の場合はボタンを出力しない
		if( empty(Config.number_input) || !Config.number_input.enable ) {
			//ボタンにセット
			var k = 1;
			var fcode = scope.menudata.category.fcode;
			var html = ""
			$.each(fcode, function( i, fcate ) {
				
				var imagename = designpath + "UI/top/mode" + mode + "/" + lang + fcate.categorycode + Config.fcategory_top.image_type + chache();
				var background_imaege = "background-image:url(" + imagename + ")";

				if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
					var text_1 = ( scope.alternate_bol && !empty(fcate.alt_text_1) ) ? fcate.alt_text_1 : fcate.text_1;
					var text_2 = ( scope.alternate_bol && !empty(fcate.alt_text_1) ) ? fcate.alt_text_2 : fcate.text_2;
				} else {
					var text_1 = fcate.text_1;
					var text_2 = fcate.text_2;
				}

				var cl =( !empty(text_2) ) ? "l2" : "";   

				html += '<button class="gt-btn gt-' + k + ' gtc-' + fcate.categorycode + ' ' + cl + '" style="' + background_imaege + '" data-code="' + fcate.categorycode + '">';
				
				html += '<span class="text_1">' + text_1 + '</span>';
				html += '<span class="text_2">' + text_2 + '</span>';
				html += '<span class="description">' + fcate.description + '</span>';
				html += '</button>';
				k++;

				//ロード完了の取得
				$("<img>").load(function(){
					self.loadCount();	
				}).error(function(){
					scope.log.send("0","トップ画面,ボタン画像ロードエラー," + designpath + "UI/top/mode" + mode + "/" + lang + fcate.categorycode + Config.fcategory_top.image_type );
					self.loadCount();
				}).attr("src", imagename );

				self.load_count++;
			});

			var b = $( "#fcategory-top .body" ).html( html );
			//クリックのセット
			$( "#fcategory-top .body button" )._click(function(){
				
				//self.hide();
				self.top_move_bol = true;
				scope.category.setFcategory( $(this).get(0).getAttribute("data-code"), "top" );
				
				//グランドトップからの遷移のみ、Fcategoryにモーションを付加
				//オープンムービー
				// $("#fcategory").removeClass("open");	
				// var timer = $.timer(function(){
				// 	$("#fcategory").addClass("open");
				// 	this.stop();
				// }, 10, 1 );
				// var timer = $.timer(function(){
				// 	$("#fcategory").removeClass("open");
				// 	this.stop();
				// }, 1100, 1 );
			});

			//ページ検索ボタンをカテゴリーボタンに含める
			if( Config.fcategory_top.search.enable ) {
				var s = '<button id="top-search-btn" class="gt-btn gt-' + (k++) + ' gtc-search">';
				s += scope.alternate.getString( "#search-btn" );
				s += '</button>';
				$( "#fcategory-top .body" ).append(s);
				$( "#fcategory-top #top-search-btn")._click(function(){
					scope.search.show();
				});
			}

			//スタッフ呼び出しボタンをカテゴリーボタンに含める
			if( !empty(Config.fcategory_top.staff) && Config.fcategory_top.staff.enable && Config.staffcall.enable ) {
				var s = '<button id="top-staff-btn" class="gt-btn gt-' + (k++) + ' gtc-staff">';
				s += scope.alternate.getString( "#staff-call" );
				s += '</button>';
				$( "#fcategory-top .body" ).append(s);
				$( "#fcategory-top #top-staff-btn")._click(function(){
					if( Config.staffcall.confirmWin ) {
						//確認画面の表示
						scope.message.confirm( "staffcall_confirm", function() {
							scope.staff_call.send();
						});
					} else {
						scope.staff_call.send();
					}
				});
			}
		}


		//ページジャンプボタン
		if( !empty(Config.fcategory_top.page_jump) ) {
			var shtml = "";
			$.each(Config.fcategory_top.page_jump, function(k,code) {
				var cate = scope.category.getCategoryDataByCode(code);
				if( empty( cate ) ) return true;
				shtml += '<button class="pj-btn pj-' + code + '" data-code="' + code + '">' + cate.tcode.text_1 +  cate.tcode.text_2 + '</button>';
			});
			$("#fcategory-top .page-jump").html(shtml);
			$("#fcategory-top .page-jump button")._click(function() {
				scope.category.setTcategory( $(this).data("code") );
			});
		}

		//おかわりは初期非表示
		//$("#fcategory-top .refill").hide();
		if( !Config.fcategory_top.refill.enable ) {
			$("#fcategory-top .refill").hide();
			//クラスをつける
			$("#fcategory-top").addClass("no-refill");
		}
		//おすすめのセット
		self.setRecommend();

		//オーダーロックのセット
		self.orderLock();

		//言語切り替えボタン
		if( Config.fcategory_top.alternate.enable && Config.alternate.enable ) {
			var ahtml = scope.alternate.createButton();
			$( "#fcategory-top .alternate" ).html(ahtml);

			$.timer( function() {
				this.stop();
				var w = $( "#fcategory-top .alternate button:eq(0)" ).outerWidth();
				$( "#fcategory-top .alternate" ).width( w * Config.alternate.language.length  );
			}, 300, 1 );
			

			$( "#fcategory-top .alternate button" )._click(function(){
				scope.alternate.setLanguage( $(this).data("code") );
			});

			$( "#fcategory-top .alternate button" ).removeClass("selected");
			$( "#fcategory-top .alternate button.lang-" + scope.alternate.language ).addClass("selected");

			$("#fcategory-top").removeClass("no-alternate");
		} else {
			//言語バーごと削除
			$( "#fcategory-top .alternate" ).remove();
			//クラスをつける
			$("#fcategory-top").addClass("no-alternate");
		}
		
		//バナー
		self.setBanner();

		//first-orderの場合にここでdisabledにセットする
		if( scope.first_order ) {
			$( "#top-staff-btn" ).attr("disabled", true);
		}


		//画像ロードのタイマー開始（エラー時の最大）
		self.load_timer = $.timer( function() {
			scope.message.hide("loading");
			this.stop();
		}, Config.timer.boot, 1 );
	};

	/**
	 * トップの画像のロード完了
	 */
	this.loadCount = function() {
		self.loaded_count++;
		if( self.load_count == self.loaded_count ) {
			//読み込み完了でローディングメッセージを閉じる
			if( !scope.menu_load_background ) {

				//メニューの準備完了まで一定時間とめる
				//var time = ( Config.islocal || self.alt_change ) ? 10 : 15000;
				//$.timer(function() {
					scope.message.hide("loading");
					$("#fcategory-top").trigger("BOOT_FINISH");
					//this.stop();
				//}, time, 1);
			}
			self.load_timer.reset().stop();
			scope.menu_load_background = false;
		}
	}


	/**
	 * おかわりの商品を表示
	 * checkOrderKeepを取得後に判定
	 */
	this.setRefill = function() {

		if( !Config.fcategory_top.refill.enable || !scope.menudata.sys.mode.refill ) {
			$("#fcategory-top .refill").hide();
			//クラスをつける
			$("#fcategory-top").addClass("no-refill");
			return;
		} else {
			$("#fcategory-top .refill").show();
			//クラスをつける
			$("#fcategory-top").removeClass("no-refill");
		}

		var data = scope.check_order.order_data;
		if( empty( data ) || empty( data.item ) ) {
			//$("#fcategory-top .refill").hide();
			//クラスをつける
			$("#fcategory-top").addClass("no-refill-list");
			return;
		}

		//データは重複させない
		var item_ids = [];
		var html = "";
		var page_data = scope.category.page_item_ary;
		
		$.each( data.item, function( i, val ) {
			
			//メニューに配置されていない場合には表示しない
			if( page_data.indexOf( String(val.id) ) == -1 ) return true;

			var item = scope.menudata.menumst[val.id];
			if( item_ids.indexOf(val.id) > -1 ) return true;
			if( empty(item) ) return true;
			if( !Config.fcategory_top.refill.food && item.lock_sts == 1 ) return true;
			if( !Config.fcategory_top.refill.drink && item.lock_sts == 2 ) return true;

			//ロックステータスが1か2のもののみ
			if( item.lock_sts != 1 && item.lock_sts != 2 ) {
				 return true;
			}

			html += self.createItem( item, "refill-item" );
			item_ids.push( val.id );
		});
		$("#fcategory-top .refill ul").html(html);
		//横幅のセット
		var li = $("#fcategory-top .refill ul li");
		$("#fcategory-top .refill ul").width( li.first().outerWidth(true) * li.length );

		//クリックのセット
		$("#fcategory-top .refill li").each( self.itemClickEvent );

		//デフォルト画像のセット
		$("#fcategory-top .refill .image").error(function(){
			$(this).attr("src", Config.product.default_image);
			$(this).parents("li").addClass("image-error");
			$(this).unbind("error");
		});

		//表示
		//$("#fcategory-top .refill").show();
		//クラスのremove
		$("#fcategory-top").removeClass("no-refill-list");

		var ids = $.map( data.item, function( n,i ) {
			return n.id;
		});
		self.menu = self.recommend_menu.concat( ids );

		//オーダーロックのセット
		self.orderLock();
	};


	/**
	 * おすすめのセット
	 * Dailyとは別なもの
	 */
	this.setRecommend = function() {

		if( !Config.fcategory_top.recommend.enable ) {
			$("#fcategory-top .recommend").hide();
			$("#fcategory-top").addClass("no-recommend");
			return;
		}

		//データを取得
		var data;
		var items;
		//codeがnull以外
		if( !empty(Config.fcategory_top.recommend.code) ) {
			//custompageにコードがあるか
			var code = Config.fcategory_top.recommend.code;
			data = scope.custom_menudata[code];
			if( empty( data ) ) {
				var cate = scope.category.getCategoryDataByCode( code );
				if( empty( cate ) || empty( cate.tcode ) ) return false;
				data = cate.tcode;
			}
			items = data.item;
		} else {
			//商品コードからIDに変更する
			var code = Config.fcategory_top.recommend.item_code;
			items = new Array();
			var leng = code.length;
			for( var i=0; i<leng; i++ ) {
				$.each( scope.menudata.menumst, function( k, val ) {
					//console.log( Number(code[i]), Number( val.code ) )
					if( Number(code[i]) == Number( val.code ) ) {
						items.push( val.id );
					}
				} );
			}
			//items = Config.fcategory_top.recommend.item_code;
		}

		if( empty( items ) ) return;

		//アイテムのセット
		var html = "";
		var page_data = scope.category.page_item_ary;
		$.each( items, function( i, val ) {
			//メニューに配置されていない場合には表示しない
			if( page_data.indexOf( String(val) ) == -1 ) return true;

			var item = scope.menudata.menumst[val];
			html += self.createItem( item, "recommend-item" );
		});

		//アイテムがなければ非表示
		if( html == "" ) {
			//$("#fcategory-top .recommend").hide();
			$("#fcategory-top").addClass("no-recommend-list");
			return;
		}

		$("#fcategory-top .recommend ul").html(html);
		$("#fcategory-top").removeClass("no-recommend-list");

		//横幅のセット
		var li = $("#fcategory-top .recommend ul li");
		$("#fcategory-top .recommend ul").width( li.first().outerWidth(true) * li.length );

		//クリックのセット
		$("#fcategory-top .recommend li").each( self.itemClickEvent );

		//デフォルト画像のセット
		$("#fcategory-top .recommend .image").error(function(){
			$(this).attr("src", Config.product.default_image);
			$(this).parents("li").addClass("image-error");
			$(this).unbind("error");
		});

		self.recommend_menu = items;
		self.menu = items;

		$("#fcategory-top .recommend").show();
	};


	/**
	 * [createItem description]
	 * @param  {[type]} item [description]
	 * @return {[type]}      [description]
	 */
	this.createItem = function( data, key ) {

		var html = "";
		if( empty( data ) ) {
			return "";
		}

		var classes = [];
		if( data.nohandle ) {
			classes.push("nohandle");
		}
		if( data.stockout ) {
			classes.push("stockout");
		}

		var name_1 = data.name_1;
		var name_2 = data.name_2;
		if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
			if( scope.alternate_bol && !empty(data.alt_name_1) ) {
				name_1 = data.alt_name_1;
				name_2 = data.alt_name_2;
			}
		}
		
		var  text_1 = data.text_1;
		var comment_1 = data.comment_1;
		var comment_2 = data.comment_2;

		//オプションテキストを金額として利用する
		var price = priceText(data.price);
		if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
			text_1 = "";
			var price = priceText(data.text_1) 
		}

		html += '<li id="product-' + data.id + '" data-id="' + data.id + '" class="product ' + key + ' ' +  classes.join(" ") + '">';
		html += '<img class="image" src="design_cmn/product/LL/' + data.code + Config.product.type  + chache() + '" >';
		html += '<span class="name_1">' + name_1 + '</span>';
		html += '<span class="name_2">' + name_2 + '</span>';
		html += '<span class="name_3">' + name_1 + name_2 + '</span>';
		html += '<span class="price">' + price + '</span>';
		html += '<span class="comment_1">' + comment_1 + '</span>';
		html += '<span class="text_1">' + text_1 + '</span>';

		//アイコンのセット
		//詳細アイコン
		//console.log( !empty(data.comment_2) && data.comment_2 != "" )
		if( !empty(comment_2) && comment_2 != "" ) html += '<button class="detail">詳細</button>';
		var icon_path = window.designpath + "icon/LL/icon_";
		if( !empty(data.icon_1) ) html += '<i class="icon_1" style="background-image:url(' + icon_path + data.icon_1 + '.png);"></i>';
		if( !empty(data.icon_2) ) html += '<i class="icon_2" style="background-image:url(' + icon_path + data.icon_2 + '.png);"></i>';
		if( !empty(data.icon_3) ) html += '<i class="icon_3" style="background-image:url(' + icon_path + data.icon_3 + '.png);"></i>';
		html += '</li>';

		return html;

	};


	/**
	 * おすすめ、おかわりのクリックのセット
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	this.itemClickEvent = function( e ) {
		//クリックイベント
		$(this)._click(function( e ){

			var refill = $(this).parents(".refill").length;

			var id = $(this).data("id");
			var data  = scope.menudata.menumst[id];
			var target = e.target;
			//詳細ボタンのクリック
			if( $(target).hasClass("detail") ) {
				scope.detail.show( data );
				return false;
			} else if( $(target).hasClass("increment") && empty(data.select) && empty(data.setmenu) ) {
				scope.cart.onIncrement( { item:data, num:1, set:[], sub:[], setmenu:[] } );
				return false;
			} else if( $(target).hasClass("decrement") && empty(data.select) && empty(data.setmenu) ) {
				scope.cart.onDecrement( { item:data, num:1, set:[], sub:[], setmenu:[] } );
				return false;
			}

			//商品のセット
			//scope.selectProduct( data );
			var res = scope.selectProduct( data );
			//console.log( "------------" + scope.addcart_res )
			if( !scope.addcart_res ) return false;

			//おかわりの場合はそのまま注文する
			//注文確認画面が有効で、セレクトが無い場合
			if( (refill && Config.fcategory_top.refill.order) || (!refill && Config.fcategory_top.recommend.order) ) {
				if( empty( data.select )  && Config.order_confirm.enable ) {
					scope.cart_list.setOrder();
					//メッセージは表示しない
					return;
				}
			}

			//メッセージを表示する
			if( empty(data.select) ) {
				//menu-pageに追加する
				var val =  { item:data, num:1, set:[], sub:[] };

				if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
					var name = ( scope.alternate_bol && !empty(val.item.alt_name_1) ) ? val.item.alt_name_1 + val.item.alt_name_2 : val.item.name_1 + val.item.name_2;
				} else {
					var name = val.item.name_1 + val.item.name_2;
				}

				var msg =  scope.alternate.getString("select-cartadd-message");
				msg = String(msg).replace( /%item%/gi, name );
				var html = '<div id="select-message"><p>';
				html += msg;
				html += '</p></div>';

				$("#menu-page").append(html);
				var timer = $.timer(function() {
					$("#select-message").remove();
					this.stop();
				}, 2000, 1);
			}
		}, 2, "mouseup", true); //強制的にクリックにする
	};


	/**
	 * [updateCounter description]
	 * @return {[type]} [description]
	 */
	this.updateCounter = function() {
		var id = scope.cart.order_id;
		
		$("#fcategory-top .counter").remove();
		var data = scope.cart.getCartAryWithoutSelect(); //scope.cart.cartAry;
		if( data.length ) {
			$.each( data, function( i, item ) {
				var html = '<span class="counter">';
				html += '<button class="decrement">-</button>';
				html += '<span class="count"><em>' + item.num + '</em></span>';
				html += '<button class="increment">+</button>';
				html += '</span>';
				$("#fcategory-top #product-" + item.item.id).append(html);
			});
			if( Config.counter.animate ) {
				var counter = $("#menu-bodys #product-" + id).find(".counter");
				counter.removeClass("up");
				self.counter_timer = $.timer(function(){
					counter.addClass("up");
					this.stop();
				}, Config.counter.delay, 1);
			}
		}
	};

	/**
		品切れのセット
		@items 品切れ商品配列
	*/
	this.setStock = function() {

		var items = ExternalInterface.stock;

		$("#fcategory-top .stockout").removeClass("stockout")
		$.each( items, function( i, item ) {
			$("#fcategory-top #product-" + item).addClass("stockout");
		});
	};

	/**
	 * オーダーロック
	 * @param  {[type]} mode [ロック対象 food,drink,all]
	 * @return {[type]}      [description]
	 */
	this.orderLock = function( mode ){

		if( empty( self.menu ) ) return;

		$("#fcategory-top .product.stop").removeClass("stop");

		if( scope.food_order_stop_bol ) {
			$.each( self.menu, function(i, item){
				var data = scope.menudata.menumst[item];
				if( !empty(data) && Number(data.lock_sts) == 1 ) {
					$("#fcategory-top #product-" + item).addClass("stop");
				}
			});
		}
		if( scope.drink_order_stop_bol ) {
			$.each( self.menu, function(i, item){
				var data = scope.menudata.menumst[item];
				if( !empty(data) && Number(data.lock_sts) == 2 ) {
					$("#fcategory-top #product-" + item).addClass("stop");
				}
			});
		}
		if( scope.order_stop_bol ) {
			$.each( self.menu, function(i, item){
				$("#fcategory-top #product-" + item).addClass("stop");
			});
		}
	};


	/**
	 * バナーのセット
	 */
	this.setBanner = function() {

		$("#fcategory-top .banners .item-list ul").html("");
		if( !Config.fcategory_top.banner.enable || !Config.billboard.enable ) return;

		//ボタン生成
		var html = "";
		$.each( Config.billboard.banners, function( i, val ) {
			//モードが対象かどうか
			//val.modeが空の場合には全て対象

			var modes = $.map(val.mode, function(m) {
				return m.toString();
			});

			if( !empty(modes) && modes.indexOf( scope.menu_mode ) == -1 ) return true;

			html += '<li class="banner ' + val.type + ' bindex-' + i + ' bid-' + val.id + '"  data-index="' + i + '">';
			if( val.type != 'epark' ) html += '<img class="image" src="' + val.banner + '" />';
			html += '</li>';
		});

		$( "#fcategory-top .banners .item-list ul" ).html( html );
		//バナー画像のエラー
		$( "#fcategory-top .banners .item-list .image" ).error(function(){
			$(this).parents("li").remove();
		});
		//クリックイベントのセット
		$( "#fcategory-top .banners .item-list li" )._click(function(){
			var index = $(this).data("index");
			var data = Config.billboard.banners[index];
			scope.billboard.show( data );
		}, 1, "mouseup", true);

		//Epark Bannerをもっている場合はセット
		if( $("#fcategory-top .banners .item-list li.epark").length ) {
			scope.epark.setBannerArea();
		}
	}


	/**
	 * 代替言語のセット
	 * @param {[type]} bol [description]
	 */
	this.setAlternate = function( bol ) {
		//生成しなおす
		self.init( true );
		//おかわりは生成しなおし
		self.setRefill();
		//言語ボタンに選択のクラスを付与
		$( "#fcategory-top .alternate button" ).removeClass("selected");
		$( "#fcategory-top .alternate button.lang-" + scope.alternate.language ).addClass("selected");
	}


	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$( "#fcategory-top" ).hide();
	}

	/**
	 * 初期化
	 */
	this.reset = function() {
		self.menu = null;
		$( "#fcategory-top .body button" ).remove();
		$( "#fcategory-top .recommend li" ).remove();
		$("#fcategory-top .refill li").remove();
	};
};;
/**
 * 味噌汁・お茶ページ
 * @param {[type]} scope [description]
 */
var FirstCategory = function( scope ) {

	var self = this;
	var scope = scope;

	this.code; //遷移先

	//チェックアウト
	$(document).bind("MODE_CHANGE CHECKOUT", function() { self.hide(); } );

	//ボタンイベント
	$("#first-category .yes")._click(function() {
		self.onYes();
	});
	$("#first-category .no")._click(function() {
		self.onNo();
	});

	this.init = function() {
	};

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function() {
		self.code = Config.first_category.code;

		if( !empty(Config.first_category.mode) ) {
			var is_mode = scope.menu_mode;
			var hit = false;
			$.each( Config.first_category.mode,  function(i,mode) {

				if( mode.id.split(",").indexOf(is_mode) != -1 ) {
					$("#first-category").css("background-image", "url(" + window.designpath + "skin/" + mode.image + chache() + ")");
					self.code = mode.code;
					hit = true;
					return false;
				}
			} );
			if( !hit ) {
				scope.viewTop();
				return;
			}
		}

		$("#first-category").show();
	};

	/**
	 * 「はい」のクリック
	 * カテゴリーに遷移
	 */
	 this.onYes = function() {
	 	var code = self.code;
	 	scope.category.setCategoryCode(  code );
	 	self.hide();

	 	$("#fcategory-top").trigger("HIDE");
	 	scope.log.send("0","促し画面,Y:" + code );
	 };

	 /**
	  * 「いいえ」のクリック
	  * トップページの表示
	  * @return {[type]} [description]
	  */
	 this.onNo = function() {
	 	scope.viewTop();
	 	self.hide();

	 	scope.log.send("0","促し画面,N");
	 };

	 /**
	  * 非表示
	  * @return {[type]} [description]
	  */
	 this.hide = function() {
	 	$("#first-category").hide();
	 };
};;
/**
 * ゲーム
 */
var Game = function( scope ) {

	var self = this;
	var scope = scope;

	this.gamedata;
	this.callback;

	this.que = [];
	this.prev_prize = {}; //前回発動ゲーム
	this.prev_total = 0; //前回発動金額
	this.load_timer; //SWFロードタイマー
	this.flash; //フラッシュオブジェクト

	//チェックアウト
	$(document).bind( "CHECKIN CHECKOUT", function() { 
		self.que = [];
		self.prev_prize = {};
		self.prev_total = 0;
		$("#game-btn").hide();
	} );


	//自動再生のイベント
	$(document).bind( "ORDER_COMPLETE_CLOSE", function() { self.setAutoStart(); } );


	//ゲームボタンのクリック
	$("#game-btn")._click(function(){
		var url = window.contentspath + "instantWin/" + self.que[0].url;
		// $('#game-frame').flash(
		//     { 
		//     	src: url,
		//     	width: "100%",
		//     	height: "100%",
		//     	id: "gameBase",
		//     	allowScriptAccess:"always"
		//     }, 
		//     { version: 8 }
		// ).show();
		$('#game-frame').append( '<iframe src="' + url + '" id="gameBase" width="100%" height="100%" style="overflow:hidden;"></iframe>' );

		scope.log.send("0","GAME,ロードします。,ゲーム:" + self.que[0].id + ",ファイル:" + url );
		scope.timerStop();

		//フラッシュオブジェクトをセット
		//self.flash = document.gameBase || window.gameBase;

		//swfをロードできなかった場合の処理
		self.load_timer = $.timer(function(){
			scope.log.send("0","GAME,SWFロードエラー,ゲーム:" + self.que[0].id + ",ファイル:" + url );
			self.setFinishGame();
			scope.message.hide();
			this.stop();
		}, Config.timer.xml, 1); //SYSのtime.xmlの値を一旦利用
		//ローディングを表示
		scope.message.show("loading");
	});


	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function( callback ) {

		self.callback = callback;

		//gameの読み込み
		var loaderObj = new Loader();
		loaderObj.load( window.datapath + "menu/game.xml" + chache(), null, self.loaded, 'xml' );

	};

	/**
	 * ロード完了
	 */
	this.loaded = function( data ) {
		if( !data ) {
			//error
			//self.message.show( "3005", "game.xml" );
			//return;
			//Gameのエラーは何もしない
		}
		//パースする
		var prize = $(data).find("prize");
		var data = new Array();
		$.each( prize, function( i, val ) {
			var pz = {
				index:String(i),
				id:$(val).attr("id"),
				type:$(val).attr("type"),
				value:$(val).attr("value"),
				option:($(val).attr("option") == "true"),
				every:Number($(val).attr("every")),
				payout:$(val).attr("payout"),
				url:$(val).attr("url")
			};
			data.push( pz );
		});
		self.gamedata = data;

		//終了の通知
		self.callback();
	};

	/**
	 * 発動のチェック
	 */
	this.check = function() {

		if( !Config.game.enable ) return;

		var data = scope.check_order.order_data;
		
		$.each( self.gamedata, function( i, prize ) {
			var game;
			switch( prize.type ) {
				case "account":
					game = self.checkAccount( prize, data.total );
					break;
				case "item":
					game = self.getItemCheck( prize, data.item );
					break;
			}
			if( !empty(game) ) {
				self.que.add(game);
			}
		});

		//ゲームの発動
		if( self.que.length ) {
			//ボタンの表示
			$("#game-btn").show();
			console.log( "game start", self.que );

			scope.log.send( "0","GAME,ボタン表示,権利数合計:" + self.que.length );
			// if( Config.game.auto_start ) {
			// 	$("#game-btn")._click();
			// }
		}

	};


	/**
	 * 自動起動
	 */
	this.setAutoStart = function() {
		if( !Config.game.enable || !Config.game.auto_start ) {
			return;
		}
		if( self.que.length ) {
			$("#game-btn")._click();
		}
	}


	/**
	 * 金額発動のチェック
	 * @return {[type]} [description]
	 */
	this.checkAccount = function( prize, total ) {
		
		var que = new Array();

		//valueがstringの場合もあるので変換
		prize.value = Number( prize.value );

		//発動金額+前回金額より低い
		//初回（前回データがない）はeveryを足さない
		var every = ( Object.has(self.prev_prize, prize.index ) ) ? prize.every : 0;
		if( total < prize.value + every ) {
			console.log( "gameなし",  total, prize.value + every );
			return null;
		}

		//前回発動+都度金額より低い
		//初回（前回データがない）は起動金額でチェック//0からに変更
		var prev_total = ( Object.has(self.prev_prize, prize.index) ) ? self.prev_prize[prize.index].total : prize.value;
		if( total < prev_total + every ) {
			console.log( "gameなし",  total, prev_total + every );
			return null;
		}

		//都度発生ではなく、1度実行していればreturn
		if( !prize.option &&  Object.has(self.prev_prize, prize.index) ) return null;

		if( prize.option ) {
			//都度発生の場合には増加分生成
			if( every != 0 ) {
				var counter = total - prev_total;
				var ptotal = total - (total%prize.every);
				var count = 0;
				var leng = Math.floor( counter/every );
				// while( counter >= 0 ) {
				// 	que.push( prize );
				// 	count++;
				// 	counter -=  every;
				// }
				for( var i=0; i<leng; i++ ) {
					que.push( prize );
				}
				scope.log.send( "0","GAME,オプション権利発動,ゲーム:" + prize.index + ",権利数:" + leng + ",差異:" +  counter);
			} else {
				//初期は起動金額を超えた分+1で権利をカウントする
				var counter = total - prize.value;
				var ptotal = total - (total%prize.value);
				var leng = Math.floor( counter/prize.every ) + 1;
				for( var i=0; i<leng; i++ ) {
					que.push( prize );
				}
				//que.push( prize );
				scope.log.send( "0","GAME,オプションありで初回の権利発動,ゲーム:" + prize.index  + ",権利数:" + leng + ",差異:" +  counter);
			}
		} else {

			que.push( prize );
			scope.log.send( "0","GAME,オプションなしで権利発動,ゲーム:" + prize.index);
			var ptotal = 0;
			
		}

		//前回データを格納
		var obj = {};
		
		obj[prize.index] = {
			prize:prize,
			total:ptotal
		}
		Object.merge( self.prev_prize, obj );
		return que;
	};

	/**
	 * 商品の発動チェック
	 * @param  {[type]} prize [description]
	 * @param  {[type]} items [description]
	 * @return {[type]}       [description]
	 */
	this.getItemCheck = function( prize, items ) {

		var que = new Array();

		var prev =  ( Object.has(self.prev_prize, prize.index) ) ? self.prev_prize[prize.index].total : 0;
		//注文数を取得
		var num = (function(){
			var n = 0;
			$.each( items, function( i, item ) {
				if( item.id == prize.value ) {
					n += item.amount;
				}
			});
			return n;
		})();

		console.log( num, prev )

		//前回より増えていない
		if( prev >= num ) return null;

		//都度発生ではなく、1度実行していればreturn
		if( !prize.option && !empty( self.prev_prize[prize.index] ) ) return null;

		if( prize.option ) {
			//都度発生の場合には増加分生成
			var counter = num - prev;
			var count = 0;
			while ( counter > 0 ) {
				que.push( prize );
				count++;
				counter--;
			}
			scope.log.send( "0","GAME,オプション権利発動,ゲーム:" + prize.index + ",権利数:" + count );
		} else {
			que.push( prize );
			scope.log.send( "0","GAME,オプションなしで権利発動,ゲーム:" + prize.index );
		}

		//前回データを格納
		self.prev_prize[prize.index] = {
			prize:prize,
			total:num
		}
		
		return que;
	};


	/**
	 * ゲームの表示
	 */
	this.onLoadedGame = function() {

		self.flash = $('#game-frame').contents().get(0).contentWindow;
		$('#game-frame').show();

		//当たり判定
		var res = false;
		//少数点対応
		var dise = Math.random() * 100;
		if( self.que[0].payout - dise > 0 ) res = true;

		//開始をコール
		self.flash.onInit( res );
		
		console.log( "Game", res, self.que[0].payout );
		scope.log.send("0","GAME,表示します。,確立:" + self.que[0].payout + ",当たり判定:" + res );

		//メッセージを消す
		scope.message.hide();
		self.load_timer.reset().stop();
	
	}

	/**
	 * ゲームの景品を注文
	 * @return {[type]} [description]
	 */
	this.onPrizeOrder = function() {
		var item =  scope.menudata.menumst[self.que[0].id];
		if( empty(item) ) {
			scope.log.send("0","GAME,商品データが見つかりません。,商品ID:" +  self.que[0].id  );
			self.onErrorPrize();
			return;
		}
		var item_data = [{ item:item, num:1, set:[], sub:[] }];
		var slip_no = ( Config.game.exec_type == "TABLE_NO" ) ? scope.tableNo : scope.slipNo;
		
		scope.log.send("0","GAME,景品を注文します。,商品ID:" + self.que[0].id + ",商品CODE:" + item.code + ",EXECTYPE:" +  Config.game.exec_type );
		scope.order.setOrderRequest( slip_no, item_data, self.onCompletePrize, self.onErrorPrize, Config.orderdate_insert );
	}

	/**
	 * 景品注文の完了
	 * @return {[type]} [description]
	 */
	this.onCompletePrize = function() {
		self.flash.onCompletePrize();
	}

	/**
	 * 景品注文のエラー
	 * @return {[type]} [description]
	 */
	this.onErrorPrize = function() {
		self.flash.onErrorPrize();
	}

	/**
	 * ゲームの完了
	 */
	this.setFinishGame = function() {
		this.hide();
		scope.timerStart();

		//キューの削除
		self.que.splice(0,1);

		scope.log.send("0","GAME,完了," + ",権利合計:" + self.que.length  );

		if( !self.que.length ) {
			//ボタンを非表示
			$("#game-btn").hide();
		}
	}

	/**
	 * 非表示
	 */
	this.hide = function() {
		$("#gameBase").remove();
		$("#game-frame").html("").hide();
	}
}
;;
/**
 * 伝票・卓番表示
 */
var Info = function( scope ) {

	var self = this;
	var scope = scope;


	//文字色クラスをセット
	if( !empty( Config.message ) ) {
		$("#info").addClass( Config.message.text_class );
	}

	this.init = function() {

	}
	
	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function() {
		var data = ExternalInterface.checkin;
		var table = data.tableNo || "";
		var slip = data.slipNo || "";
		$("#info .table").text( table );
		$("#info .slip").text( slip );
		$("#info").show();
	}

	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#info").hide();
	}
};;
/**
 * 利用開始画面
 * V4から登場
 */
var Login = function( scope ) {

	var self = this;
	var scope = scope;

	//クリックイベント
	$("#login .close-btn")._click(function(){
		self.hide();

		scope.log.send("0","利用開始,選択" );
	});

	//文字色クラスをセット
	if( !empty( Config.message ) ) {
		$("#login").find("h1").addClass( Config.message.text_class );
	}

	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {}

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function() {
		$("#login").show();

		//スクリーンセーバーをとめる
		scope.timerStop();
	}

	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		//無線の更新
		if( Config.login.wlan_update ) {
			scope.refleshWlanStat();
			//無線更新がある場合には消さない
		} else {
			//スクリーンセーバーを再開
			//クリックで再開される
			scope.timerStart();
			$("#login").hide();
		}		
	}

};;
/**
 * MenuBody
 * メニューレイアウト
 * @param {[MainController]} scope [MainController]
 */
var MenuBody = function( scope ) {
	//"use strict";

	var self = this;
	var scope = scope;

	this.page_width; //ページ幅
	this.page_height; //ヘージ高さ
	this.page_length; //ページ数
	this.menumst; //メニューデータ
	this.flick_move; //フリック中かどうか
	this.counter_timer; //カウンターのアニメーションタイマー
	this.visible_page; //表示中のページ


	//フードロックのイベントリスナー
	$(document).bind("FOOD_STOP", function() { self.orderLock( "food" ); });
	$(document).bind("FOOD_START", function() { self.orderUnlock( "food" ); });
	//ドリンクロックのイベントリスナー
	$(document).bind("DRINK_STOP", function() { self.orderLock( "drink" ); });
	$(document).bind("DRINK_START", function() { self.orderUnlock( "drink" ); });
	//オーダーロックのイベントリスナー
	$(document).bind("ORDER_STOP", function() { self.orderLock( "all" ); } );
	$(document).bind("ORDER_START", function() { self.orderUnlock( "all" ); } );

	//ストックのチェック
	$(document).bind("STOCK", function() { self.setStock(); } );


	//次へ前へボタンのセット
	var event = "mouseup";
	if( Config.menubody.page_navi_mousedown ) {
		event = "mousedown";
	}
		
	//フリックの時には音をならさない
	var sound = ( Config.flick.enable ) ? -1 : 1;

	$( ".menu-navi .navi-left-btn" )._click( function(){
		scope.category.setNextPrevPage( -1 );
	}, sound, event);
	$( ".menu-navi .navi-right-btn" )._click( function(){
		scope.category.setNextPrevPage( 1 );
	}, sound, event);

	$( ".menu-navi .navi-top-btn" )._click( function(){
		scope.category.setNextPrevPage( -1 );
	}, sound, event);
	$( ".menu-navi .navi-bottom-btn" )._click( function(){
		scope.category.setNextPrevPage( 1 );
	}, sound, event);


	//スクロールしたときのタイマーの延長
	var events = ( $(window).isTablet() ) ? "touchstart" : "mousedown";
	$("#menu-bodys").bind(events, function(){
		scope.timerReset();
	});

	//品切れ表示方法のセット
	var classes = [];
	if( !empty(Config.menubody.item) && Config.menubody.item.stockout_hide ) classes.push("stockout_hide");
	if( !empty(Config.menubody.item) && Config.menubody.item.nohandle_hide ) classes.push("nohandle_hide");
	$("#menu-bodys").addClass(classes.join(" "));


	/**
		起動
	*/
	this.init = function() {

		//サイズ計測が変わる場合があるので、先にクラスをセット
		 if( !Config.flick.enable && Config.flick.scroll && Config.flick.vertical ) {
			//縦位置にセット
			//クラスをセット
			$("#menu-page").addClass("vertical");
		};

		//メニューの生成
		self.menumst = scope.menudata.menumst;
		self.createMenu();

		$.timer( function() {
			this.stop();

			//次へ前への制御
			var pages = $("#menu-bodys .page");
			var first = $("#menu-bodys  .page").first();
			self.page_width = first.outerWidth(true);
			self.page_height = first.outerHeight(true);
			self.page_length = pages.length;
			self.visible_page = $("#menu-bodys .page").map(function(){ return $(this); });

			//flickのセット
			$("#menu-bodys").unbind("webkitTransitionEnd");
			$("#menu-bodys").unbind("transitionend");
			if( Config.flick.enable ) {
				
				$("#menu-page-layout").css("overflow-x","hidden");
				$("#menu-page-layout").scrollLeft(0);

				if( !empty( scope.flipsnap ) ) {
					
					// $.timer( function() {
					// 	scope.flipsnap.moveToPoint( 0 );
					// 	scope.flipsnap.refresh();
					// 	this.stop();
					// }, 1000, 1 );
					scope.flipsnap.moveToPoint( 0 );
					scope.flipsnap.refresh();
					
				} else {

					scope.flipsnap = Flipsnap('#menu-bodys', {
						distance: self.page_width,
						transitionDuration:Config.flick.movetime,
						cssAnimation:(Config.flick.movetime>0),
						//maxPoint:self.visible_page.length-1
					});

					// ローカルの場合のみバグ対応
					if( Config.islocal ) {
						$.timer( function() {
							this.stop();
							scope.flipsnap.distance = $("#menu-bodys  .page").first().outerWidth(true);
							scope.flipsnap.refresh();
						}, 200, 1 );
					}
					
					//フリックの完了のリスナー
					scope.flipsnap.element.addEventListener('fsmoveend', function() {
						scope.category.setFlick( scope.flipsnap.currentPoint );
						scope.menubody.move( scope.flipsnap.currentPoint );
						scope.timerReset();
						self.flick_move = false;

						//トップからの移動で音が2回なってしまうので制御
						if( !scope.fcategorytop.top_move_bol ) $("#sound1").soundPlay();
						scope.fcategorytop.top_move_bol = false;
					});
					scope.flipsnap.element.addEventListener('fstouchmove', function() {
						if( self.flick_move ) return;
						//$("#sound3").soundPlay();
						self.flick_move = true;
					});

					//先頭をセット
					// scope.flipsnap.moveToPoint( 0 );
					// scope.flipsnap.refresh();

					//$("#fcategory-top").bind("SHOW", function() { $("#menu-page-layout").scrollLeft(0); } );
				}

				$(".menu-navi .navi-bottom-btn").hide();
				$(".menu-navi .navi-right-btn").show();

			} else if( Config.flick.scroll && Config.flick.vertical ) {

				//縦位置にセット
				//クラスをセット
				$("#menu-page").addClass("vertical");
				//スクロールイベント
				$("#menu-page-layout")._scroll(function(){
					scope.category.setScroll();
					scope.menubody.move();
					scope.timerReset();
				}, 1000);

				$("#menu-page-layout").css("overflow-y","auto");
				$(".menu-navi .navi-right-btn").hide();

			} else if( Config.flick.scroll ) {

				//スクロールイベント
				$("#menu-page-layout")._scroll(function(){
					self.move();
					scope.category.setScroll();
					scope.timerReset();
				}, 4000);
				// $("#menu-page-layout").bind("touchend", function(e) {
				// 	e.preventDefault();
				// });

				$("#menu-page-layout").css("overflow-x","scroll");
				$(".menu-navi .navi-bottom-btn").hide();

			} else {
				$("#menu-page-layout").css("overflow-x","hidden");
			}

			$( ".menu-navi .navi-left-btn" ).hide();
			$( ".menu-navi .navi-top-btn" ).hide();
			//scrollもしない場合にはすべてhide
			if( !Config.flick.enable && !Config.flick.scroll ) {
				$( ".menu-navi .navi-right-btn" ).hide();
				$( ".menu-navi .navi-bottom-btn" ).hide();
			}

			//ページャーの使用
			if( !empty(Config.menubody.page_navi_pager) ) {
				if(Config.menubody.page_navi_pager.enable) {
					$( ".menu-navi" ).show();
				} else {
					$( ".menu-navi" ).hide();
					$( "#menu-page" ).addClass("no-pager");
				}
			}

			//カウンターのセット
			//イベントでセット
			if( Config.counter.enable ) {
				$(document).bind("CART_UPDATE", self.updateCounter );
			}

			//メニュー起動のトリガー
			$(document).trigger( "MENU_BOOT_FINISH" );

		}, 10, 1 );
	};

	/**
		メニューの生成
	*/
	this.createMenu = function() {

		var data = scope.menudata.category;
		var index = 0;
		var html = "";
		$.each( data.fcode, function( f, fcode ) {
			$.each( fcode.scode, function( s, scode ) {
				$.each( scode.tcode, function( t, tcode) {
					var basetype = tcode.basetype;
					var lang = scope.alternate.language;
					if( lang == Config.alternate.default ) {
						lang =  "";
					} else {
						lang = lang + "_";
					}
					var style = ( !empty( basetype ) ) ?  'style="background-image:url(' + designpath + "background/page/" + lang + "page_bg_typ" + basetype + '.jpg' + chache() + ');"' : "";
					var id = 'page-' + fcode.categorycode + '-' + scode.categorycode + '-' +tcode.categorycode;
					var cclass = [ "f"+fcode.categorycode, "s"+scode.categorycode, "t"+tcode.categorycode ].join(" ");
					var template_class = tcode.class || "";
					html += '<div class="page temp' + tcode.type + ' ' + cclass + ' ' + template_class +  '" ' + style + ' id="' + id + '" data-fcode="' + fcode.categorycode + '" data-scode="' + scode.categorycode + '" data-index="' + index + '" data-tcode="' + tcode.categorycode + '" data-lock="' + fcode.lock + '" data-focus="false">';
					
					//属性が出力されていない場合の対応
					if( tcode.title_name != undefined ) {
						var tname = tcode.title_name;
						html += '<h1 class="page-title">' + tname + '</h1>';

						var tdisc = tcode.description1;
						var tclass = "";
						if( !empty( tcode.description2 ) ) {
							tdisc += "<br>" + tcode.description2;
							tclass = "l2";
						}
						html += '<h5 class="page-discription">' + tdisc + '</h5>';
					}

					html += '<ul>';
					html += self.createItem( tcode );
					html += "</ul></div>";
					index++;
				});
			});
		});

		$("#menu-bodys div").remove();

		$("#menu-bodys").html( html );

		//幅をセット
		var w = 0;
		var h = 0;
		$("#menu-bodys .page").each(function(){
			w += $(this).outerWidth();
			h += $(this).outerHeight();			
		});
		if( !Config.flick.enable && Config.flick.vertical ) {
			//$("#menu-bodys").height( h );
		} else {
			$("#menu-bodys").width( w );	
		}
		//lastのセット
		$("#menu-bodys .last").removeClass('last');
		var last = $("#menu-bodys .page").last();
		last.addClass("last");

		//クリックのセット
		$("#menu-bodys li").each( function() {
			//クリックイベント
			$(this)._click(function( e ){

				var id = $(this).data("id");
				var data  = self.menumst[id];
				var target = e.target;

				//セレクトボタン
				if( $(target).hasClass("select") ) {
					var code = $(target).data("code");
					var type = $(target).data("type");
					var select = scope.menudata.select[code];
					var index = $(target).data("index");
					var sdata = select.option[0].member[index];
					//商品のセット
					if( type == "dummy" ) {
						//ダミー商品
						data.select = null;
						scope.selectProduct( data, e );
					} else {
						var set_data = scope.menudata.menumst[sdata.id];
						scope.selectProduct( data, e, set_data );
					}
					return false;

				//詳細ボタンのクリック
				} else if( $(target).hasClass("detail") ) {
					scope.detail.show( data );
					return false;
				//加算
				} else if( $(target).hasClass("increment") && empty(data.select) && empty(data.setmenu) ) {
					scope.cart.onIncrement( { item:data, num:1, set:[], sub:[], setmenu:[] } );
					return false;
				//減算
				} else if( $(target).hasClass("decrement") && empty(data.select) && empty(data.setmenu) ) {
					scope.cart.onDecrement( { item:data, num:1, set:[], sub:[], setmenu:[] } );
					return false;
				}
				//商品のセット
				scope.selectProduct( data, e );

				scope.log.send("0","商品選択," + data.name_1 + data.name_2 + "," + data.code + "," + data.id );

			}, 2, "mouseup", true); //強制的にクリックにする スクロール判定する
		});

		//デフォルト画像のセット
		$("#menu-bodys li .image").error(function(){
			$(this).attr("src", Config.product.default_image);
			$(this).unbind("error");
		});

		//品切れを更新
		//self.setStock();
	};


	/**
	 * アイテムの生成
	 * @param  {[type]} tcode [description]
	 * @return {[type]}       [description]
	 */
	this.createItem = function( tcode ) {

		var html = "";
		var eq = 0;
		$.each( tcode.item, function( i, id ) {

			var data = self.menumst[id];

			if( empty( data ) ) {
				html += '<li class="dummy pr-' + eq + '"></li>';
				eq++;
				return true;
			}

			//console.log( data )
			var classes = [];
			if( data.stockout ) classes.push("stockout");
			if( data.nohandle ) classes.push("nohandle");
			if( scope.food_order_stop_bol && data.lock_sts == 1 ) classes.push("stop");
			if( scope.drink_order_stop_bol && data.lock_sts == 2 ) classes.push("stop");
			if( scope.order_stop_bol || scope.use_stop_bol ) classes.push("stop");

			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
				var name_1 = data.name_1;
				var name_2 = data.name_2;
				if( scope.alternate_bol && !empty(data.alt_name_1) ) {
					name_1 = data.alt_name_1;
					name_2 = data.alt_name_2;
				} 
				var name_3 = ( scope.alternate_bol && !empty(data.alt_name_3)  ) ? data.alt_name_3 : data.name_3;
				var text_1 =  ( scope.alternate_bol ) ? data.alt_text_1 : data.text_1;
				var comment_1 =  ( scope.alternate_bol ) ? data.alt_comment_1 : data.comment_1;
				var comment_2 =  ( scope.alternate_bol ) ? data.alt_comment_2 : data.comment_2;
			} else {
				var name_1 = data.name_1;
				var name_2 = data.name_2;
				var name_3 = data.name_3;
				var text_1 = data.text_1;
				var comment_1 = data.comment_1;
				var comment_2 = data.comment_2;
			}
			

			//オプションテキストを金額として利用する
			var price = priceText(data.price);
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				text_1 = "";
				var price = priceText(data.text_1) 
			}

			//文字の長さでクラスを追加
			if( !name_2.length && name_1.length <= 5 ) {
				classes.push("name_short");
			} else if( name_2.length <= 0 ) {
				classes.push("name_middle");
			} else {
				classes.push("name_long");
			}
			//オプションテキストなし
			if( !text_1.length ) {
				classes.push("no_text_1");
			}
			//コメント１なし
			if( !comment_1.length ) {
				classes.push("no_comment_1");
			}
			//セレクトボタンが入る
			if( Config.menubody.include_select.select.indexOf(data.select) > -1 ) {
				classes.push("include_select");
				if( Config.menubody.include_select.add_price ) {
					classes.push("select_add_price");
				}
			}
			//セレクトを持っているかどうか
			if( !empty(data.select) ) {
				classes.push("has_select");
			} else if( !empty(data.setmenu )) {
				//セットメニューを持っている
				classes.push("has_select");
				classes.push("has_setmenu");
			}

			html += '<li id="product-' + data.id + '" data-id="' + data.id + '" class="product ' + classes.join(" ") + ' pr-' + eq + '">';
			//html += '<img class="image" src="design_cmn/product/LL/' + data.code + Config.product.type +  chache() + '" >';
			html += '<img class="image" src="design_cmn/product/LL/' + data.code + Config.product.type + chache() + '" >';
			html += '<span class="name_1">' + name_1 + '</span>';
			var name_2class = ( empty(name_2) ) ? 'hide' : '';
			html += '<span class="name_2 ' + name_2class + '">' + name_2 + '</span>';
			html += '<button class="drinkpanel">';
				html += '<em class="name_1">' + name_1 + '</em>';
				html += '<em class="name_2 ' + name_2class + '">' + name_2 + '</em>';
				var name_3class = ( empty(name_3) ) ? 'hide' : '';
				html += '<em class="name_3 ' + name_3class + '">' + name_3 + '</em>';
				var comment_1class = ( empty(comment_1) ) ? 'hide' : '';
				html += '<em class="comment_1 ' + comment_1 + '">' + comment_1 + '</em>';
				var text_1class = ( empty(text_1) ) ? 'hide' : '';
				html += '<em class="text_1 ' + text_1class + '">' + text_1 + '</em>';
				html += '<em class="price">' + price + '</em>';
			html += '</button>';
			html += '<span class="comment_1 ' + comment_1 + '">' + comment_1 + '</span>';
			var comment_2class = ( empty(comment_2) ) ? 'hide' : '';
			html += '<span class="comment_2 ' + comment_2class + '">' + comment_2 + '</span>';
			var text_1class = ( empty(text_1) ) ? 'hide' : '';
			html += '<span class="text_1 ' + text_1class + '">' + text_1 + '</span>';
			html += '<span class="price">' + price + '</span>';

			//クリックエリア
			html += '<span class="click_area"></span>';

			//アイコンのセット
			//詳細アイコン
			//console.log( !empty(data.comment_2) && data.comment_2 != "" )
			var dstyle = "display:none";
			if( !empty(comment_2) && comment_2 != "" ) dstyle = "";
			html += '<button class="detail" style="' + dstyle + '">' + scope.alternate.getString("#menu-page-layout .detail") + '</button>';
			
			var lang = scope.alternate.language;
			if( lang == Config.alternate.default ) {
				lang =  "";
			} else {
				lang = lang + "_";
			}
			var icon_path = window.designpath + "icon/LL/" + lang + "icon_";
			if( !empty(data.icon_1) ) html += '<i class="icon_1" style="background-image:url(' + icon_path + data.icon_1 + '.png);"></i>';
			if( !empty(data.icon_2) ) html += '<i class="icon_2" style="background-image:url(' + icon_path + data.icon_2 + '.png);"></i>';
			if( !empty(data.icon_3) ) html += '<i class="icon_3" style="background-image:url(' + icon_path + data.icon_3 + '.png);"></i>';
			
			if( data.nohandle ) {
				html += '<i class="icon_nohandle">' + scope.alternate.getString(".icon_nohandle") + '</i>';
			}
			if( data.stockout ) {
				html += '<i class="icon_stockout">' + scope.alternate.getString(".icon_stockout") + '</i>';
			}

			//セレクトボタンの埋め込み
			//指定のセレクトグループが設定されている場合にはセレクトボタンを埋め込む
			if( Config.menubody.include_select.select.indexOf(data.select) > -1 ) {
				var select_data = scope.menudata.select[data.select];

				if( select_data && select_data.option[0].member ) {
					html += '<div class="select_buttons">';
					$.each( select_data.option[0].member, function( k, select ) { //ステップはないので0のみ
						var sdata = scope.menudata.menumst[select.id];
						var type = "default";
						if( select.id == "9999" ) {
							type = "dummy";
							sdata = { price:0 };
						}
						var name = ( empty( select.name_2 ) ) ? select.name_1 : select.name_1 + "<br />" + select.name_2;
						if( scope.alternate_bol && !empty(select.alt_name_1) ) {
							var name = ( empty( select.name_2 ) ) ? select.alt_name_1 : select.alt_name_1 + "<br />" + select.alt_name_2;
						}
						html += '<button class="select" data-type="' + type + '" data-code="' + data.select + '" data-index="' + k + '">';
						//変則だがボタン内にalt_textを格納
						html += '<em class="select_name" data-deftext1="' + select.name_1 + '" data-deftext2="' + select.name_2 + '" data-alttext1="' + select.alt_name_1 + '" data-alttext2="' + select.alt_name_2 + '">';
						html += name + '</em>';
						var sp = ( Config.menubody.include_select.add_price ) ? Number( sdata.price ) + Number( data.price ) : sdata.price;
						html += '<em class="select_price" data-price="' + sp + '">' + priceText(sp) + '</em>';
						html += '</button>';
					});
					html += '</div>';
				}
			}

			html += '</li>';
			eq++;
		});		
		return html;

	};

	/**
		代替言語のセット
	*/
	this.setAlternate = function( bol ) {

		//商品の変更
		$("#menu-bodys li").each( function() {
			var id = $(this).data("id");
			var data  = self.menumst[id];
			if( empty( data ) ) {
				//dummyの場合
				return true;
			}

			var name_1 = data.name_1;
			var name_2 = data.name_2;
			if( bol && !empty(data.alt_name_1) ) {
				name_1 = data.alt_name_1;
				name_2 = data.alt_name_2;
			} 
			var name_3 = ( bol && !empty(data.alt_name_3)  ) ? data.alt_name_3 : data.name_3;
			var text_1 =  ( bol ) ? data.alt_text_1 : data.text_1;
			var comment_1 =  ( bol ) ? data.alt_comment_1 : data.comment_1;
			var comment_2 =  ( bol ) ? data.alt_comment_2 : data.comment_2;

			//オプションテキストを金額として利用する
			var price = priceText(data.price);
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				text_1 = "";
				var price = priceText(data.text_1) 
			}

			$(this).find( ".name_1" ).html( name_1 );
			$(this).find( ".name_2" ).html( name_2 );
			$(this).find( ".name_3" ).html( name_3 );
			$(this).find( ".text_1" ).html( text_1 );
			$(this).find( ".comment_1" ).html( comment_1 );
			$(this).find( ".comment_2" ).html( comment_2 );
			$(this).find( ".price" ).html( price );

			( empty(name_2) ) ? $(this).find( ".name_2" ).addClass('hide') : $(this).find( ".name_2" ).removeClass('hide');
			( empty(name_3) ) ? $(this).find( ".name_3" ).addClass('hide') : $(this).find( ".name_3" ).removeClass('hide');
			( empty(text_1) ) ? $(this).find( ".text_1" ).addClass('hide') : $(this).find( ".text_1" ).removeClass('hide');
			( empty(comment_1) ) ? $(this).find( ".comment_1" ).addClass('hide') : $(this).find( ".comment_1" ).removeClass('hide');
			( empty(comment_2) ) ? $(this).find( ".comment_2" ).addClass('hide') : $(this).find( ".comment_2" ).removeClass('hide');

			if( !empty(comment_2) && comment_2 != "" ) {
				$(this).find(".detail").show();
			} else {
				$(this).find(".detail").hide();
			}

			//文字の長さでクラスを追加
			var classes = [];
			$(this).removeClass("name_short name_middle name_long no_text_1 no_comment_1");
			if( !name_2.length && name_1.length <= 5 ) {
				classes.push("name_short");
			} else if( name_2.length <= 0 ) {
				classes.push("name_middle");
			} else {
				classes.push("name_long");
			}
			//オプションテキストなし
			if( !text_1.length ) {
				classes.push("no_text_1");
			}
			//コメント１なし
			if( !comment_1.length ) {
				classes.push("no_comment_1");
			}
			$(this).addClass( classes.join(" ") );

			//セレクトボタン
			$(this).find(".select_name").each(function(){
				var n1 = ( bol ) ? $(this).data("alttext1") : $(this).data("deftext1");
				var n2 =  ( bol ) ? $(this).data("alttext2") : $(this).data("deftext2");
				var n = ( !empty( n2 ) ) ? n1 + "<br />" + n2 : n1;
				$(this).html( n );
			});
			$(this).find(".select_price").each(function(){
				$(this).html( priceText($(this).data("price")) );
			});
		});

		//ページタイトル
		//ページ背景
		//カテゴリーコードで検索
		var cate = scope.menudata.category;
		$.each( cate.fcode, function( f, fcode ) {
			$.each( fcode.scode, function( s, scode ) {
				$.each( scode.tcode, function( t, tcode) {
					var id = '#page-' + fcode.categorycode + '-' + scode.categorycode + '-' +tcode.categorycode;
					var pageobj = $("#menu-bodys").find(id);

					var basetype = ( scope.alternate_bol ) ? tcode.alt_basetype ||  tcode.basetype : tcode.basetype;
					var style = ( !empty( tcode.basetype ) ) ?  'background-image:url(' + designpath + "background/page/page_bg_typ" + basetype + '.jpg' + chache() + ');' : "";
					pageobj.attr( "style", style );

					//属性が出力されていない場合の対応
					if( tcode.title_name != undefined ) {
						var title = ( bol && !empty(tcode.alt_title_name) ) ? tcode.alt_title_name : tcode.title_name;
						pageobj.find('.page-title').text(title);

						var tdisc = ( bol && !empty(tcode.alt_description1) ) ? tcode.alt_description1 : tcode.description1;
						if( scope.alternate_bol ) {
							if( !empty( tcode.alt_description2 ) ) {
								tdisc += "<br>" + tcode.alt_description2;
								tclass = "l2";
							}
						} else {
							if( !empty( tcode.description2 ) ) {
								tdisc += "<br>" + tcode.description2;
								tclass = "l2";
							}
						}
						pageobj.find('.page-discription').html(tdisc);
					}
				});
			});
		});
	};

	/**
		商品データの取得
	*/
	this.getProduct = function( id ) {
		var id = $(this).data("id");
		return self.menumst[id];
	};

	/**
		移動後のリスナー
	*/
	this.move = function( index ) {

		if(  !Config.flick.enable && Config.flick.vertical ) {
			//縦スクロール
			//上下スクロール
			var list = $("#menu-page-layout");
			var sh = list.get(0).scrollHeight;
			//var max = sh - list.get(0).clientHeight;
			var max = (self.page_height-1) * (self.visible_page.length-1)
			
			if( list.scrollTop() <= 0 || sh <= list.get(0).offsetHeight ) {
				//スクロールの場合の判定
				$( ".menu-navi .navi-top-btn" ).hide();
			} else {
				$( ".menu-navi .navi-top-btn" ).show();
			}

			//var max_bottom = self.page_height * (self.page_length - 1);
			//var max_bottom = self.page_height * ( self.visible_page.length - 1 );
			//var stop = $("#menu-page-layout").scrollTop();

			if( list.scrollTop() >= max || sh <= list.get(0).offsetHeight ) {
				//スクロールの場合の判定
				$( ".menu-navi .navi-bottom-btn" ).hide();
			} else {
				$( ".menu-navi .navi-bottom-btn" ).show();
			}

		} else {

			var list = $("#menu-page-layout");
			var sw = list.get(0).scrollWidth;
			//var max = sw - list.get(0).clientWidth;
			var max = (self.page_width-1) * (self.visible_page.length-1)

			//左右スクロール
			if( Config.flick.enable && !scope.flipsnap.hasPrev() ) {
				$( ".menu-navi .navi-left-btn" ).hide();

			} else if( !Config.flick.enable && ( list.scrollLeft() <= 0 || sw <= list.get(0).offsetWidth )) {
				//スクロールの場合の判定
				$( ".menu-navi .navi-left-btn" ).hide();
				$( ".menu-navi.navi-left").addClass("hide");
				
				//list.find(".page").attr("data-focus", "false").first().find(".page").first().attr("data-focus", "true");
				list.find(".focus").removeClass("focus");
				list.find(".page").first().addClass("focus");

			} else {
				$( ".menu-navi .navi-left-btn" ).show();
				$( ".menu-navi.navi-left").removeClass("hide");
			}

			if( Config.flick.enable && !scope.flipsnap.hasNext() ) {
				$( ".menu-navi .navi-right-btn" ).hide();
			} else if( !Config.flick.enable && ( list.scrollLeft() >= max || sw <= list.get(0).offsetWidth ) ) {
				//スクロールの場合の判定
				$( ".menu-navi .navi-right-btn" ).first().hide();
				$( ".menu-navi.navi-right").addClass("hide");

				//list.find(".page").attr("data-focus", "false").last().find(".page").first().attr("data-focus", "true");
				list.find(".focus").removeClass("focus");
				list.find(".page").last().addClass("focus");

			} else {
				$( ".menu-navi .navi-right-btn" ).show();
				$( ".menu-navi.navi-right").removeClass("hide");
			}
		}

	};

	
	/**
	 * カウンターのセット
	 * @return {[type]} [description]
	 */
	this.updateCounter = function() {
		var id = scope.cart.order_id;
		//var timer = $.timer( function() {
			$("#menu-bodys .counter").remove();
			var data = scope.cart.getCartAryWithoutSelect(); //scope.cart.cartAry;
			if( data.length ) {
				$.each( data, function( i, item ) {
					var html = '<span class="counter">';
					html += '<button class="decrement">-</button>';
					html += '<span class="count"><em>' + item.num + '</em></span>';
					html += '<button class="increment">+</button>';
					html += '</span>';
					$("#menu-bodys #product-" + item.item.id).append(html);
				});
				if( Config.counter.animate ) {
					var counter = $("#menu-bodys #product-" + id).find(".counter");
					counter.removeClass("up");
					self.counter_timer = $.timer(function(){
						counter.addClass("up");
						this.stop();
					}, Config.counter.delay, 1);
				}
			}

			//this.stop();
		//}, 100, 1 );
	}


	/**
		品切れのセット
		@items 品切れ商品配列
	*/
	this.setStock = function() {

		var items = ExternalInterface.stock;
		if( empty( self.menumst ) ) return;

		$("#menu-bodys .stockout").removeClass("stockout").find(".icon_stockout").remove();
		$.each( items, function( i, item ) {
			html = '<i class="icon_stockout">品切れ</i>';
			$("#menu-bodys #product-" + item).addClass("stockout").append( html );
		});

	};

	/**
	 * オーダーロック
	 * @param  {[type]} mode [ロック対象 food,drink,all]
	 * @return {[type]}      [description]
	 */
	this.orderLock = function( mode ){

		if( empty( self.menumst ) ) return;

		switch( mode ) {
			case "food":
				$.each( self.menumst, function(i, item){
					if( Number(item.lock_sts) == 1 ) {
						html = '<i class="icon_stop">終了しました</i>';
						$("#menu-bodys #product-" + item.id).addClass("stop").append( html );
						self.menumst[item.id].orderstop = true;
					}
				});
				break;
			case "drink":
				$.each( self.menumst, function(i, item){
					if( Number(item.lock_sts) == 2 ) {
						html = '<i class="icon_stop">終了しました</i>';
						$("#menu-bodys #product-" + item.id).addClass("stop").append( html );
						self.menumst[item.id].orderstop = true;
					}
				});
				break;
			default:
				$.each( self.menumst, function(i, item){
					html = '<i class="icon_stop">終了しました</i>';
					$("#menu-bodys #product-" + item.id).find(".icon_stop").remove();
					$("#menu-bodys #product-" + item.id).addClass("stop").append( html );
					self.menumst[item.id].orderstop = true;
				});
				break;
		}
	};

	/**
	 * オーダーロック解除
	 * @param  {[type]} mode [解除対象 food,drink,all]
	 * @return {[type]}      [description]
	 */
	this.orderUnlock = function( mode ) {

		//console.log( self.menumst.length )
		if( empty( self.menumst ) ) return;

		switch( mode ) {
			case "food":
				$.each( self.menumst, function(i, item){
					if( item.lock_sts == 1 ) {
						$("#menu-bodys #product-" + item.id).removeClass("stop").find(".icon_stop").remove();
						self.menumst[item.id].orderstop = false;
					}
				});
				break;
			case "drink":
				$.each( self.menumst, function(i, item){
					if( item.lock_sts == 2 ) {
						$("#menu-bodys #product-" + item.id).removeClass("stop").find(".icon_stop").remove();
						self.menumst[item.id].orderstop = false;
					}
				});
				break;
			default:
				$.each( self.menumst, function(i, item){
					$("#menu-bodys #product-" + item.id).removeClass("stop").find(".icon_stop").remove();
					self.menumst[item.id].orderstop = false;
				});
				break;				
		}
	};


	/**
	 * 商品のロック
	 * カートがいっぱい
	 * @param {string} type case or item.id
	 */
	this.setDisabled = function(type, clear) {

		if( empty( self.menumst ) ) return;
		if( empty( type ) ) return;

		switch( type ) {
			case "reset":
				$("#menu-bodys .disabled").removeClass("disabled");
				$("#total-full-message").remove();
				break;

			case "all": //すべてオーダー不可
				$("#menu-bodys li").addClass("disabled");
				var msg = scope.alternate.lang_data.messages["max_value_total"]["msg"];
				$("#menu-page-layout").after('<div id="total-full-message"><h3>' + msg + '</h3></div>');
				break;

			case "panel":
				$.each( self.menumst, function(i, item){
					if( item.usePanel == 1 ) {
						$("#menu-bodys #product-" + item.id).addClass("disabled");
					}
				});
				var msg = scope.alternate.lang_data.messages["max_panel_value_total"]["msg"];
				$("#menu-page-layout").after('<div id="total-full-message"><h3>' + msg + '</h3></div>');
				break;

			default :
				if( !clear ) {
					$("#menu-bodys #product-" + type).addClass("disabled");
				} else {
					$("#menu-bodys #product-" + type).removeClass("disabled");
				}
				break;
		}
	};


	/**
	 * ロックカテゴリーのセット
	 * そのカテゴリーしか表示しない
	 * @param {Object} code tcode
	 * @param {Object} data getCategoryDataByCodeのreturnデータ
	 */
	this.setLockCategory = function( code, data ) {

		var cdata = ( !empty(data) ) ? data : scope.category.getCategoryDataByCode( code );

		var w = 0;
		var h = 0;
		self.visible_page = [];

		var pages = $("#menu-bodys .page");
		if(cdata.fcode.lock) {
			pages.hide();
		} else {
			pages.show();
		}
		pages.each(function(){
			var visible = false;
			if( cdata.fcode.lock ) {
				//対象コード内のみ表示
				if( $(this).data("fcode") == cdata.fcode.categorycode ) {
					$(this).show();
					visible = true;
				}
			} else {
				if( $(this).data("lock") ) {
					//ロックカテゴリーは非表示
					$(this).hide();
				} else {
					visible = true;
				}
			}
			if( visible ) {
				w += $(this).outerWidth();
				h += $(this).outerHeight();
				self.visible_page.push( $(this) );
			}
		});
		//幅を再セット
		if( !Config.flick.enable && Config.flick.vertical ) {
			//$("#menu-bodys").height( h );
		} else {
			$("#menu-bodys").width( w );
		}

		//flickのmaxPointの再設定
		if( !empty(scope.flipsnap) ) {
			scope.flipsnap.maxPoint = self.visible_page.length-1;
			scope.flipsnap.refresh();
		}

		//lastのセット
		$("#menu-bodys .last").removeClass('last');
		var last = self.visible_page.last();
		last.addClass("last");
	};


	/**
	 * 人数チェックで数量を超えてるものをオーダー不可にする
	 * @param {Array} group チェックグループ配列 { id:check_id, item:[data], num:val.amount, lock:false }
	 * @param {Array} item チェックアイテム配列 { id:val.id, item:data, num:val.amount, lock:false }
	 */
	this.setCheckPerson = function( group, person ) {

		// $("#menu-bodys .personstop").removeClass("personstop");
		
		// $.each( group, function( i, temp ) {
		// 	if( temp.lock ) {
		// 		$.each( temp.item, function( i, item ) {			
		// 			html = '<i class="icon_personstop">ご注文いただけません。</i>';
		// 			$("#menu-bodys #product-" + item.id).addClass("personstop").append( html );
		// 		});
		// 	}			
		// });

		// $.each( person, function( k, temp ) {
		// 	if( temp.lock ) {
		// 		var item = $("#menu-bodys #product-" + temp.id);
		// 		//if( !item.hasClass("personstop") ) {
		// 			html = '<i class="icon_personstop">ご注文いただけません。</i>';
		// 			item.addClass("personstop").append( html );
		// 		//}
		// 	}
		// });
	}
}
;;
var Message = function( scope ) {

	var self = this;
	var scope = scope;
	this.messages; 
		//{ "msg":"メッセージ", "action":"-1", "blink":"点滅 Boolean", "yes":"ボタン名, "no":"ボタン名"}
		//action
		//0:再起動
		//1:閉じる
		//2:注文商品にエラー（品切れ）があった場合で、カート内の対象商品を削除する場合
		//3:注文商品にエラーがあった場合で,カートをクリアする場合
		//-1:クローズボタン非表示
	this.item; //エラー商品
	this.callback;
	this.message_code; //メッセージID

	this.lock; //ロックフラグ


	//リストの上下
	$("#message .prev")._click(function(){
		self.setListPrev();
	});
	$("#message .next")._click(function(){
		self.setListNext();
	});
	//リストのスクロールイベント
	$("#message .item-list ul").scroll( function() {
		self.setListBtn();
	});

	//文字色クラスをセット
	if( !empty( Config.message ) ) {
		$("#message h1").addClass( Config.message.text_class );
	}
	

	/**
		起動
		@data メッセージデータ（alternateから）
	*/
	this.init = function( data ) {
		self.messages = data;
	};


	/**
	 * メッセージの表示
	 * @param  {[type]}   code        メッセージコード 
	 * @param  {[type]}   description 詳細
	 * @param  {[type]}   item       オーダーエラー時の商品配列
	 * @param  {Function} callback    閉じた後のcallback（クローズボタン押下後）
	 * @param  {[type]}   lock        Hide引数で同じcodeを送られるまで消さない
	 * @return {[type]}               [description]
	 */
	this.show = function( code, description, item, callback, lock ) {
		
		if( empty(self.messages) ) return;
		if( self.lock ) return;

		var msgobj = self.messages[code];
		if( empty( msgobj ) ) { //オブジェクトなし
			//console.log("Messageデータがありません。", code);
			//return;
			//codeをそのまま表示する
			msgobj = { "msg":code, "action":1 };
		}

		var message = $("#message");
		var close  = $("#message .close-btn");
		var h1 = $("#message h1");

		//confirm用のボタンを非表示
		$("#message .confirm").hide();

		if( self.message_code ) {
			message.removeClass( self.message_code );
		}
		message.removeClass( "in-item-list" );
		h1.removeClass( "blink in" );

		//表示
		if( !msgobj.noclass ) message.addClass( code );
		message.show();
		h1.html(msgobj.msg);
		//discriptionがある場合に表示
		if( !empty( description ) ) {
			$("#message .description").text( code + " " + description ).show();
		} else {
			$("#message .description").hide();
		}

		self.message_code = code;

		// エラー商品配列を生成
		var html = "";
		self.item = item;
		if( !empty(item) ) {
			//商品リストを作る
			$.each( item, function(i, id) {
				var val = scope.cart.getCartAryProductId( id );
				if( !val ) return true;
				//var name = ( scope.alternate_bol ) ? val.item.alt_name_1 + val.item.alt_name_2 : val.item.name_1 + val.item.name_2;
				var name = val.item.name_1 + val.item.name_2;
				html += '<li><span class="name">' + name + '</span>';
				html += '<span class="price">' + val.item.price + '</span>';
				html += '<span class="num">' + val.num + '</span>';
				html += '</li>';
			});
			$( "#message .item-list ul" ).html( html );
			$( "#message .item-list" ).show();
			$( "#message").addClass("in-item-list");
		} else {
			$( "#message .item-list" ).hide();
			$( "#message").removeClass("in-item-list");
		}
		self.setListBtn();


		if( msgobj.action == "-1" ) {
			//actionがない場合にはクローズボタンを表示しない
			$("#message .close").hide();
		} else {
			$("#message .close").show();
		}

		//blink
		if( msgobj.blink ) {
			h1.addClass( "blink" );
		} else {
			h1.addClass( "in" );
		}

		self.callback = callback;

		//クローズボタンのイベントのセット
		close._click(function(){
			switch(msgobj.action) {
				case "0" :
					scope.reboot();
					break;
				
				case "1":
					//this.scope.Hidden();
					self.hide( code );
					break;
				
				case "2":
					// 注文商品にエラー（品切れ）があった場合で、カート内の対象商品を削除する場合
					if( !empty(self.item) ) scope.cart.onDeleteList(self.item);
					self.hide( code );	
					break;
				
				case "3":
					// 注文商品にエラーがあった場合で,カートをクリアする場合
					scope.cart.onDeleteAll();
					self.hide( code );
					break;
					
				default :
					self.hide( code );
					break;
			}
			message.removeClass( self.message_code );
			h1.removeClass("in");
			//callbackがある場合には実行
			if( !empty(self.callback) ) {
				self.callback();
			}
		}, 1, "mouseup"); //下の言語切り替えをクリックすることがあるのでマウスアップ

		self.lock = lock || false;

		//言語を更新
		scope.alternate.updateLang();

		scope.log.send("0","MESSAGE,メッセージを表示します。,メッセージCODE:" + code + ",DESC:" + description);

		$(document).trigger("MESSAGE_SHOW");
	};

	/**
		yes, noの画面
		@code メッセージコード
		@yfunc yesのcallback
		@nfunc noのcallback
	*/
	this.confirm = function( code, yfunc, nfunc ) {

		var msgobj = self.messages[code];

		if( empty( msgobj ) ) { //オブジェクトなし
			msgobj = { "msg":code, "yes":"はい", "no":"いいえ", "action":"-1"  };
		}

		$("#message .close").hide();

		var message = $("#message");
		var h1 = $("#message h1");
		h1.removeClass( "blink in" );

		if( self.message_code ) {
			message.removeClass( self.message_code );
		}
		$( "#message .item-list" ).hide();
		message.removeClass( "in-item-list" );
		$("#message .description").hide();

		//表示
		message.addClass( code ).show();
		h1.html(msgobj.msg).addClass( "in" );

		self.message_code = code;

		//yesボタンのクリック
		$("#message .yes").text(msgobj.yes)._click(function(){
			if( empty(yfunc) ) {
				self.hide();
			} else {
				self.hide();
				yfunc();
			}
		});
		//noボタンのクリック
		$("#message .no").text(msgobj.no)._click(function(){
			if( empty(nfunc) ) {
				self.hide();
			} else {
				self.hide();
				nfunc();
			}
		});

		$("#message .confirm").show();

		$(document).trigger("MESSAGE_CONFIRM_SHOW");
	};

	/**
	 * setListBtn ボタンの表示セット
	 */
	this.setListBtn = function() {

		$("#message").find(".next,.prev").hide();

		var list = $("#message .item-list ul");
		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;

		if( list.scrollTop() >= max || sh <= list.get(0).offsetHeight ) {
			$("#message .next").hide();
		} else {
			$("#message .next").show();
		}
		if( list.scrollTop() <= 0 || sh <= list.get(0).offsetHeight ) {
			$("#message .prev").hide();
		} else {
			$("#message .prev").show();
		}
	};

	/**
	 * setListPrev 前へのボタンクリック
	 */
	this.setListPrev = function() {
		var list = $("#message .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h * 5 ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	};

	/**
	 * setListNext 次へのボタンクリック
	 */
	this.setListNext = function() {
		var list = $("#message .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() +  h * 5 ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	};


	/**
		非表示
	*/
	this.hide = function( code ) {
		if( self.lock && code != self.message_code ) {
			return;
		}

		$("#message").hide();
		if( self.message_code ) {
			$("#message").removeClass( self.message_code );
			self.message_code = "";
		}

		self.lock = false;

	};

};;
/**
 * 番号入力
 */
var NumberInput = function(scope) {

	"use strict";

	var self = this;
	var scope = scope;

	this.menumst; //メニューデータ
	this.product_data; //選択商品
	this.select_msg; //選択メッセージを表示するかどうか

	//チェックアウト
	//$(document).bind("MODE_CHANGE CHECKOUT", function() { self.init(); });

	//オーダーロック
	$(document).bind("FOOD_STOP DRINK_STOP ORDER_STOP", function() { 
		self.setView( false );
	});

	//カート追加イベントリスナー
	$(document).bind("CART_UPDATE", function() {
		//注文可能数をセット
	 	self.checkNum();

	 	//表示をリセット
	 	self.setView( false );
	});

	//次へ
	$(".no-input-bodys .next-btn")._click(function(){
		self.searchItem();
	});

	//注文ボタン
	$("#number-input .num-input-bodys .order-btn")._click(function(){
		self.setOrder();
	});

	//キャンセル
	$("#number-input .num-input-bodys .cancel-btn")._click(function(){
		self.setView(false);
	});


	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {

		if( empty(Config.number_input) || !Config.number_input.enable ) {
			$("#number-input").remove();
			return;
		}

		self.menumst = scope.menudata.menumst;
		self.setButton();
		self.setView(false);

		//数量入力のタイプを変更
		var div = $("#number-input");
		if( Config.number_input.num_counter ) {
 			div.find(".num-input-bodys .buttons").hide();
 			div.find(".num-input-bodys .counter").show();
 			$("#number-input").addClass("num-counter");
 			self.setCounter();
 		} else {
 			div.find(".num-input-bodys .buttons").show();
 			div.find(".num-input-bodys .counter").hide();
 		}

 		//トップに多言語切り替えボタンがあるかどうか
 		//クラスをつける
 		if( !Config.fcategory_top.alternate.enable || !Config.alternate.enable ) {
 			$("#number-input").addClass("no-alternate");
 		}

		self.show();
	};

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function() {
		$("#number-input").show();
	};


	/**
	 * 表示切替
	 * @param {Boolean} [bol] [1:num-input, 0:default]
	 */
	 this.setView = function( bol ) {

	 	var div = $("#number-input");
	 	$("#number-input .inputs").val("");

	 	if( bol ) {
	 		div.find(".num-input-bodys").show();
			div.find(".no-input-bodys").hide();
			div.find(".no-input-title").removeClass("selected");
			div.find(".num-input-title").addClass("selected");
	 		if( Config.number_input.num_counter ) {
	 			div.find(".num-input-bodys .buttons").hide();
	 			div.find(".num-input-bodys .counter").show();

	 			//数量を1にセット
	 			div.find(".num-input-bodys").find(".inputs").val(0);
	 			div.find(".num-input-bodys .counter em").text(0);
	 			div.find(".num-input-bodys .inputs-box").hide();

	 			div.find(".num-input-bodys .counter .increment").removeAttr("disabled");
	 			div.find(".num-input-bodys .counter .decrement").attr("disabled", true);

	 			//次へボタンを無効化
				div.find(".num-input-bodys").find(".order-btn").removeAttr( "disabled");

	 		} else {

	 			//番号キーボタンを表示
	 			div.find(".num-input-bodys .buttons").show();
	 			div.find(".num-input-bodys .counter").hide();

				//次へボタンを無効化
				div.find(".num-input-bodys").find(".order-btn, .btn-0, .delete").attr( "disabled", true );
	 		}
		 	
	 	} else {
	 		//表示を初期化
			div.find(".num-input-bodys").hide();
			div.find(".no-input-bodys").show();
			div.find(".no-input-title").addClass("selected");
			div.find(".num-input-title").removeClass("selected");

			//次へボタンを無効化
			div.find(".no-input-bodys .next-btn, .delete").attr( "disabled", true );

			//cart_updateで消えてしまうので、ここではリセットしない
			//self.product_data = null;
	 	}
	 }

	/**
	 * ボタンをセット
	 */
	this.setButton = function() {

		//初期化
		var html = "";
		for( var i=0; i<=9; i++ ) {
			if( Config.number_input.no_use_keypad ) {
				var n = [7,8,9,4,5,6,1,2,3,0][i]
			} else {
				var n = i+1;
				if( n == 10 ) n =0;
			}
			html += '<button class="btn-' + n + '" data-key="' + n + '">' + n + '</button>';
		}
		html += '<button class="delete" data-key="delete">×</button>';
		$("#number-input .buttons").html(html);
		self.num_input_bol = true;

		//クリック
		$("#number-input .buttons button")._click(function() {

			var is_num = $(this).parents(".input").hasClass("num-input-bodys");
			var target = (is_num) ? $("#number-input .num-input-bodys") : $("#number-input .no-input-bodys");
			var key = $(this).data("key");

			if( key == "delete" ) {
				//var val = $("#search-input").val();
				//var txt = String(val).to( val.length-1 );
				//一括削除に変更
				target.find(".inputs").val( '' );
				if( is_num )  {
					self.checkNum();
					target.find(".order-btn").attr( "disabled", true );
				} else {
					target.find(".next-btn, .delete").attr( "disabled", true );
				}

			} else {
				var num_count = ( empty(Config.number_input.count) ) ? 4 : Config.number_input.count;
				var leng = ( is_num ) ? 2 : num_count; //番号入力桁数;
				//4文字に固定
				if( target.find(".inputs").val().length  >= leng ) {
					return;
				}
				
				var txt = target.find(".inputs").val() + key;
				if( is_num )  {
					if( !Number(txt) ) {
						return;
					} else {
						target.find(".inputs").val( txt );
						self.checkNum();
						target.find(".order-btn").removeAttr("disabled");
					}
				} else {
					target.find(".inputs").val( txt );
					target.find(".next-btn, .delete").removeAttr( "disabled" );
				}
				
			}
		});

		//ボタン名をアップデート
		scope.alternate.updateLang();
	};


	/**
	 * カウンターのセット
	 */
	this.setCounter = function() {

		var counter = $("#number-input .no-input-bodys .counter em");
		var bodys = $("#number-input .num-input-bodys");

		//インクリメント
		bodys.find(".increment")._click(function() {
			self.setNumCounter( true );
		});

		//デクリメント
		bodys.find(".decrement")._click(function() {
			self.setNumCounter( false );
		});
	}


	/**
	 * 商品の検索
	 */
	 this.searchItem = function() {

	 	var no = $("#number-input .no-input-bodys .inputs").val();
	 	var data;
	 	if( Config.number_input.search_page ) {
	 		//ページに配置してある商品のみから検索
	 		var pagedata = scope.category.page_item_ary;
	 		$.each( pagedata, function( key, id ) {
	 			var item = self.menumst[id];
	 			if( empty( item ) ) return true;
				if( item.no == no ) {
					data = item;
					return false;
				}
			});
	 	} else {
			$.each( self.menumst, function( key, item ) {
				if( item.no == no ) {
					data = item;
					return false;
				}
			});
	 	}

	 	if( empty(data) ) {
	 		//商品なし
	 		//アラート表示
	 		scope.alert.show( "number_input_notfound" );
	 		$("#number-input .no-input-bodys .inputs").val("");
	 		$("#number-input .no-input-bodys .next-btn, .delete").attr( "disabled", true );
	 		return;
	 	}

	 	//品切れ
	 	if( data.stockout ) {
	 		scope.alert.show( "number_input_stockout" );
	 		$("#number-input .no-input-bodys .inputs").val("");
	 		$("#number-input .no-input-bodys .next-btn, .delete").attr( "disabled", true );
	 		return;
	 	}
	 	//取り扱いなし
		if( data.nohandle ) {
			scope.alert.show( "number_input_nohandle" );
	 		$("#number-input .no-input-bodys .inputs").val("");
	 		$("#number-input .no-input-bodys .next-btn, .delete").attr( "disabled", true );
			return;
		}
		//フードストップ
		if( scope.food_order_stop_bol && data.lock_sts == 1 ) {
			scope.alert.show( "number_input_foodstop" );
	 		$("#number-input .no-input-bodys .inputs").val("");
	 		$("#number-input .no-input-bodys .next-btn, .delete").attr( "disabled", true );
			return;
		}
		//ドリンクストップ
		if( scope.drink_order_stop_bol && data.lock_sts == 2 ) {
			scope.alert.show( "number_input_drinkstop" );
	 		$("#number-input .no-input-bodys .inputs").val("");
	 		$("#number-input .no-input-bodys .next-btn, .delete").attr( "disabled", true );
			return;
		}
		//オーダーストップ
		if( scope.order_stop_bol || scope.use_stop_bol ) {
			scope.alert.show( "number_input_stop" );
	 		$("#number-input .no-input-bodys .inputs").val("");
	 		$("#number-input .no-input-bodys .next-btn, .delete").attr( "disabled", true );
			return;
		}
		

		scope.log.send("0","番号商品選択," + data.name_1 + data.name_2 + "," + data.code + "," + data.id );

		//セレクトあり
		if( !empty( data.select ) ) {
			//商品のセット
			scope.selectProduct( data );
			
			$("#number-input .no-input-bodys .inputs").val("");
			$("#number-input .no-input-bodys .next-btn, .delete").attr( "disabled", true );
			return;
		}
	 	
	 	var html = self.createItem( data );
	 	$("#number-input .num-input-bodys .item").html( html );

	 	//詳細ボタンのクリック
	 	$("#number-input .num-input-bodys .item .detail")._click(function() {
	 		scope.detail.show( data );
	 		//詳細ボタンの選択の場合
	 	});

	 	self.product_data = data;

	 	//数量選択を表示
	 	self.setView( true );
	 	
	 	//注文可能数をセット
	 	self.checkNum();
	 	if(Config.number_input.num_counter) {
	 		self.setNumCounter(true);
	 	}
	 	
	 	
	 }


	/**
	 * アイテムデータの整形
	 * @param  {[type]} item [description]
	 * @return {[type]}      [description]
	 */
	this.createItem = function( data ) {

		var html = "";

		var classes = [];
		if( data.stockout ) classes.push("stockout");
		if( data.nohandle ) classes.push("nohandle");
		if( scope.food_order_stop_bol && data.lock_sts == 1 ) classes.push("stop");
		if( scope.drink_order_stop_bol && data.lock_sts == 2 ) classes.push("stop");
		if( scope.order_stop_bol || scope.use_stop_bol ) classes.push("stop");

		//セレクトを持っているかどうか
		if( !empty(data.select) ) {
			classes.push("has_select");
		}

		html += '<div id="product-' + data.id + '" data-id="' + data.id + '" class="product ' + classes.join(" ") + '">';
		html += '<img class="image" src="design_cmn/product/LL/' + data.code + Config.product.type + '" >';

		var name_1 = data.name_1;
		var name_2 = data.name_2;
		if( scope.alternate_bol && !empty(data.alt_name_1) ) {
			name_1 = data.alt_name_1;
			name_2 = data.alt_name_2;
		} 
		var name_3 = ( scope.alternate_bol && !empty(data.alt_name_3)  ) ? data.alt_name_3 : data.name_3;
		var text_1 =  ( scope.alternate_bol ) ? data.alt_text_1 : data.text_1;
		var comment_1 =  ( scope.alternate_bol ) ? data.alt_comment_1 : data.comment_1;
		var comment_2 =  ( scope.alternate_bol ) ? data.alt_comment_2 : data.comment_2;

		//オプションテキストを金額として利用する
		var price = priceText(data.price);
		if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
			text_1 = "";
			var price = priceText(data.text_1) 
		}

		html += '<span class="no">' + scope.alternate.getString('#number-input .no-input-label') + data.no + '</span>';
		html += '<span class="name_1">' + name_1 + '</span>';
		html += '<span class="name_2">' + name_2 + '</span>';
		html += '<span class="price">' + price + '</span>';
		html += '<span class="comment_1">' + comment_1 + '</span>';
		html += '<span class="text_1">' + text_1 + '</span>';

		//アイコンのセット
		//詳細アイコン
		//console.log( !empty(data.comment_2) && data.comment_2 != "" )
		if( !empty(comment_2) && comment_2 != "" ) html += '<button class="detail">詳細</button>';
		var icon_path = window.designpath + "icon/LL/icon_";
		if( !empty(data.icon_1) ) html += '<i class="icon_1" style="background-image:url(' + icon_path + data.icon_1 + '.png);"></i>';
		if( !empty(data.icon_2) ) html += '<i class="icon_2" style="background-image:url(' + icon_path + data.icon_2 + '.png);"></i>';
		if( !empty(data.icon_3) ) html += '<i class="icon_3" style="background-image:url(' + icon_path + data.icon_3 + '.png);"></i>';

		if( data.nohandle ) {
			html += '<i class="icon_nohandle">取り扱いなし</i>';
		} else if( data.stockout ) {
			html += '<i class="icon_stockout">品切れ</i>';
		}

		html += '</div>';

		return html;

	};


	/**
	 * 残数チェック
	 * 数量ボタンを無効化
	 */
	this.checkNum = function() {

		if( empty( self.product_data ) ) return;

		//残数分にセット
	 	var last = scope.cart.getObjectLast( {item:self.product_data, num:1, set:[], sub:[], setmenu:[]} );
	 	var num = Number( $("#number-input .num-input-bodys .inputs").val() );

	 	$("#number-input .num-input-bodys .buttons button").removeAttr("disabled");
		
		if( num == 0 ) {
			$("#number-input .num-input-bodys .buttons").find(".btn-0,.delete ").attr("disabled",true);
			if( last <10 ) {
				$("#number-input .num-input-bodys .buttons button").each( function(){
					var key = $(this).data("key");
					if( isNaN( key ) || key == 0 ) return true;
					if( key > last ) {
						$(this).attr("disabled",true);
					} 
				});
			}
		} else {
			var num = ( num ) * 10;
			var max = Math.max( last - num, 0 );

			if( num > last ) $("#number-input .num-input-bodys .buttons").find(".btn-0").attr("disabled",true);

			$("#number-input .num-input-bodys .buttons button").each( function(){
				var key = $(this).data("key");
				if( isNaN( key ) ) return true;
				if( key > max ) {
					$(this).attr("disabled",true);
				} 
			});
		}
	}


	/**
	 * 数量のセット
	 * カウンター
	 */
	this.setNumCounter = function( increment ) {

		if( empty( self.product_data ) ) return;

		var last = scope.cart.getObjectLast( {item:self.product_data, num:1, set:[], sub:[], setmenu:[]} );

		var bodys = $("#number-input .num-input-bodys");
		var counter = $("#number-input .num-input-bodys .counter em");
		var no_str = counter.text();
		var no_num = Number( no_str );

		//頼むことができない場合
		if( last <= 0 && no_num <= 1  ) {

			counter.text( String(no_num) );
		 	bodys.find(".increment").attr( "disabled", true );
		 	bodys.find(".decrement").attr( "disabled", true );
		 	bodys.find(".order-btn").attr( "disabled", true );

		} else {
			if( increment ) {
				//注文数アラート
				if( Config.max_value.alert == ( scope.cart.totalnum + (no_num+1) ) && !scope.cart.order_value_alert_bol ) {
					scope.message.confirm("order_value_alert", function() {
						self.setNumCounter( true );
					}, function(){} );
					scope.cart.order_value_alert_bol = true;
					return false;
				}

				no_num++;
				if( last <= no_num ) {
		 			bodys.find(".increment").attr( "disabled", true );
		 		}
		 		counter.text( String(no_num) );

		 		if( no_num > 1 ) {
		 			bodys.find(".decrement").removeAttr("disabled");
		 		}
		 		
			} else {
				no_num--;
				if( no_num <= 1 ) {
					bodys.find(".decrement").attr( "disabled", true );
				}
				counter.text( String(no_num) );
		 		bodys.find(".increment").removeAttr("disabled");
			}
		}
		
		//注文用にセット
		bodys.find(".inputs").val( no_num );

	}


	/**
	 * オーダー
	 */
	this.setOrder = function() {
		var num = Number( $("#number-input .num-input-bodys .inputs").val() );

		if( num > scope.cart.max_value_numtotal ) {
			//カートの数量エラー
			scope.message.show( "max_value_subtotal" );
			return false;
		}

		//注文数アラート
		if( Config.max_value.alert == ( scope.cart.totalnum + num ) && !scope.cart.order_value_alert_bol ) {
			scope.message.confirm("order_value_alert", function() {
				self.setOrder( true );
			}, function(){} );
			scope.cart.order_value_alert_bol = true;
			return false;
		}

		//商品のセット
		scope.selectProduct( self.product_data, null, null, num );

		if( scope.addcart_res ) {

			var val =  { item:self.product_data, num:num, set:[], sub:[] };
			var name = ( scope.alternate_bol && !empty(val.item.alt_name_1) ) ? val.item.alt_name_1 + val.item.alt_name_2 : val.item.name_1 + val.item.name_2;
			var timer1 = $.timer( function() {		
				var msg =  scope.alternate.getString("select-cartadd-message");
				msg = String(msg).replace( /%item%/gi, name );
				var html = '<div id="select-message"><p>';
				html += msg;
				html += '</p></div>';
				$("#menu-page").append(html);
				var timer = $.timer(function() {
					$("#select-message").remove();
					this.stop();
				}, 3000, 1);

				this.stop();
			}, 100, 1);

			self.setView( false );

		} else {

			$("#number-input .num-input-bodys .inputs").val("");
			$("#number-input .num-input-bodys .counter em").text(0);
			
			//注文可能数をセット
	 		self.checkNum();
	 		if(Config.number_input.num_counter) {
		 		self.setNumCounter(true);
		 	}
			return;

		}
	}


	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#number-input").hide();
	};

};;
var OrderLock = function(scope) {
	
	var self = this;
	var scope = scope;

	this.message_code; //メッセージID
	this.lock; //ロックフラグ

	//チェックアウト
	$(document).bind("CHECKOUT", function() { self.hide( self.message_code ); } );

	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {
	};

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function( code, lock ) {

		if( self.lock ) return;

		//var msg = scope.alternate.getString( message );
		var msg = scope.alternate.lang_data.messages[ code ];
		if( empty(msg) ) return;
		$( "#order-lock .order-lock-text" ).html( msg.msg );

		$("#order-lock").show();

		self.message_code = code;
		self.lock = lock || false;

		//トップに戻す
		scope.viewTop();
		//カートのリセット
		scope.cart.reset();
		scope.cart_list.reset();
		scope.updateCart();
	}

	/**
	 * 非表示
	 */
	this.hide = function( code ) {

		if( self.lock && code != self.message_code ) {
			return;
		}

		self.lock = false;
		self.message_code = null;

		$("#order-lock").hide();
		// scope.order_lock_bol = false;
		// scope.order_stop_bol = true;
	}

};;
/**
 * ページ検索
 */
var PageSearch = function(scope) {

	"use strict";

	var self = this;
	var scope = scope;

	this.input_timer; //入力タイマー

	//初期化イベントリスナー
	$(document).bind("BOOT", function() { self.init(); });
	//チェックアウト
	$(document).bind("MODE_CHANGE CHECKOUT", function() { self.init(); });

	//表示ボタンのクリック
	$("#page-search-btn")._click(function(){
		self.show();
	});
	
	//閉じるボタン
	$( "#page-search .close-btn" )._click(function(){
		self.hide();
	});

	//OKボタンのクリック
	$("#page-search .ok-btn")._click(function(){
		var txt = $("#page-search-input").val();
		var cdata = scope.category.getCategoryDataByCode( txt );
		scope.category.setTcategory( cdata.tcode.categorycode );
		self.hide();
	});

	//無効化
	if( !Config.page_search.enable ) {
		$("#page-search-btn").remove();
	}

	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {
		self.setButton();
		self.hide();
	};

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function() {
		//タイトルをアップデート
		scope.alternate.updateLang();
		$("#page-search").show();
	};

	/**
	 * ボタンをセット
	 */
	this.setButton = function() {

		//初期化
		$("#page-search-input").val("");
		$("#page-search .ok-btn").attr("disabled", "disabled");

		//番号入力に変更
		var html = "";
		for( var i=0; i<=9; i++ ) {
			var n = i+1;
			if( n == 10 ) n =0;
			html += '<button data-key="' + n + '">' + n + '</button>';
		}
		html += '<button class="delete" data-key="delete">×</button>';
		$("#page-search .buttons").html(html);
		self.num_input_bol = true;

		//クリック
		$("#page-search .buttons button")._click(function() {
			var key = $(this).data("key");

			if( key == "delete" ) {
				var val = $("#page-search-input").val();
				var txt = String(val).to( val.length-1 );
			} else {
				var txt = $("#page-search-input").val() + key;
			}				
			$("#page-search-input").val( txt );

			//とりあえずカテゴリーコード
			if( txt.length ) {
				var cdata = scope.category.getCategoryDataByCode( txt );
				console.log( cdata )
				if( !empty(cdata) ) {
					$("#page-search .ok-btn").removeAttr("disabled");
				}
			}
			
		});
	};

	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#page-search-input").val("");
		$("#page-search .ok-btn").attr("disabled", "disabled");
		$("#page-search").hide();
	};

};;
/**
	制限時間表示
*/
var PartyTimer = function( scope ) {

	"use strict";
	
	var self = this;
	var scope = scope;

	this.boot_bol = false; //起動フラグ
	this.countdown; //カウントダウン表示時間
	this.timer; //タイマー
	this.date_end; //終了(Date)
	this.mode; //モードデータ
	this.announce_time; //アナウンス時間

	//チェックアウト
	$(document).bind("CHECKOUT", function() { self.hide(); } );

	//topのときだけ表示
	$("#fcategory-top").bind("SHOW", function(){
		if( self.boot_bol ) {
			$("#party-timer").show();
		}
	});
	$("#fcategory-top").bind("HIDE", function(){
		$("#party-timer").hide();
	});

	/**
		起動
	*/
	this.init = function() {
		
		//カウントダウン
		self.countdown = Config.party_timer.countdown;
		var end_hour = scope.menuEnd.substr(0,2);
		var end_min = scope.menuEnd.substr(2,2);
		self.date_end = new Date();
		self.date_end.setHours(end_hour);
		self.date_end.setMinutes(end_min);
		self.mode = scope.sys.mode();


		var n_date = new Date();

		//24時間対応
		if( self.date_end.getTime() < n_date.getTime() ) {
			self.date_end.addDays(1);
		}

		$("#party-timer .countdown").hide();

		if( Config.party_timer.current_time ) {
			//現在時間の表示エリアの作成
			var title = $("#party-timer .now").data("title") || "";
			var html = '<span class="title">' + title + '</span>';
			html += '<span class="hour"></span>';
			html += '<span class="hour-str">時</span>';
			html += '<span class="min"></span>';
			html += '<span class="min-str">分</span>';
			$("#party-timer .now").html(html);
		}  else {
			$("#party-timer .now").hide();
		}

		//終了時間の表示エリアの作成
		var title = $("#party-timer .end").data("title") || "";
		var html = '<span class="title">' + title + '</span>';
		html += '<span class="hour">' + end_hour + '</span>';
		html += '<span class="hour-str">時</span>';
		html += '<span class="min">' + end_min + '</span>';
		html += '<span class="min-str">分</span>';
		$("#party-timer .end").html(html);

		//現在時間かカウントダウンがある場合にはタイマーを起動する
		if( self.countdown > 0 || Config.party_timer.current_time ) {
			self.timer = $.timer(function(){
				self.timerEvent();
			}).set({ time:60000, autostart:true });
			self.timerEvent();
		}
		
		//アナウンス時間
		self.announce_time = null;
		if( !empty(self.mode.announce_time) && self.mode.announce_time != "" ) {
			var add = Number(self.mode.announce_time) * -1;
			self.announce_time = Object(self.date_end).clone().addMinutes(add);
		}

		//表示
		$("#party-timer").show();
		self.boot_bol = true;

		//クラスをつける
		$("#page").addClass("in_party_timer");
	};


	/**
		タイマーイベント
	*/
	this.timerEvent = function() {

		//現在時間の取得
		var date = new Date();

		//カウントダウンの取得
		if( self.countdown > 0 ) {

			var end = Math.round( self.date_end.getTime() / 60000 );
			var last = end - Math.round( date.getTime() / 60000 );
			if( last < self.countdown ) {
				var min = last; //Math.round( last / 60000 );
				if( min < 0 ) min = 0;
				var min_str = String( $emenu.alternate.getString( "partytimer_countdown_min" ) ).replace(/%min%/g, min );
				console.log( min, min_str )
				$("#party-timer .countdown .min").html(min_str);
				$("#party-timer .countdown").show();
			}
		}

		//現在時間のセット
		if( Config.party_timer.current_time ) {
			var now = $("#party-timer .now");
			var h = date.getHours();
			var m = date.getMinutes();
			if( h < 10 ) h = "0" + h;
			if( m < 10 ) m = "0" + m;
			now.find(".hour").text( h );
			now.find(".min").text( m );
		}

		//アナウンスの表示
		//卓指定メッセージで発行さえるので、処理を削除
		// if( !empty(self.announce_time) ) {
		// 	var announce = Math.round( self.announce_time.getTime() / 60000 );
		// 	var now = Math.round( date.getTime() / 60000 );
		// 	if( announce == now ) {
		// 		scope.message.show( self.mode.announce_msg );
		// 	}
		// }
	};

	/**
		非表示
	*/
	this.hide = function() {
		//timerのクリア
		if( !empty(self.timer) ) {
			self.timer.stop();
		}
		//非表示
		$("#party-timer").hide();
		self.boot_bol = false;

		//クラスをはずす
		$("#page").removeClass("in_party_timer");
	};
};;
/**
 * プリロード
 * 初期起動チェックアウト時に事前ロードを開始
 */
var Preload = function( scope ) {

	var self = this;
	var scope = scope;

	this.start_preload = false;
	this.checkin = false;
	this.is_stop = false;
	this.alternate = [];
	this.alternate_id;
	this.mode_index = 0;

	this.modes = [];
	this.images = [];

	this.product_size = ["LL"];


	$(document).bind("CHECKIN", function() { 
		self.stop();
	});


	/**
	 * ロード開始
	 */
	this.load = function() {

		if( !empty(Config.preload) && Config.preload === false ) return;

		if( self.start_preload ) return;
		self.start_preload = true;
		

		//言語データ
		if( Config.alternate.enable ) {
			$.each( Config.alternate.language, function( i, val ) {
				self.alternate.push( val.id );
			});
		} else {
			self.alternate.push( Config.alternate.default );
		}
		

		//sysからモードを取得、メニューデータを取得
		var sys = scope.sys.data;
		var mode = $( sys ).find( "mode" );
		$.each( mode, function( k, m ) {
			self.modes.push( $(m).attr("type") );

			$.each( self.alternate, function( a, lang ) {
				if( lang == Config.alternate.default ) {
					lang =  "";
				} else {
					lang = lang + "_";
				}
				var bg = window.designpath + "UI/top/mode" + $(m).attr("type") + "/" + lang + "background.jpg" + chache();
				self.images.push( bg );
			});
		});


		//first_category
		if( !empty(Config.first_category.mode) ) {
			$.each( Config.first_category.mode,  function(i,mode) {
				var bg = window.designpath + "skin/" + mode.image + chache();
				self.images.push( bg );
			} );
		}

		//menu.jsonをロード開始
		self.menujson();

	}


	/**
	 * メニューjsonのロード
	 */
	this.menujson = function() {

		//チェックインしたら中止
		if( self.is_stop ) return;

		var lang = self.alternate[0];
		self.alternate_id = lang;

		if( lang == Config.alternate.default ) {
			lang =  "";
		} else {
			lang = lang + "_";
		}

		//日本語のみ
		//modeの取得
		var menupath = lang + self.modes[self.mode_index] + ".json" + chache();
		//MTMLの取得
		var loaderObj = new Loader();
		loaderObj.load( window.htmlpath + menupath, null, self.loadedMenujson, 'json' );	
	}

	/**
	 * メニューjsonのロード完了
	 */
	this.loadedMenujson = function( data ) {

		//self.modes.splice(0,1);
		self.mode_index++;
		if(self.modes.length == self.mode_index) {
			self.mode_index = 0;
			self.alternate.splice(0,1);
		}

		if( !data && self.alternate.length ) {

			self.menujson();

		} else if( self.alternate.length ) {

			var lang = self.alternate_id;
			if( lang == Config.alternate.default ) {
				lang =  "";
			} else {
				lang = lang + "_";
			}

			//データからページ背景を取得
			$.each( data.category.fcode, function( i, fcate ) {

				$.each( fcate.scode, function( k, scate ) {

					var btn = designpath + "UI/top/mode" + data.sys.mode.type + "/" + lang + fcate.categorycode + Config.fcategory_top.image_type + chache();
					self.images.push( btn );

					$.each( scate.tcode, function( h, tcate ) {
						var path = window.designpath + "background/page/page_bg_typ" + lang + tcate.basetype + ".jpg" + chache();
						if( self.images.indexOf( path ) == -1 ) {
								self.images.push( path );
						}
						
						$.each( tcate.item, function( j, item ) {
							var product = data.menumst[ item ];
							if( !product ) return true;

							$.each( self.product_size, function( t, size ) {
								var path1 = window.designpath + "product/" + size + "/" + product.code + Config.product.type + chache();
								if( self.images.indexOf( path1 ) == -1 ) {
									self.images.push( path1 );
								}
							} );
							
						});
					} );
				} );
			} );


			self.menujson();


		} else {

			//ロード完了
			//画像ロードの開始
			console.log( self.images );
			self.loadImage();
		}

	}


	/**
	 * 画像のロード開始
	 */
	this.loadImage = function() {

		//チェックインしたら中止
		if( self.is_stop ) return;

		if( empty(self.images.length) ) {
			self.is_stop = true;
			console.log( "loaded menu" );
			return;
		}

		$("<img>").load(function(){

			console.log( "load" );
			self.loadCount();

		}).error(function(){

			console.log( "error" );
			self.loadCount();

		}).attr("src", self.images[0] );

	}


	/**
	 * 画像のロード完了
	 */
	this.loadCount = function() {
		self.images.splice(0,1);
		self.loadImage();
	}



	/**
	 * 停止
	 */
	this.stop = function() {
		self.checkin = true;
		if( !self.is_stop ) {
			self.is_stop = true;
		}
	}

};;
/**
 * ランク別メニュー
 * 
 */
var RankMenu = function( scope ) {

	var self = this;
	var scope = scope;

	this.menu; //メニューデータ
	this.menumst;
	this.page_classes; //クラス名

	//初期化
	$(document).bind("BOOT MODE_CHANGE CHECKOUT", function() {
		self.hide();
	});

	//オーダーロック
	$(document).bind("FOOD_STOP FOOD_START DRINK_STOP DRINK_START ORDER_STOP ORDER_START", function() { self.orderLock( ); } );
	$(document).bind("ORDER_STOP", function() { self.hide( ); } );

	//ストックのチェック
	$(document).bind("STOCK", function() { self.setStock(); } );
	//言語切り替えのチェック
	$(document).bind("ALTERNATE-CHANGE", function() { self.setAlternate(); });


	//閉じるボタン
	$( "#rank-menu .close-btn" )._click(function(){
		self.hide();
	});

	//リストの上下
	$("#rank-menu .prev")._click(function(){
		self.setListPrev();
	});
	$("#rank-menu .next")._click(function(){
		self.setListNext();
	});

	//リストのスクロールイベント
	$("#rank-menu .item-list ul").scroll( function() {
		self.setListBtn();
	});


	/**
	 * 起動
	 */
	this.init = function() {};

	/**
	 * 表示のセット
	 * @param Array item 表示商品
	 * @param Array class ページクラス
	 * @param String title ページタイトル
	 * @return {[type]} [description]
	 */
	this.setView = function( item, classes, title ) {

		self.menumst = scope.menudata.menumst;
		
		var html = self.createItem( item );
		$("#rank-menu .item-list ul").html( html );
		$("#rank-menu").removeClass(self.page_classes).addClass(classes);
		self.page_classes = classes;

		//クリックのセット
		$("#rank-menu .item-list li").each( function() {
			//クリックイベント
			$(this)._click(function( e ){

				var id = $(this).data("id");
				var data  = self.menumst[id];
				var target = e.target;
				//詳細ボタンのクリック
				if( $(target).hasClass("detail") ) {
					scope.detail.show( data );
					return false;
				} else if( $(target).hasClass("increment") && empty(data.select) && empty(data.setmenu) ) {
					scope.cart.onIncrement( { item:data, num:1, set:[], sub:[], setmenu:[] } );
					return false;
				} else if( $(target).hasClass("decrement") && empty(data.select) && empty(data.setmenu) ) {
					scope.cart.onDecrement( { item:data, num:1, set:[], sub:[], setmenu:[] } );
					return false;
				}

				//商品のセット
				scope.selectProduct( data, e );

			}, 2, "mouseup", true); //強制的にクリックにする
		});

		//イベントでセット
		if( Config.counter.enable ) {
			$(document).bind("CART_UPDATE", self.updateCounter );
			//注文済みの場合があるのでカウンターをアップデート
			self.updateCounter();
		}
		
		//タイトルのセット
		$("#rank-menu .title").text( title );

		var timer = $.timer( function() {
			$("#rank-menu .item-list ul").scrollTop(0);
			self.setListBtn();
			this.stop();
		}, 100, 1 );
		$("#rank-menu").show();
	};

	/**
	 * [createItem description]
	 * @param  {[type]} item [description]
	 * @return {[type]}      [description]
	 */
	this.createItem = function( items ) {

		if( !items.length ) return "";

		var html = "";
		$.each( items,  function( i, item ){

			var data = self.menumst[item];

			if( empty( data ) ) {
				html += '<li class="dummy"></li>';
				return true;
			}

			var classes = [];
			if( data.stockout ) classes.push("stockout");
			if( data.nohandle ) classes.push("nohandle");
			if( scope.food_order_stop_bol && data.lock_sts == 1 ) classes.push("stop");
			if( scope.drink_order_stop_bol && data.lock_sts == 2 ) classes.push("stop");
			if( scope.order_stop_bol || scope.use_stop_bol ) classes.push("stop");
			//セレクトを持っているかどうか
			if( !empty(data.select) ) {
				classes.push("has_select");
			}

			var name_1 = data.name_1;
			var name_2 = data.name_2;
			// if( scope.alternate_bol && !empty(data.alt_name_1) ) {
			// 	name_1 = data.alt_name_1;
			// 	name_2 = data.alt_name_2;
			// } 
			var name_3 = data.name_3;
			var text_1 =  data.text_1;
			var comment_1 = data.comment_1;
			var comment_2 = data.comment_2;
			//オプションテキストを金額として利用する
			var price = priceText(data.price);
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				text_1 = "";
				var price = priceText(data.text_1) 
			}

			html += '<li id="product-' + data.id + '" data-id="' + data.id + '" class="product ' + classes.join(" ") + '">';
			html += '<img class="image" src="design_cmn/product/LL/' + data.code + Config.product.type + '" >';
			html += '<span class="name_1">' + name_1 + '</span>';
			html += '<span class="name_2">' + name_2 + '</span>';
			html += '<span class="comment_1">' + comment_1 + '</span>';
			html += '<span class="text_1">' + text_1 + '</span>';
			html += '<span class="price">' + price + '</span>';

			//アイコンのセット
			//詳細アイコン
			//console.log( !empty(data.comment_2) && data.comment_2 != "" )
			if( !empty(comment_2) && comment_2 != "" ) html += '<button class="detail">' + scope.alternate.getString("#menu-page-layout .detail") + '</button>';
			var lang = scope.alternate.language;
			if( lang == Config.alternate.default ) {
				lang =  "";
			} else {
				lang = lang + "_";
			}
			var icons = "";
			var icon_path = window.designpath + "icon/LL/" + lang + "icon_";
			if( !empty(data.icon_1) ) html += '<i class="icon_1" style="background-image:url(' + icon_path + data.icon_1 + '.png);"></i>';
			if( !empty(data.icon_2) ) html += '<i class="icon_2" style="background-image:url(' + icon_path + data.icon_2 + '.png);"></i>';
			if( !empty(data.icon_3) ) html += '<i class="icon_3" style="background-image:url(' + icon_path + data.icon_3 + '.png);"></i>';
			
			if( data.nohandle ) {
				html += '<i class="icon_nohandle">' + scope.alternate.getString(".icon_stockout") + '</i>';
			} else if( data.stockout ) {
				html += '<i class="icon_stockout">' + scope.alternate.getString(".icon_nohandle") + '</i>';
			}

			html += '</li>';
		});

		return html;

	};

	/**
	 * ボタンの表示セット
	 */
	this.setListBtn = function() {

		var list = $("#rank-menu .item-list ul");
		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;

		if( list.scrollTop() >= max || sh <= list.get(0).offsetHeight ) {
			$("#rank-menu .next").hide();
		} else {
			$("#rank-menu .next").show();
		}
		if( list.scrollTop() <= 0 || sh <= list.get(0).offsetHeight ) {
			$("#rank-menu .prev").hide();
		} else {
			$("#rank-menu .prev").show();
		}
	};

	/**
	 *  前へのボタンクリック
	 */
	this.setListPrev = function() {
		var list = $("#rank-menu .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	};

	/**
	 * 次へのボタンクリック
	 */
	this.setListNext = function() {
		var list = $("#rank-menu .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() +  h ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	};

	/**
	 * [updateCounter description]
	 * @return {[type]} [description]
	 */
	this.updateCounter = function() {
		var id = scope.cart.order_id;
		
		$("#rank-menu .counter").remove();
		var data = scope.cart.getCartAryWithoutSelect(); //scope.cart.cartAry;
		if( data.length ) {
			$.each( data, function( i, item ) {
				var html = '<span class="counter">';
				html += '<button class="decrement">-</button>';
				html += '<span class="count"><em>' + item.num + '</em></span>';
				html += '<button class="increment">+</button>';
				html += '</span>';
				$("#rank-menu #product-" + item.item.id).append(html);
			});
			if( Config.counter.animate ) {
				var counter = $("#rank-menu #product-" + id).find(".counter");
				counter.removeClass("up");
				self.counter_timer = $.timer(function(){
					counter.addClass("up");
					this.stop();
				}, Config.counter.delay, 1);
			}
		}
	}

	/**
		品切れのセット
		@items 品切れ商品配列
	*/
	this.setStock = function() {

		var items = ExternalInterface.stock;

		$("#rank-menu .stockout").removeClass("stockout")
		$.each( items, function( i, item ) {
			html = '<i class="icon_stockout">品切れ</i>';
			$("#rank-menu #product-" + item).addClass("stockout").append( html );
		});
	};

	/**
	 * オーダーロック
	 * @param  {[type]} mode [ロック対象 food,drink,all]
	 * @return {[type]}      [description]
	 */
	this.orderLock = function( mode ){

		if( empty( self.menu ) ) return;

		$("#rank-menu .product").find(".icon_stop").remove();
		$("#rank-menu .product.stop").removeClass("stop");

		if( scope.food_order_stop_bol ) {
			$.each( self.menu, function(i, item){
				var data = scope.menudata.menumst[item];
				if( !empty(data) && Number(data.lock_sts) == 1 ) {
					html = '<i class="icon_stop">終了しました</i>';
					$("#rank-menu #product-" + item).addClass("stop").append( html );
				}
			});
		}
		if( scope.drink_order_stop_bol ) {
			$.each( self.menu, function(i, item){
				var data = scope.menudata.menumst[item];
				if( !empty(data) && Number(data.lock_sts) == 2 ) {
					html = '<i class="icon_stop">終了しました</i>';
					$("#rank-menu #product-" + item).addClass("stop").append( html );
				}
			});
		}
		if( scope.order_stop_bol ) {
			$.each( self.menu, function(i, item){
				$("#rank-menu #product-" + item).find(".icon_stop").remove();
				$("#rank-menu #product-" + item).addClass("stop").append( html );
			});
		}
	};


	/**
	 * 代替言語のセット
	 */
	this.setAlternate = function() {

		var bol = scope.alternate_bol;

		//商品の変更
		$("#rank-menu li").each( function() {
			var id = $(this).data("id");
			var data  = self.menumst[id];
			if( empty( data ) ) {
				//dummyの場合
				return true;
			}

			var name_1 = data.name_1;
			var name_2 = data.name_2;
			// if( bol && !empty(data.alt_name_1) ) {
			// 	name_1 = data.alt_name_1;
			// 	name_2 = data.alt_name_2;
			// } 
			var name_3 = data.name_3;
			var text_1 =  data.text_1;
			var comment_1 = data.comment_1;
			var comment_2 = data.comment_2;
			//オプションテキストを金額として利用する
			var price = priceText(data.price);
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				text_1 = "";
				var price = priceText(data.text_1) 
			}
			//var price = ( bol ) ? data.price : data.price;
			$(this).find( ".name_1" ).html( name_1 );
			$(this).find( ".name_2" ).html( name_2 );
			$(this).find( ".name_3" ).html( name_3 );
			$(this).find( ".text_1" ).html( text_1 );
			$(this).find( ".comment_1" ).html( comment_1 );
			$(this).find( ".comment_2" ).html( comment_2 );
			$(this).find( ".price" ).html( priceText(price) );

			if( !empty(comment_2) && comment_2 != "" ) {
				$(this).find(".detail").show();
			} else {
				$(this).find(".detail").hide();
			}
		});

	};

	/**
	 * [hide description]
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#rank-menu").hide();
	};
};;
/**
 * レコメンド
 */
var Recommend = function( scope ) {

	var self = this;
	var scope = scope;

	this.data; //レコメンドデータ
	this.pop_data; //オーダー、カートないにないデータ


	//データの整形
	$(document).bind("LOAD_MENU", function() {
		self.init();
	});

	
	/**
		起動
	*/
	this.init = function() {

		var menudata = scope.menudata;
		if( empty(menudata.setmenu) || empty(menudata.setmenu.pattern) ) return;

		var pattern = menudata.setmenu.pattern;

		if( empty(pattern) ) return;

		$.each( pattern, function( i, val ) {
			if( !empty( val.type ) && val.type == "recommend" ) {
				if( !empty(val.step[0]) && !empty(val.step[0].code) ) {
					self.data = val.step[0].code.clone();
					return false;
				}
			}
		});

		// $(document).unbind("CART_UPDATE", self.updateCart );
		// $(document).bind("CART_UPDATE", self.updateCart );
	};



	/**
	 * カートの変更とともにHTMLの変更
	 */
	this.updateCart = function() {

		if( empty(self.data) ) return;

		//カート内
		var is_data = new Array();
		var cart = scope.cart.cartAry;
		$.each( self.data, function( i, id ) {
			var hit = false;
			$.each( cart, function( j, val ) {
				if( val.item.id == id ) {
					hit = true;
					return false;
				}
			});
			if( !hit ) is_data.push( id );
		});

		//オーダーリスト
		var is_data_2 = new Array();
		if( !empty(scope.check_order.order_data) ) {
			var order = scope.check_order.order_data.item;
			$.each( is_data, function( k, id ) {
				var hit = false;
				$.each( order, function( h, val ) {
					if( val.item.id == id ) {
						hit = true;
						return false;
					}
				});
				if( !hit ) is_data_2.push( id );
			});
		}

		self.pop_data = is_data_2;
	}



	/**
	 * [createItem description]
	 * @param  {[type]} item [description]
	 * @param  {[type]} key  [description]
	 * @return {[type]}      [description]
	 */
	this.createItem = function( items ) {

		if( empty(items) ) return "";

		var html = '<div class="recommend-list"><ul>';
		$.each( items,  function( i, item ){

			var data = scope.menudata.menumst[item];

			if( empty( data ) ) {
				html += '<li class="dummy"></li>';
				return true;
			}

			if( data.nohandle ) {
				return true;
			} else if( data.stockout ) {
				return true;
			}

			var classes = [];
			if( data.nohandle ) {
				classes.push("nohandle");
			}
			//セレクトを持っているかどうか
			if( !empty(data.select) ) {
				classes.push("has_select");
			}

			var name_1 = data.name_1;
			var name_2 = data.name_2;
			if( scope.alternate_bol && !empty(data.alt_name_1) ) {
				name_1 = data.alt_name_1;
				name_2 = data.alt_name_2;
			} 
			var name_3 = ( scope.alternate_bol && !empty(data.alt_name_3)  ) ? data.alt_name_3 : data.name_3;
			var text_1 =  ( scope.alternate_bol ) ? data.alt_text_1 : data.text_1;
			var comment_1 =  ( scope.alternate_bol ) ? data.alt_comment_1 : data.comment_1;
			var comment_2 =  ( scope.alternate_bol ) ? data.alt_comment_2 : data.comment_2;
			//オプションテキストを金額として利用する
			var price = priceText(data.price);
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				text_1 = "";
				var price = priceText(data.text_1) 
			}

			html += '<li id="product-' + data.id + '" data-id="' + data.id + '" class="product ' + classes.join(" ") + '">';

			//画像をカスタマイズ
			var size = ( !empty(Config.recommend) && Config.recommend.image_size == 'recommend' ) ? 'recommend' : 'LL';
			html += '<img class="image" src="design_cmn/product/' + size + '/' + data.code + Config.product.type + '" >';
			html += '<span class="name_1">' + name_1 + '</span>';
			html += '<span class="name_2">' + name_2 + '</span>';
			html += '<span class="price">' + price + '</span>';
			html += '<span class="comment_1">' + comment_1 + '</span>';
			html += '<span class="text_1">' + text_1 + '</span>';


			html += '</li>';
		});

		html += '</ul></div>';
		return html;

	};


	/**
	 * 商品リストの作成
	 *  呼び出しはこれ
	 * @param  {[type]} target 格納する先
	 * @return {[type]}        [description]
	 */
	this.createList = function( target )　{

		self.updateCart();

		var html = self.createItem( self.pop_data );
		target.html( html );

		//クリックのセット
		target.find(".recommend-list li").each( function() {
			//クリックイベント
			$(this)._click(function( e ){

				var id = $(this).data("id");
				var data  = scope.menudata.menumst[id];
				
				//セレクトを持っている
				if(!empty(data.select)) {
					scope.select.show( data, true );
					return;
				}

				//カートに格納
				scope.selectProduct( data, e );
				scope.log.send("0","レコメンド商品選択," + target.parents("div").attr("id") + "," + data.name_1 + data.name_2 + "," + data.code + "," + data.id );

				$(document).trigger("SELECT_RECOMMEND");

			}, 2, "mouseup", true); //強制的にクリックにする
		});
	}


	/**
	 * カウンターのセット
	 * @return {[type]} [description]
	 */
	this.updateCounter = function() {

		var id = scope.cart.order_id;
		$(".recommend-list li .counter").remove();
		var data = scope.cart.getCartAryWithoutSelect(); //scope.cart.cartAry;
		if( data.length ) {
			$.each( data, function( i, item ) {
				var html = '<span class="counter">';
				html += '<button class="decrement">-</button>';
				html += '<span class="count"><em>' + item.num + '</em></span>';
				html += '<button class="increment">+</button>';
				html += '</span>';
				$(".recommend-list #product-" + item.item.id).append(html);
			});
		}
	}




	/**　ここからデータ取得 */
	/**
	 * 指定IDのレコメンドを取得
	 */
	this.getRecommend = function(id) {

		var menudata = scope.menudata;
		if( empty(menudata.setmenu) || empty(menudata.setmenu.pattern) ) return null;

		var pattern = menudata.setmenu.pattern;

		if( empty(pattern) ) return null;

		var data = null;
		$.each( pattern, function( i, val ) {
			if( !empty( val.type ) && val.type == "recommend" ) {
				$.each( val.item, function( k, is_id ) {
					if( id == is_id ) {
						data = val;
						return false;
					}
				});
			}
		});
		return data;

	}
};;
/**
 * 消しこみ要求
 * @param {[type]} scope [description]
 */
var RequestCheckout = function( scope ) {

	var self = this;
	var scope = scope;

	var dbl_bol;
	var dbl_timer;
	//クリックイベント
	//ダブルクリックで起動
	$("#requeat-checkout-btn")._click(function(){
		if( self.dbl_bol ) {
			self.show();
		}
		self.dbl_bol = true;
		self.dbl_timer = $.timer(function(){
			self.dbl_bol = false;
			this.stop();
		}, 300, 1);
	});

	//消しこみ
	$("#request-checkout .delete-btn")._click(function(){
		self.setDelete();
	});
	//チェックアウト
	$("#request-checkout .checkout-btn")._click(function(){
		self.setCheckout();
	});

	if( !Config.request_checkout.delete  ) {
		$("#request-checkout .delete-btn").hide();
	}
	if( !Config.request_checkout.checkout ) {
		$("#request-checkout .checkout-btn").hide();
	}

	//クローズ
	$("#request-checkout .close-btn")._click(function(){
		self.hide();
	});

	//無効の場合にはボタンを削除
	if( !Config.request_checkout.enable ) {
		$("#requeat-checkout-btn").remove();
	}

	this.init = function() {
	}

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function() {
		if( !Config.request_checkout.enable ) {
			return;
		}
		$("#request-checkout").show();
	}

	/**
	 * 消しこみ要求
	 */
	this.setDelete = function() {
		scope.setRequestDelete();
		scope.viewTop();
		self.hide();
	}

	/**
	 * チェックアウト要求
	 */
	this.setCheckout = function() {
		scope.setRequestCheckout();
		self.hide();
	}

	/**
	 * 閉じる
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#request-checkout").hide();
	}

};;
/**
 * 中カテゴリートップ
 * @param {[type]} scope [description]
 */
var ScategoryTop = function( scope ) {

	var self = this;
	var scope = scope;

	this.load_count; //画像ロード数
	this.loaded_count; //画像ロード完了数

	this.category_ary; //カテゴリーデータ
	this.fcategory_ary; //中カテが2個以上の大カテ

	this.init = function() {

		$("#scategory-top .scategory-top-box").remove();
		
		if( !Config.scategory.top_enable ) return;

		//画面の生成
		//中カテが2個以上の大カテを抽出
		self.category_ary = scope.category.category_ary;
		self.fcategory_ary = new Array();
		
		var f_leng = self.category_ary.fcode.length;
		for( var i=0; i<f_leng; i++ ) {
			var fcate = self.category_ary.fcode[i];
			var s_leng = fcate.scode.length;
			if( s_leng > 1 ) {
				self.fcategory_ary.push( fcate );
			}
		}

		if( self.fcategory_ary.length ) {

			//ボタンを生成
			self.load_count = 0;
			self.loaded_count = 0;

			var html = "";
			$.each( self.fcategory_ary, function( k, val ){
				html += self.createButton( val );
			});
			$("#scategory-top").html( html );

			//クリックイベントのセット
			$("#scategory-top button")._click(function(){
				scope.category.setScategory( $(this).data("code"), "top" );
				self.hide();

				//中カテトップからの遷移のみ、Scategoryにモーションを付加
				//オープンムービー
				// $("#scategory").addClass("open");
				// var timer = $.timer(function(){
				// 	$("#scategory").removeClass("open");
				// 	this.stop();
				// }, 1000, 1 );
				
			});
		}
	}

	/**
	 * ボタンの作成
	 * @param  {[type]} data 大カテゴリーデータ
	 * @return {[type]}      [description]
	 */
	this.createButton = function( data ) {
		
		//console.log( data );
		var mode = scope.menu_mode;

		var lang = scope.alternate.language;
		if( lang == Config.alternate.default ) {
			lang =  "";
		} else {
			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
				lang = "alt_";
			} else {
				lang = lang + "_";
			}
			
		}

		var background_imaege = "url(" + designpath + "UI/top/mode" + mode + "/" + lang + "m" + data.categorycode + ".jpg)";
		var html = '<div id="scategory-top-' + data.categorycode + '" class="scategory-top-box" style="background-image:' + background_imaege + '">';
		//ロード完了の取得
		$("<img>").attr("src", designpath + "UI/top/mode" + mode + "/" + lang + "m" + data.categorycode + ".jpg").load(function(){
			self.loadCount();	
		});
		self.load_count++;
		
		if(!empty( Config.alternate.use_alt ) && Config.alternate.use_alt) {
			var fname = ( scope.alternate_bol && !empty( data.alt_text_1 ) ) ? data.alt_text_1 : data.text_1;
			var fclass = "";
			if(  scope.alternate_bol && !empty( data.alt_text_2 ) ) {
				fname += "<br />" +  data.alt_text_2;
				fclass = "l2";
			} else if( !scope.alternate_bol && !empty( data.text_2 ) ) {
				fname += "<br />" +  data.text_2;
				fclass = "l2";
			}
		} else {
			var fname = data.text_1;
			var fclass = "";
			if( !empty( data.text_2 ) ) {
				fname += "<br />" +  data.text_2;
				fclass = "l2";
			}
		}

		html += '<h1 class="page-title ' + fclass + '">' + fname + '</h1>';
		html += '<div class="buttons">';
		$.each( data.scode, function( i, scate ) {
			var type = (!empty( Config.scategory.image_type )) ? Config.scategory.image_type : '.jpg';
			var background_imaege = "background-image:url(" + designpath + "UI/top/mode" + mode + "/" + lang + "m" + scate.categorycode + type + ")";
			html += '<button class="st-' + i + ' stc-' + scate.categorycode + '" data-code="' + scate.categorycode + '">';
			html += '<span class="bg" style="' + background_imaege + '"></span>';


			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
				var text_1 = ( scope.alternate_bol && !empty(scate.alt_text_1) ) ? scate.alt_text_1 : scate.text_1;
				var text_2 = ( scope.alternate_bol && !empty(scate.alt_text_1) ) ? scate.alt_text_2 : scate.text_2;
			} else {
				var text_1 = scate.text_1;
				var text_2 = scate.text_2;
			}

			html += '<span class="text_1">' + text_1 + '</span>';
			html += '<span class="text_2">' + text_2 + '</span>';
			html += '<span class="description">' + scate.description + '</span>';
			html += '</button>';

			//ロード完了の取得
			$("<img>").attr("src", designpath + "UI/top/mode" + mode + "/" + lang + "m" + scate.categorycode + ".jpg").load(function(){
				self.loadCount();	
			});
			self.load_count++;
		});
		html += '</div></div>';

		return html;

	}

	/**
	 * トップの画像のロード完了
	 */
	this.loadCount = function() {
		self.loaded_count++;
		if( self.load_count == self.loaded_count ) {
			//表示より先に生成しているのでここではｎロード画面を出さない
			//console.log("hoge")
		}
	}

	/**
	 * 代替言語のセット
	 * @param {[type]} bol [description]
	 */
	this.setAlternate = function( bol ) {
		//生成しなおす
		self.init();	
	}

	/**
	 * 表示
	 * @param  {[type]} code [description]
	 * @return {[type]}      [description]
	 */
	this.show = function( code ) {
		$("#scategory-top .scategory-top-box").hide();
		$("#scategory-top-" + code ).show();
		$("#scategory-top").show();

		//カテゴリー変更イベントの通知
		$(document).trigger("SCATEGORY_TOP");
	}

	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#scategory-top").hide();

		//カテゴリー変更イベントの通知
		$(document).trigger("SCATEGORY_TOP_HIDE");
	}

};;
/**
 * スクリーンセーバー
 */
var Screensaver = function( scope ) {

	var self = this;
	var scope = scope;
	this.data;

	this.checkin_time; //チェックイン時間
	this.boot_time; //起動時間
	this.enable = false; //有効無効
	this.movie; //ムービー配列
	this.index = 0; //ムービー順
	this.timer_stop_bol; //タイマーの停止フラグ
	this.waiting_bol; //ムービー再生待ちフラグ
	this.retry = 0; //リトライカウント
	this.count; //再生カウント
	this.video_loadtimer; //動画ロードタイマー


	//初期化イベントリスナー
	$(document).bind("BOOT", function(){
		self.init();
	});
	//チェックアウト
	$(document).bind("MODE_CHANGE CHECKOUT", function(){
		self.init();
	});
	
	//起動タイマー
	this.timer = $.timer(function(){ 
		self.setTimeUp();
	}, 1000, false); 
	
	//表示タイマー
	this.view_timer = $.timer(function(){ 
		//console.log( "view_timer" )
		self.removeMovie();
	}, 1000, false);
	this.view_time = 5000; //表示時間

	//切り替えタイマー
	this.close_timer = $.timer(function(){ 
		//console.log( "close_timer" )
		self.index++;
		self.setMovie();
	}, 1000, false);

	//再生中のクリックイベント
	$("#screensaver")._click(function(){
		self.onClick();
	});


	/**
	 * 起動
	 */
	this.init = function() {
		self.timer.reset().stop();
		self.view_timer.reset().stop();
		self.close_timer.reset().stop();
		$("#screensaver").html("").hide();
		self.timer_stop_bol = true;
		self.count = 0;
	};

	/**
	 * チェックイン
	 */
	this.setCheckin = function( data ) {
		//初期化
		self.init();

		if( scope.sinage_bol ) {
			self.enable = false;
			self.timer.stop();
			return;
		}

		//情報をマージ
		//マージしない
		//screensaver_localにムービーがある場合にはそちらを使用する
		//self.data = $.extend( {}, data, scope.screensaver_local );
		// if( !empty( data.movie ) ) {
		// 	self.data.movie = data.movie.concat( scope.screensaver_local.movie );
		// }
		self.data = data;
		if(scope.screensaver_local.movie.length) {
			self.data = scope.screensaver_local;
		}
		//console.log( self.data, scope.screensaver_local );

		self.enable = true;
		if( !self.data.enable || empty( self.data ) || empty( self.data.movie ) )  {
			self.enable = false;
			self.timer.stop();
			return;
		}

		//現在時間を格納
		var checkin = new Date();
		self.checkin_time = checkin;

		//起動時間
		self.boot_time = self.data.timer * 1000;
		self.timer.set({ time:self.boot_time, autostart:false });
		self.timer.reset();
		self.timer.play();
		self.timer_stop_bol = false;
		
		//表示時間
		self.view_time = self.data.movielength * 1000;
		self.view_timer.set({ time:self.view_time, autostart:false });

		self.index = 0;
		self.waiting_bol = true;

		self.retry = 0;

		scope.log.send("0","SCREENSAVER,タイマーを起動します。");
	};

	/**
	 * timeup
	 */
	this.setTimeUp = function() {

		console.log( "Screensaver.setTimeUp" );
		if( self.timer_stop_bol  ) return;

		//ムービー配列をdisplay_afterから作成
		self.movie = new Array();
		var urls = [];
		$.each( self.data.movie, function( i, val ) {
			if( !empty( val.display_after ) ) {
				//チェックイン時間が経過しているかどうかをチェック
				var check = Date.create(self.checkin_time).addMinutes( val.display_after );
				var now = Date.create();
				console.log( check, self.checkin_time );
				if( !now.isAfter(check) ) return true;
			}
			self.movie.push( val );
			//ログ用に格納
			urls.push( val.url );
		});

		if( empty(self.movie) ) {
			scope.log.send("0","SCREENSAVER,チェックイン時間の対象がないので再生しません。" );
			self.reset();
			return;
		}

		//表示中はとめる
		self.stop();

		self.index = 0;
		self.setMovie();

		self.waiting_bol = false;
		//self.retry = 0;
		//self.count = 0;

		scope.log.send("0","SCREENSAVER,再生を開始します。,再生:" + urls.join() );
	};

	/**
	 * ムービーのセット
	 */
	this.setMovie = function() {

		self.close_timer.stop();
		$("#screensaver").find("img, video").remove();

	 	if( self.index >= self.movie.length ) {
	 		self.index = 0;

	 		//ムービーが1枚の場合には終了する
	 		if( self.movie.length == 1 ) {
	 			//クリックしたのは表示中なので開始
				self.start();
				
			 	self.hide();
			 	self.reset();
	 		} else {
	 			//display_afterのチェックがあるためsetTimeUpを実行する
		 		// self.timer_stop_bol = false;
		 		// self.setTimeUp();
		 		
		 		//終了にする
		 		self.start();
				
			 	self.hide();
			 	self.reset();
	 		}	 		
	 		return;
	 	}
	 	
		var data = self.movie[self.index];
		if( empty(data) ) self.index = 0;

		//テキストのセット
		var thtml = "";
		if( !empty( data.title ) || !empty( data.caption ) ) {

			thtml += '<div class="text ' + data.align + ' ' + data.valign + '">';

			if( !empty( data.title ) ) {
				var title = ( scope.alternate_bol && !empty(data.alt_title) ) ? data.alt_title : data.title;
				title = title.replace(/&#10;|\n/g, '<br>');
				thtml += '<h1>' + title + '</h1>';
			}
			if( !empty( data.caption ) ) {
				var caption = ( scope.alternate_bol && !empty(data.alt_caption) ) ? data.alt_caption : data.caption;
				caption = caption.replace(/&#10;|\n/g, '<br>');
				thtml += '<p>' + caption + '</p>';
			}
			thtml += '</div>';
		}

		if( data.url.substr( -4, 4 ) == ".jpg" ) {
			//イメージの読み込み
			var img = new Image();
			//console.log( self.data.movie )
			img.src = window.designpath + "screensaver/" + data.url;// + chache();

			//.jpg
			img.onload = function() {

				$("#screensaver .sbody").remove();

				//イメージの読み込み完了
				var html = '<div class="sbody">';
				if( !empty(thtml) ) html +=  thtml;
				html += '</div>'
				//$("#screensaver").html( img ).show();
				$("#screensaver").html( html );
				$("#screensaver").find(".sbody").prepend( '<img src="' + img.src + '">' ).addClass("in");
				$("#screensaver").show();
				self.view_timer.play();
				self.count++;

				scope.log.send("0","SCREENSAVER,再生:" + data.url + ",再生トータル回数:" + self.count );
			}

			//console.log( data )
			img.onerror = function() {
				if( self.waiting_bol ) return;
				self.index++;
				self.retry++;

				//2回以上エラーになったらスクリーンセーバーを停止
				if( self.retry >=2 ){
					self.hide();
					self.enable = false;
					scope.log.send("0","SCREENSAVER,ファイルが見つからないためスクリーンセーバーを終了します。" ) ;
					return;
				}
				scope.log.send("0","SCREENSAVER,ファイルがロードできません。:" + $(this).attr("src") );
				self.setMovie();
			}

		} else if( data.url.substr( -4, 4 ) == ".mp4" ) {

			//再生完了が表示時間
			self.view_timer.stop();


			if( $(window).isTablet() == 'windowstabret' && !Config.islocal ) {
				tcs.openWindow( data.url );
				scope.log.send("0","SCREENSAVER,動画Windows,動画再生:" + data.url );
				return;
			}


			var path = window.designpath + "screensaver/" + data.url;

			//.mp4
			var html = '<video id="video" width="100%" height="100%" muted="muted" preload="true" poster="design_cmn/skin/poster.png">';
			html += '<source src="' + path + '">';
			html += '<object>';
			html += '<embed src="' + path + '" type= "application/x-shockwave-flash" allowfullscreen="false" allowscriptaccess="always" />';
			html += '</object>';
			html += '</video>';
			$("#screensaver").html( html );

			var video = $("#video").get(0);

			//ロードタイマーの開始
			if( !empty(self.video_loadtimer) ) self.video_loadtimer.stop();

			//10秒間で再生が開始されなければ、次へ
			self.video_loadtimer = $.timer( function() {
				this.stop();

				//if( self.retry >=2 ){
				//	self.hide();
				//	scope.log.send("0","SCREENSAVER,動画エラーのためスクリーンセーバーを終了します。" ) ;
				//	return;
				//}
				self.retry++;
				self.index++;
				scope.log.send("0","SCREENSAVER,動画がロードできません。" );
				self.setMovie();
			}, 15000, 1 );

			//動画の再生開始
			//video.playing = function(){
			video.oncanplaythrough = function(){
				if( !empty(self.video_loadtimer) ) self.video_loadtimer.stop();
				scope.log.send("0","SCREENSAVER,動画再生:" + data.url );
				$("#screensaver").show();
				video.play();

				console.log( video.duration )

				self.video_loadtimer = $.timer( function() {
					this.stop();

					//if( self.retry >=2 ){
					//	self.hide();
					//	scope.log.send("0","SCREENSAVER,動画エラーのためスクリーンセーバーを終了します。" ) ;
					//	return;
					//}
					self.retry++;
					self.index++;
					scope.log.send("0","SCREENSAVER,停止したので次を再生" );
					self.setMovie();
				}, video.duration * 1000 + 30000, 1 );
			}

			//動画の再生終了
			video.addEventListener( 'ended' , self.videoEnded, false );

			//動画ロード途中での停止
			video.onstalled = function() {
				//if( self.retry >=2 ){
				//	self.hide();
				//	scope.log.send("0","SCREENSAVER,動画エラーのためスクリーンセーバーを終了します。" ) ;
				//}
				//self.retry++;
				scope.log.send("0","SCREENSAVER,動画,動画ロード途中での停止" ) ;
				// self.index++;
				// self.setMovie();
			}
			video.onerror = function() {
				//if( self.retry >=2 ){
				//	self.hide();
				//	scope.log.send("0","SCREENSAVER,動画エラーのためスクリーンセーバーを終了します。" ) ;
				//}
				//self.retry++;
				scope.log.send("0","SCREENSAVER,動画エラー,動画ロード途中でエラー停止" ) ;
				self.index++;
				self.setMovie();
			}
		
		} else {

			// other
		}

		$(document).trigger('SCREENSAVER_SETMOVIE');

	 };

	 /**
	  *	video 再生完了イベント
	  */
	 this.videoEnded = function() {
	 	if( !empty(self.video_loadtimer) ) self.video_loadtimer.stop();
		self.index++;
		self.setMovie();
	 }

	 /**
	  * Windows　動画戻り
	  */
	 this.closedWindow = function() {
		scope.log.send("0","SCREENSAVER,動画Windows,動画戻り" + "," + ExternalInterface.ss_result );
	 	if( ExternalInterface.ss_result == 'click' ) {
	 		self.onClick();
	 	} else {
	 		self.index++;
			self.setMovie();
	 	}
	 }



	 /**
	  * ムービーの切り替え
	  */
	 this.removeMovie = function() {

	 	//console.log("removeMovie");

	 	self.view_timer.stop();
	 	$("#screensaver").find(".sbody").addClass("out");
	 	//切り替えタイマー
	 	self.close_timer.play();

	 };


	 /**
	  * クリックイベント 
	  */
	 this.onClick = function() {
	 	var data = self.movie[self.index];
	 	switch( data.linktype ) {
	 		case "goTop":
	 		default :
	 			scope.viewTop();
	 			scope.log.send("0","SCREENSAVER,クリックされました。,TOP" );
	 			break;
	 		case "opt":
	 			break;
	 		case "menu":
	 			scope.category.setTcategory( data.code );
	 			scope.log.send("0","SCREENSAVER,クリックされました。,MENU:" + data.code );
	 			break;
	 		case "publicity":
	 			break;
	 		case "item":
	 			var hit = false;
	 			$.each(scope.menudata.menumst, function(index, el) {
					if( el.code == data.code ) {
						scope.selectProduct( el );
						hit = true;
						scope.log.send("0","SCREENSAVER,クリックされました。,item:" + data.code );

						if( empty( data.select )  && Config.order_confirm.enable ) {
							scope.cart_list.setOrder();
						}
					}
				});
				if( !hit ) scope.log.send("0","SCREENSAVER,クリックされましたが商品が見つかりません。,ITEM:" + data.code );
	 			break;
	 	}
	 	//クリックしたのは表示中なので開始
		self.start();
		
	 	self.hide();
	 	self.reset();
	 };


	/**
	 * タイマーストップ
	 */
	this.stop = function() {
		//console.log( "screensaver stop", self.enable )
		self.timer.stop();
		self.view_timer.stop();
		self.close_timer.stop();
		self.timer_stop_bol = true;
		self.waiting_bol = true;

		if(self.enable) scope.log.send("0","SCREENSAVER,タイマーを停止します。");
	};

	/**
	 * タイマースタート
	 */
	this.start = function() {
		//console.log( "screensaver start", self.enable )
		self.timer_stop_bol = false;

		if(self.enable) scope.log.send("0","SCREENSAVER,タイマーを有効にします。");
	};

	/**
	 * タイマーリセット
	 */
	this.reset = function() {
		self.timer.reset().stop();
		//タイマーを開始
		if( self.enable && !self.timer_stop_bol ) {
			self.timer.play(true);
		}
	};

	/**
	 * クローズ
	 */
	this.hide =function() {

		self.view_timer.stop();
		self.close_timer.stop();
		$("#screensaver").html("").hide();
		self.waiting_bol = true;
		self.count = 0;

	};

};;
/**
 * 商品検索
 */
var Search = function(scope) {

	"use strict";

	var self = this;
	var scope = scope;
	

	this.menumst; //メニューデータ

	this.num_input_bol = true; //番号入力フラグ
	this.txt_ary = [ //テキストの配列
		["あ","い","う","え","お"],
		["か","き","く","け","こ"],
		["さ","し","す","せ","そ"],
		["た","ち","つ","て","と"],
		["な","に","ぬ","ね","の"],
		["は","ひ","ふ","へ","ほ"],
		["ま","み","む","め","も"],
		["や","ゆ","よ"],
		["ら","り","る","れ","ろ"],
		["わ","を","ん"],
	];
	this.alt_txt_ary = String.range('A', 'Z').every(); //テキスト配列（代替）
	this.input_timer; //入力タイマー

	this.list_item; //リストアイテム
	this.list_view = 0; //現在のページ
	this.list_num = 5; //生成商品数
	this.list_total = 0; //トータルページ

	this.number_input_count = 4; //番号入力桁数

	//初期化イベントリスナー
	$(document).bind("LOAD_MENU", function() { self.init(); });
	//チェックアウト
	$(document).bind("MODE_CHANGE CHECKOUT", function() { self.init(); });

	//オーダーロック
	$(document).bind("FOOD_STOP DRINK_STOP ORDER_STOP", function() { self.hide(); } );

	//カート追加｣イベント｣リスナー
	$(document).bind("CART_UPDATE", function() {
		//カートが空であればオーダーボタンをdisabled
		if( empty(scope.cart.cartAry) ) {
			$("#search .order-btn").attr("disabled", true);
		} else {
			$("#search .order-btn").removeAttr("disabled");
		}
	});

	//ストックのチェック
	$(document).bind("STOCK", function() { self.setStock(); } );


	//表示ボタンのクリック
	$("#search-btn")._click(function(){
		self.show();
	});
	
	//閉じるボタン
	$( "#search .close-btn" )._click(function(){
		self.hide();
	});

	//検索ボタン
	$( "#search .search-btn" )._click(function(){
		self.setList();

		//ひらがな入力をリセット
		$("#search .buttons button").data("col", 0);
	});

	//ボタンの上下
	$("#search .input .prev")._click(function(){
		self.setButtonPrev();
	});
	$("#search .input .next")._click(function(){
		self.setButtonNext();
	});
	//ボタンのスクロールイベント
	$("#search .buttons")._scroll( function() {
		self.setButtonBtn();
	});

	//リストの上下
	$("#search .item-list .prev")._click(function(){
		self.setListPrev();
	});
	$("#search .item-list .next")._click(function(){
		self.setListNext();
	});
	//リストのスクロールイベント
	$("#search .item-list ul")._scroll( function() {
		self.setListBtn();
	});


	//リセットボタン
	$("#search .reset-btn")._click(function(){
		// $("#search-input").val( '' );
		// self.setList();
		// $(this).attr("disabled", true);
		self.resetList();
	});

	//オーダーボタン
	$("#search .order-btn")._click(function(){
		scope.cart_list.setOrder();
		self.hide();
	},　2);


	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {
		self.hide();

		//無効化
		if( !Config.search.enable ) {
			$("#search, #search-btn, #top-search-btn").remove();
		}
		//ボタンを無効化
		if( !Config.search.btn_enable ) {
			$("#search-btn").remove();
		}

		//検索ボタン
		if( Config.search.search_btn ) $( "#search" ).addClass("use-search-btn");
	};

	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function() {

		self.menumst = scope.menudata.menumst;

		//番号入力優先
		var bol = Config.search.number; 
		self.setButton( bol );
		
		self.setListBtn();

		//カートが空であればオーダーボタンをdisabled
		if( empty(scope.cart.cartAry) ) {
			$("#search .order-btn").attr("disabled", true);
		} else {
			$("#search .order-btn").removeAttr("disabled");
		}

		//初期はリセットボタンをdisabled
		$("#search .reset-btn").attr("disabled", true);

		$("#search").show();

		//イベントでセット
		if( Config.counter.enable ) {
			$(document).bind("CART_UPDATE", self.updateCounter );
		}
	};

	/**
	 * ボタンをセット
	 */
	this.setButton = function( bol ) {

		//初期化
		$("#search-input").val("");
		$("#search .input").removeClass("number hiragana hiragana50 english");
		$("#search .after-btn").remove();
		self.setList();

		if( !bol && !scope.alternate_bol ) {
			//文字入力に変更
			var html = "";
			if( Config.search.hiragana_50 ) {
				//50音
				html += '<div class="btn-list">';
				for( var i=0; i<=9; i++ ) {
					var leng = self.txt_ary[i].length;
					for( var k=0; k<leng; k++ ) {
						var n = self.txt_ary[i][k];
						html += '<button data-key="' + n + '"  data-row="' + i + '" data-col="0">' + n + '</button>';						
					}
					html += "<br />";
				}
				html += '</div>';
				$("#search .input").addClass("hiragana50");

				//切り替え・削除ボタン
				html += '<div class="after-btn">';
				if( Config.search.number ) {
					html += '<button class="change number" data-key="number">123</button>';
				}
				html += '<button class="delete" data-key="delete">×</button>';
				html += '</div>';

			} else {
				for( var i=0; i<=9; i++ ) {
					//切り替えボタン
					if( i == 9 && Config.search.number ) {
						html += '<button class="change number" data-key="number">123</button>';
					}
					var n = self.txt_ary[i][0];
					html += '<button class="switch-btn" data-key="' + n + '"  data-row="' + i + '" data-col="0">' + n + '</button>';
				}
				html += '<button class="delete" data-key="delete">×</button>';
			}

			$("#search .buttons").html(html);
			self.num_input_bol = false;

			//クリック
			$("#search .buttons button")._click(function() {

				var key = $(this).data("key");
				if( key == "number" ) {
					self.setButton( true );
					return;
				}

				if( key == "delete" ) {
					// $("#search-input").val( "" );
					// self.setList();
					self.resetList();
					return;
				}

				if( $(this).hasClass("switch-btn") ) {

					var col = $(this).data("col");
					var row = $(this).data("row");
					key = self.txt_ary[row][col];

					var leng = self.txt_ary[row].length-1;
					var next = ( col < leng ) ? col+1 : 0;
					$(this).data("col", next);

					$("#search-input").val( key );
					
					//一定時間入力待ち
					var btn = $(this);
					if( !empty(self.input_timer) ) {
						self.input_timer.stop();
					}
					self.input_timer = $.timer(function(){
						btn.data("col", 0);
						this.stop();
						//検索ボタンを使わない場合にはリストをセット
						if( !Config.search.search_btn) self.setList();
					}, 3000, 1 );

				} else {

					$("#search-input").val( key );
					if( !Config.search.search_btn) self.setList();

				}
				

			});

			//Classを付与
			$("#search .input").addClass("hiragana");

		} else if( !bol ) {

			//代替言語
			//文字入力に変更
			var html = "";
			var leng = self.alt_txt_ary.length-1;
			for( var i=0; i<=leng; i++ ) {
				//切り替えボタン
				if( i == 24 && Config.search.number ) {
					html += '<button class="change number" data-key="number">123</button>';
				}
				var n = self.alt_txt_ary[i];
				html += '<button data-key="' + n + '"  data-row="' + i + '">' + n + '</button>';
			}
			html += '<button class="delete" data-key="delete">×</button>';
			$("#search .buttons").html(html);
			self.num_input_bol = false;


			$("#search .buttons button")._click(function() {
				
				var key = $(this).data("key");
				
				if( key == "number" ) {
					self.setButton( true );
					return;
				}

				if( key == "delete" ) {
					//$("#search-input").val( "" );
					self.resetList();
				} else {
					$("#search-input").val( key );
				}

				//検索ボタンを使わない場合にはリストをセット
				if( !Config.search.search_btn) self.setList();
			});

			//Classを付与
			$("#search .input").addClass("english");

		} else {

			//番号入力に変更
			var html = "";
			for( var i=0; i<=9; i++ ) {

				if( i == 9 && Config.search.hiragana ) {
					html += '<button class="change hiragana" data-key="hiragana">あ</button>';
				}

				var n = i+1;
				if( n == 10 ) n =0;
				html += '<button data-key="' + n + '">' + n + '</button>';
			}
			html += '<button class="delete" data-key="delete">×</button>';
			$("#search .buttons").html(html);
			self.num_input_bol = true;

			//クリック
			$("#search .buttons button")._click(function() {

				var key = $(this).data("key");

				if( $(this).data("key") == "hiragana" ) {
					self.setButton( false );
					return;
				}

				if( key == "delete" ) {
					//var val = $("#search-input").val();
					//var txt = String(val).to( val.length-1 );
					//一括削除に変更
					self.resetList();

				} else {

					//4文字に固定
					if( $("#search-input").val().length  >= self.number_input_count ) {
						//リセットする
						$("#search-input").val(key);
						return;
					}
					var txt = $("#search-input").val() + key;
					$("#search-input").val( txt );
				}				
				//$("#search-input").val( txt );

				//検索ボタンを使わない場合にはリストをセット
				if( !Config.search.search_btn ) self.setList();
			});

			//Classを付与
			$("#search .input").addClass("number");
		}

		$.timer( function(){
			self.setButtonBtn();
			this.stop();
		}, 10, 1 );
		

		//タイトルをアップデート
		scope.alternate.updateLang();
	};


	/**
	 * リストのリセット
	 */
	this.resetList = function() {
		$("#search-input").val( '' );
		self.setList();
		$("#search .reset-btn").attr("disabled", true);
		$("#search .order-btn").attr("disabled", true);

		//ひらがな入力をリセット
		$("#search .buttons button").data("col", 0);
	}


	/**
	 * ボタンスクロールボタンの表示セット
	 */
	this.setButtonBtn = function() {

		var list = $("#search .buttons .btn-list");
		if( !list.length ) {
			$("#search .input").find(".next, .prev").hide();
			return;
		}

		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;
		
		if( list.scrollTop() >= max || sh <= list.get(0).offsetHeight ) {
			$("#search  .input .next").hide();
		} else {
			$("#search  .input .next").show();
		}
		if( list.scrollTop() <= 0 || sh <= list.get(0).offsetHeight ) {
			$("#search  .input .prev").hide();
		} else {
			$("#search  .input .prev").show();
		}
	};

	/**
	 * 前へのボタンクリック
	 */
	this.setButtonPrev = function() {
		var list = $("#search .buttons .btn-list");
		var h = list.find("button").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h * 3 ) / h );
		list.scrollTop( sh*h );
		self.setButtonBtn();
	};

	/**
	 * [setListNext 次へのボタンクリック]
	 */
	this.setButtonNext = function() {
		var list = $("#search .buttons .btn-list");
		var h = list.find("button").first().outerHeight();		
		var sh = Math.round( ( list.scrollTop() +  h * 3 ) / h );
		list.scrollTop( sh*h );
		self.setButtonBtn();
	};


	/**
	 * リストの作成
	 */
	this.setList = function() {

		//ページに配置してある商品のみから検索
		var data = scope.category.page_item_ary;

		//指定Noを検索（文字列で先頭から一致）
		var val = $("#search-input").val();
		var leng = val.length;
		
		if( val == "" ) {
			$("#search .item-list ul").html( "" );
			self.setListBtn();
			return;
		}

		var items = [];
		$.each( data, function( key, id ) {
			var item = self.menumst[id];
			if( empty(item) ) return true;

			if( self.num_input_bol ) {
				//番号で検索
				if( !empty(Config.search.number_match) && Config.search.number_match ) {
					if( String(item.no) == val ) {
						if( items.indexOf(id) == -1 ) items.push( id );
					}
				} else {
					if( String(item.no).first( leng ) == val ) {
						if( items.indexOf(id) == -1 ) items.push( id );
					}
				}
				
			} else if( scope.alternate_bol ) {
				//頭文字で検索（代替）
				//name_alt_sがalt_name_sにしたいが一旦これで行く
				if( !empty(item.name_alt_s) && item.name_alt_s.toLowerCase() == val.toLowerCase() ) {
					if( items.indexOf(id) == -1 ) items.push( id );
				}
			} else {
				//頭文字で検索
				if( item.name_s == val ) {
					if( items.indexOf(id) == -1 ) items.push( id );
				}
			}
		});
		self.list_item = items;
		self.list_total = items.length;
		self.list_view = 1;
		
		if( self.list_total <= 0 ) {
			$("#search .item-list ul").html( '<li class="readmore no-item">商品が見つかりません。</li>' );
		} else {
			var html = self.createItem( 1 );
			$("#search .item-list ul").html( html );
		}

		if( self.list_total > self.list_num ) {
			$("#search .item-list ul").append('<li class="readmore"><button class="readmore-btn">続きを見る</button></li>');
			$("#search .item-list .readmore-btn")._click(function(){
				//続きを見るの処理
				self.list_view++;

				//リストを追加
				var html = self.createItem( self.list_view );
				$("#search .item-list .readmore").last().before( html );
				//デフォルト画像のセット
				$("#search .item-list ul .image").error(function(){
					$(this).attr("src", Config.product.default_image);
					$(this).unbind("error");
				});
		
				self.setListClick();
				//続きを見るの非表示
				console.log( Math.ceil( self.list_total / self.list_num ), self.list_view )
				var pages = Math.ceil( self.list_total / self.list_num );
				if( pages <= self.list_view ) {
					$(this).hide();
				}

				var timer = $.timer( function() {
					self.setListBtn();
					this.stop();
				}, 100, 1 );

				return false;
			});
		}

		//クリックイベントのセット
		self.setListClick();

		//デフォルト画像のセット
		$("#search .item-list ul .image").error(function(){
			$(this).attr("src", Config.product.default_image);
		});
		
		var timer = $.timer( function() {
			$("#search .item-list ul").scrollTop(0);
			self.setListBtn();
			this.stop();
		}, 100, 1 );
		

		//注文済みの場合があるのでカウンターをアップデート
		if( Config.counter.enable ) {
			self.updateCounter();
		}

		//言語を更新
		scope.alternate.updateLang();
	};


	/**
	 * リストのクリックイベント
	 */
	this.setListClick = function() {
		$("#search .item-list ul li").each(function() {

			var sound = 2;
			if($(this).hasClass("readmore")) {
				sound = -1;
			} 

			//クリックイベント
			$(this)._click(function( e ){

				var id = $(this).data("id");
				var data  = self.menumst[id];
				var target = e.target;
				//詳細ボタンのクリック
				if( $(target).hasClass("detail") ) {
					scope.detail.show( data );
					return false;
				} else if( $(target).hasClass("increment") && empty(data.select) && empty(data.setmenu) ) {
					scope.cart.onIncrement( { item:data, num:1, set:[], sub:[], setmenu:[] } );
					return false;
				} else if( $(target).hasClass("decrement") && empty(data.select) && empty(data.setmenu) ) {
					scope.cart.onDecrement( { item:data, num:1, set:[], sub:[], setmenu:[] } );
					return false;
				} else if( $(target).hasClass("readmore") || $(target).hasClass("readmore-btn") ) {
					return false;
				}

				//商品のセット
				scope.selectProduct( data, e );

				scope.log.send("0","検索商品選択," + data.name_1 + data.name_2 + "," + data.code + "," + data.id );

				//商品が選択されたとみなし、リセットボタンを有効化
				$("#search .reset-btn").removeAttr("disabled");

			}, sound, "mouseup", true); //強制的にクリックにする
		});
	}

	/**
	 * アイテムデータの整形
	 * @param  {[type]} item [description]
	 * @return {[type]}      [description]
	 */
	this.createItem = function( page ) {

		var html = "";
		var from = self.list_num * (page-1);
		var to = self.list_num * page;

		for( var i=from; i<to; i++ ) {
			
			if( i>= self.list_total ) break;

			var item = self.list_item[i];
			var data = self.menumst[item];

			if( empty( data ) ) {
				html += '<li class="dummy"></li>';
				continue;
			}

			var classes = [];
			if( data.stockout ) classes.push("stockout");
			if( data.nohandle ) classes.push("nohandle");
			if( scope.food_order_stop_bol && data.lock_sts == 1 ) classes.push("stop");
			if( scope.drink_order_stop_bol && data.lock_sts == 2 ) classes.push("stop");
			if( scope.order_stop_bol || scope.use_stop_bol ) classes.push("stop");

			//セレクトを持っているかどうか
			if( !empty(data.select) ) {
				classes.push("has_select");
			}

			html += '<li id="product-' + data.id + '" data-id="' + data.id + '" class="product ' + classes.join(" ") + '">';
			html += '<img class="image" src="design_cmn/product/LL/' + data.code + Config.product.type + '" >';

			
			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
				var name_1 = data.name_1;
				var name_2 = data.name_2;
				if( scope.alternate_bol && !empty(data.alt_name_1) ) {
					name_1 = data.alt_name_1;
					name_2 = data.alt_name_2;
				} 
				var name_3 = ( scope.alternate_bol && !empty(data.alt_name_3)  ) ? data.alt_name_3 : data.name_3;
				var text_1 =  ( scope.alternate_bol ) ? data.alt_text_1 : data.text_1;
				var comment_1 =  ( scope.alternate_bol ) ? data.alt_comment_1 : data.comment_1;
				var comment_2 =  ( scope.alternate_bol ) ? data.alt_comment_2 : data.comment_2;
			} else {
				var name_1 = data.name_1;
				var name_2 = data.name_2;
				var name_3 = data.name_3;
				var text_1 =  data.text_1;
				var comment_1 =  data.comment_1;
				var comment_2 = data.comment_2;
			}

			//オプションテキストを金額として利用する
			var price = priceText(data.price);
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				text_1 = "";
				var price = priceText(data.text_1) 
			}

			html += '<span class="name_1">' + name_1 + '</span>';
			html += '<span class="name_2">' + name_2 + '</span>';
			html += '<span class="price">' + price + '</span>';
			html += '<span class="comment_1">' + comment_1 + '</span>';
			html += '<span class="text_1">' + text_1 + '</span>';

			//アイコンのセット
			//詳細アイコン
			//console.log( !empty(data.comment_2) && data.comment_2 != "" )
			if( !empty(comment_2) && comment_2 != "" ) html += '<button class="detail">詳細</button>';
			var lang = scope.alternate.language;
			if( lang == Config.alternate.default ) {
				lang =  "";
			} else {
				lang = lang + "_";
			}
			var icons = "";
			var icon_path = window.designpath + "icon/LL/" + lang + "icon_";
			if( !empty(data.icon_1) ) html += '<i class="icon_1" style="background-image:url(' + icon_path + data.icon_1 + '.png);"></i>';
			if( !empty(data.icon_2) ) html += '<i class="icon_2" style="background-image:url(' + icon_path + data.icon_2 + '.png);"></i>';
			if( !empty(data.icon_3) ) html += '<i class="icon_3" style="background-image:url(' + icon_path + data.icon_3 + '.png);"></i>';

			if( data.nohandle ) {
				html += '<i class="icon_nohandle">取り扱いなし</i>';
			} else if( data.stockout ) {
				html += '<i class="icon_stockout">品切れ</i>';
			}

			html += '</li>';
		};

		return html;

	};

	/**
	 * リストスクロールボタンの表示セット
	 */
	this.setListBtn = function() {

		var list = $("#search .item-list ul");
		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;
		
		if( list.scrollTop() >= max || sh <= list.get(0).offsetHeight ) {
			$("#search .item-list .next").hide();
		} else {
			$("#search .item-list .next").show();
		}
		if( list.scrollTop() <= 0 || sh <= list.get(0).offsetHeight ) {
			$("#search .item-list .prev").hide();
		} else {
			$("#search .item-list .prev").show();
		}
	};

	/**
	 * 前へのボタンクリック
	 */
	this.setListPrev = function() {
		var list = $("#search .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h * 3 ) / h );
		list.scrollTop( sh*h );
		//list.addClass("scroll").scrollTop( sh*h ).removeClass("scroll");
		self.setListBtn();
	};

	/**
	 * [setListNext 次へのボタンクリック]
	 */
	this.setListNext = function() {
		var list = $("#search .item-list ul");
		var h = list.find("li").first().outerHeight();		
		var sh = Math.round( ( list.scrollTop() +  h * 3 ) / h );
		list.scrollTop( sh*h );
		//list.addClass("scroll").scrollTop( sh*h ).removeClass("scroll");
		self.setListBtn();
	};

	/**
	 * リストの品切れのセット
	 */
	this.setStock = function() {

		var items = ExternalInterface.stock;

		$("#search .stockout").removeClass("stockout").find(".icon_stockout").remove();
		$.each( items, function( i, item ) {
			html = '<i class="icon_stockout">品切れ</i>';
			$("#search .item-list #product-" + item).addClass("stockout").append( html );
		});
	};

	/**
	 * [updateCounter description]
	 * @return {[type]} [description]
	 */
	this.updateCounter = function() {
		var id = scope.cart.order_id;
		
		$("#search .counter").remove();
		var data = scope.cart.getCartAryWithoutSelect(); //scope.cart.cartAry;
		if( data.length ) {
			$.each( data, function( i, item ) {
				var html = '<span class="counter">';
				html += '<button class="decrement">-</button>';
				html += '<span class="count"><em>' + item.num + '</em></span>';
				html += '<button class="increment">+</button>';
				html += '</span>';
				$("#search #product-" + item.item.id).append(html);
			});
			if( Config.counter.animate ) {
				var counter = $("#search #product-" + id).find(".counter");
				counter.removeClass("up");
				self.counter_timer = $.timer(function(){
					counter.addClass("up");
					this.stop();
				}, Config.counter.delay, 1);
			}
		}
	}

	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#search").hide();
		$(document).unbind("CART_UPDATE", self.updateCounter );
	};

};;
/**
 * セレクト
 * @param {[type]} scope [description]
 */
var Select = function( scope ) {

	var self = this;
	var scope = scope;

	this.data; //商品データ
	this.select_data; //セレクトデータ
	this.select_data_org; //初期セレクトデータ
	this.select_data_ary; //セレクトデータ配列（depth）
	this.temp_class; //テンプレート名
	this.code_class; //セレクトコード名

	this.temp_product; //データの一時格納
	this.last_select_id; //最後に選択したもの（カウンター用）
	this.last_click_btn; //最後に選択したボタン
	this.useadd_btn; //決定ボタンを使うかどうか
	this.use_list; //リストを使うかどうか
	this.close; //最後に閉じるかどうか

	this.select_body_width; //セレクトのボタンのデフォルト幅
	this.cart_data; //カート内の該当商品のデータ

	this.depth; //セレクトの深度
	this.last_select; //最後のセレクト

	this.change_index; //変更したリスト
	this.select_step_btn_data; //変更したボタンのデータ

	//templateの設定値
	this.template = Config.select.template;

	this.setmenu; //セットメニューフラグ
	this.edit; //変更フラグ

	//起動イベントリスナー
	//初期化イベントリスナー
	$(document).bind("BOOT", function(){
		self.init();
	});;
	//チェックアウト
	$(document).bind("MODE_CHANGE CHECKOUT", function() { self.init(); });

	//人数チェックエラー
	$(document).bind("CHECK_PARSON_ERROR", function() {
		//セレクトメッセージを強制的に消す
		// $("#select-message").remove();
		// self.init();
	} );

	//フードロックのイベントリスナー
	$(document).bind("FOOD_STOP", function() { self.hide(); });
	//ドリンクロックのイベントリスナー
	$(document).bind("DRINK_STOP", function() { self.hide(); });
	//オーダーロックのイベントリスナー
	$(document).bind("ORDER_STOP", function() { self.hide(); });

	//ストックのリスナー
	$(document).bind("STOCK", function() { self.setStockOut(); });

	//クローズボタン
	$("#select .close-btn")._click( function(){
		self.hide();
	});


	/**
		起動
	*/
	this.init = function() {
		self.hide();
	};

	/**
	 * 表示
	 * @param  {[type]} data [商品データ]
	 * @param  {[type]} setmenu [セットメニューからの呼び出し]
	 * @param  {[type]} setmenu [カートからの変更（カートindex）]
	 * @return {[type]}      [description]
	 */
	this.show = function( data, setmenu, edit ) {

		self.data = data;
		self.setmenu = setmenu;
		self.edit = edit;

		self.temp_product = new Array( { item:self.data, num:0, sub:[], set:[], setmenu:[] } );

		//商品情報エリア
		var item_html = "";
		item_html += '<img class="image" src="design_cmn/product/LL/' + data.code + Config.product.type + chache() + '" >';

		if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
			var name_1 = data.name_1;
			var name_2 = data.name_2;
			var name_3 = data.name_3;
			if( scope.alternate_bol && !empty(data.alt_name_1) ) {
				name_1 = data.alt_name_1;
				name_2 = data.alt_name_2;
				name_3 = data.alt_name_3;
			} 
			var text_1 = (scope.alternate_bol && (data.alt_text_1)) ? data.alt_text_1 : data.text_1;
			var comment_1 = (scope.alternate_bol && (data.alt_comment_1)) ? data.alt_comment_1 : data.comment_1;
			var comment_2 = (scope.alternate_bol && (data.alt_comment_2)) ? data.alt_comment_2 : data.comment_2;

		} else {
			var name_1 = data.name_1;
			var name_2 = data.name_2;
			var name_3 = data.name_3;
			var text_1 = data.text_1;
			var comment_1 = data.comment_1;
			var comment_2 = data.comment_2;
		}

		//オプションテキストを金額として利用する
		var price = priceText(data.price);
		if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
			text_1 = "";
			var price = priceText(data.text_1);
		}

		//番号入力の場合には出力する
		if( !empty( Config.number_input ) && Config.number_input.enable ) {
			item_html += '<p class="no">' + scope.alternate.getString('#number-input .no-input-label') + data.no + '</p>';
		}

		var name = name_1 + "<br>" + name_2;
		if( !empty( name_3 )  && Config.product.use_name3 !== false ) {
			name += "　";
			name += String( name_3 ).replace(/<br \/>/,'');
		}

		item_html += '<p class="name_1">' + name + '</p>';
		//item_html += '<p class="name_2">' + name_2 + '</p>';
		item_html += '<p class="price">' + price + '</p>';
		item_html += '<p class="text_1">' + text_1 + '</p>';
		item_html += '<p class="comment_1">' + comment_1 + '</p>';
		item_html += '<p class="comment_2">' + comment_2 + '</p>';

		//アイコンのセット
		var lang = scope.alternate.language;
		if( lang == Config.alternate.default ) {
			lang =  "";
		} else {
			lang = lang + "_";
		}
		var icons = "";
		var icon_path = window.designpath + "icon/LL/" + lang + "icon_";
		if( !empty(data.icon_1) ) icons += '<i class="icon_1" style="background-image:url(' + icon_path + data.icon_1 + '.png);"></i>';
		if( !empty(data.icon_2) ) icons += '<i class="icon_2" style="background-image:url(' + icon_path + data.icon_2 + '.png);"></i>';
		if( !empty(data.icon_3) ) icons += '<i class="icon_3" style="background-image:url(' + icon_path + data.icon_3 + '.png);"></i>';
		if( icons != "" ) {
			item_html += '<p class="icons">' + icons + '</p>';
		}
		$("#select .item").html( item_html );

		self.code_class = data.select;		
		self.select_data = scope.menudata.select[self.code_class]; //格納
		self.select_data_org = scope.menudata.select[self.code_class];
		self.select_data_ary = [ self.select_data ];
		//テンプレートデータ
		var template = self.template[self.select_data.type] || [];
		if( empty(self.select_data) ) {
			//エラー
			return;
		}


		/////セットメニューをステップに追加
		var reco_data = scope.recommend.getRecommend( data.id );
		if( !empty( reco_data ) ) {

			self.select_data = Object.clone( self.select_data, true );
			
			//無理やりサブメニュー画面を開くため、ダミーのみのステップを削除
			if( self.select_data.option.length == 1 && self.select_data.option[0].member.length == 1 && self.select_data.option[0].member[0].id == "9999" ) {
				self.select_data.option.splice(0,1);
			}

			//レコメンドメンバをステップに追加
			$.each( reco_data.step, function( g, re ) {

				var reco_member = [];
				$.each( re.code, function( t, me ) {
					var me_data = scope.menudata.menumst[me];
					var data = {
						id:me_data.id,
						name_1:me_data.name_1,
						name_2:me_data.name_2,
						alt_name_1:me_data.alt_name_1,
						alt_name_2:me_data.alt_name_2
					}
					reco_member.push( data );
				});

				var reco_step_data = {
					btn_type: ( re.selecttype == "toggle" ) ? "00_004" : "00_005",
					show_price: "1",
					first_select: false,
					text: re.text,
					alt_text: "Please choose from the items below.",
					show_pic: "1",
					setmenu: true,
					member: reco_member
				}

				self.select_data.option.push( reco_step_data );
			} );

			self.select_data_org = Object.clone( self.select_data, true );
		}


		//深度をセット
		self.depth = 0;

		//ボタンの生成
		self.temp_class = self.select_data.type;
		var html = self.createButtons( self.select_data.option, self.select_data.type, 0 );
		html += '<div class="add"><button class="add-cart" disabled="disabled">決定</button></div>';
		html += '<div class="reset"><button class="reset-btn">リセット</button></div>';
		$("#select .btns").html( html );
		
		//デフォルト画像のセット
		$("#select .image").error(function(){
			$(this).attr("src", Config.product.default_image);
		});


		//リストが有効でステップごとにhideの場合は選択商品を表示
		$("#select .selected-items").remove();
		$("#select .btns").before( '<div class="selected-items"></div>' );

		//ウィザード表示
		$("#select .wizard").remove();
		var wizard = '<ul class="wizard">';
		$.each( self.select_data.option, function(i,ss) {
			wizard += '<li><em>' + (i+1) + '</em><span>' + ss.text + '</span></li>';
		});
		wizard += '</ul>';
		$("#select .btns").before( wizard );
		//幅をそろえる
		$("#select .wizard li").width( 100 / self.select_data.option.length + "%" );
		//ウィザードの初期選択
		$("#select .wizard li").eq( 0 ).addClass("selected");

		//表示
		$("#select").show();

		//Classをセット
		$("#select").addClass("select-temp-" + self.temp_class + " select-code-" + self.code_class );

		
		//クリックイベント
		$("#select .stepbox").each( function(){
			var events = null; //($(this).hasClass("toggle")) ? "click" : null;
			$(this).find("ul button")._click(function( e ) {
				//console.log( "hogehoge" )
				var target = null;
				if( $(this).hasClass("decrement") ) target = "decrement";
				if( $(this).hasClass("increment") ) target = "increment";
				self.setSelect( $(this), target );
				self.last_select_id = $(this).data("id");

				self.last_click_btn = $(this);
				$(document).trigger( "SELECT_BUTTON_CLICK" );
			}, 1, "mouseup", true );
		} );
		
		//次のステップのクリック
		$("#select .stepbox .step-next-btn")._click(function() {
			var step = $(this).data("step");
			var next = ".step" + (step+1);
			$("#select .stepbox-bodys " + next).show();
			//セレクトボタンを有効化
			$("#select .stepbox-bodys " + next).find(".select-btn").removeAttr("disabled");

			var temp = self.template[self.select_data.type];
			if( temp.step_hide ) {
				$(this).parents(".stepbox").hide();
			}

			//skipできる場合は次へを表示
			if( !empty(temp.step[step+1]) && temp.step[step+1].skip ) {
				$("#select .stepbox-bodys " + next).find(".step-next-btn").removeAttr("disabled");
				//cart_addの場合には決定ボタンを表示
				if( temp.step[step+1].cart_add ) {
					$("#select .add-cart").removeAttr("disabled");
				}
			}

			//スクロール
			var box = $(this).parents(".stepbox").next(".stepbox");
			box.find("ul").scrollTop(0);
			self.setBtnsBtn( box );

			//初期選択のセット
			$(this).parents(".stepbox").next(".stepbox").find(".first_select").first().find("button").first()._click();


			//wizardの選択
			$("#select .wizard li.selected").removeClass("selected");
			$("#select .wizard li").eq( step+1 ).addClass("selected");
		});
		//次へボタンの無効化
		//ボタンを非表示にしない場合は次へボタンを非表示
		if( template.step_hide ) {
			$("#select .btns .stepbox").hide().first().show();
		} else {
			$("#select .stepbox .step-next-btn").hide();
			//2ステップ以降のボタンをdisabled
			$("#select .step0").nextAll(".stepbox").find("button:not(.btn_next,.btn_prev)").attr("disabled", true);
		}

		//最初のステップがstep=trueの場合には次へボタンを表示する
		if( template.step[0].skip ) {
			$("#select .step0 .step-next-btn").removeAttr("disabled");
			//次のステップを有効化
			if( !empty(template.step[1]) ) {
				var nextbtn = $("#select .step1").find("li button");
				nextbtn.removeAttr("disabled");
			}
		}

		//カウンターつき1ステップセレクト以外の場合には親数量を1にする
		if( self.select_data.option.length != 1 || !( self.select_data.option.length == 1 && template.step[0].toggle ) ) {
			self.temp_product[0].num = 1;
		}

		//もどるのクリック
		$("#select .stepbox .step-prev-btn")._click(function() {
			var step = $(this).data("step");
			var prev = ".step" + (step-1);
			$("#select .stepbox-bodys " + prev).show();
			var temp = self.template[self.select_data.type];
			if( temp.step_hide ) {
				$(this).parents(".stepbox").hide();
			}

			var set = self.temp_product[0].set.clone();
			var set_leng = set.length;
			for(var i=0; i<set_leng; i++) {
				var val = set[i];
				if( val.depth == self.depth && val.step == step ) {
					self.temp_product[0].set.splice(i,1);
					set_leng--;
					i--;
				}
			}

			var sub = self.temp_product[0].sub.clone();
			var sub_leng = sub.length;
			for(var i=0; i<sub_leng; i++) {
				var val = sub[i];
				if( val.depth == self.depth && val.step == step ) {
					self.temp_product[0].sub.splice(i,1);
					sub_leng--;
					i--;
				}
			}

			//選択を解除
			$(this).parents(".stepbox").find(".selected").removeClass("selected");
			//カウンターの非表示
			$(this).parents(".stepbox").find("li .counter").hide();
			//次へのdisabled
			if(!temp.step[step].skip) {
				var thisbtn = $(this).parents(".stepbox").find(".step-next-btn");
				thisbtn.attr("disabled", true);
			}

			//決定ボタンの無効化
			$("#select .add-cart").attr( "disabled", "disabled" );

			//選択表示の削除
			$('#select .selected-items .depth-' + self.depth + '.gindex-' + step ).remove();


			//wizardの選択
			$("#select .wizard li.selected").removeClass("selected");
			$("#select .wizard li").eq( step-1 ).addClass("selected");
		});


		//リストのセット
		self.use_list = template.use_list;
		if( template.use_list ) {
			var html = '<div class="item-list">';
			html += '<header><span class="name">商品名</span><span class="num">数</span><span class="cart_counter">変更</span></header>';
			html += '<ul></ul>';
			html += '<button class="next">下へ</button><button class="prev">上へ</button>';
			html += '</div>';
			$("#select .stepbox-bodys").append( html );
			$("#select .stepbox-bodys").find(".next, .prev").hide();
			$("#select").removeClass("no-list");
		} else {
			$("#select").addClass("no-list");
		}
		//スクロール
		$("#select .item-list ul")._scroll( function(){ 
			self.setListBtn();
		});
		$("#select .item-list ul").unbind("touchend touchcancel");
		$("#select .item-list ul").bind("touchend touchcancel", function(e){
			$.timer(function() {
				this.stop();
				e.preventDefault();
			}, 10, 1 );
		});

		//イベントでリストをセット
		$(document).unbind("CART_UPDATE", self.updateList);
		$(document).bind("CART_UPDATE", self.updateList);
		self.updateList( null, true );

		//決定ボタンの無効化
		self.useadd_btn = template.useadd_btn;
		if( self.useadd_btn ) {
			$("#select .add-cart").attr( "disabled", "disabled" );
			$("#select .reset-btn").attr( "disabled", "disabled" );
			$("#select").find(".add,.reset").show();
		} else {
			$("#select").find(".add,.reset").hide();
		}
		$("#select .add-cart")._click(function(){
			self.setProduct();
			if( self.close ) {
				self.hide();
			}
		}, 2);

		//全てのステップがskip可能の場合の処理
		template.all_skip = false;
		if( !template.step_hide ) {
			var skip = true;
			$.each( template.step, function( i, val ) {
				if( !val.skip ) {
					skip = false;
					return false;
				}
			});
			if( skip ) {
				template.all_skip = true;
				$("#select .add-cart").removeAttr( "disabled" );
				//2ステップ以降のボタンを有効化
				$("#select .step0").nextAll(".stepbox").find("button:not(.btn_next,.btn_prev)").removeAttr("disabled");
				//※初期選択の処理が必要
			}
		}

		//リセットのボタン
		$("#select .reset-btn")._click(function(){
			self.reset();
		});

		//クローズのセット
		self.close = template.close;

		//先頭のステップの処理
		$("#select .stepbox").first().find(".first_select").first().find("button").first()._click();

		//ボタンのセット（高さがセットされないので、ここで実行）
		//ボタンの上下
		$("#select .btns .btn_prev")._click(function(e) {
			self.setBtnsPrev(e);
		});
		$("#select .btns .btn_next")._click(function(e) {
			self.setBtnsNext(e);
		});
		
		//スクロール
		$("#select .stepbox ul")._scroll( function(e){
			self.setBtnsBtn( $(e.target).parents(".stepbox") );
		});
		$("#select .stepbox ul").unbind("touchend touchcancel");
		$("#select .stepbox ul").bind("touchend touchcancel", function(e){
			$.timer(function() {
				this.stop();
				e.preventDefault();
			}, 10, 1 );
		});
		self.setBtnsBtn();

		//ステップ1が数量ボタンの場合の処理
		var firststep = $("#select .stepbox").first();
		var fbutton = firststep.find("button").first();
		if( fbutton.data("type") == "num" ) {
			var num = Number(fbutton.data("num"));
			if( !fbutton.hasClass("v2") ) { //V2の1つボタンでの制御ではない場合
				var last = scope.cart.getObjectLast( {item:self.data, num:1, set:[], sub:[]} );
				//console.log( last )
				firststep.find("button").each( function(){
					if( Number($(this).data("num")) > last ) {
						$(this).attr("disabled",true);
					} 
				});
			}
		}

		//編集の場合の処理
		//すでに選択したものがある場合にはセット
		if( !empty(self.edit) ) {
			var cartdata = scope.cart.cartAry[self.edit];
			if( !empty(cartdata.set) ) {
				$.each(cartdata.set, function( esi, eset ) {
					$("#select .stepbox").first().find("#select-btn-"+eset.item.id).find("button").first()._click();
				});
			}
		}

		//言語のアップデート
		scope.alternate.updateLang();

		//イベントの発行
		$( document ).trigger("SELECT_SHOW");
	};



	/**
	 * ボタンの作成
	 * @return {[type]} [description]
	 */
	this.createButtons = function( options, type, depth ) {

		var template = self.template[type];
		var html = '<div class="stepbox-bodys temp-' + type + ' code-' + self.code_class + ' depth-' + self.depth + '" data-depth="' + depth + '">';
		var tmp_skip; //1つ前のスキップ設定 disableの設定

		//ステップ属性を定義
		template.step = new Array();

		$.each( options, function( i, option ) {

			var temp = new Object();
			var member = option.member;

			//stepのデータを整形
			//決定ボタンの表示
			temp["cart_add"] = ( options.length-1 == i ) ? true : false;
			//金額の表示
			temp["show_price"] = option.show_price || 0;
			//最初の商品の選択
			temp["first_select"] = option.first_select || false;
			//ボタンタイプによって設定を変更
			temp["btn_type"] =  String(option.btn_type);
			//写真の表示
			temp["show_pic"] = ( !empty(option.show_pic) && option.show_pic == "1" ) ? true : false;

			//数量指定がある場合にを変更
			var nn = String(temp["btn_type"]).split("_");
			if( nn.length > 2 ) {
				temp["btn_type"] = nn[0] + "_" + nn[1];
			}

			switch( temp["btn_type"] ) {
				case "00_001"://toggleボタン
					temp["toggle"] = true;
					temp["num_btn"] = false;
					temp["check"]= "1";
					temp["skip"] = false;
					temp["btn"] = -1;
					temp["v2"] = true;
					break;
				case "00_002"://複数選択ボタン
					temp["toggle"]= false;
					temp["num_btn"]= false;
					temp["check"]= "1";
					temp["skip"] = false;
					temp["btn"] = -1;
					break;
				case "00_003"://数量変更ボタン(1個)
					temp["toggle"]= false;
					temp["num_btn"]= true;
					temp["check"]= "0";
					temp["skip"] = (member[0].id == "9999" && member.length == 1) ? false : true;
					temp["btn"] = -1;
					break;

				case "00_004"://toggleボタン（選択しなくてもよい）
					temp["toggle"] = true;
					temp["num_btn"] = false;
					temp["check"]= (!empty(option.setmenu) && option.setmenu) ? "X10" : "1";
					temp["skip"] = true;
					temp["btn"] = -1;
					break;
				case "00_005"://複数選択ボタン（選択しなくてもよい）
					temp["toggle"]= false;
					temp["num_btn"]= false;
					temp["check"]= (!empty(option.setmenu) && option.setmenu) ? "X10" : "1";
					temp["skip"] = true;
					temp["btn"] = -1;
					break;

				case "0X_001"://N選択ボタン
					temp["toggle"]= false;
					temp["num_btn"]= false;
					temp["check"]= "X0";
					temp["skip"] = false;
					temp["btn"] = -1;
					temp["fix_num"] = Number(nn[2]);
					break;

				case "0X_002"://N選択ボタン（複数選択可）
					temp["toggle"]= false;
					temp["num_btn"]= true;
					temp["check"]= "X1";
					temp["skip"] = false;
					temp["btn"] = -1;
					temp["fix_num"] = Number(nn[2]);
					break;

				case "0X_003"://N選択ボタン（fix以下であればOK）
					temp["toggle"]= false;
					temp["num_btn"]= false;
					temp["check"]= "X2";
					temp["skip"] = false;
					temp["btn"] = -1;
					temp["fix_num"] = Number(nn[2]);
					break;
				case "0X_004"://N選択ボタン（複数選択可/fix以下であればOK）
					temp["toggle"]= false;
					temp["num_btn"]= true;
					temp["check"]= "X3";
					temp["skip"] = false;
					temp["btn"] = -1;
					temp["fix_num"] = Number(nn[2]);
					break;

				case "0X_005"://N選択ボタン（fix以下であればOK）
					temp["toggle"]= false;
					temp["num_btn"]= false;
					temp["check"]= "X2";
					temp["skip"] = true;
					temp["btn"] = -1;
					temp["fix_num"] = Number(nn[2]);
					break;
				case "0X_006"://N選択ボタン（複数選択可/fix以下であればOK）
					temp["toggle"]= false;
					temp["num_btn"]= true;
					temp["check"]= "X3";
					temp["skip"] = true;
					temp["btn"] = -1;
					temp["fix_num"] = Number(nn[2]);
					break;


				case "0X_100"://数量ボタン（複数・寿司）
					temp["toggle"]= true;
					temp["num_btn"]= true;
					temp["check"]= "0";
					temp["skip"] = false;
					//ボタン数のセット
					temp["btn"] = Number(nn[2]);
					break;

				case "01_001"://単品セレクト
					temp["toggle"]= true;
					temp["num_btn"]= true;
					temp["check"]= "3";
					temp["skip"] = false;
					temp["btn"] = -1;
					break;
				case "01_002"://単品セレクト数量ボタン
					temp["toggle"]= true;
					temp["num_btn"]= true;
					temp["check"]= "4";
					temp["skip"] = true;
					temp["btn"] = -1;
					break;

				case "00_010"://toggleボタン 数量カウンター表示なし
					temp["toggle"] = true;
					temp["num_btn"] = false;
					temp["check"]= "1";
					temp["skip"] = false;
					temp["btn"] = -1;
					temp["v2"] = false;
					break;

				default :
					temp["toggle"] = true;
					temp["num_btn"] = false;
					temp["check"]= "1";
					temp["skip"] = false;
					temp["btn"] = -1;
					break;
			}

			var is_toggle = ( temp.toggle ) ? "toggle" : "";
			var is_first_select =  ( temp.first_select ) ? "first_select" : "";

			//親数量変更ボタンかどうか
			var parent_num_btn = (temp.num_btn && member[0].id == "9999" && member.length == 1) ? true : false;
			var parent_num_class = (parent_num_btn) ? "parent" : "";

			html += '<div class="stepbox step' + i + ' ' + is_toggle + '" data-index="' + i + '" >';
			var text = "";
			if( !empty( option.text ) ) {
				//英語がない場合には日本語する
				text = option.text;
				if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
					text = ( scope.alternate_bol && !empty(option.alt_text) ) ? option.alt_text : option.text;
				}
			}
			html += '<h4 class="step-text">' + text + '</h4>';

			//自身の前のステップがskip=trueの場合は初期にdisable
			var disabled = "";
			var first_disabled = "";
			if( !empty( tmp_skip ) && tmp_skip ) {
				disabled = "disabled";
				first_disabled = "first-disabled";
			}

			//画像表示テンプレかどうかをセット
			var show_pic = ""
			if( temp.show_pic ) {
				show_pic = "show_pic";
			}

			html += '<div class="buttons"><ul data-btntype="' + temp["btn_type"] + '" data-check="' +  temp["check"] + '" class="' + first_disabled + ' ' + is_first_select + ' ' + parent_num_class + ' ' + show_pic + '">';
			//数量選択ボタン
			if( parent_num_btn ) {

				if( temp.btn <= 1 ) {
					var is_class = "";
					
					//V2のボタン（1つのボタンで数量を変更）
					var n_class = "";
					var name = ( empty( member[0].name_2 ) ) ? member[0].name_1 : member[0].name_1 + "<br />" + member[0].name_2;
					if( !empty( member[0].name_2 ) ) {
						n_class = "l2";
					}
					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						if( scope.alternate_bol && !empty(member[0].alt_name_1) ) {
							name = ( empty( member[0].alt_name_2 ) ) ? member[0].alt_name_1 : member[0].alt_name_1 + "<br />" + member[0].alt_name_2;
							if( !empty( member[0].name_2 ) ) {
								n_class = "l2";
							}
						}
					}
					if( !empty( member[0].name_2 ) ) {
						is_class += " " + n_class;
					}

					var btn_class = 'btn-' + i + 0 + depth;
					html += '<li  id="select-btn-' + self.data.id + '" class="' + is_class + '"><button class="select-btn numbtn v2 ' + btn_class+ '" data-type="num" data-id="9999" data-index="0" data-num="1" ' + disabled + '>' + name + '</button>';
					html += self.getCounter( self.data.id, null, "num", 9999);
					html += '</li>';

				} else {
					var num = ( !empty( temp ) ) ? temp.btn : 8;
					for( var k=0; k<num; k++ ) {
						var btn_class = 'btn-' + i + k + depth;
						html += '<li id="select-btn-' + self.data.id + '"><button class="select-btn numbtn ' + btn_class + '" data-type="num" data-id="9999" data-index="' + k + '" data-num="' + (k+1) + '" ' + disabled + '>' + (k+1) + '</button>';
						html += '</li>';
					}					
				}

			} else {
				
				//通常のセレクト
				$.each( member, function( k, item ) {

					var type = 'normal';
					//ダミーボタン
					if( item.id == "9999" ) {
						type = 'dammy';
					}

					//numbtnでmemberが1以上の場合にはダミーは無視
					//親商品の参照と自信の参照の混在になるため
					if( temp["num_btn"] && member.length>1 && type == 'dammy' ) {
						type = 'hide';
					}

					var is_class = (type != "dammy" && temp.show_pic) ? "has_photo" : "";

					var pdata = scope.menudata.menumst[item.id];

					//品切れ
					//console.log( pdata.stockout )
					if( type == "normal" && pdata.stockout ) {
						return true;
					}

					var n_class = "";
					var name = ( empty( item.name_2 ) ) ? item.name_1 : item.name_1 + "<br />" + item.name_2;
					if( !empty(item.name_2) ) {
						n_class = "l2";
					}
					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						if( scope.alternate_bol && !empty(item.alt_name_1) ) {
							name = ( empty( item.alt_name_2 ) ) ? item.alt_name_1 : item.alt_name_1 + "<br />" + item.alt_name_2;
							if(empty( item.alt_name_2 )) {
								n_class = "l2";
							}
						}
					}
					if( !empty(n_class) ) {
						is_class += " " + n_class;
					}

					var btn_class = 'btn-' + i + k + depth;

					html += '<li id="select-btn-' + item.id + '" class="' + is_class + '"><button class="select-btn ' + btn_class + ' ' + type + '" data-type="' + type + '" data-id="' + item.id + '" data-index="' + k + '" ' + disabled+ '>';

					//写真
					if( type != "dammy" && temp.show_pic ) {
						html += '<span><img src="design_cmn/product/LL/' + pdata.code + Config.product.type + '" class="image"></span>';
						html += '<span>' + name + '</span>';
					} else {
						html += name;
					}

					
					//金額の表示
					if( !empty(pdata) && Number(temp.show_price) != 0 ) {	
						//オプションテキストの価格に変更
						var parent_price = self.data.price;
						var price = pdata.price;
						//サブメニューはオプション価格を入力できないため
						if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
							parent_price = String( self.data.text_1 ).replace( /円||,/g, "" );
							price = String( pdata.text_1 ).replace( /円||,/g, "" );
						}
						
						//0円のときにクラスをつける
						var c0 = ( price == 0 ) ? 'price0' : '';
						if( Number(temp.show_price) == 2 ) {
							html +=　'<em class="price">' + priceText( Number(price) + Number(parent_price) ) + '</em>';
						} else {
							html +=　'<em class="price ' + c0 + '">' + priceText( price ) + '</em>';
						}
					} else if(type == "dammy" && Number(temp.show_price) != 0) {
						var parent_price = self.data.price;
						if( Number(temp.show_price) == 2 ) {
							html +=　'<em class="price">' + priceText( Number(parent_price) ) + '</em>';
						}
					}
					html += '</button>';
					html += self.getCounter(item.id, k, type, -1);
					html += '</li>';
				});

			}
			html += '</ul></div>';
			html += '<button class="btn_next">下へ</button><button class="btn_prev">上へ</button>';

			//自身のcheckを格納する
			//skipに変更
			tmp_skip = temp["skip"];

			//戻るボタン
			if( options.length >= 2 && ( i != 0 || self.depth > 0 ) && template.step_hide ) {
				html += '<div class="prev_btn_box"><button class="step-prev-btn" data-step="' + i + '">戻る</button></div>';
			}

			//次へボタン
			if( options.length >= 2 && options.length-1 != i ) {
				html += '<div class="next_btn_box"><button class="step-next-btn" data-step="' + i + '" disabled="disabled">次へ</button></div>';
			}

			html += '</div>';

			//スキップ設定を格納
			template.step.push( temp );

		});
		html += '</div>';

		return html;
	}


	/**
	 * [setBtnsBtn ボタンの表示セット]
	 */
	this.setBtnsBtn = function( box ) {
		var list = (empty(box)) ? $("#select .stepbox") : box;
		$.each( list, function( i, box ) {

			var btn = $(box).find("ul").get(0);

			var sh= btn.scrollHeight;
			var max = sh - btn.clientHeight;

			if( $(btn).scrollTop() >= max || sh <= btn.offsetHeight ) {
				$(box).find(".btn_next").hide();
			} else {
				$(box).find(".btn_next").show();
			}
			if( $(btn).scrollTop() <= 0 || sh <= btn.offsetHeight ) {
				$(box).find(".btn_prev").hide();
			} else {
				$(box).find(".btn_prev").show();
			}
		});
	};

	/**
	 * [setBtnsPrev 前へのボタンクリック]
	 */
	this.setBtnsPrev = function( e ) {
		var box = $(e.target).parents( ".stepbox" );
		var list = box.find("ul");
		var h = list.find("button").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h * 1 ) / h );
		list.scrollTop( sh*h );
		self.setBtnsBtn( box );
	};

	/**
	 * [setBtnsNext 次へのボタンクリック]
	 */
	this.setBtnsNext = function( e ) {
		var box = $(e.target).parents( ".stepbox" );
		var list = box.find("ul");
		var h = list.find("button").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() +  h * 1 ) / h );
		list.scrollTop( sh*h );
		self.setBtnsBtn( box );
	};


	/**
	 * idからitemを取得
	 * @param  {[type]} index [ステップ]
	 * @param  {[type]} id    [description]
	 * @return {[type]}       [description]
	 */
	this.getSelectItem = function( index, id ) {
		var item_data;
		var option = self.select_data.option[index];
		$.each( option.member , function( i, item ) {
			if( id ==  item.id ) {
				item_data = Object.clone( scope.menudata.menumst[id] );
				//名前をボタン名に置き換える
				if( item_data ) {
					item_data.name_1 = item.name_1;
					item_data.name_2 = item.name_2;
					item_data.alt_name_1 = item.alt_name_1;
					item_data.alt_name_2 = item.alt_name_2;
					//checkを格納しておく
					item_data.check = item.check;
				} else {
					item_data = item;
				}
				return false;
			}
		});
		return item_data;
	};

	/**
		商品をセット
	*/
	this.setSelect = function( btn, target ) {

		console.log( "setSelect" )

		if(  target == "decrement" || target == "increment" ) btn = btn.parents("li").find(".select-btn");

		var group = btn.parents(".stepbox");
		var depth = group.parents(".stepbox-bodys").data("depth");
		var gindex = group.data("index");
		var index = btn.data( "index" );
		var id = btn.data( "id" );
		var type = btn.data( "type" );

		var item = ( type == "dammy" ) ? null : self.getSelectItem( gindex, id );
		var step = self.select_data.option[ gindex ];

		var template = self.template[self.select_data.type] || [];
		var temp = template.step[gindex];

		//カートに追加するかどうか
		var add = ( !empty( temp ) ) ? temp.cart_add : true;
		//addボタンを有効化許可
		var add_bol = true;

		var remove_select;

		var check = temp.check;
		//ダミーボタン
		if( type == "dammy" ) {
			check = "dammy";
		}

		self.select_step_btn_data = [ group, depth, gindex, index ];

		//数量ボタン
		//親商品の変更の場合のみ分岐
		if( temp.num_btn && id == "9999" ) {

			//減算ボタン
			if( target == "decrement" ) {
				self.temp_product[0].num--;
				var num = self.temp_product[0].num;
				group.find("li .counter").show().find("em").text( num );
				$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() + "×" + num );

				if( num <= 0 ) {
					//カウンターの数量をセット
					group.find("li .counter").hide();
					btn.removeClass("selected");

					if( gindex == 0 ) {
						$("#select .reset-btn").attr( "disabled", true );
					}
					$("#select .add-cart").attr( "disabled", true );

					//選択状態変更によって以降の内容が変わる可能性があるので、
					//step_hide=falseの場合には以降の選択をはずす(trueの場合は戻るで消える)
					if( template.step.length > 1 && !template.step_hide ) {

						var sset = self.temp_product[0].set.clone();
						$.each( self.temp_product[0].set, function(i,val) {
							if( step > gindex ) {
								sset.splice(i,1);
							}
						});
						self.temp_product[0].set = sset;

						var ssub = self.temp_product[0].set.clone();
						$.each( self.temp_product[0].sub, function(i,val) {
							if( step > gindex ) {
								ssub.splice(i,1);
							}
						});
						self.temp_product[0].sub = ssub;

						//自身以降のステップを無効化
						group.nextAll(".stepbox").find(".selected").removeClass("selected");
						group.nextAll(".stepbox").find(".select-btn").attr("disabled",true);
						group.nextAll(".stepbox").find(".counter").hide();

						//選択表示の削除
						var selectitem = $('#select .depth-' + self.depth + '.gindex-' + gindex).last();			
						selectitem.nextAll("button").remove();
						$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex ).remove();
					
					}
					//リセットボタンを初期化する
					if( !self.temp_product.length || ( self.temp_product[0].num <= 1 && !self.temp_product[0].set.length && !self.temp_product[0].sub.length ) ) {
						$("#select .reset-btn").attr( "disabled", true );
					}
				}
				return;
			}

			//まだ選択されていない場合には数量を0に戻す
			if( btn.hasClass("v2") ) {
				if( group.find("li .counter").length && !group.find("li .counter").isVisible() ) {
					self.temp_product[0].num = 0;
				}
			}

			//数量変更の対象
			if( temp.btn <= 1 ) {
				num = self.temp_product[0].num + ( btn.data("num")  || 1 );
			} else {
				num = btn.data("num") || 1;
			}

			//注文数アラート
			if( Config.max_value.alert-1 == ( scope.cart.totalnum + num -1 ) && !scope.cart.order_value_alert_bol ) {
				scope.message.confirm("order_value_alert", function() {
					self.setSelect( btn, target );
				}, function(){} );
				scope.cart.order_value_alert_bol = true;
				return false;
			}

			//数量チェック
			var same = scope.cart.getCartSameProductExcSetAry( self.temp_product[0] );
			var snum = 0;
			var leng = same.length;
			for( var i=0; i<leng; i++ ) {
				snum += scope.cart.cartAry[same[i]].num;
			}
			//個別の上限エラー
			if( snum+num >= scope.cart.max_value_numtotal+1 ) {
				scope.message.show( "max_value_subtotal_select" );
				return;
			}
			//全体の数量エラー
			if( scope.cart.cart_last-num < 0 ) {
				scope.message.show( "max_value_subtotal_select" );
				return false;
			}
			//パネルの数量エラー
			if( self.temp_product[0].item.usePanel && scope.cart.panelcart_last-num < 0 ) {
				scope.message.show( "max_value_subtotal_select" );
				return false;
			}

			//強制的にトグル
			if( !btn.hasClass("v2") ) {
				group.find(".selected").removeClass("selected");	
			}

			//親商品の数量を変更
			self.temp_product[0].num = num;
			//セットの数量も変更
			if( !empty( self.temp_product[0].set ) ) {
				$.each( self.temp_product[0].set, function( i, val ) {
					val.num = num;
				} );
			}
			//カウンターの数量をセット
			group.find("li .counter").eq(index).show().find("em").text( num );
			btn.addClass("selected");
			
			//次のステップのdisableを削除
			var nextbtn = group.nextAll( ".stepbox" ).find("button");
			nextbtn.removeAttr("disabled");
			
			//次へを表示
			group.find(".step-next-btn").removeAttr("disabled");

			//リセットボタン
			if( self.temp_product[0].num >=1 ) {
				$("#select .reset-btn").removeAttr( "disabled" );
			}

			//選択表示を追加
			// if( !$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).length ) {
			// 	$("#select .selected-items").append('<button class="depth-' + self.depth + ' gindex-' + gindex + ' index-' + index + '"></button>');
			// }
			// $('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() + "×" + num );
			//$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex ).remove();
			var name = ( btn.hasClass("v2") ) ? btn.text() + "×" + num : num;
			var selecteditem = $('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex);
			if( !selecteditem.length ) {
				$("#select .selected-items").append('<button class="depth-' + self.depth + ' gindex-' + gindex + ' index-' + index + '">' + name + '</button>');
			} else {
				selecteditem.text( btn.text() + "×" + num );
			}

			if( add ) {
				$("#select .add-cart").removeAttr( "disabled", "disabled" );
				//決定ボタンを使わない場合には、カートに格納
				if( !self.useadd_btn ) {
					self.setProduct( target );
					if( self.close ) {
						self.hide();
						return;
					}
				}
			}

			//次のステップがaddでskip=trueの場合の処理
			//決定ボタンのdisabledをはずす
			//step_hideの場合は次へボタンで制御
			//0の場合のみ
			if( !empty( self.select_data.option[gindex+1] ) && !template.step_hide ) {
				console.log(!empty( self.select_data.option[gindex+1]) , !template.step_hide)
				var nextskip = template.step[gindex+1].skip;
				var nextadd = template.step[gindex+1].cart_add;
				if( nextskip &&  nextadd ) {
					$("#select .add-cart").removeAttr( "disabled", "disabled" );
				}
				//初期選択の処理
				//選択毎にクリックしてしまうので、選択されてない場合のみ
				var selected = group.next(".stepbox").find(".selected").length;
				var visible = group.next(".stepbox").find(".counter").isVisible();

				if( template.step[gindex+1].first_select &&  !selected && !visible ) {
					group.next(".stepbox").find(".select-btn").first()._click();
				}
			}

			//trigger
			$(document).trigger("SELECT_SET_SELECT");
			return false;
		}
		
		//カウンターつき1ステップセレクト（たれ・塩）
		//ステップ数が1のみ有効にする
		//temp.v2=falseの場合はカウンターを表示しない
		if( self.select_data.option.length == 1 && temp.toggle && depth == "0" && temp.v2 ) {
			if( check == "1" || check == "dammy" ) {
				check = "Y1";
			} else {
				//不要
				//check = "Y0";
			}
		}

		//数量チェック毎に動きを分岐
		switch( check ) { //先頭のcheckを参照する
			case "0": //サブ
				var sub = false;
				var num = 1;
				var max = false;
				var del = false; //0になった場合の処理
				var alert = false;
				
				var same = scope.cart.getCartSameProduct( self.temp_product[0] );
				
				if( !empty( self.temp_product[0].sub ) ) {

					$.each(self.temp_product[0].sub, function(i,val) {
						if( btn.data("id") == val.item.id ) {
							if( target == "decrement" ) {
								val.num--;
								sub = true;
								num = val.num;
								if( num <= 0 ) {

									//$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() + "×" + num );
									var selectitem = $('#select .depth-' + self.depth + '.gindex-' + gindex).last();
									selectitem.nextAll("button").remove();
									//選択表示の削除
									$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index  ).remove();
									self.temp_product[0].sub.splice( i, 1 );

									group.find("li").eq(index).find(".counter").hide();
									btn.removeClass("selected");
									del = true;

									//同じグループ内に選択状態のものがあるか
									var select_num = group.find("li").find(".selected").length;
									
									//選択状態変更によって以降の内容が変わる可能性があるので、
									//step_hide=falseの場合には以降の選択をはずす(trueの場合は戻るで消える)
									/*
									if( template.step.length > 1 && !template.step_hide && !select_num ) {
										var sset = self.temp_product[0].set.clone();
										$.each( self.temp_product[0].set, function(k,val) {
											if( step > gindex ) {
												sset.splice(k,1);
											}
										});
										self.temp_product[0].set = sset;

										var ssub = self.temp_product[0].set.clone();
										$.each( self.temp_product[0].sub, function(k,val) {
											if( step > gindex ) {
												ssub.splice(k,1);
											}
										});
										self.temp_product[0].sub = ssub;

										//自身以降をリセット
										group.nextAll(".stepbox").find(".selected").removeClass("selected");
										group.nextAll(".stepbox").find(".select-btn").attr("disabled",true);
										group.nextAll(".stepbox").find(".counter").hide();
										//親数量の変更ボタンがある場合
										group.nextAll(".stepbox").each(function() {
											if( $(this).hasClass("parent") ) {
												self.temp_product[0].num = 1;
												return false;
											}
										});										
									}
									*/
								}
							} else {
								var snum = val.num;

								//注文数アラート
								if( Config.max_value.alert-1 == ( scope.cart.totalnum + snum ) && !scope.cart.order_value_alert_bol ) {
									scope.message.confirm("order_value_alert", function() {
										self.setSelect( btn, target );
									}, function(){} );
									scope.cart.order_value_alert_bol = true;
									alert = true;
									return false;
								}
								//数量チェック
								if( same > -1 ) {
									var s_snum = val.num;
									var leng = scope.cart.cartAry[same].sub.length;
									for( var i=0; i<leng; i++ ) {
										var citem = scope.cart.cartAry[same].sub[i];
										if( citem.id == val.id ) {
											snum += citem.num;
											break;
										}
									}
									if( snum >= scope.cart.max_value_numtotal ) {
										max = true;
										return false;
									}
								} else {
									if( snum >= scope.cart.max_value_numtotal ) {
										max = true;
										return false;
									}
								}

								val.num++;
								sub = true;
								num = val.num;
							}
							return false;
						}
					});
				} else {

					//数量チェック
					if( same > -1 ) {
						var leng = scope.cart.cartAry[same].sub.length;
						var snum = 1;
						var id = btn.data("id");
						for( var i=0; i<leng; i++ ) {
							var citem = scope.cart.cartAry[same].sub[i];
							if( citem.item.id == id ) {
								snum += citem.num;
								break;
							}
						}
						if( snum >= scope.cart.max_value_numtotal ) {
							max = true;
						}
					}
					
				}
				//console.log( "!!!", sub, max, num , self.temp_product, del )
				if( alert ) return false; //アラート表示なのでreturn
				
				//商品数が0なのでリターン
				if( !del ) {

					//数量上限なのでreturn
					if( max ) {
						scope.message.show( "max_value_subtotal_select" );
						return false;
					}

					if( !sub ) {
						self.temp_product[0].sub.push( { item:item, num:1, check:"0", depth:self.depth, step:gindex } );
						//選択リストに追加
						$("#select .selected-items").append('<button class="depth-' + self.depth + ' gindex-' + gindex + ' index-' + index + '"></button>');
					}
					//サブの場合、親が0はありえない
					if( self.temp_product[0].num <= 0 ) self.temp_product[0].num = 1;

					//選択表示を変更
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() + "×" + num );
					//カウンターを表示
					group.find("li").eq(index).find(".counter").show().find("em").text( num );
					btn.addClass("selected");

				}
				break;

			case "1": //セット
				//親とセットで数量が動く	
				group.find(".select_child").remove();

				//選択状態変更によって以降の内容が変わる可能性があるので、
				//step_hide=falseの場合には以降の選択をはずす(trueの場合は戻るできる)
				/*
				if( template.step.length > 1 && !template.step_hide ) {
					var sset = []; //self.temp_product[0].set.clone();
					$.each( self.temp_product[0].set, function(i,val) {
						if( val.step > gindex ) {
							// sset.splice(i,1);

							//選択表示を削除
							//選択順が004の2ステップの場合、2ステップ目から選択される可能性があるためここで削除
							var selectitem = '.depth-' + self.depth + '.gindex-' + val.step;
							$('#select .selected-items').find(selectitem).remove();
						} else {
							sset.push( val );
						}
					});
					self.temp_product[0].set = sset;

					var ssub = []; //self.temp_product[0].sub.clone();
					$.each( self.temp_product[0].sub, function(i,val) {
						if( val.step > gindex ) {
							//ssub.splice(i,1);
						} else {
							ssub.push( val );
						}
					});
					self.temp_product[0].sub = ssub;

					group.nextAll(".stepbox").find(".selected").removeClass("selected");
					group.nextAll(".stepbox").find(".select-btn").attr("disabled",true);
					group.nextAll(".stepbox").find(".counter").hide();
					//親数量の変更ボタンがある場合
					group.nextAll(".stepbox").each(function() {
						if( $(this).hasClass("parent") ) {
							self.temp_product[0].num = 1;
							return false;
						}
					});
					//$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() + "×" + num );
					//無しがある場合があるのでここでも削除
					var selectitem = $('.depth-' + self.depth + '.gindex-' + gindex).last();
					selectitem.nextAll("button").remove();
				}
				*/
				
				//選択処理ここから
				if( btn.hasClass("selected") ) {

					//toggleの場合に2回クリックで外さない
					if( Config.select.remove_select_toggle !== false || !temp.toggle ) {

						$.each(self.temp_product[0].set, function(i,val) {
							if( btn.data("id") == val.item.id ) {
								self.temp_product[0].set.splice(i,1);
								return false;
							}
						});
						btn.removeClass("selected");

						//次へボタンと決定ボタンを元に戻す
						if( !group.find(".selected").length && !temp.skip ) {
							group.find(".step-next-btn").attr("disabled", true);
							$("#select .add-cart").attr("disabled", true);
							add_bol = false;
						}

						//選択表示を削除
						$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).remove();

					}

				} else {

					if( temp.toggle ) {
						remove_select =  group.find(".selected");
						$.each(self.temp_product[0].set, function(i,val) {
							if( remove_select.data("id") == val.item.id ) {
								self.temp_product[0].set.splice(i,1);
								return false;
							}
						});
						remove_select.removeClass("selected");
						//選択表示を削除
						$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex ).remove();

					} else {
						//複数選択（トッピング）
						//ダミーがある場合にはグレーをつける
						if( temp["btn_type"] == "00_005" ) {
							group.find(".dammy").removeClass("selected");
							//選択表示を削除
							$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.dammy' ).remove();
						}
					}
					//選択表示を追加
					$("#select .selected-items").append('<button class="depth-' + self.depth + ' gindex-' + gindex + ' index-' + index + '"></button>');
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() );

					self.temp_product[0].num = 1;
					self.temp_product[0].set.push( { item:item, num:1, check:"1", depth:self.depth, step:gindex } );
					btn.addClass("selected");
					//子セレクトの生成
					if( !empty(item.select) ) {
						self.setChildSelect( group, item );
						return;
					}
				}
				break;

			case "3":
				//親商品を打ち消して自身のみでオーダーする
				//数量が個別に動く
				self.temp_product.num = 1;
				self.temp_product.item = item;
				break;
			case "4":
				//親商品を打ち消して自身のみでオーダーする
				//親とセットで数量が動く
				self.temp_product.num = 1;
				self.temp_product.item = item;
				break;


			case "Y1":
				//たれ・塩のような1ステップで
				//複数のCHECK=1を選べる
				var set = false;
				var num = 1;
				var max = false;
				var snumall = 0;

				var sameall = 0;
				var same = scope.cart.getCartSameProductExcSetAry( { item:self.data } );
				var leng = same.length;
				for( var h=0;h<leng;h++ ) {
					sameall += scope.cart.cartAry[same[h]].num;
				}

				if( !empty( self.temp_product ) ) {

					if( target != "decrement" ) {
						//トータル数オーバー
						$.each(self.temp_product, function(h, setval) {
							snumall += setval.num;
						});
						//注文数アラート
						if( Config.max_value.alert - 1 == ( scope.cart.totalnum + snumall ) && !scope.cart.order_value_alert_bol ) {
							scope.message.confirm("order_value_alert", function() {
								self.setSelect( btn, target );
							}, function(){} );
							scope.cart.order_value_alert_bol = true;
							return false;
						}
						//トータル数
						if( scope.cart.cart_last-snumall <= 0 ) {
							max = true;
							scope.message.show( "max_value_subtotal_select" );
							return false;
						}
						//個別トータル数オーバー
						if( sameall + snumall >= scope.cart.max_value_numtotal ) {
							console.log(1)
							max = true;
							scope.message.show( "max_value_subtotal_select" );
							return false;
						}
						//パネル商品の場合のチェック
						if( self.data.usePanel &&  scope.cart.panelcart_last-snumall <= 0 ) {
							max = true;
							scope.message.show( "max_value_subtotal_select" );
							return false;
						}
						//人数チェックをY0だけ適応
						var checkperson = scope.cart.checkPersons( { item:self.data, num:snumall+1, set:[], sub:[] } );
						if( !checkperson ) {
							return false;
						}
					}

					$.each(self.temp_product, function(i, setitem) {
						var hit = false;

						//セットなしを変更
						if( id == "9999" ) {
							if( empty(setitem.set) ) {
								if( target == "decrement" ) {
									setitem.num--;
									set = true;
									num = setitem.num;
									if( num <= 0 ) {
										self.temp_product.splice( i, 1 );
										if( empty( self.temp_product ) ) {
											self.temp_product = [ { item:self.data, num:0, set:[], sub:[] } ];
										}
									}
								} else {
									//数量チェック
									var snum = setitem.num;
									
									//数量オーバー
									if( snum == scope.cart.max_value_numtotal ) {
										max = true;
										return false;
									}
									
									//親数量を変更
									setitem.num++;
									set = true;
									num = setitem.num;
								}
								hit = true;
								return false;
							} else {
								return true;
							}
						}

						//セットを検索
						$.each( setitem.set, function( k, val ) {
							if( btn.data("id") == val.item.id ) {
								if( target == "decrement" ) {
									val.num--;
									set = true;
									num = val.num;
									//親数量を変更
									setitem.num = val.num;

									if( num <= 0 ) {
										self.temp_product.splice( i, 1 );
										if( empty( self.temp_product ) ) {
											self.temp_product = [ { item:self.data, num:0, set:[], sub:[] } ];
										}
									}
								} else {
								
									val.num++;
									//親数量を変更
									setitem.num = val.num;
									set = true;
									num = val.num;
								}
								hit = true;
								return false;
							}
						});
						if( hit ) return false;
					});
				}

				if( !set ) {
					if( !self.temp_product[0].num ) self.temp_product = new Array();
					if( id == "9999" ) {
						self.temp_product.push( { item:self.data, num:1, set:[], sub:[] } );
					} else {
						self.temp_product.push( { item:self.data, num:1, set:[ { item:item, num:1, check:"1", depth:self.depth, step:gindex } ], sub:[] } );
					}
				}

				//カウンターを表示
				group.find("li").eq(index).find(".counter").show().find("em").text( num );

				if( num <= 0 ) {
					group.find("li").eq(index).find(".counter").hide();
					btn.removeClass("selected");
				} else {
					btn.addClass("selected");
				}
				// if( !self.temp_product.length || !self.temp_product[0].set.length ) {
				// 	$("#select .add-cart").attr("disabled", true);
				// 	$("#select .reset-btn").attr("disabled", true);
				// }
				break;


			case "X0":
				//制限数あり
				//選択しなければならない
				console.log( temp.fix_num );

				//選択状態変更によって以降の内容が変わる可能性があるので、
				//step_hide=falseの場合には以降の選択をはずす(trueの場合は戻るできえる)
				/*
				if( template.step.length > 1 && !template.step_hide ) {
					var sset = self.temp_product[0].set.clone();
					$.each( self.temp_product[0].set, function(i,val) {
						if( val.step > gindex ) {
							sset.splice(i,1);
						}
					});
					self.temp_product[0].set = sset;

					var ssub = self.temp_product[0].sub.clone();
					$.each( self.temp_product[0].sub, function(i,val) {
						if( val.step > gindex ) {
							ssub.splice(i,1);
						}
					});
					self.temp_product[0].sub = ssub;

					group.nextAll(".stepbox").find(".selected").removeClass("selected");
					group.nextAll(".stepbox").find(".select-btn").attr("disabled",true);
					group.nextAll(".stepbox").find(".counter").hide();
					//親数量の変更ボタンがある場合
					group.nextAll(".stepbox").each(function() {
						if( $(this).hasClass("parent") ) {
							self.temp_product[0].num = 1;
							return false;
						}
					});
					//$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() + "×" + num );
					var selectitem = $('.depth-' + self.depth + '.gindex-' + gindex).last();
					selectitem.nextAll("button").remove();
				}
				*/
				
				if( btn.hasClass("selected") ) {

					group.find(".select_child").remove();

					$.each(self.temp_product[0].set, function(i,val) {
						if( btn.data("id") == val.item.id ) {
							self.temp_product[0].set.splice(i,1);
							return false;
						}
					});
					btn.removeClass("selected");

					//選択表示を削除
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).remove();

					group.find(".select-btn").removeAttr("disabled", true);

					//次へボタンと決定ボタンを元に戻す
					if( group.find(".selected").length < temp.fix_num ) {
						group.find(".step-next-btn").attr("disabled", true);
						$("#select .add-cart").attr("disabled", true);
						group.addClass("not-selected");
					}
					
					//リセットボタンを無効
					if(group.find(".selected").length <= 0) {
						$("#select .reset-btn").attr( "disabled", true );
					}
					return;

				} else {
					//数量以上の選択はNG
					var xset = self.temp_product[0].set.filter(function(n){
						return ( n.gindex == gindex );
					});
					if( xset.length == temp.fix_num ) {
						return;
					}
					group.find(".select_child").remove();
					
					self.temp_product[0].num = 1;
					self.temp_product[0].set.push( { item:item, num:1, check:"x0", gindex:gindex, depth:self.depth, step:gindex } );
					btn.addClass("selected");

					//選択表示を追加
					$("#select .selected-items").append('<button class="depth-' + self.depth + ' gindex-' + gindex + ' index-' + index + '"></button>');
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() );
				
					//リセットボタンを有効
					$("#select .reset-btn").removeAttr( "disabled" );
				}
				var xset = self.temp_product[0].set.filter(function(n){
					return ( n.gindex == gindex );
				});
				
				console.log( xset.length, temp.fix_num )

				if( xset.length < temp.fix_num ) {
					//一定数に至ってなければ、次に行ってはだめ
					group.addClass("not-selected");
					return;
				} else {
					//ボタンを無効化
					group.find(".select-btn:not(.selected)").attr("disabled", true);
					group.removeClass("not-selected");
				}

				//子のセレクトをセットしてみる
				if( !empty(item.select) ) {
					self.setChildSelect( group, item );
					return;
				}
				break;


			case "X1":
				//制限数あり
				//選択しなければならない
				//複数選択可
				console.log( temp.fix_num );

				if( target != "decrement" ) {
					//数量以上の選択はNG
					var xset = self.temp_product[0].set.filter(function(n){
						return ( n.gindex == gindex );
					});
					if( xset.length == temp.fix_num ) {
						return;
					}
				}

				//選択状態変更によって以降の内容が変わる可能性があるので、
				//step_hide=falseの場合には以降の選択をはずす(trueの場合は戻るできえる)
				/*
				if( template.step.length > 1 && !template.step_hide ) {
					var sset = self.temp_product[0].set.clone();
					$.each( self.temp_product[0].set, function(i,val) {
						if( val.step > gindex ) {
							sset.splice(i,1);
						}
					});
					self.temp_product[0].set = sset;

					var ssub = self.temp_product[0].sub.clone();
					$.each( self.temp_product[0].sub, function(i,val) {
						if( val.step > gindex ) {
							ssub.splice(i,1);
						}
					});
					self.temp_product[0].sub = ssub;

					group.nextAll(".stepbox").find(".selected").removeClass("selected");
					group.nextAll(".stepbox").find(".select-btn").attr("disabled",true);
					group.nextAll(".stepbox").find(".counter").hide();
					//親数量の変更ボタンがある場合
					group.nextAll(".stepbox").each(function() {
						if( $(this).hasClass("parent") ) {
							self.temp_product[0].num = 1;
							return false;
						}
					});
					//$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() + "×" + num );
					var selectitem = $('.depth-' + self.depth + '.gindex-' + gindex).last();
					selectitem.nextAll("button").remove();
				}
				*/
				
				var hit = false;
				if( target == "decrement" ) {
					$.each(self.temp_product, function(i, setitem) {
						//セットを検索
						$.each( setitem.set, function( k, val ) {
							if( btn.data("id") == val.item.id ) {
								//セットを削除
								self.temp_product[0].set.splice( k, 1 );
								hit = true;
								return false;
							}
						});
						if( hit ) return false;
					});
				}

				if( !hit ) {
					self.temp_product[0].num = 1;
					self.temp_product[0].set.push( { item:item, num:1, check:"x0", gindex:gindex, depth:self.depth, step:gindex } );
					btn.addClass("selected");

					//選択表示を追加
					$("#select .selected-items").append('<button class="depth-' + self.depth + ' gindex-' + gindex + ' index-' + index + '"></button>');
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() );

				} else {
					//削除された
					group.find(".select-btn").removeAttr("disabled", true);
					group.find(".step-next-btn").attr("disabled", true);
					$("#select .add-cart").attr("disabled", true);
					add_bol = false;

					//選択表示を削除
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).last().remove();
				}

				//ボタン商品の合計数
				var is_set = self.temp_product[0].set.filter(function(n){
					return ( n.gindex == gindex && n.item.id == btn.data("id") );
				});

				//カウンターを表示
				group.find("li").eq(index).find(".counter").show().find("em").text( is_set.length );
				if( is_set <= 0 ) {
					group.find("li").eq(index).find(".counter").hide();
					btn.removeClass("selected");
				}

				//セレクト総数
				var xset = self.temp_product[0].set.filter(function(n){
					return ( n.gindex == gindex );
				});

				// console.log( xset.length, temp.fix_num )

				if( xset.length < temp.fix_num ) {
					if( xset.length <= 0 ) {
						//リセットボタンを無効
						$("#select .reset-btn").attr( "disabled", true );
					} else {
						//リセットボタンを有効
						$("#select .reset-btn").removeAttr( "disabled" );
					}
					//一定数に至ってなければ、次に行ってはだめ
					group.addClass("not-selected");
					return;
				} else {
					//ボタンを無効化
					group.find(".select-btn").attr("disabled", true);
					group.removeClass("not-selected");
				}

				//子のセレクトをセットしてみる
				if( !empty(item.select) ) {
					self.setChildSelect( group, item );
					return;
				}

				break;


			case "X2":
				//制限数あり
				//以下であれば選択可
				console.log( temp.fix_num );

				if( btn.hasClass("selected") ) {

					group.find(".select_child").remove();

					$.each(self.temp_product[0].set, function(i,val) {
						if( btn.data("id") == val.item.id ) {
							self.temp_product[0].set.splice(i,1);
							return false;
						}
					});
					btn.removeClass("selected");

					//選択表示を削除
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).remove();

					group.find(".select-btn").removeAttr("disabled", true);

					//次へボタンと決定ボタンを元に戻す
					if( group.find(".selected").length <= 0 ) {
						group.find(".step-next-btn").attr("disabled", true);
						$("#select .add-cart").attr("disabled", true);
						$("#select .reset-btn").attr( "disabled", true );
					}
					
					return;

				} else {
					//数量以上の選択はNG
					var xset = self.temp_product[0].set.filter(function(n){
						return ( n.gindex == gindex );
					});
					if( xset.length == temp.fix_num ) {
						return;
					}
					group.find(".select_child").remove();
					
					self.temp_product[0].num = 1;
					self.temp_product[0].set.push( { item:item, num:1, check:"x0", gindex:gindex, depth:self.depth, step:gindex } );
					btn.addClass("selected");

					//選択表示を追加
					$("#select .selected-items").append('<button class="depth-' + self.depth + ' gindex-' + gindex + ' index-' + index + '"></button>');
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() );
				
					//リセットボタンを有効
					$("#select .reset-btn").removeAttr( "disabled" );
				}
				var xset = self.temp_product[0].set.filter(function(n){
					return ( n.gindex == gindex );
				});
				
				console.log( xset.length, temp.fix_num )

				if( xset.length >= temp.fix_num ) {
					//ボタンを無効化
					group.find(".select-btn:not(.selected)").attr("disabled", true);
				}

				break;


			case "X3":
				//同じ商品を複数選べるボタン
				//N以下であれば選択可能
				//同じ商品を複数選べるボタン
				console.log( temp.fix_num );

				if( target != "decrement" ) {
					//数量以上の選択はNG
					var xset = self.temp_product[0].set.filter(function(n){
						return ( n.gindex == gindex );
					});
					if( xset.length == temp.fix_num ) {
						return;
					}
				}
				
				var hit = false;
				if( target == "decrement" ) {
					$.each(self.temp_product, function(i, setitem) {
						//セットを検索
						$.each( setitem.set, function( k, val ) {
							if( btn.data("id") == val.item.id ) {
								//セットを削除
								self.temp_product[0].set.splice( k, 1 );
								hit = true;
								return false;
							}
						});
						if( hit ) return false;
					});
				}

				if( !hit ) {
					self.temp_product[0].num = 1;
					self.temp_product[0].set.push( { item:item, num:1, check:"x0", gindex:gindex, depth:self.depth, step:gindex } );
					btn.addClass("selected");

					//選択表示を追加
					$("#select .selected-items").append('<button class="depth-' + self.depth + ' gindex-' + gindex + ' index-' + index + '"></button>');
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() );

				} else {
					//削除された
					group.find(".select-btn").removeAttr("disabled", true);
					group.find(".step-next-btn").attr("disabled", true);
					$("#select .add-cart").attr("disabled", true);
					add_bol = false;

					//選択表示を削除
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).last().remove();
				}

				//ボタン商品の合計数
				var is_set = self.temp_product[0].set.filter(function(n){
					return ( n.gindex == gindex && n.item.id == btn.data("id") );
				});

				//カウンターを表示
				group.find("li").eq(index).find(".counter").show().find("em").text( is_set.length );
				if( is_set <= 0 ) {
					group.find("li").eq(index).find(".counter").hide();
					btn.removeClass("selected");
				}

				//セレクト総数
				var xset = self.temp_product[0].set.filter(function(n){
					return ( n.gindex == gindex );
				});

				// console.log( xset.length, temp.fix_num )

				if( xset.length >= temp.fix_num ) {
					//ボタンを無効化
					group.find(".select-btn").attr("disabled", true);
				}
				break;



			case "X10": //レコメンドセットメニュー
				//親とセットで数量が動く	
				group.find(".select_child").remove();

				//選択状態変更によって以降の内容が変わる可能性があるので、
				//step_hide=falseの場合には以降の選択をはずす(trueの場合は戻るできる)
				/*
				if( template.step.length > 1 && !template.step_hide ) {
					var sset = []; //self.temp_product[0].set.clone();
					$.each( self.temp_product[0].setmenu, function(i,val) {
						if( val.step > gindex ) {
							// sset.splice(i,1);

							//選択表示を削除
							//選択順が004の2ステップの場合、2ステップ目から選択される可能性があるためここで削除
							var selectitem = '.depth-' + self.depth + '.gindex-' + val.step;
							$('#select .selected-items').find(selectitem).remove();
						} else {
							sset.push( val );
						}
					});
					self.temp_product[0].setmenu = sset;


					group.nextAll(".stepbox").find(".selected").removeClass("selected");
					group.nextAll(".stepbox").find(".select-btn").attr("disabled",true);
					group.nextAll(".stepbox").find(".counter").hide();
					//親数量の変更ボタンがある場合
					group.nextAll(".stepbox").each(function() {
						if( $(this).hasClass("parent") ) {
							self.temp_product[0].num = 1;
							return false;
						}
					});
					//$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() + "×" + num );
					//無しがある場合があるのでここでも削除
					var selectitem = $('.depth-' + self.depth + '.gindex-' + gindex).last();
					selectitem.nextAll("button").remove();
				}
				*/
				
				//選択処理ここから
				if( btn.hasClass("selected") ) {

					//toggleの場合に2回クリックで外さない
					if( Config.select.remove_select_toggle !== false || !temp.toggle ) {

						$.each(self.temp_product[0].setmenu, function(i,val) {
							if( btn.data("id") == val.item.id ) {
								self.temp_product[0].setmenu.splice(i,1);
								return false;
							}
						});
						btn.removeClass("selected");

						//次へボタンと決定ボタンを元に戻す
						if( !group.find(".selected").length && !temp.skip ) {
							group.find(".step-next-btn").attr("disabled", true);
							$("#select .add-cart").attr("disabled", true);
							add_bol = false;
						}

						//選択表示を削除
						$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).remove();

					}

				} else {

					if( temp.toggle ) {
						remove_select =  group.find(".selected");
						$.each(self.temp_product[0].setmenu, function(i,val) {
							if( remove_select.data("id") == val.item.id ) {
								self.temp_product[0].setmenu.splice(i,1);
								return false;
							}
						});
						remove_select.removeClass("selected");
						//選択表示を削除
						$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex ).remove();

					} else {
						//複数選択（トッピング）
						//ダミーがある場合にはグレーをつける
						if( temp["btn_type"] == "00_005" ) {
							group.find(".dammy").removeClass("selected");
							//選択表示を削除
							$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.dammy' ).remove();
						}
					}
					//選択表示を追加
					$("#select .selected-items").append('<button class="depth-' + self.depth + ' gindex-' + gindex + ' index-' + index + '"></button>');
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() );

					self.temp_product[0].num = 1;
					self.temp_product[0].setmenu.push( { item:item, num:1, check:"1", depth:self.depth, step:gindex, set:[], sub:[], select:true } );
					btn.addClass("selected");

				}

				break;


			case "dammy": //ダミーボタン
				group.find(".select_child").remove();

				//選択状態変更によって以降の内容が変わる可能性があるので、
				//step_hide=falseの場合には以降の選択をはずす(trueの場合は戻るできえる)
				/*
				if( template.step.length > 1 && !template.step_hide ) {
					var sset = self.temp_product[0].set.clone();
					$.each( self.temp_product[0].set, function(i,val) {
						if( val.step > gindex ) {
							sset.splice(i,1);
						}
					});
					self.temp_product[0].set = sset;

					var ssub = self.temp_product[0].sub.clone();
					$.each( self.temp_product[0].sub, function(i,val) {
						if( val.step > gindex ) {
							ssub.splice(i,1);
						}
					});
					self.temp_product[0].sub = ssub;

					group.nextAll(".stepbox").find(".selected").removeClass("selected");
					group.nextAll(".stepbox").find(".select-btn").attr("disabled",true);
					group.nextAll(".stepbox").find(".counter").hide();
					//親数量の変更ボタンがある場合
					group.nextAll(".stepbox").each(function() {
						if( $(this).hasClass("parent") ) {
							self.temp_product[0].num = 1;
							return false;
						}
					});
					//$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() + "×" + num );
					var selectitem = $('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex).last();
					selectitem.nextAll("button").remove();
				}
				*/

				if( btn.hasClass("selected") ) {

					//toggleの場合に2回クリックで外さない
					if( Config.select.remove_select_toggle !== false || !temp.toggle ) {

						btn.removeClass("selected");
						//次へボタンと決定ボタンを元に戻す
						if( !group.find(".selected").length ) {
							group.find(".step-next-btn").attr("disabled", true);
							$("#select .add-cart").attr("disabled", true);
							add_bol = false;
						}

						//選択表示を削除
						$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).remove();
						//return;
					}

				} else {
					if( temp.toggle ) {
						remove_select =  group.find(".selected");
						$.each(self.temp_product[0].set, function(i,val) {
							if( remove_select.data("id") == val.item.id ) {
								self.temp_product[0].set.splice(i,1);
								return false;
							}
						});
						remove_select.removeClass("selected");
						//選択表示を削除
						$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex ).remove();
					}
					self.temp_product[0].num = 1;
					btn.addClass("selected");

					//複数選択（トッピング）でダミー（変更なし）の場合に
					//ダミー以外のボタンをリセットする
					if( temp["btn_type"] == "00_005" ) {
						group.find(".select-btn").removeClass("selected");
						//セットをクリアする
						//depthとステップが同じものだけ削除する
						//self.temp_product[0].set = [];
						var sset = self.temp_product[0].set.clone();
						var ssset = [];
						$.each( self.temp_product[0].set, function(i,val) {
							if( val.step != gindex ) {
								//sset.splice(i,1);
								ssset.push( val );
							}
						});
						self.temp_product[0].set = ssset;
						group.find(".dammy").addClass("selected");
						//選択表示を削除
						$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex ).remove();
					}

					//選択表示を追加
					$("#select .selected-items").append('<button class="depth-' + self.depth + ' gindex-' + gindex + ' index-' + index + ' dammy"></button>');
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + gindex + '.index-' + index ).text( btn.text() );
				}
				break;
		}
		//group.find(".increment, .decrement").show();
		
		var nextbtn = group.nextAll( ".stepbox" ).find("li button:not(.btn_next,.btn_prev)");
		//skip不可の場合未選択の処理
		if( !temp.skip && !group.find("button.selected").length  ) {
			//次へボタンと決定ボタンを元に戻す
			group.find(".step-next-btn").attr("disabled", "disabled");
			nextbtn.attr("disabled", true);
		} else {
			//次のステップのdisabledを削除
			nextbtn.removeAttr("disabled");
			//次を表示
			group.find(".step-next-btn").removeAttr("disabled");
		}

		//リセットボタン
		if( self.temp_product.length > 1 || self.temp_product[0].num > 1 || self.temp_product[0].set.length || self.temp_product[0].sub.length ) {
			$("#select .reset-btn").removeAttr( "disabled" );
		} else if( $("#select .select-btn.selected").length ) {
			$("#select .reset-btn").removeAttr( "disabled" );
		} else {
			$("#select .reset-btn").attr( "disabled", true );
		}

		//カートに追加するかどうか
		if( self.temp_product.length && self.temp_product[0].num >=1 && add && add_bol ) {	
			$("#select .add-cart").removeAttr( "disabled" );
			//決定ボタンを使わない場合には、カートに格納
			if( !self.useadd_btn ) {
				self.setProduct( target );
				if( self.close ) {
					return;
				}
			}	
		} else if( !self.temp_product.length || self.temp_product[0].num < 1 ) {
			//配列が空の場合には一回リセット
			self.reset();
			return;
		}

		//次のステップがaddでskip=trueの場合の処理
		//決定ボタンのdisabledをはずす
		//step_hideの場合は次へボタンで制御
		//
		if( !empty( self.select_data.option[gindex+1] ) && !template.step_hide && add_bol  ) {
			//console.log(!empty( self.select_data.option[gindex+1]) , !template.step_hide)
			var nextskip = template.step[gindex+1].skip;
			var nextadd = template.step[gindex+1].cart_add;

			//次のステップのチェック
			//var nextselected = group.nextAll( ".stepbox" ).find("li button.select-btn.selected").length;
			// 選ばなければならないのステップをカウントせず、次への表示の判定
			var nextselected = group.nextAll( ".stepbox" ).length;
			group.nextAll( ".stepbox" ).each(function(index, el) {
				var btntype = $(this).find('ul').data("btntype");
				if( btntype != "00_004" && btntype != "00_005" ) {
					nextselected -= ($(this).find("li button.select-btn.selected").length) ? 0 : 1;
				} else {
					nextselected--;
				}
			});

			if( group.next(".stepbox").hasClass("not-selected") ) { //0Xの対応
				nextselected = false;
			}

			if( nextselected == 0 ) {
				nextadd = true;
			}

			if( nextskip && nextadd ) {
				$("#select .add-cart").removeAttr( "disabled" );
			} else if( nextselected ) { //次のステップに選択がある場合
				$("#select .add-cart").removeAttr( "disabled" );
			} else {
				$("#select .add-cart").attr( "disabled", true );
			}

			//初期選択の処理
			//選択毎にクリックしてしまうので、選択されてない場合のみ
			var selected = group.next(".stepbox").find(".selected").length;
			var visible = group.next(".stepbox").find(".counter").isVisible();

			//console.log( template.step[gindex+1],  !selected , !visible )
			if( template.step[gindex+1].first_select &&  !selected && !visible ) {
				group.next(".stepbox").find(".select-btn").first()._click();
			}
		}

		//次のステップが数量選択の場合には選択可能数まで
		//お寿司のテンプレート
		if( nextbtn.first().data("type") == "num" ) {
			if( !nextbtn.first().hasClass("v2") ) { //V2の1つボタンでの制御ではない場合
				var last = scope.cart.getObjectLast( {item:self.data, num:1, set:[], sub:[]} );
				//console.log( last )
				nextbtn.each( function(){
					if( Number($(this).data("num")) > last ) {
						$(this).attr("disabled",true);
					} 
				});
			}
		}

		//trigger
		$(document).trigger("SELECT_SET_SELECT");
	};


	/**
	 *  子セレクトの作成
	 *  　セレクトのセレクトを作成します。
	 */
	this.setChildSelect = function( group, item ) {

		//group.find("ul").after('<div class="select_child"><button class="step-next-btn">次へ</button></div>');
		group.find(".buttons").after('<div class="select_child"><button class="step-next-btn">次へ</button></div>');
		$("#select .add-cart").attr("disabled", true);

		//親の次へが選択された時に生成する
		group.find(".step-next-btn")._click(function(){

			//親のテンプレート情報
			var parent_template = self.template[self.select_data_org.type];

			//self.select_dataを置き換える
			self.select_data = scope.menudata.select[item.select];
			self.select_data_ary.push( self.select_data );

			var template = self.template[self.select_data.type] || [];
			self.depth++;
			self.code_class = item.select;

			var html = self.createButtons( self.select_data.option, self.select_data.type, self.depth );

			group.after(html);
			var bodys = group.next(".stepbox-bodys");
			bodys.find( ".stepbox" ).each( function(){

				var stepbox = $(this);
				var events = null; //($(this).hasClass("toggle")) ? "click" : null;
				$(this).find("ul button")._click(function( e ){
					var target = null;
					self.setSelect( $(this), target );
					self.last_select_id = $(this).data("id");
				}, 1, events );

				//次へボタン
				$(this).find(".step-next-btn")._click(function(){
					var step = $(this).data("step");
					var next = ".step" + (step+1);
					bodys.find(next).show();
					var temp = self.template[self.select_data.type];
					if( temp.step_hide ) {
						$(this).parents(".stepbox").hide();
					}

					//skipできる場合は次へを表示
					if( !empty(temp.step[step+1]) && temp.step[step+1].skip ) {
						bodys.find(next).find(".step-next-btn").removeAttr("disabled");
					}
				});

				//戻るのクリック
				$(this).find(".step-prev-btn")._click(function() {
					var step = $(this).data("step");

					var set = self.temp_product[0].set.clone();
					var set_leng = set.length;
					for(var i=0; i<set_leng; i++) {
						var val = set[i];
						if( val.depth == self.depth && val.step == step ) {
							self.temp_product[0].set.splice(i,1);
							set_leng--;
							i--;
						}
					}

					var sub = self.temp_product[0].sub.clone();
					var sub_leng = sub.length;
					for(var i=0; i<sub_leng; i++) {
						var val = sub[i];
						if( val.depth == self.depth && val.step == step ) {
							self.temp_product[0].sub.splice(i,1);
							sub_leng--;
							i--;
						}
					}

					
					if( step <= 0 ) {
						
						//ボタンを削除
						bodys.remove();
						
						//セレクトデータの入れ替え
						self.select_data_ary = self.select_data_ary.splice( 0, self.depth );
						//選択表示の削除
						$('#select .selected-items .depth-' + self.depth + '.gindex-' + step ).remove();

						//階層をあげる
						self.depth--;
						self.select_data = self.select_data_ary[self.depth];

						group.show();

						//決定を戻す
						$("#select .add-cart").attr( "disabled", true );
						

					} else {

						var prev = ".step" + (step-1);
						bodys.find(prev).show();
						var temp = self.template[self.select_data.type];
						if( temp.step_hide ) {
							$(this).parents(".stepbox").hide();
						}

						//決定を戻す
						$("#select .add-cart").attr( "disabled", true );
					}

					//選択を解除
					$(this).parents(".stepbox").find(".selected").removeClass("selected");
					//カウンターの非表示
					$(this).parents(".stepbox").find("li .counter").hide();
			
					//選択表示の削除
					$('#select .selected-items .depth-' + self.depth + '.gindex-' + step ).remove();
				});
				
			} );

			//親を継承する
			if( parent_template.step_hide ) {
				group.hide();
				bodys.find( ".stepbox" ).hide().first().show();
			}

			//ボタンのセット（高さがセットされないので、ここで実行）
			//ボタンの上下
			$("#select .btns .btn_prev")._click(function(e) {
				self.setBtnsPrev(e);
			});
			$("#select .btns .btn_next")._click(function(e) {
				self.setBtnsNext(e);
			});
			self.setBtnsBtn( bodys );

			//言語のアップデート
			scope.alternate.updateLang();
		});

		//言語のアップデート
		scope.alternate.updateLang();
	};

	/**
	 * 商品の確定
	 * @param {[type]} target [description]
	 */
	this.setProduct = function( target ) {

		if( self.temp_product.length <= 0 ) {
			self.reset();
			return;
		} else {

			if( self.close ) {
				self.hide();
			}

			var name = "";
			var res = "";
			$.each( self.temp_product , function( i, val ) {

				//1ステップでスキップの場合（btn_type_004）
				//親数量が0の場合があるので1にする
				if( val.num == 0 ) val.num = 1;
				
				//listが無い場合にはメッセージを表示する
				if( !self.use_list || self.close ) {
					if( i>0 ) name += " ";
					//menu-pageに追加する
					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						name += ( scope.alternate_bol && !empty(val.item.alt_name_1) ) ? val.item.alt_name_1 + val.item.alt_name_2 : val.item.name_1 + val.item.name_2;
					} else {
						name += val.item.name_1 + val.item.name_2;
					}

					//セット商品
					if( val.set.length ) {
						var set_name = new Array();
						$.each( val.set, function( k, sitem ) {
							var sname = sitem.item.name_1 + sitem.item.name_2;
							if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
								sname = ( scope.alternate_bol && !empty(sitem.item.alt_name_1) ) ? sitem.item.alt_name_1 + sitem.item.alt_name_2 : sitem.item.name_1 + sitem.item.name_2;
							}
							set_name.push( sname );
						});
						name += "/" + set_name.join(",");
					}
					if( val.num > 1 ) name += "×" + val.num;

					if( val.sub.length ) {
						var sub_name = new Array();
						$.each( val.sub, function( i, bitem ) {
							var bname = bitem.item.name_1 + bitem.item.name_2;
							if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
								bname =  ( scope.alternate_bol && !empty(bitem.item.alt_name_1) ) ? bitem.item.alt_name_1 + bitem.item.alt_name_2 : bitem.item.name_1 + bitem.item.name_2;
							}
							bname += "×" + bitem.num;
							sub_name.push( bname );
						});
						name += "/" + sub_name.join(",");
					}
				}

				//セットメニューの場合
				if( self.setmenu ) {
					scope.setmenu.endSetSelect( val, self.edit );
					return false;
				} else if( !empty( self.data.setmenu ) ) {
					scope.setmenu.show( val, self.edit );
					return false;
				}

				//カートに格納
				if( !empty( self.edit ) ) {
					scope.cart.editCart( val, self.edit );
					return false;
				}

				res = scope.setProduct( val );
				if( !res || ( res != "normal" && res != "caution" ) ) return false;
			});
			if( !res || ( res != "normal" && res != "caution" ) ) return false;

			//メッセージを表示
			if( !self.use_list || self.close ) {
				var timer1 = $.timer( function() {
					var msg =  scope.alternate.getString("select-cartadd-message");
					msg = String(msg).replace( /%item%/gi, name );
					var html = '<div id="select-message"><p>';
					html += msg;
					html += '</p></div>';

					$("#menu-page").append(html);
					var timer = $.timer(function() {
						$("#select-message").remove();
						this.stop();
					}, 3000, 1);

					this.stop();
				}, 100, 1);
			}
		}

		self.reset();
	};

	/**
	 * 初期化
	 */
	this.reset = function() {
		//初期化
		self.select_data = self.select_data_org;
		//
		self.temp_product = new Array({ item:self.data, num:0, sub:[], set:[], setmenu:[] });
		$("#select button.selected").removeClass("selected");
		$("#select button.gray").removeClass("gray");
		$("#select .select-btn").removeAttr("disabled");
		$("#select .selected-items button").remove();

		//disabledに初期化
		$("#select .first-disabled button").attr("disabled", true );
		$("#select .add-cart").attr( "disabled", "disabled" );

		$("#select .reset-btn").attr( "disabled", "disabled" );
		//子セレクトを削除
		$(".stepbox-bodys .stepbox-bodys").remove();

		//先頭に戻す
		var temp = self.template[self.select_data.type];
		if( temp.step_hide ) {
			$("#select .stepbox").hide().eq(0).show();
		}
		//カウンターを消す
		$("#select .stepbox .counter").hide();
		$("#select .stepbox .step-next-btn").attr("disabled", true);

		//2ステップ以降のボタンをdisabled
		//戻るボタンは有効化
		$("#select .step0").nextAll(".stepbox").find("button:not(.step-prev-btn,.btn_next,.btn_prev)").attr("disabled", true);

		//スクロールを0にする
		$("#select .stepbox ul").scrollTop(0);
		self.setBtnsBtn();


		//最初のステップがstep=trueの場合には次へボタンを表示する
		if( temp.step[0].skip ) {
			$("#select .step0 .step-next-btn").removeAttr("disabled");
			//次のステップを有効化
			if( !empty(temp.step[1]) ) {
				var nextbtn = $("#select .step1").find("li button");
				nextbtn.removeAttr("disabled");
			}
		}
		//カウンターつき1ステップセレクト以外の場合には親数量を1にする
		if( self.select_data.option.length != 1 || ( !empty(temp.step[1]) && !temp.step[1].toggle ) ) {
			self.temp_product[0].num = 1;
		}

		//全てのステップがスキップ可能の場合には決定ボタンを有効にする
		if( temp.all_skip ) {
			$("#select .add-cart").removeAttr( "disabled" );
		}

		//先頭を選択状態にする
		//$("#select .stepbox").first().find(".first_select").first().find("button").first()._click();
	}

	/**
	 * [getCounter description]
	 * @param {[type]} [varname] 数量変更ボタン
	 * @return {[type]} [description]
	 */
	this.getCounter = function( id, index, type, num, increment ) {

		var html = "";
		//カウンターを使うかどうかチェック
		var temp = self.template[self.select_data.type] || [];

		html += '<div class="counter">';
		html += '<button class="decrement" data-id="' + id + '" data-index="' + index + '" data-type="' + type + '" data-num="' + num + '">-</button>';
		html += '<span class="count"><em></em></span>';
		html += '<button class="increment" data-id="' + id + '" data-index="' + index + '" data-type="' + type + '" data-num="' + num + '">+</button>';
		html += '</div>';
		
		return html;
	}

	/**
	 * [updateCounter description]
	 * @return {[type]} [description]
	 */
	this.updateCounter = function() {

		//カウンターを使うかどうかチェック
		var temp = self.template[self.select_data.type] || [];
		var id = self.data.id;
		var data = scope.cart.getCartAryProductIdAll(id);

		if( !empty(data) ) {

			$("#select ul").find(".counter").hide();

			//セットが2個つくことは今のところ無い
			//セレクトはコードを個々にもっている
			//ボタンごとの個数を抽出
			var product_ids = [];
			$.each( data, function( i, item ) {
				if( !empty( item.set ) ) {
					$.each( item.set, function( k, set ) {
						var index = product_ids.findIndex(function(n) {
							return n.id == set.item.id;
						});
						if( index > -1 ) {
							product_ids[index].num += set.num;
						} else {
							product_ids.push( { id:set.item.id, num:set.num } );
						}
						//console.log( product_ids )
					});
				}
				if( !empty( item.sub ) ) {
					$.each( item.sub, function( h, sub ) {
						 var index = product_ids.findIndex(function(n) {
							return n.id == sub.item.id;
						});
						if( index > -1 ) {
							product_ids[index].num += sub.num;
						} else {
							product_ids.push( { id:sub.item.id, num:sub.num } );
						}
					});
				}
				if( empty( item.set ) && empty( item.sub ) ) {
					product_ids.push( { id:"9999", num:item.num } );
					product_ids.push( { id:"9999", num:item.num } );
				}				
				product_ids.push( { id:item.item.id, num:item.num } );
			});
			//全部のカウンターをアップデート
			//console.log( product_ids )
			$.each( product_ids, function( j, ids ) {
				var counter = $("#select #select-btn-" + ids.id ).find(".counter");
				counter.find(".count em").text( ids.num );
				counter.show();
				counter.removeClass("up");
			});
			self.counter_timer = $.timer(function(){
				var counter = $("#select #select-btn-" + self.last_select_id ).find(".counter");
				counter.addClass("up");
				this.stop();
			}, 100, 1);
			
		} else {
			$("#select ul").find(".counter").hide();
		}
	}


	/**
	 * リストをセット
	 * @param {Boolean} is_open 起動時かどうか
	 */
	this.updateList = function( e, is_open ) {

		//リストを使うかどうかチェック
		//var temp = self.template[self.select_data.type] || [];
		//if( empty( temp ) || !temp.use_list ) return;
		if( !self.use_list ) return;
		if( !$("#select").isVisible() ) return;

		var id = self.data.id;
		self.cart_data = scope.cart.getCartAryProductIdAll(id);
		
		var ary = self.cart_data;

		$("#select .item-list li").remove();
		if( empty(ary) ) {	
			return;
		} 

		var html = "";

		$.each( ary, function( i, val ) {
			html += '<li><span class="name">';
			var name = val.item.name_1 + val.item.name_2;
			if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
				var name = ( scope.alternate_bol && !empty(val.item.alt_name_1) ) ? val.item.alt_name_1 + val.item.alt_name_2 : val.item.name_1 + val.item.name_2;
			}
			//セット商品
			if( val.set.length ) {
				var set_name = new Array();
				$.each( val.set, function( k, sitem ) {
					var sname = sitem.item.name_1 + sitem.item.name_2;
					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						var sname =  ( scope.alternate_bol && !empty(sitem.item.alt_name_1) ) ? sitem.item.alt_name_1 + sitem.item.alt_name_2 : sitem.item.name_1 + sitem.item.name_2;
					}
					set_name.push( sname );
				});
				name += "/" + set_name.join(",");
			}
			html += name;
			html += '</span>';
			html += '<span class="price">' + val.item.price + '</span>';
			html += '<span class="num">' + val.num + '</span>';
			html += '<span class="delete"><button data-index="' + i + '">×</button></span>';
			html += '<span class="cart_counter"><button class="decrement" data-index="' + i + '">-</button>';
			html += '<button class="increment" data-index="' + i + '">+</button></span>';
			html += '</li>';

			//サブ商品
			if( val.sub.length ) {
				$.each( val.sub, function( b, bitem ) {
					var bname = bitem.item.name_1 + bitem.item.name_2;
					if( !empty( Config.alternate.use_alt ) && Config.alternate.use_alt ) {
						var bname = ( scope.alternate_bol && !empty(bitem.item.alt_name_1) ) ? bitem.item.alt_name_1 + bitem.item.alt_name_2 : bitem.item.name_1 + bitem.item.name_2;
					}

					html += '<li data-index="' + i + '" data-sub="true"><span class="name">　' + bname + '</span>';
					html += '<span class="price">' + bitem.item.price + '</span>';
					html += '<span class="num">' + bitem.num + '</span>';
					html += '<span class="delete"><button data-index="' + i + '" data-sub="' + b + '">×</button></span>';
					html += '<span class="cart_counter"><button class="decrement" data-index="' + i + '" data-sub="' + b + '">-</button>';
					html += '<button class="increment" data-index="' + i + '" data-sub="' + b + '">+</button></span>';
					html += '</li>';
				});
			}
			if( val.selected && self.change_index==-1 ) self.change_index = i;
			
		});	
		$("#select .item-list ul").append( html );

		//increment
		$("#select .item-list li .cart_counter .increment")._click(function(){
			self.change_index = $("#select .item-list li").index( $(this).parents("li") );
			self.incrementItem( $(this).data("index"), $(this).data("sub") );
			//self.setLargeCart();
		});
		//decrement
		$("#select .item-list li .cart_counter .decrement")._click(function(){
			self.change_index = $("#select .item-list li").index( $(this).parents("li") );
			self.decrementItem( $(this).data("index"), $(this).data("sub") );
			//self.setLargeCart();
		});

		//リストの上下
		$("#select .stepbox-bodys .prev")._click(function(){
			self.setListPrev();
		});
		$("#select .stepbox-bodys .next")._click(function(){
			self.setListNext();
		});

		//ハイライト
		if( !is_open ) {
			var item = $("#select .item-list li").eq(self.change_index);
			if( !item.length ) {
				item = $("#select .item-list li").last();
			}
			if( !empty( item ) ) {
				// item.addClass("highlight");
				// var timer = $.timer(function(){
				// 	item.removeClass("highlight");
				// 	this.stop();
				// }, 200, 1);
				$("#select .item-list ul").scrollTop( item.get(0).offsetTop - item.get(0).offsetHeight );
			}		
			self.change_index = -1;
		}
		

		//幅を更新
		//var ow = $("#select .stepbox-bodys .item-list").outerWidth();
		//$("#select .stepbox-bodys").width( ow + self.select_body_width );
		
		//ボタンのセット
		self.setListBtn();
		
		//テキストの更新
		scope.alternate.updateLang();
	}


	/**
	 * 商品の加算
	 * @param {[type]} [index] [cart内のindex]
	 * @param {[type]} [sub] [sub商品かどうか]
	 * @return {[type]} [description]
	 */
	this.incrementItem  = function( index, sub  ) {
		//sub商品かどうか
		index = Number(index);
		var data = self.cart_data[index];
		if( !empty(sub) ) {
			var sdata = data.sub[sub];
			scope.cart.onSubIncrement( data, sdata, index, sub );
		} else {
			scope.cart.onIncrement( data );
		}
	};

	/**
	 * 商品の減算
	 * @param {[type]} [index] [cart内のindex]
	 * @param {[type]} [sub] [sub商品かどうか]
	 * @return {[type]} [description]
	 */
	this.decrementItem  = function( index, sub  ) {
		//sub商品かどうか
		index = Number(index);
		var data = self.cart_data[index];		
		if( !empty(sub) ) {
			var sdata = data.sub[sub];
			scope.cart.onSubDecrement( data, sdata, index, sub );
		} else {
			scope.cart.onDecrement( data );
		}
	};

	/**
	 * [setListBtn ボタンの表示セット]
	 */
	this.setListBtn = function() {

		var list = $("#select .stepbox-bodys .item-list ul");
		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;

		if( list.scrollTop() >= max || sh <= list.get(0).offsetHeight ) {
			$("#select .stepbox-bodys .next").hide();
		} else {
			$("#select .stepbox-bodys .next").show();
		}
		if( list.scrollTop() <= 0 || sh <= list.get(0).offsetHeight ) {
			$("#select .stepbox-bodys .prev").hide();
		} else {
			$("#select .stepbox-bodys .prev").show();
		}
	};

	/**
	 * [setListPrev 前へのボタンクリック]
	 */
	this.setListPrev = function() {
		var list = $("#select .stepbox-bodys .item-list ul");
		var h = list.find("li").first().outerHeight();
		var sh = Math.round( ( list.scrollTop() - h * 1 ) / h );
		// list.animate( { scrollTop:sh*h }, {
		// 	'duration':100,
		// 	'complete':$.proxy( self.setListBtn, self )
		// });
		list.scrollTop( sh*h );
		//list.addClass("scroll").scrollTop( sh*h ).removeClass("scroll");
		self.setListBtn();
	};

	/**
	 * [setListNext 次へのボタンクリック]
	 */
	this.setListNext = function() {
		var list = $("#select .stepbox-bodys .item-list ul");
		var h = list.find("li").first().outerHeight();
		
		var sh = Math.round( ( list.scrollTop() +  h * 1 ) / h );
		// list.animate( { scrollTop:sh*h }, {
		// 	'duration':100,
		// 	'complete':$.proxy( self.setListBtn, self )
		// });
		list.scrollTop( sh*h );
		//list.addClass("scroll").scrollTop( sh*h ).removeClass("scroll");
		self.setListBtn();
	};

	/**
	 * 品切れのチェック
	 * 自身が対象の場合には閉じる
	 */
	this.setStockOut = function() {

		if( empty( self.data ) || !$("#select").isVisible() ) return;

		var stock = ExternalInterface.stock;
		if( stock.indexOf( self.data.id ) != -1 ) self.hide();
		
	}

	/**
	 * 閉じる
	 * @return {[type]} [description]
	 */
	 this.hide = function() {
	 	//$("#select").removeClass("temp-" + self.temp_class)
	 	$("#select").removeClass("select-temp-" + self.temp_class + " select-code-" + self.code_class );
	 	$(document).unbind("CART_UPDATE", self.updateList);
	 	$("#select").hide();
	 }

};;
/**
 * セットメニュー
 */
var SetMenu = function(scope) {

	"use strict";

	var self = this;
	var scope = scope;

	this.product; //選択商品データ
	this.data;  //セットメニューデータ
	this.pattern_data; //パターンデータ
	this.step = 0; //パターンステップ
	this.setmenu_group = 0; //セットメニューグループコード
	this.edit; //変更フラグ

	//チェックアウト
	$(document).bind("MODE_CHANGE CHECKOUT", function() { self.init(); });
	
	//フードロックのイベントリスナー
	$(document).bind("FOOD_STOP", function() { self.hide(); });
	//ドリンクロックのイベントリスナー
	$(document).bind("DRINK_STOP", function() { self.hide(); });
	//オーダーロックのイベントリスナー
	$(document).bind("ORDER_STOP", function() { self.hide(); });

	//閉じるボタン
	$( "#setmenu .close-btn" )._click(function(){
		self.hide();
	});
	
	//単品ボタン
	$( "#setmenu .dummy-btn" )._click(function(){
		//ダミー商品なので、次のステップに移行
		self.step++;
		self.show( self.product );
	});

	//戻るボタン
	$( "#setmenu .prev-step-btn" )._click(function(){
		self.setPrevStep();
	});

	//リストの上下
	$("#setmenu .prev")._click(function(){
		self.setListPrev();
	});
	$("#setmenu .next")._click(function(){
		self.setListNext();
	});

	//リストのスクロールイベント
	$("#setmenu .item-list ul")._scroll( function() {
		self.setListBtn();
	});


	/**
	 * 起動
	 * @return {[type]} [description]
	 */
	this.init = function() {
		self.hide();
	};


	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function( product, edit ) {

		self.product = product;
		if( !empty(edit) ) self.edit = edit;

		//配列を追加
		if( empty( self.product["setmenu"] ) ) {
			self.product["setmenu"] = [];
		}

		//classを削除
		$("#setmenu").removeClass(function(index, className) {
			return (className.match(/\bgr-\S+/g) || []).join(' ');
		});
	
		//セットメニューデータ
		var pattern = scope.menudata.setmenu.pattern;
		$.each( pattern, function( i, val ) {
			if( val.type == "set" && val.id == self.product.item.setmenu ) {
				self.pattern_data = val;
				return false;
			}
		} );

		if( empty( self.pattern_data ) || self.step >= self.pattern_data.step.length ) {
			

			var set_item = [];
			var single_item = [];

			//カートに格納
			if( !empty(self.edit) ) {
				scope.cart.editCart( self.product, self.edit );

			} else {

				//セット注文か単独注文か
				//単品注文はカートにセット
				$.each(self.product.setmenu, function(index, el) {
					var single = el.single; //pattern[el.setmenu_group]["single"];

					if( single ) {
						single_item.push( el );
					} else {
						set_item.push( el );
					}
				});
				self.product.setmenu = set_item;
							
				//単品注文
				if( single_item.length ) {
					$.each(single_item, function(sindex, is_single) {
						//カートにセット
						scope.setProduct( is_single );
					});
				}
							
				//カートにセット
				scope.setProduct( self.product );				

			}


			//メッセージを表示
			var product = self.product;

			var name = product.item.name_1 + product.item.name_2;
			//セット商品
			if( product.set.length ) {
				var set_name = new Array();
				$.each( product.set, function( k, sitem ) {
					var sname = sitem.item.name_1 + sitem.item.name_2;
					set_name.push( sname );
				});
				name += "/" + set_name.join(",");
			}
			if( product.num > 1 ) name += "×" + product.num;

			if( product.sub.length ) {
				var sub_name = new Array();
				$.each( product.sub, function( i, bitem ) {
					var bname = bitem.item.name_1 + bitem.item.name_2;
					bname += "×" + bitem.num;
					sub_name.push( bname );
				});
				name += "/" + sub_name.join(",");
			}

			if( product.setmenu.length || single_item.length ) {

				var ssmenu = Object.clone(product.setmenu);
				ssmenu.add( single_item );
				
				var set_name = new Array();
				$.each( ssmenu, function( h, mitem ) {
					var mname = mitem.item.name_1 + mitem.item.name_2;

					if( mitem.set.length ) {
						var sset_name = new Array();
						$.each( mitem.set,  function( t, mmitem ) {
							var mname = mmitem.item.name_1 + mmitem.item.name_2;
							sset_name.push( mname );
						});

						mname += "/" + sset_name.join(",");
					}

					set_name.push( mname );
				});
				name += "/" + set_name.join(",");
			}

			var timer1 = $.timer( function() {
				var msg =  scope.alternate.getString("select-cartadd-message");
				msg = String(msg).replace( /%item%/gi, name );
				var html = '<div id="select-message"><p>';
				html += msg;
				html += '</p></div>';

				$("#menu-page").append(html);
				var timer = $.timer(function() {
					$("#select-message").remove();
					this.stop();
				}, 3000, 1);

				this.stop();
			}, 100, 1);

			//初期化
			self.step = 0;
			self.pattern_data = null;
			self.hide();

		} else {

			//グループコードを加算
			if( self.step == 0 ) self.setmenu_group++;

			//step商品の表示
			var html = self.createItem( self.pattern_data.step[self.step]["code"] );
			$("#setmenu .item-list ul").html( html );
			$("#setmenu .item-list ul").data( "leng", $("#setmenu .item-list ul li").length );

			//クリックのセット
			$("#setmenu .item-list li").each( function() {
				//クリックイベント
				$(this)._click(function( e ){

					var id = $(this).data("id");
					var data  = scope.menudata.menumst[id];
					
					//セレクトを持っている
					if(!empty(data.select)) {
						scope.select.show( data, true );
						return;
					}
					
					var index = -1;
					$.each( self.product.setmenu, function( i, val ) {
						if( val.item.id == data.id ) {
							//val.num++;
							self.product.setmenu.splice(i,1);
							index = i;
							return false;
						}
					} );
					if( index == -1 ) {
						//self.product配列に追加
						self.product.setmenu.push( { item:data, setmenu_group:self.setmenu_group, set:[], sub:[], num:1, single:self.pattern_data.step[self.step]["single"] } );
					}

					//親にグループコードを付与
					self.product.item["setmenu_group"] = self.setmenu_group;

					//再帰処理
					//一度閉じる？
					if( self.pattern_data.step[self.step]["selecttype"] == "toggle" ) {
						$("#setmenu").hide();
						$.timer( function() {
							this.stop();
							self.step++;
							self.show(self.product);
						}, 100, 1 );
					} else {
						//カウンターのセット
						self.updateCounter();
					}

				}, 2, "mouseup", true); //強制的にクリックにする
			});

			//クローズボタンのテキスト（単品）
			$("#setmenu .dummy-btn").text( self.pattern_data.step[self.step]["dummyname"] );
			$("#setmenu .title").text( self.pattern_data.step[self.step]["text"] );
			
			//表示
			$("#setmenu").show();
			$("#setmenu").addClass( "gr-" + self.pattern_data.id + "-" + self.step );

			self.setListBtn();


			//イベントの発行
			$( document ).trigger("SETMENU_SHOW");
		}
	};


	/**
	 * [createItem description]
	 * @param  {[type]} item [description]
	 * @param  {[type]} key  [description]
	 * @return {[type]}      [description]
	 */
	this.createItem = function( items ) {

		if( !items.length ) return "";

		var html = "";
		$.each( items,  function( i, item ){

			var data = scope.menudata.menumst[item];

			if( empty( data ) ) {
				html += '<li class="dummy"></li>';
				return true;
			}

			var classes = [];
			if( data.nohandle ) {
				classes.push("nohandle");
			}
			if( data.stockout ) {
				classes.push("stockout");
			}
			//セレクトを持っているかどうか
			if( !empty(data.select) ) {
				classes.push("has_select");
			}

			var name_1 = data.name_1;
			var name_2 = data.name_2;
			if( scope.alternate_bol && !empty(data.alt_name_1) ) {
				name_1 = data.alt_name_1;
				name_2 = data.alt_name_2;
			} 
			var name_3 = ( scope.alternate_bol && !empty(data.alt_name_3)  ) ? data.alt_name_3 : data.name_3;
			var text_1 =  ( scope.alternate_bol ) ? data.alt_text_1 : data.text_1;
			var comment_1 =  ( scope.alternate_bol ) ? data.alt_comment_1 : data.comment_1;
			var comment_2 =  ( scope.alternate_bol ) ? data.alt_comment_2 : data.comment_2;
			//オプションテキストを金額として利用する
			var price = priceText(data.price);
			if( !empty(Config.product.option_price_text) && Config.product.option_price_text ) {
				text_1 = "";
				var price = priceText(data.text_1) 
			}

			html += '<li id="product-' + data.id + '" data-id="' + data.id + '" class="product ' + classes.join(" ") + '">';
			html += '<img class="image" src="design_cmn/product/LL/' + data.code + Config.product.type + '" >';
			html += '<span class="name_1">' + name_1 + '</span>';
			html += '<span class="name_2">' + name_2 + '</span>';
			html += '<span class="price">' + price + '</span>';
			html += '<span class="comment_1">' + comment_1 + '</span>';
			html += '<span class="text_1">' + text_1 + '</span>';

			//アイコンのセット
			//詳細アイコン
			//console.log( !empty(data.comment_2) && data.comment_2 != "" )
			if( !empty(comment_2) && comment_2 != "" ) html += '<button class="detail">詳細</button>';
			var icon_path = window.designpath + "icon/LL/icon_";
			if( !empty(data.icon_1) ) html += '<i class="icon_1" style="background-image:url(' + icon_path + data.icon_1 + '.png);"></i>';
			if( !empty(data.icon_2) ) html += '<i class="icon_2" style="background-image:url(' + icon_path + data.icon_2 + '.png);"></i>';
			if( !empty(data.icon_3) ) html += '<i class="icon_3" style="background-image:url(' + icon_path + data.icon_3 + '.png);"></i>';
			
			if( data.nohandle ) {
				html += '<i class="icon_nohandle">' + scope.alternate.getString(".icon_nohandle") + '</i>';
			} else if( data.stockout ) {
				html += '<i class="icon_stockout">' + scope.alternate.getString(".icon_stockout") + '</i>';
			}

			html += '</li>';
		});

		return html;

	};



	/**
	 * [updateCounter description]
	 * @return {[type]} [description]
	 */
	this.updateCounter = function() {

		//$("#setmenu .counter").remove();
		$("#setmenu .product.selected").removeClass("selected");
		var data = self.product.setmenu;
		if( data.length ) {
			//配列の整形　セレクトを排除して数を出す
			var temp_ary = [];
			$.each( data, function( i, item ) {
				var citem = Object.clone( item, true );

				var index = -1;
				$.each( temp_ary, function( k, temp ) {
					if( item.item.id == temp.item.id ) {
						//temp.num += item.num;
						self.product.setmenu.splice(i,1);		
						index = k;
						return false;
					}
				} );
				if( index == -1 ) {
					temp_ary.push( citem );
				}
			});	

			// $.each( temp_ary, function( h, copy_item ) {
			// 	var html = '<span class="counter">';
			// 	html += '<button class="decrement">-</button>';
			// 	html += '<span class="count"><em>' + copy_item.num + '</em></span>';
			// 	html += '<button class="increment">+</button>';
			// 	html += '</span>';
			// 	$("#setmenu #product-" + copy_item.item.id).append(html);
			// });
			
			$.each( temp_ary, function( h, copy_item ) {
				$("#setmenu #product-" + copy_item.item.id).addClass("selected");
			});
		}
	}



	/**
	 * セットメニューのセレクトからの戻り
	 */
	this.endSetSelect = function( data ) {

		//self.product配列に追加
		//self.product.setmenu.push( { item:data.item, setmenu_group:self.setmenu_group, set:data.set, num:data.num } );

		var index = -1;
		$.each( self.product.setmenu, function( i, val ) {
			if( val.item.id == data.item.id ) {
				if( scope.cart.getSameObject( val.set, data.set ) ) {
					val.num++;
					index = i;
				}				
			}
		} );
		if( index == -1 ) {
			//self.product配列に追加
			self.product.setmenu.push( { item:data.item, setmenu_group:self.setmenu_group, set:data.set, sub:[], num:data.num, single:self.pattern_data.step[self.step]["single"] } );
		}
		//親にグループコードを付与
		self.product.item["setmenu_group"] = self.setmenu_group;

		//再帰処理
		//一度閉じる？
		if( self.pattern_data.step[self.step]["selecttype"] == "toggle" ) {
			$("#setmenu").hide();
			$.timer( function() {
				this.stop();
				self.step++;
				self.show(self.product);
			}, 100, 1 );
		} else {
			//カウンターのセット
			self.updateCounter();
		}

	}


	/**
	 * ステップの戻り
	 */
	this.setPrevStep = function() {
		$("#setmenu").hide();

		if( self.step > 0 ) {
			self.step--;
			self.show(self.product);
		} else {
			console.log( self.product )
			if( !empty(self.product.item.select) ) {
				scope.select.show( self.product.item );
			} else {
				self.hide();
			}
		}
	}


	/**
	 * ボタンの表示セット
	 */
	this.setListBtn = function() {

		var list = $("#setmenu .item-list ul");
		var sh= list.get(0).scrollHeight;
		var max = sh - list.get(0).clientHeight;

		if( list.scrollTop() >= max || sh <= list.get(0).offsetHeight ) {
			$("#setmenu .next").hide();
		} else {
			$("#setmenu .next").show();
		}
		if( list.scrollTop() <= 0 || sh <= list.get(0).offsetHeight ) {
			$("#setmenu .prev").hide();
		} else {
			$("#setmenu .prev").show();
		}
	};

	/**
	 *  前へのボタンクリック
	 */
	this.setListPrev = function() {
		var list = $("#setmenu .item-list ul");
		var h = list.find("li").first().outerHeight(true);
		var sh = Math.round( ( list.scrollTop() - h * 1 ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	};

	/**
	 * 次へのボタンクリック
	 */
	this.setListNext = function() {
		var list = $("#setmenu .item-list ul");
		var h = list.find("li").first().outerHeight(true);
		var sh = Math.round( ( list.scrollTop() +  h * 1 ) / h );
		list.scrollTop( sh*h );
		self.setListBtn();
	};


	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#setmenu").hide();
		self.step = 0;
		self.pattern_data = null;
		self.edit = null;
	};

};;
/**
 * バッテリー・無線
 * @param {[type]} scope [description]
 */
var Stat = function( scope ) {

	var self = this;
	var scope = scope;
	
	this.init_bol = false;
	this.ac_charge = true;
	this.battery_timer;
	this.battery_lock;
	this.battery_alert_sound;

	this.touch_count = 0;
	this.touch_counter = $.timer(function(){
		self.touch_count = 0;
		this.stop();
	}, 2000);

	//アイコンを3回クリックで無線再取得
	$("#stat")._click(function(){
		self.touch_count++;
		if( self.touch_count  > 2 ) {
			self.touch_count = 0;

			//ファーストオーダーを解除する
			if( scope.first_order ) {
				scope.log.send("0","ファーストオーダー,バッテリーアイコンクリックでチェックアウトします。" );
				scope.first_order = false;
				$( "#ordercheck-btn, #staff-call, #accounting-call" ).attr("disabled", false);
				ExternalInterface.doCheckin(scope.tableNo, "", scope.person ,"0","000", Config.terminal_checkin.first_order.mode ,"    ","0","0","0");
			}

			scope.refleshWlanStat();
			self.touch_counter.stop();
			self.touch_count = 0;
		}
		self.touch_counter.play();
	});


	this.init = function() {

		//タッチでsound4をロード
		if( !self.init_bol ) {
			//カートアラートのサウンドをロードのためにセット
			$("body,#main").bind("mousedown touchdown", function() {
				$("body,#main").unbind("mousedown touchdown");
				$("#sound4").get(0).load();
				self.init_bol = true;
			});
		}

	};

	/**
	 * バッテリーのセット
	 * @param {[type]} data [description]
	 */
	this.setBattery = function( data ) {

		if( !Config.stat.battery ) return;

		var value = Number( data.batteryLifePercent );
		var battery = $("#stat .battery");
		battery.removeClass("cation denger charge");

		//充電中かどうか
		if( data.acLineStatus == "1" ) {
			battery.addClass("charge");
			if( !self.ac_charge ) {
				scope.log.send("0","BATT,AC稼働に切り替わりました:" + data.batteryLifePercent);
				self.ac_charge = true;
				if( scope.message.message_code == "battery_alert" || scope.message.message_code == "battery_timeup" ) {
					scope.message.hide("battery_alert");
					scope.message.hide("battery_timeup");

					if( !empty(scope.battery_alert_sound) ) {
						scope.battery_alert_sound.stop();
					}

					//スクリーンセーバーの再開
					scope.timerStart();
				}
				if( !empty(self.battery_timer) ) {
					self.battery_timer.reset().stop();
				}
			}
		} else {
			battery.removeClass("charge");
			if( self.ac_charge ) {
				scope.log.send("0","BATT,バッテリ駆動に切り替わりました:" + data.batteryLifePercent);
				self.ac_charge = false;
				//バッテリーアラートの開始
				if( Config.stat.batt_alert.enable ) {
					if( !empty(self.battery_timer) ) {
						self.battery_timer.reset().stop();
					}
					self.battery_timer = $.timer( function() {
						scope.message.show("battery_timeup", null, null, null, true);
						scope.log.send("0","BATT,クレードル警告画面表示:" + data.batteryLifePercent);
						//スクリーンセーバーの停止
						scope.timerStop();

						//サウンドの再生
						scope.battery_alert_sound = $.timer(function() {
							$("#sound4").soundPlay();
						}, 10000, 1);
						$("#sound4").soundPlay();

						this.stop();
					},  Config.stat.batt_alert.interval, 1 );
				}
			}
			//バッテリー残量が10%以下だったら警告を出す
			if( value <= 20 ) {
				scope.log.send("0","BATT,バッテリが20％切りましたので警告画面表示します:" + data.batteryLifePercent);
				scope.message.show("battery_alert", null, null, null, true);
				//サウンドを再生
				$("#sound4").soundPlay();
				self.battery_lock = true;
				
				if( !empty(self.battery_timer) ) {
					self.battery_timer.reset().stop();
				}
			}
		}

		if(  value > 30 && self.battery_lock ) {
			scope.message.hide("battery_alert");
			self.battery_lock = false;
		} 

		var battery_output_value = value; //Math.floor( (( value - 20 ) / 80 ) * 100 );
		
		//バッテリーの残量
		if( battery_output_value < 40 ) {
			battery.addClass("denger");	
		} else if(  battery_output_value < 60 ) {
			battery.addClass("cation");
		}
		battery.show();

		//バッテリー残量の表示		
		$("#stat .battery_text").text( battery_output_value + "%" ).show();

		//log
		scope.log.send("0","BATT,バッテリ残量:" + data.batteryLifePercent + ",AC電源状態:" + data.acLineStatus + ",残り時間:" + data.batteryLifeTime);
	};

	/**
	 * 無線のセット
	 * @param {[type]} data [description]
	 */
	this.setWlan = function( data ) {

		if( !Config.stat.wlan ) return;

		var value = Number( data.level );
		var wlan = $("#stat .wlan");
		wlan.removeClass("cation denger none");
		var status = "高";
		switch(value) {
			case 3:
				break;
			case 2:
				wlan.addClass("cation");
				status = "中";
				break;
			case 1:
				wlan.addClass("denger");
				status = "弱";
				break;
			case 0:
				wlan.addClass("none");
				status = "圏外";
				break;
		}
		wlan.show();

		scope.log.send("0","WLAN,無線状態:" + status + "/" + value);
	};

};;/**
	卓番設定画面
*/
var TableNoSetup = function( scope ) {

	var self = this;
	var scope = scope;

	this.table_no; //卓番

	//ステップボタン
	this.step_btn_num = $( ".table-setup-btn" ).length;
	this.step = 0;
	this.btn_click = false; //クリック後にフラグ有効

	//stepリセット用のボタン
	$(document).bind("TIMER_RESET", function() {
		//自身のボタンの場合にはリセットしない
		if(!self.btn_click) {
			self.step = 0;
			$( ".table-setup-btn" ).hide().eq(0).show();
		}
	});
	//卓番号呼び出し
	$( ".table-setup-btn" )._click( function(){
		var timer = $.timer( function() {
			self.btn_click =  false;
			this.stop();
		}, 100, 1 );
		self.btn_click =  true;
		self.setStep( $(this) );
	});
	$( ".table-setup-btn" ).hide().eq(0).show();

	//設定ボタン
	$("#table-no-setup .set")._click( function() {
		self.setTable( 0 );
	});
	//チェックインボタン
	$("#table-no-setup .checkin")._click( function() {
		self.setTable( 1 );
	});
	
	//チェックインボタンのセット
	if( Config.tableno_setup && !Config.tableno_setup.checkin ) {
		$("#table-no-setup .checkin").remove();
	}

	/**
		ステップボタンのクリック
	*/
	this.setStep = function( btn ) {
		var index = btn.data("index");
		if( self.step+1 == index ) {
			self.step = index;
			//次のステップを有効化
			$( ".table-setup-btn" ).eq(self.step).show();
			if( index == self.step_btn_num ) {
				//ステップの完了
				//卓番号のリリースと卓番号リストの取得
				scope.setReleaseTableNo();
				self.step = 0;
				$( ".table-setup-btn" ).hide().eq(0).show();
			}
		} else {
			self.step = 0;
			$( ".table-setup-btn" ).hide().eq(0).show();
		}
	};

	/**
		起動
	*/
	this.show = function() {
		//卓番リストの取得
		var path = (Config.islocal) ? "get_table_list.xml" : "get_table_list";
		var loaderObj = new Loader();
		var data = {};
		data.KEY = "3"; //固定で3
		loaderObj.load( window.apppath + path, data, self.loadedList, 'xml' );
		scope.message.show("loading");
		//ボタンを選択するまではdisabledにする
		$("#table-no-setup").find(".set, .checkin").attr("disabled", "disabled");
	};

	/**
		リストの取得完了
	*/
	this.loadedList = function( data ) {

		scope.message.hide();
		if( !data ) {
			//error
			scope.message.show("5211","get_table_list");
			return;
		}

		//ボタンを作成
		var tables = $(data).find("tablelist table");
		var html = "";
		$.each( tables, function( i, table ) {
			var no = $(table).attr("no");
			html += '<button data-id="' + no + '">' + no + '</button>';
		});
		$("#table-no-setup .box").html( html );

		//クリックのセット
		$("#table-no-setup .box button")._click( function() {
			$( "#table-no-setup .box .selected" ).removeClass("selected");
			self.table_no = $(this).data("id");
			$(this).addClass( "selected" );
			//ボタンを有効にする
			$("#table-no-setup").find(".set, .checkin").removeAttr("disabled");
		});

		//表示
		$("#table-no-setup").show();
	};


	/**
		設定要求
		@checkin チェックインするかどうか 1 : 0
	*/
	this.setTable = function( checkin ) {

		var path = (Config.islocal) ? "get_table_no.xml" : "get_table_no";
		var loaderObj = new Loader();
		var data = {};
		data.TABLE_NO = self.table_no;
		data.CHECKIN = checkin;
		loaderObj.load( window.apppath + path, data, self.loadedTable, 'xml' );
		scope.message.show("loading");

		scope.log.send("0","卓番設定,卓番号の設定します。,卓番号" + self.table_no + ",チェックイン:" + checkin );

	}

	/**
		設定完了
	*/
	this.loadedTable = function( data ) {
		scope.message.hide();
		if( !data ) {
			//error
			scope.message.show("5209","get_table_no");
			//設定はできていないので閉じない
			return;
		}
		$("#table-no-setup").hide();
	};
};;
/**
 * ボリューム
 */
var Volume = function(scope) {

	var self = this;
	var scope = scope;

	this.vol; //ボリューム

	//クリックイベント
	$("#volume-btn")._click(function() {
		self.show();
		$(this).hide();
	});

	//アップボタン
	$("#volume .up")._click(function() {
		self.setVolume( Config.volume.vol );
	});
	//ダウンボタン
	$("#volume .down")._click(function() {
		self.setVolume( Config.volume.vol * -1 );
	});

	//チェックイン
	$(document).bind("CHECKIN", function() { self.init(); } );

	//無効化
	if( !Config.volume.enable ) {
		$("#volume-btn").remove();
	}

	/**
	 * 
	 */
	this.init = function() {
		//初期セット
		self.vol = Config.volume.default;

		//バグがあるのでセットしない
		//self.setVolume(0);
	};


	/**
	 * 表示
	 * @return {[type]} [description]
	 */
	this.show = function() {
		
		var timer = $.timer( function(){
			var event = ( $(window).isTablet() ) ? "touchstart" : "mousedown";
			$("body").bind( event, function( e ){
				if( !$(e.target).hasClass("up") && !$(e.target).hasClass("down") ) {
					self.hide();
					$("body").unbind(event);
				} else {
					return;
				}
			});
			this.stop();
		}, 100 , 1 );
		
		$("#volume").show();

	};

	/**
	 * ボリュームのセット
	 * @param {[type]} add 調整量
	 */
	this.setVolume = function( add ) {
		//console.log( self.vol, add )
		self.vol += add;
		if( self.vol > 1 ) self.vol = 1;
		if( self.vol < 0 ) self.vol = 0;

		$(".sound").each( function() {
			$(this).get(0).volume = self.vol;
		});

		var sound = "volume0";
		if( self.vol > 0.9 ) {
			sound = "volume3";
		} else if( self.vol > 0.6 ) {
			sound = "volume2";
		} else if( self.vol > 0.1 ) {
			sound = "volume1";
		}
		$(".volume").removeClass("volume0 volume1 volume2 volume3").addClass(sound);
	};

	/**
	 * 
	 */
	this.hide = function() {
		$("#volume").hide();
		$("#volume-btn").show();
	};
};/**
	いらっしゃいませ画面
*/
var Welcome = function( scope ) {

	var self = this;
	var scope = scope;

	this.message;

	//初期化イベントリスナー
	$(document).bind("BOOT", function(){
		self.init();
	});

	//チェックイン要求ボタン
	$( "#welcome .do-checkin" )._click(function() {
		if( !Config.terminal_checkin.enable ) {
			//チェックイン確認要求
			scope.setNotifyCheckin();
		} else if( Config.terminal_checkin.inp_number ) {
			self.showPersonInput();
		} else {
			scope.setRequestCheckin();
		}
	});
	
	//スタッフコール
	$("#welcome .staffcall")._click(function(){
		if( Config.staffcall.confirmWin ) {
			//確認画面の表示
			scope.message.confirm( "staffcall_confirm", function() {
				self.setStaffCall();
			});
		} else {
			self.setStaffCall();
		}
	});

	//文字色クラスをセット
	if( !empty( Config.message ) ) {
		$("#welcome").find("#welcome-text, .ad-message").addClass( Config.message.text_class );
	}


	/**
		起動
	*/
	this.init = function() {
		//人数入力をセット
		self.setPersonInput();
		$("#person-input").hide();
	};

	/**
		show
	*/
	this.show = function() {
		$("#welcome").show();
		self.step = 0;
		//店舗メッセージの表示
		self.setAdMessage();
		//スタッフコールのセット
		if( !Config.staffcall.enable || !Config.welcome.staffcall_enable ) {
			$("#welcome .staffcall").remove();
		}

		//トリガー
		$(document).trigger("WELCOME_SHOW");
	};

	/**
	 * メッセージの更新
	 */
	this.setAdMessage = function() {
		//表示の切り替え
		if( empty( Config.fcategory_top.admessage ) || Config.welcome.admessage.enable ) {
			$("#welcome .ad-message").show();
		} else {
			$("#welcome .ad-message").hide();
		}

		//店舗メッセージの表示
		var str = ExternalInterface.message;
		if( empty(str) || scope.alternate_bol ) {
			//代替言語の場合はデフォルト値を表示する
			str = scope.alternate.getString("admessage");	
		}
		str = str.replace(/&#10;|\n/g, '<br>');
		$("#welcome .ad-message").html( str );
		self.message = str;
	}


	/**
	 * 人数入力
	 */
	this.setPersonInput = function() {

		//ボタンの生成
		html = "";
		for( var i=0; i<=9; i++ ) {
			var n = i+1;
			if( n == 10 ) n =0;
			html += '<button class="btn-' + n + '" data-key="' + n + '">' + n + '</button>';
		}
		html += '<button class="delete" data-key="delete">×</button>';
		$("#person-input .box").html(html);

		//クリックのセット
		$("#person-input .box button")._click(function(){
			var target = $("#person-input");
			var key = $(this).data("key");
			if( key == "delete" ) {
				target.find(".inputs").val( '' );
				target.find(".box button").removeAttr( "disabled" );
				target.find(".checkin, .delete, .btn-0").attr( "disabled", true );
			} else {
				var leng = target.find(".inputs").val().length;
				if( leng >= 2 ) {
					return;
				}

				var txt = target.find(".inputs").val() + key;
				target.find(".inputs").val( txt );
				target.find(".checkin, .delete, .btn-0").removeAttr( "disabled" );
				
				//人数の上限
				var num = Number( target.find(".inputs").val() );
				var last = Config.terminal_checkin.max_num || 10;
				num = ( num ) * 10;
				var max = Math.max( last - num, 0 );

				if( num > last ) target.find(".box").find(".btn-0").attr("disabled",true);
				target.find(".box button").each( function(){
					var key = $(this).data("key");
					if( isNaN( key ) ) return true;
					if( key > max ) {
						$(this).attr("disabled",true);
					} 
				});
			}
		});

		//チェックインのクリック
		$("#person-input .checkin")._click(function() {
			var val = $("#person-input .inputs").val();
			scope.setRequestCheckin( val );
			$("#person-input .box .delete")._click();
			$("#person-input").hide();
		});
		
		$("#person-input").find(".checkin, .delete, .btn-0").attr( "disabled", true );

		//戻るボタンのクリック
		$("#person-input .close")._click(function() {
			$("#person-input .box .delete")._click();
			$("#person-input").hide();
		});

	}


	/**
	 * 人数入力
	 */
	this.showPersonInput = function() {
		$("#person-input").show();
	}


	/**
	 * スタッフコール
	 */
	this.setStaffCall = function() {
		scope.staff_call.loginCall(function(){
			scope.message.show("staffcall_complete");
			var timer = $.timer(function(){
				scope.message.hide();
				this.stop();
			}, 3000, 1);
		},function(){
			scope.message.show( "staffcall_error",  "exec_order" );
		});
	}	


	/**
	 * 非表示
	 * @return {[type]} [description]
	 */
	this.hide = function() {
		$("#welcome").hide();
		$("#person-input").hide();
		self.step = 0;
	};
}