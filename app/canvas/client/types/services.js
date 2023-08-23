export var EServices;
(function (EServices) {
    EServices["REGISTRATION"] = "registration";
    EServices["UNREGISTER"] = "unregister";
    EServices["HOST_DISCONNECT"] = "host_disconnect";
})(EServices || (EServices = {}));
export var EClient;
(function (EClient) {
    EClient["CLIENT_ID"] = "clientId";
    EClient["HOST_ID"] = "hostId";
    EClient["RAND_COLOR"] = "randColor";
})(EClient || (EClient = {}));
export var EWebsocketEvents;
(function (EWebsocketEvents) {
    EWebsocketEvents["REGISTER_FOR_CANVAS"] = "registerForCanvas";
    EWebsocketEvents["UNREGISTER_FOR_CANVAS"] = "unregisterForCanvas";
    EWebsocketEvents["SELECT_SHAPE"] = "selectShape";
    EWebsocketEvents["UNSELECT_SHAPE"] = "unselectShape";
    EWebsocketEvents["HOST_DISCONNECT"] = "host_disconnect";
})(EWebsocketEvents || (EWebsocketEvents = {}));
