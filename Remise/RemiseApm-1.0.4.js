/* RemiseApm ver.1.0.4 Copyright© 2020 REMISE Corporation. All Rights Reserved. */
var REMISE_APM_DEBUG_MODE = true;
var RemiseApmSelf;
(function (window) {

    function ApmDriver() {
        // プロパティ
        this.HttpUrl        = "";
        this.HttpTimeout    = "";
        this.PollingTime    = "";
        this.Callbacks      = {};

        // イベント
        this.OnTerminalResult   = null;
        this.OnCancelErrorResult= null;
        this.OnProcessingStatus = null;

        RemiseApmSelf = this;
    }

    ApmDriver.prototype = {
        DEFAULT_PORT_NO:        8001,
        DEFAULT_PORT_NO_SSL:    10443,
        DEFAULT_HTTP_TIMEOUT:   5000,
        DEFAULT_POLLING_TIME:   100,

        // 処理区分
        JOB_TYPE_CAPTURE:   "CAPTURE",
        JOB_TYPE_RETURN:    "RETURN",
        JOB_TYPE_VOID:      "VOID",
        JOB_TYPE_CHECK:     "CHECK",

        // 機能コード（決済方法）
        PAYMENT_TYPE_TERMINAL_STATUS_CHECK:     "3000",
        PAYMENT_TYPE_TERMINAL:                  "3001",
        PAYMENT_TYPE_TERMINAL_RESULT:           "3002",
        PAYMENT_TYPE_TERMINAL_CANCEL:           "3008",
        PAYMENT_TYPE_TERMINAL_APP_CHECK:        "3100",

        PAYMENT_TYPE_CARD_APP_INSTALL_CHECK:    "4000",
        PAYMENT_TYPE_CARD:                      "4001",
        PAYMENT_TYPE_CARD_RESULT:               "4002",
        PAYMENT_TYPE_CARD_CANCEL:               "4008",
        PAYMENT_TYPE_CARD_TRAN_CHECK:           "4100",

        PAYMENT_TYPE_POINT_APP_INSTALL_CHECK:   "4200",
        PAYMENT_TYPE_POINT:                     "4201",
        PAYMENT_TYPE_POINT_RESULT:              "4202",
        PAYMENT_TYPE_POINT_CANCEL:              "4208",

        PAYMENT_TYPE_QR_APP_INSTALL_CHECK:      "5000",
        PAYMENT_TYPE_QR:                        "5001",
        PAYMENT_TYPE_QR_RESULT:                 "5002",
        PAYMENT_TYPE_QR_CANCEL:                 "5008",
        PAYMENT_TYPE_QR_TRAN_CHECK:             "5100",

        PAYMENT_TYPE_EMONEY_APP_INSTALL_CHECK:  "6000",
        PAYMENT_TYPE_EMONEY:                    "6001",
        PAYMENT_TYPE_EMONEY_RESULT:             "6002",
        PAYMENT_TYPE_EMONEY_CANCEL:             "6008",
        PAYMENT_TYPE_EMONEY_BALANCE:            "6021",
        PAYMENT_TYPE_EMONEY_BALANCE_RESULT:     "6022",
        PAYMENT_TYPE_EMONEY_BALANCE_CANCEL:     "6028",
        PAYMENT_TYPE_EMONEY_HISTORY:            "6031",
        PAYMENT_TYPE_EMONEY_HISTORY_RESULT:     "6032",
        PAYMENT_TYPE_EMONEY_HISTORY_CANCEL:     "6038",
        PAYMENT_TYPE_EMONEY_TRAN_CHECK:         "6100",

        PAYMENT_TYPE_TERMINAL_RESTART:          "1005",
        PAYMENT_TYPE_DAILY_TOTAL:               "1100",
        PAYMENT_TYPE_ABNORMAL_UNLOCK:           "1200",
        PAYMENT_TYPE_APP_RESTART:               "2005",
        PAYMENT_TYPE_CONNETION_CHECK:           "2200",

        // 処理結果
        RESULT_STATUS_SUCCESS:                      "0000",
        RESULT_STATUS_CANCELED_IN_TERMINAL:         "0001",
        RESULT_STATUS_CANCELED_IN_HOST:             "0002",
        RESULT_STATUS_MAINTENANCE:                  "0003",
        RESULT_STATUS_ERROR_INTERMINAL:             "0009",
        RESULT_STATUS_NOT_FOUND_ORDER:              "0010",
        RESULT_STATUS_NOT_INSTALLED:                "1001",
        RESULT_STATUS_NOT_PROCESSING:               "1002",
        RESULT_STATUS_PROCESSING:                   "1003",
        RESULT_STATUS_SUCCESS_TO_STOP:              "1100",
        RESULT_STATUS_PROCESSING_TO_STOP:           "1103",
        RESULT_STATUS_ERROR_TO_STOP:                "1104",
        RESULT_STATUS_TIMEOUT_TERMINAL_CONNECTION:  "TIMEOUT",
        RESULT_STATUS_INVALID_INPUT_PARAMETER:      "7000",
        RESULT_STATUS_ABNORMAL_TRANSACTION_ERROR:   "9500",
        RESULT_STATUS_UNEXPECTED_ERROR:             "9999",

        // 初期設定
        SetConnectionSetting : function(p, rEvt, ceEvt, psEv) {
            trace("〇SetConnectionSetting");
            trace(p);
            const protocol = p.UseSSL === true ? "https" : "http";
            if (p.HttpAddress !== undefined && p.HttpAddress != null) {
                if (p.HttpAddress.indexOf('http') >= 0) {
                    this.HttpUrl = p.HttpAddress;
                }
                else if (p.HttpAddress.indexOf(':') > 0) {
                    this.HttpUrl = protocol + "://" + p.HttpAddress;
                }
                else {
                    const port = p.UseSSL === true ? this.DEFAULT_PORT_NO_SSL : this.DEFAULT_PORT_NO;
                    this.HttpUrl = protocol + "://" + p.HttpAddress + ":" + port;
                }
            }
            this.HttpTimeout = this.getValue(p.HttpTimeout, this.DEFAULT_HTTP_TIMEOUT);
            this.PollingTime = this.getValue(p.PollingTime, this.DEFAULT_POLLING_TIME);

            if (rEvt) {
                this.OnTerminalResult = rEvt;
            }
            if (ceEvt) {
                this.OnCancelErrorResult = ceEvt;
            }
            if (psEv) {
                this.OnProcessingStatus = psEv;
            }
        },

        // 決済端末連携処理
        CallTerminal: function(p) {
            trace("●CallTerminal");
            trace(p);

            var requestData = {
                "UID":          this.getUUID(),
                "FUNC":         this.getValue(p.PaymentType,    ""),
                "ORDERID":      this.getValue(p.OrderId,        ""),
                "JOB":          this.getValue(p.JobType,        ""),
                "AMOUNT":       this.getValue(p.Amount,         ""),
                "MACHINE_CODE": this.getValue(p.MachineCode,    ""),
                "CANTRANID":    this.getValue(p.CanTranId,      ""),
                "TRANID":       this.getValue(p.TranId,         ""),
                "JOBID":        this.getValue(p.JobId,          ""),
                "OFFLINE":      (this.getValue(p.IsOffline, false) === true) ? "1": ""
            };

            this.sendData(requestData);
        },

        // 通信処理
        sendData: function(requestData) {
            trace("□sendData");
            trace("URL:" + this.HttpUrl + " data:" + JSON.stringify(requestData));
            var callback = "remiseApmCallback" + requestData.FUNC;
            try {
                if (this.Callbacks[callback] !== undefined && this.Callbacks[callback] != null) {
                    remiseApmCallback({
                        FUNC: requestData.FUNC,
                        FUNC_STATUS: RemiseApmSelf.RESULT_STATUS_PROCESSING
                    }, requestData.FUNC)
                    return;
                }

                var sc = document.createElement("script");
                sc.id   = "remise_" + requestData.UID;
                sc.type = "text/javascript";
                sc.src  = this.HttpUrl + "/?callback=" + callback + "&" + encodeURIComponent(JSON.stringify(requestData)) + "&=_" + requestData.UID;
                document.head.appendChild(sc);

                var tid = setTimeout(function(){RemiseApmSelf.removeScript(callback, requestData.FUNC);}, RemiseApmSelf.HttpTimeout);
                this.Callbacks[callback] = tid;

                sc = document.getElementById("remise_" + requestData.UID);
                document.head.removeChild(sc);
            } catch(e) {
                remiseApmCallback(e, requestData.FUNC);
            }
        },

        // ユニークID取得
        getUUID: function() {
            var uuid, i, random;
            uuid = "";
            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i == 8 || i == 12 || i == 16 || i == 20) {
                    uuid += "-";
                }
                uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
            }
            return uuid;
        },

        // コールバック処理削除
        removeScript: function(callback, func) {
            if (this.Callbacks[callback] !== undefined && this.Callbacks[callback] != null) {
                clearTimeout(RemiseApmSelf.Callbacks[callback]);
                delete this.Callbacks[callback];
                remiseApmCallback(null, func);
            }
        },

        // コールバック処理
        callbackProcess: function(func, data) {
            trace("■callbackProcess");
            trace(data);

            var callback = "remiseApmCallback" + func;

            // 応答があった場合のタイマー削除
            if (this.Callbacks[callback] !== undefined && this.Callbacks[callback] != null) {
                clearTimeout(RemiseApmSelf.Callbacks[callback]);
                delete this.Callbacks[callback];
            }

            // タイムアウトエラー
            if (this.timeoutError(func, data)) {
                return;
            }

            // ポーリング用
            var nextPaymentType = "";
            switch (func) {
                case RemiseApmSelf.PAYMENT_TYPE_TERMINAL:
                case RemiseApmSelf.PAYMENT_TYPE_TERMINAL_RESULT:
                    nextPaymentType = RemiseApmSelf.PAYMENT_TYPE_TERMINAL_RESULT;
                    break;
                case RemiseApmSelf.PAYMENT_TYPE_CARD:
                case RemiseApmSelf.PAYMENT_TYPE_CARD_RESULT:
                    nextPaymentType = RemiseApmSelf.PAYMENT_TYPE_CARD_RESULT;
                    break;             
                case RemiseApmSelf.PAYMENT_TYPE_POINT:
                case RemiseApmSelf.PAYMENT_TYPE_POINT_RESULT:
                    nextPaymentType = RemiseApmSelf.PAYMENT_TYPE_POINT_RESULT;
                    break;
                case RemiseApmSelf.PAYMENT_TYPE_QR:
                case RemiseApmSelf.PAYMENT_TYPE_QR_RESULT:
                    nextPaymentType = RemiseApmSelf.PAYMENT_TYPE_QR_RESULT;
                    break;
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_RESULT:
                    nextPaymentType = RemiseApmSelf.PAYMENT_TYPE_EMONEY_RESULT;
                    break;
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_BALANCE:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_BALANCE_RESULT:
                    nextPaymentType = RemiseApmSelf.PAYMENT_TYPE_EMONEY_BALANCE_RESULT;
                    break;
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_HISTORY:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_HISTORY_RESULT:
                    nextPaymentType = RemiseApmSelf.PAYMENT_TYPE_EMONEY_HISTORY_RESULT;
                    break;
                default:
                    break;
            }

            switch (func) {
                // インストール確認、決済処理、決済状況確認
                case RemiseApmSelf.PAYMENT_TYPE_TERMINAL_STATUS_CHECK:
                case RemiseApmSelf.PAYMENT_TYPE_CARD_APP_INSTALL_CHECK:
                case RemiseApmSelf.PAYMENT_TYPE_POINT_APP_INSTALL_CHECK:
                case RemiseApmSelf.PAYMENT_TYPE_QR_APP_INSTALL_CHECK:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_APP_INSTALL_CHECK:
                case RemiseApmSelf.PAYMENT_TYPE_TERMINAL:
                case RemiseApmSelf.PAYMENT_TYPE_CARD:
                case RemiseApmSelf.PAYMENT_TYPE_POINT:
                case RemiseApmSelf.PAYMENT_TYPE_QR:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_BALANCE:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_HISTORY:
                case RemiseApmSelf.PAYMENT_TYPE_TERMINAL_APP_CHECK:
                case RemiseApmSelf.PAYMENT_TYPE_CARD_TRAN_CHECK:
                case RemiseApmSelf.PAYMENT_TYPE_QR_TRAN_CHECK:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_TRAN_CHECK:
                case RemiseApmSelf.PAYMENT_TYPE_TERMINAL_RESTART:
                case RemiseApmSelf.PAYMENT_TYPE_APP_RESTART:
                case RemiseApmSelf.PAYMENT_TYPE_CONNETION_CHECK:
                    trace("★OnTerminalResult");
                    if (this.OnTerminalResult) {
                        this.OnTerminalResult(this.convertResult(func, data));
                    }

                    if (data.FUNC_STATUS !== undefined
                     && data.FUNC_STATUS != null
                     && data.FUNC_STATUS == RemiseApmSelf.RESULT_STATUS_SUCCESS) {
                        if (nextPaymentType != "") {
                            this.CallTerminal({PaymentType: nextPaymentType});
                        }
                    }
                    break;

                // 結果取得
                case RemiseApmSelf.PAYMENT_TYPE_TERMINAL_RESULT:
                case RemiseApmSelf.PAYMENT_TYPE_CARD_RESULT:
                case RemiseApmSelf.PAYMENT_TYPE_POINT_RESULT:
                case RemiseApmSelf.PAYMENT_TYPE_QR_RESULT:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_RESULT:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_BALANCE_RESULT:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_HISTORY_RESULT:
                    if (data.FUNC_STATUS !== undefined && data.FUNC_STATUS != null) {
                        // 処理中
                        if (data.FUNC_STATUS == RemiseApmSelf.RESULT_STATUS_PROCESSING
                         || data.FUNC_STATUS == RemiseApmSelf.RESULT_STATUS_PROCESSING_TO_STOP
                         || data.FUNC_STATUS == RemiseApmSelf.RESULT_STATUS_ERROR_TO_STOP) {
                            trace("★OnProcessingStatus");
                            if (this.OnProcessingStatus) {
                                this.OnProcessingStatus(this.convertResult(func, data));
                            }
                            // 中断エラー
                            if (data.FUNC_STATUS == RemiseApmSelf.RESULT_STATUS_ERROR_TO_STOP) {
                                trace("★OnCancelErrorResult");
                                if (this.OnCancelErrorResult) {
                                    this.OnCancelErrorResult(this.convertResult(func, data));
                                }
                            }
                            if (nextPaymentType != "") {
                                setTimeout(
                                    function(){RemiseApmSelf.CallTerminal({PaymentType: nextPaymentType});},
                                    RemiseApmSelf.PollingTime
                            );
                            }
                            return;
                        }
                    }
                    trace("★OnTerminalResult");
                    if (this.OnTerminalResult) {
                        this.OnTerminalResult(this.convertResult(func, data));
                    }
                    break;

                // 中断処理
                case RemiseApmSelf.PAYMENT_TYPE_TERMINAL_CANCEL:
                case RemiseApmSelf.PAYMENT_TYPE_CARD_CANCEL:
                case RemiseApmSelf.PAYMENT_TYPE_POINT_CANCEL:
                case RemiseApmSelf.PAYMENT_TYPE_QR_CANCEL:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_CANCEL:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_BALANCE_CANCEL:
                case RemiseApmSelf.PAYMENT_TYPE_EMONEY_HISTORY_CANCEL:
                    if (data.FUNC_STATUS == RemiseApmSelf.RESULT_STATUS_SUCCESS_TO_STOP) {
                        trace("★OnTerminalResult");
                        if (this.OnTerminalResult) {
                            this.OnTerminalResult(this.convertResult(func, data));
                        }
                        break;
                    }
                    trace("★OnCancelErrorResult");
                    if (this.OnCancelErrorResult) {
                        this.OnCancelErrorResult(this.convertResult(func, data));
                    }
                    break;

                default:
                    trace("★OnTerminalResult");
                    if (this.OnTerminalResult) {
                        this.OnTerminalResult(this.convertResult(func, data));
                    }
                    break;
            }
        },

        // タイムアウトエラー
        timeoutError: function (func, data) {
            trace("■apmTimeoutError");

            if (data === undefined
             || data === null
             || data.FUNC_STATUS === undefined
             || data.FUNC_STATUS === null) {
                if (this.OnTerminalResult) {
                    var result = {
                        PaymentType:    func,
                        Status:         RemiseApmSelf.RESULT_STATUS_TIMEOUT_TERMINAL_CONNECTION,
                        ProccessStatus: "",
                        AppStatus:      "",
                        ErrType:        "",
                        AppErrcode:     "",
                        AppMessage:     ""
                    };
                    trace("★OnTerminalResult");
                    trace(result);
                    this.OnTerminalResult(result);
                }
                return true;
            }
            return false;
        },

        // 結果データ変換
        convertResult: function(func, data) {
            var result = {
                UID:            this.getValue(data.UID,             ""),
                PaymentType:    func,
                Status:         this.getValue(data.FUNC_STATUS,     ""),
                ProccessStatus: this.getValue(data.PROCESS_STATUS,  ""),
                AppStatus:      this.getValue(data.APP_STATUS,      ""),
                ErrType:        this.getValue(data.ERRTYPE,         ""),
                AppErrcode:     this.getValue(data.APP_ERRCODE,     ""),
                AppMessage:     this.getValue(data.APP_MESSAGE,     ""),
                AppVersion:     this.getValue(data.APP_VERSION,     ""),
                Method:         this.getValue(data.METHOD,          "")
            };
            if (data.FUNC_STATUS !== undefined && data.FUNC_STATUS != null) {
                if (data.FUNC_STATUS.substr(0, 1) == "7") {
                    result.Status = RemiseApmSelf.RESULT_STATUS_INVALID_INPUT_PARAMETER;
                }
            }

            // カード決済
            if (data.METHOD == "01") {
                result.CardResult = {
                    CardType:       this.getValue(data.CARD_TYPE,       ""),
                    OrderId:        this.getValue(data.ORDERID,         ""),
                    TranId:         this.getValue(data.TRANID,          ""),
                    Card:           this.getValue(data.CARD,            ""),
                    Expire:         this.getValue(data.EXPIRE,          ""),
                    RefApproved:    this.getValue(data.REFAPPROVED,     ""),
                    RefForwarded:   this.getValue(data.REFFORWARDED,    ""),
                    RefCardbrand:   this.getValue(data.REFCARDBRAND,    ""),
                    ArpcInfo:       this.getValue(data.ARPC_INFO,       ""),
                    ErrCode:        this.getValue(data.ERRCODE,         ""),
                    ErrInfo:        this.getValue(data.ERRINFO,         ""),
                    ErrLevel:       this.getValue(data.ERRLEVEL,        ""),
                    Result:         this.getValue(data.RESULT,          ""),
                    RefGatewayNo:   this.getValue(data.REFGATEWAYNO,    ""),
                    Datetime:       this.getValue(data.DATETIME,        ""),
                    MemberId:       this.getValue(data.MEMBERID,        ""),
                    JobId:          this.getValue(data.JOBID,           ""),
                    PayquickId:     this.getValue(data.PAYQUICKID,      ""),
                    Aid:            this.getValue(data.AID,             ""),
                    AppLabel:       this.getValue(data.APPLABEL,        ""),
                    CardSequenceNo: this.getValue(data.CARDSEQUENCENO,  ""),
                    Atc:            this.getValue(data.ATC,             ""),
                    Arc:            this.getValue(data.ARC,             ""),
                    Spid:           this.getValue(data.SPID,            ""),
                    Tc:             this.getValue(data.TC,              ""),
                    PinErrInfo:     this.getValue(data.PIN_ERRINFO,     "")
                };
            }

            // コード決済
            if (data.METHOD == "02") {
                result.QRResult = {
                    JobId:          this.getValue(data.JOBID,           ""),
                    OrderId:        this.getValue(data.ORDERID,         ""),
                    Job:            this.getValue(data.JOB,             ""),
                    RCode:          this.getValue(data.R_CODE,          ""),
                    ErrInfo:        this.getValue(data.ERRINFO,         ""),
                    Cny:            this.getValue(data.CNY,             ""),
                    Gatewayno:      this.getValue(data.GATEWAYNO,       ""),
                    CenDate:        this.getValue(data.CEN_DATE,        ""),
                    TransStatus:    this.getValue(data.TRANS_STATUS,    ""),
                    Payee:          this.getValue(data.PAYEE,           ""),
                    PayName:        this.getValue(data.PAY_NAME,        "")
                };
            }

            // 電子マネー決済
            if (data.METHOD == "03") {
            }
            
            // ポイントカード読取
            if (func == RemiseApmSelf.PAYMENT_TYPE_POINT_RESULT) {
                result.PointResult = {
                    Result:         this.getValue(data.RESULT,       ""),
                    Jis2Data:       this.getValue(data.JIS2_DATA,    ""),
                    FormatGroupId:  this.getValue(data.FORMAT_GROUP_ID, ""),
                    FormatName:     this.getValue(data.FORMAT_NAME,     ""),
                    ConvFlg:        this.getValue(data.CONV_FLG,     ""),
                    Other1:         this.getValue(data.OTHER1,       ""),
                    Other2:         this.getValue(data.OTHER2,       ""),
                    Other3:         this.getValue(data.OTHER3,       ""),
                }
            }

            // アプリ起動状況確認
            if (func == RemiseApmSelf.PAYMENT_TYPE_TERMINAL_APP_CHECK) {
                result.CardAppRunning       = this.getValue(data.CARD_APP_RUNNING,      "");
                result.QrAppRunning         = this.getValue(data.QR_APP_RUNNING,        "");
                result.EMoneyAppRunning     = this.getValue(data.EMONEY_APP_RUNNING,    "");
                result.TerminalAppRunning   = this.getValue(data.TERMINAL_APP_RUNNING,  "");
                result.EMoneyAppFrontRunning     = this.getValue(data.EMONEY_APP_RUNNING_FROM_STANDBY,    "");
            }

            // カード決済状況確認
            if (func == RemiseApmSelf.PAYMENT_TYPE_CARD_TRAN_CHECK) {
                result.CardTranCheckResult = {
                    OrderId:        this.getValue(data.ORDERID,         ""),
                    TranId:         this.getValue(data.TRANID,          ""),
                    Card:           this.getValue(data.CARD,            ""),
                    Expire:         this.getValue(data.EXPIRE,          ""),
                    RefApproved:    this.getValue(data.REFAPPROVED,     ""),
                    RefForwarded:   this.getValue(data.REFFORWARDED,    ""),
                    RefCardbrand:   this.getValue(data.REFCARDBRAND,    ""),
                    ErrCode:        this.getValue(data.ERRCODE,         ""),
                    ErrInfo:        this.getValue(data.ERRINFO,         ""),
                    ErrLevel:       this.getValue(data.ERRLEVEL,        ""),
                    Result:         this.getValue(data.RESULT,          ""),
                    TranFlg:        this.getValue(data.TRANFLG,         ""),
                    RefGatewayNo:   this.getValue(data.REFGATEWAYNO,    ""),
                    Datetime:       this.getValue(data.DATETIME,        ""),
                    MemberId:       this.getValue(data.MEMBERID,        ""),
                    Yflg:           this.getValue(data.YFLG,            ""),
                    Aid:            this.getValue(data.AID,             ""),
                    AppLabel:       this.getValue(data.APPLABEL,        ""),
                    CardSequenceNo: this.getValue(data.CARDSEQUENCENO,  ""),
                    JobId:          this.getValue(data.JOBID,           ""),
                    Atc:            this.getValue(data.ATC,             ""),
                    Arc:            this.getValue(data.ARC,             ""),
                    Spid:           this.getValue(data.SPID,            ""),
                    CupSendDate:    this.getValue(data.CUP_SEND_DATE,   ""),
                    CupSequence:    this.getValue(data.CUP_SEQUENCE,    ""),
                    CupMarchantId:  this.getValue(data.CUP_MARCHANTID,  ""),
                    Tc:             this.getValue(data.TC,              "")
                };
            }

            // コード決済状況確認
            if (func == RemiseApmSelf.PAYMENT_TYPE_QR_TRAN_CHECK) {
                result.QRTranCheckResult = {
                    JobId:          this.getValue(data.JOBID,           ""),
                    RCode:          this.getValue(data.R_CODE,          ""),
                    OrderId:        this.getValue(data.ORDERID,         ""),
                    RTotal:         this.getValue(data.R_TOTAL,         ""),
                    RPayee:         this.getValue(data.R_PAYEE,         ""),
                    RecFlg:         this.getValue(data.REC_FLG,         ""),
                    RecDate:        this.getValue(data.REC_DATE,        ""),
                    DecisionFlg:    this.getValue(data.DECISION_FLG,    ""),
                    DecisionDate:   this.getValue(data.DECISION_DATE,   ""),
                    CanFlg:         this.getValue(data.CAN_FLG,         ""),
                    CanDate:        this.getValue(data.CAN_DATE,        ""),
                    TransStatus:    this.getValue(data.TRANS_STATUS,    "")
                };
            }

            // 電子マネー決済状況確認
            if (func == RemiseApmSelf.PAYMENT_TYPE_EMONEY_TRAN_CHECK) {
                result.EMoneyTranCheckResult = {
                    JobId:          this.getValue(data.JOBID,           ""),
                    RCode:          this.getValue(data.R_CODE,          ""),
                    OrderId:        this.getValue(data.ORDERID,         ""),
                    RTotal:         this.getValue(data.R_TOTAL,         ""),
                    RecFlg:         this.getValue(data.REC_FLG,         ""),
                    RecDate:        this.getValue(data.REC_DATE,        ""),
                    DecisionFlg:    this.getValue(data.DECISION_FLG,    ""),
                    DecisionDate:   this.getValue(data.DECISION_DATE,   ""),
                    AppResult:      this.getValue(data.APP_RESULT,      "")
                };
            }

            trace(result);
            return result;
        },

        // 値の取得
        getValue: function(p, d) {
            if (p !== undefined && p != null) return p;
            return d;
        }
    };

    if (!window.remise) {
        window.remise = {};
    }
    window.remise.ApmDriver = ApmDriver;
})(window);
function remiseApmCallback(data, func) {
    RemiseApmSelf.callbackProcess(func || "", data);
}

