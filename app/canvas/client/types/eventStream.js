export var ECanvasEventType;
(function (ECanvasEventType) {
    ECanvasEventType[ECanvasEventType["DRAW"] = 0] = "DRAW";
    ECanvasEventType[ECanvasEventType["CLEAR"] = 1] = "CLEAR";
    ECanvasEventType[ECanvasEventType["ADD_SHAPE"] = 2] = "ADD_SHAPE";
    ECanvasEventType[ECanvasEventType["REMOVE_SHAPE"] = 3] = "REMOVE_SHAPE";
    ECanvasEventType[ECanvasEventType["REMOVE_SHAPE_WITH_ID"] = 4] = "REMOVE_SHAPE_WITH_ID";
    ECanvasEventType[ECanvasEventType["UPDATE_SHAPE"] = 5] = "UPDATE_SHAPE";
    ECanvasEventType[ECanvasEventType["UPDATE_SHAPES_ORDER"] = 6] = "UPDATE_SHAPES_ORDER";
    ECanvasEventType[ECanvasEventType["TOOL_ACTION"] = 7] = "TOOL_ACTION";
    ECanvasEventType[ECanvasEventType["CHANGE_COLOR"] = 8] = "CHANGE_COLOR";
    ECanvasEventType[ECanvasEventType["SELECT_SHAPE"] = 9] = "SELECT_SHAPE";
    ECanvasEventType[ECanvasEventType["UNSELECT_SHAPE"] = 10] = "UNSELECT_SHAPE";
})(ECanvasEventType || (ECanvasEventType = {}));
