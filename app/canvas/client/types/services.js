export var EServices;
(function (EServices) {
    EServices["REGISTRATION"] = "registration";
    EServices["UNREGISTER"] = "unregister";
    EServices["HOST_DISCONNECT"] = "host_disconnect";
})(EServices || (EServices = {}));
export var EClient;
(function (EClient) {
    EClient["CLIENT_ID"] = "clientID";
    EClient["HOST_ID"] = "hostId";
    EClient["RAND_COLOR"] = "randColor";
})(EClient || (EClient = {}));
export var EWsEvents;
(function (EWsEvents) {
    EWsEvents["REGISTER_FOR_CANVAS"] = "registerForCanvas";
    EWsEvents["UNREGISTER_FOR_CANVAS"] = "unregisterForCanvas";
    EWsEvents["SELECT_SHAPE"] = "selectShape";
    EWsEvents["UNSELECT_SHAPE"] = "unselectShape";
    EWsEvents["HOST_DISCONNECT"] = "host_disconnect";
})(EWsEvents || (EWsEvents = {}));