function remiseApmCallback(data) {
    RemiseApmSelf.callbackProcess("", data);
}
function remiseApmCallback3000(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_TERMINAL_STATUS_CHECK, data);
}
function remiseApmCallback3001(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_TERMINAL, data);
}
function remiseApmCallback3002(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_TERMINAL_RESULT, data);
}
function remiseApmCallback3008(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_TERMINAL_CANCEL, data);
}
function remiseApmCallback3100(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_TERMINAL_APP_CHECK, data);
}
function remiseApmCallback4000(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_CARD_APP_INSTALL_CHECK, data);
}
function remiseApmCallback4001(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_CARD, data);
}
function remiseApmCallback4002(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_CARD_RESULT, data);
}
function remiseApmCallback4008(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_CARD_CANCEL, data);
}
function remiseApmCallback4100(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_CARD_TRAN_CHECK, data);
}
function remiseApmCallback4200(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_POINT_APP_INSTALL_CHECK, data);
}
function remiseApmCallback4201(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_POINT, data);
}
function remiseApmCallback4202(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_POINT_RESULT, data);
}
function remiseApmCallback4208(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_POINT_CANCEL, data);
}
function remiseApmCallback5000(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_QR_APP_INSTALL_CHECK, data);
}
function remiseApmCallback5001(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_QR, data);
}
function remiseApmCallback5002(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_QR_RESULT, data);
}
function remiseApmCallback5008(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_QR_CANCEL, data);
}
function remiseApmCallback5100(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_QR_TRAN_CHECK, data);
}
function remiseApmCallback6000(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY_APP_INSTALL_CHECK, data);
}
function remiseApmCallback6001(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY, data);
}
function remiseApmCallback6002(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY_RESULT, data);
}
function remiseApmCallback6008(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY_CANCEL, data);
}
function remiseApmCallback6021(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY_BALANCE, data);
}
function remiseApmCallback6022(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY_BALANCE_RESULT, data);
}
function remiseApmCallback6028(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY_BALANCE_CANCEL, data);
}
function remiseApmCallback6031(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY_HISTORY, data);
}
function remiseApmCallback6032(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY_HISTORY_RESULT, data);
}
function remiseApmCallback6038(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY_HISTORY_CANCEL, data);
}
function remiseApmCallback6100(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_EMONEY_TRAN_CHECK, data);
}
function remiseApmCallback1005(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_TERMINAL_RESTART, data);
}
function remiseApmCallback1100(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_DAILY_TOTAL, data);
}
function remiseApmCallback1200(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_ABNORMAL_UNLOCK, data);
}
function remiseApmCallback2005(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_APP_RESTART, data);
}
function remiseApmCallback2200(data) {
    RemiseApmSelf.callbackProcess(RemiseApmSelf.PAYMENT_TYPE_CONNETION_CHECK, data);
}

function trace(s) {
    if (REMISE_APM_DEBUG_MODE && this.console && this.console.log !== undefined) {
        console.log(s);
    }
}
