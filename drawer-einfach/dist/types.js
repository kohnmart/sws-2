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
})(CanvasEventType || (CanvasEventType = {}));
//# sourceMappingURL=types.js.map