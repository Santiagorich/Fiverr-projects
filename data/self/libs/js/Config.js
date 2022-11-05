/**
 * 各種設定
 * FREE
 * @return {[Object]} Configで参照可能
 */
var Config = (function() {

	"use strict";

	var config = {

		shop:{ //業態定義 
			size:"vertical",
			color:"turmeric", //champagne,tonic,sesame,sakura,saffron,turmeric,vanilla,marin,laurier,cumin
			css:[
				//"libs/css/325.css",
				//"libs/css/shop/layout.css",
			],
			js:[
				"libs/js/VerticalLayout.js",
				"libs/js/Custom.js"
			],
		},

		islocal:false, //ローカルモード
		debug:false, //デバッグモード

		window_fit:false, //画面にサイズをフィットさせる
		fullscreen:false, //フルスクリーン
		pinch_in:{ //拡大縮小
			enable:true,
			max_scale:2, //拡大最大値
		},
		mousedown:true, //マウスダウンで反応させるかどうか
		flick:{
			enable:false, //フリックをするかどうか
			scroll:true, //フリックしない場合の処理(スクロールする)
			vertical:true, //スクロール方向を縦にするかどうか
			movetime:0, //フリックの移動時間（ミリ秒）325の端末の場合には0にすること
		},
		billboard:{ //ショップ情報
			enable:true,
			banners:[ //情報リスト
			],
		},
		alternate:{ //多言語設定
			//利用停止はsysの設定で上書きされます
			enable:true,
			button_enable:false, //ボタンを表示するかどうか
			default:'jp',
			language:[
			],
		},
		product_select:{ //商品選択
			animate:false, //商品選択時にアニメーションするか
			cart:"panel", //格納先カート panel or small
		},
		cart: { //カート
			panel_cart:{ //パネルカート
				enabe:false,
				total:3,
				product_all:false,
				total_price:false,
			},
			normal_cart: {
				enable:false,
				total_price:false,
			},
			smallcart: {
				enable:true,
				catch:{ //スモールカートキャッチ画像
					enable:false,
					time:10000
				}
			},
			timeup_alert: { //カートタイムアップアラート
				enable:true,
				time:120000, //アラート待機時間（ミリ秒）
			} 
		},
		order_confirm:{ //注文確認画面
			enable:true,
			total_price:true,
			alcohol:true //アルコール商品の警告
		},
		exec_order:{ //注文
			checkin_request_enable:false, //リクエストチェックインで要求する
			use_table_no:true, //オーダー時に卓番を送信する
			single_mode:true, //シングルモード（商品を個別に送信）
		},
		orderdate_insert:true, //2重オーダー日付パラメータの有無
		order_complete:{ //注文完了画面
			auto_close:true, //自動でクローズする
			close_time:10000, //クローズ時間(ミリ秒)
			view_top:true, //オーダー完了後にトップを表示する
		},
		party_timer:{ //制限時間表示
			current_time:true, //現在時間の表示
			countdown:15, //ラストオーダーまでのカウントダウン（分）
			staffcall:true, //ラストオーダー時のスタッフコール
		},
		check_order:{ //注文確認
			enable:true,
			price:true, //金額の表示
			status:false, //ステータスの表示
			sabiari:"8001", //さびあり（表示しない）code || null
			sabinuki:"8002", //さびぬき（親商品に名前をつけます）code || null
			supply:{ //提供済みアイコン
				enable:true,
				type:1 //1:画像, 2:テキスト
			},
			not_offered:{ //未提供アイコン
				enable:true,
				type:1
			},
			excluded:{ //提供済み対象外アイコン
				enable:true,
				type:1
			},
			refill: false, //おかわりの表示
			keep:true, //チックオーダーキープの利用
			total_include_tax:false, //強制税込みにするかsysに順ずるか
		},
		product:{ //商品情報
			type:".png", //画像商品タイプ
			default_image:"design_cmn/UI/ng.png", //デフォルト画像の位置
			//（セレクトの範囲、コンテンツの範囲）
			select_from:"8000", //セレクトの開始
			select_to:"8999", //セレクトの終了
			contents_from:"9000", //コンテンツの開始
			contents_to:"9999" //コンテンツの終了
		},
		menubody:{
			include_select:{
				select:[],
				add_price:true, //親商品の値段にセレクトの商品価格を追加するかどうか
			},
			page_navi_mousedown:true, //ページナビのクリックイベントをマウスダウンにする
			page_navi_pager:{ //メニューナビ内のページャー
				enable:false,
				total_type:"total", //表示数 page:中カテ内のトータル数,total:全ページ数
			},
			item:{
				stockout_hide:false, //品切れ商品を表示しない
				nohandle_hide:false, //取り扱い無し商品を表示しない
			},
		},
		select:{ //セレクト
			template:{ //テンプレート定義
				"001":{ 
					//リストを表示しない
					//1ステップのみの場合
					step_hide:false, //ステップごとに非表示にするかどうか
					useadd_btn:true, //決定ボタンを使用するか
					use_list:false, //リストを使うかどうか
					close:true, //選択後にクローズする
				},
				"002":{
					//リストを表示しない
					//幅50％
					step_hide:false, //ステップごとに非表示にするかどうか
					useadd_btn:true, //決定ボタンを使用するか
					use_list:false, //リストを使うかどうか
					close:true, //選択後にクローズする
				},
				"003":{ 
					//リストを表示する
					step_hide:true, //ステップごとに非表示にするかどうか
					use_list:true, //リストを使うかどうか
					useadd_btn:true, //決定ボタンを使用するか
					close:true, //選択後にクローズする
				},
			},
		},
		arrival:{ //到着案内
			enable:true, //到着案内を使用
			autoclose:-1, //自動でクローズする時間
			arrived_enable:true, //返却案内を表示しない
			exec_type:"SLIP_NO", //返却要求方法
			exec_id:"9902", //返却商品ID
			request:"SERVER", //返却要求先
			interval:3000 //到着案内のデータ受信のインターバル時間
		},
		game:{ //ゲーム
			enable:true,
			auto_start:true, //注文後に自動で起動する
			exec_type:"SLIP_NO", //返却要求方法
		},
		stat:{ //バッテリー・無線LAN
			battery:true,
			batt_alert:{ //バッテリーアラート
				enable:true,
				interval:600000,
			},
			wlan:true,
			wlan_update_timer:10000,
		},
		welcome:{ //いらっしゃいませ画面
			staffcall_enable:true,
			admessage: {
				enable:false, //いらっしゃいませ画面に店舗メッセージを表示しない
			}
		},
		login:{ //利用開始画面
			enable:false,
			wlan_update:true,
		},
		fcategory_top:{ //大カテゴリートップ
			image_type:".png", //トップボタン画像の拡張子
			refill: { //おかわり
				enable:true,
				drink:true, //ドリンク商品の表示
				food:true, //フード商品の表示
				order:true, //選択後にオーダー（注文確認画面を表示）
			},
			recommend:{ //おすすめ
				enable:true,
				code:null, //カテゴリーコード codeがnullの場合にはitem_codeの商品を表示
				item_code:[], //商品ID配列
			},
			timer: { //無操作でトップを表示する
				enable:true,
				time:30, //無操作時間（秒）
			},
			page_jump:[/*"111","112"*/], //ページジャンプ（小カテコード）
			alternate:{
				enable:true, //トップページに多言語ボタンを設置
			},
			staff:{
				enable:true, //トップページのカテゴリーボタンにスタッフ呼び出しボタンを設置
			},
			search:{
				enable:true, //トップページのカテゴリーボタンに商品検索ボタンを設置
			},
			banner:{
				enable:true, //トップページにバナーボタンを表示するかどうか
			},
			admessage: {
				enable:false, //トップページに店舗メッセージを表示しない（寿司）
			}
			
		},
		number_input:{ //番号入力
			enable:false, //番号入力に大カテトップを切り替えます
			search_page:true, //ページに配置されている商品から検索する
			num_counter:false, //数量選択をカウンターにする
			no_use_keypad:true　//番号入力を電卓型配置にする
		},
		category:{ //カテゴリー
			page_animate:{ //カテゴリー表示後の商品画像のアニメーション
				enable:false, // スクロールがカクつくので注意！
				time:5000, //アニメーションまでの時間
			},
			btn_click:true, //ボタンをtouchupにする（verticalはtrue）
		},
		scategory:{ //中カテゴリー
			pager:false, //ページャーの表示
			pager_animate:false, //ページャーのアニメーション
			top_enable:false, //中カテトップを使うかどうか
			image_type:".png", //中カテトップボタン画像の拡張子
		},
		request_checkout:{ //消しこみ・チェックアウト要求
			enable:false,
			delete:true, //消しこみを有効
			checkout:true, //チェックアウトを有効
		},
		account_division:{ //割り勘
			enable:true, //割り勘を有効
			price_raund:500, //プライスの刻み金額
		},
		counter:{ //カウンター（V2）
			enable:true,
			animate:false,
			delay:10,
		},
		first_category:{ //味噌茶のページ表示（旧レコメンド）
			enable:false,
			code:"213", //表示カテゴリー
		},
		search:{ //商品検索
			enable:true,
			btn_enable:false, //ボタンを表示するかどうか
			number:true, //番号検索
			number_match:true, //番号の完全一致で検索するかどうか
			hiragana:true, //ひらがな検索
			hiragana_50:true, //ひらがなを50音表示にするかどうか
			search_btn:true, //検索ボタンを使うかどうか（リストアップデートのイベント）
		},
		page_search:{ //ページ検索
			enable:false,
		},
		volume:{ //ボリューム設定
			enable:false,
			vol:0.3, //上下のボリューム移動量 0.1～1;
			default:0.5, //ボリュームの初期値 0～1;
		},
		tableno_setup: {
			checkin:true, //チェックインボタンの表示
		},
		message: {
			text_class:"white", //文字
		},
		//sys系
		max_value:{ //カート上限 sysの設定が反映されます
			total:30,
			subtotal:20,
			alert:15,
			max_value_msg:true, //カートがいっぱいのメッセージ表示
		},
		timer:{ //ロードタイムアウト時間 sysの設定が反映されます
			servlet:40000,
			xml:200000,
			boot:30000, //起動時のおちください表示タイマー（トップ画像ロードタイマー）
		},
		displayTableInfo:true, //卓番の表示 sysの設定が反映されます
		include_tax:{ //税込表示 sysの設定が反映されます
			enable:true,
			type:1,
		},
		custompage:{ //おすすめ
			enable:true,
			type:"recommend", // [dairy,fair,recommend] sysの設定が反映されます
			daily:"920",  //category.code
			fair:"930", //category.code
			recommend:"910", //category.code
			btn_hide:true, //ボタンを表示するかどうか
		},
		staffcall:{ //スタッフコール
			enable:true, //sysの設定が反映されます
			id:"9900", //sysの設定が反映されます
			confirmWin:true,
			exec_type:"SLIP_NO",
			auto_close:true, //呼び出し完了画面を自動で閉じるかどうか
			close_time:3000, //自動で閉じる時間
			btn_enable:false, //画面表示ボタンを表示するかどうか（トップで表示する場合にはfalse）
		},
		accountingcall:{ //会計呼び出し
			enable:true, //sysの設定が反映されます
			id:"9900", //sysの設定が反映されます
			confirmWin:true,
			exec_id:"accounting",
			exec_type:"SLIP_NO",
			auto_close:true, //呼び出し完了画面を自動で閉じるかどうか
			close_time:3000, //自動で閉じる時間
		},
		terminal_checkin:{
			enable:true, //端末チェックイン sysの設定が反映されます
			interval:5000, //再リクエストのインターバル
			inp_number:true, //人数入力のセット　sysの設定が反映されます
			max_num:30, //最大入力可能値
			first_order: {
				enable:true, //ファーストオーダー選択後に商品と一緒に送信する
				mode:"01", //初期表示のメニューのモード
			}
		}
	}
	
	return config;

})();