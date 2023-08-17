export var PLT_TYPES;
(function (PLT_TYPES) {
    PLT_TYPES["Outline"] = "Outline";
    PLT_TYPES["Hintergrund"] = "Hintergrund";
})(PLT_TYPES || (PLT_TYPES = {}));
export var CanvasEventType;
(function (CanvasEventType) {
    CanvasEventType[CanvasEventType["DRAW"] = 0] = "DRAW";
    CanvasEventType[CanvasEventType["CLEAR"] = 1] = "CLEAR";
    CanvasEventType[CanvasEventType["ADD_SHAPE"] = 2] = "ADD_SHAPE";
    CanvasEventType[CanvasEventType["REMOVE_SHAPE"] = 3] = "REMOVE_SHAPE";
    CanvasEventType[CanvasEventType["REMOVE_SHAPE_WITH_ID"] = 4] = "REMOVE_SHAPE_WITH_ID";
    CanvasEventType[CanvasEventType["UPDATE_SHAPE"] = 5] = "UPDATE_SHAPE";
    CanvasEventType[CanvasEventType["UPDATE_SHAPES_ORDER"] = 6] = "UPDATE_SHAPES_ORDER";
    CanvasEventType[CanvasEventType["TOOL_ACTION"] = 7] = "TOOL_ACTION";
    CanvasEventType[CanvasEventType["CHANGE_COLOR"] = 8] = "CHANGE_COLOR";
    CanvasEventType[CanvasEventType["SELECT_SHAPE"] = 9] = "SELECT_SHAPE";
    CanvasEventType[CanvasEventType["UNSELECT_SHAPE"] = 10] = "UNSELECT_SHAPE";
})(CanvasEventType || (CanvasEventType = {}));
export var Services;
(function (Services) {
    Services["REGISTRATION"] = "registration";
    Services["UNREGISTER"] = "unregister";
    Services["HOST_DISCONNECT"] = "host_disconnect";
})(Services || (Services = {}));
