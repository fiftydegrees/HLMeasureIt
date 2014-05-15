﻿var originalUnit = preferences.rulerUnits;preferences.rulerUnits = Units.PIXELS;app.displayDialogs = DialogModes.NO;if(validateState()){	app.activeDocument.suspendHistory("HLMeasureIt", "drawMeasures();");}/**** Check whether the document is ready to execute HLMeasureIt script*/function validateState(){	if (app.documents.length == 0) {		alert("Please open a document");		return false;	}	else if(!findSelectionInDocument(app.activeDocument)) {		alert("Please select the element to measure (Default: Ctrl+Clic on layer)");		return false;	}		return true;}	/*** Draw measures for X, Y, Width and Height*/function drawMeasures(){	var docRef = app.activeDocument;	var selRef = docRef.selection;	var mainLayerSet;		try {		mainLayerSet = docRef.layerSets.getByName("HLMeasureIt");	}	catch(error) {		mainLayerSet = docRef.layerSets.add();		mainLayerSet.name = "HLMeasureIt";	}	var layerSetRef = mainLayerSet.layerSets.add() 	var linesLayerRef = layerSetRef.artLayers.add();	/*	** Draw lines	*/	var x1 = selRef.bounds[0].value;	var y1 = selRef.bounds[1].value;	var x2 = selRef.bounds[2].value;	var y2 = selRef.bounds[3].value;	selRef.deselect();	var width = x2 - x1;	var height = y2 - y1;	var horizontal = width > height;	drawLine(0, y1, x1, y1);	drawLine(x1, 0, x1, y1);	drawLine(x1, y1, x2, y1);	drawLine(x1, y1, x1, y2);	/*	** Draw Text	*/	var textLayerRefX = layerSetRef.artLayers.add();	var textLayerRefY = layerSetRef.artLayers.add();	var textLayerRefW = layerSetRef.artLayers.add();	var textLayerRefH = layerSetRef.artLayers.add();	textLayerRefX.kind = LayerKind.TEXT;	textLayerRefY.kind = LayerKind.TEXT;	textLayerRefW.kind = LayerKind.TEXT;	textLayerRefH.kind = LayerKind.TEXT;	var textItemRefX = textLayerRefX.textItem;	var textItemRefY = textLayerRefY.textItem;	var textItemRefW = textLayerRefW.textItem;	var textItemRefH = textLayerRefH.textItem;	//X	textItemRefX.contents = x1 + " px";	textItemRefX.justification = Justification.CENTER;	textItemRefX.position = Array(Math.floor(x1 / 2), y1 - 5);	textItemRefX.color = app.foregroundColor;	textItemRefX.font = "ArialBlack";	textItemRefX.size = 15;	//Y	textItemRefY.contents = y1 + " px";	textItemRefY.justification = Justification.LEFT;	textItemRefY.position = Array(x1 + 2, Math.floor(y1 / 2));	textItemRefY.color = app.foregroundColor;	textItemRefY.font = "ArialBlack";	textItemRefY.size = 15;	//W	textItemRefW.contents = width + " px";	textItemRefW.justification = Justification.CENTER;	textItemRefW.position = Array(x1 + Math.floor(width / 2), y1 - 5);	textItemRefW.color = app.foregroundColor;	textItemRefW.font = "ArialMT";	textItemRefW.size = 15;	//H	textItemRefH.contents = height + " px";	textItemRefH.justification = Justification.RIGHT;	textItemRefH.position = Array(x1 - 2, y1 + Math.floor(height / 2));	textItemRefH.color = app.foregroundColor;	textItemRefH.font = "ArialMT";	textItemRefH.size = 15;	layerSetRef.name = "Measures";	app.preferences.rulerUnits = originalUnit;}/*** Draw a line between (x1,y1) and (x2,y2)*/function drawLine(x1,y1,x2,y2){	var pointArray = new Array();	var pointA = new PathPointInfo();	pointA.kind = PointKind.CORNERPOINT;	pointA.anchor = Array(x1, y1);	pointA.leftDirection = pointA.anchor;	pointA.rightDirection = pointA.anchor;	pointArray.push(pointA);	var pointB = new PathPointInfo();	pointB.kind = PointKind.CORNERPOINT;	pointB.anchor = Array(x2, y2);	pointB.leftDirection = pointB.anchor;	pointB.rightDirection = pointB.anchor;	pointArray.push(pointB);	var line = new SubPathInfo();	line.operation = ShapeOperation.SHAPEXOR;	line.closed = false;	line.entireSubPath = pointArray;	var lineSubPathArray = new Array();	lineSubPathArray.push(line);	var linePath = app.activeDocument.pathItems.add("TempPath", lineSubPathArray);	linePath.strokePath(ToolType.PENCIL, false);	app.activeDocument.pathItems.removeAll();}/*** Return active selection*/function findSelectionInDocument(doc){	var res = false;	var as = doc.activeHistoryState;	doc.selection.deselect();		if (as != doc.activeHistoryState) {		res = true;		doc.activeHistoryState = as;	}		return res;}